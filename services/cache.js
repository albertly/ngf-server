const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const { performance } = require('perf_hooks');

const keys = require('../config/keys');

const client = redis.createClient({host:keys.redis.host, port:keys.redis.port, password:keys.redis.auth,
  retry_strategy: function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
        // End reconnecting on a specific error and flush all commands with
        // a individual error
        return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
        // End reconnecting after a specific timeout and flush all commands
        // with a individual error
        return new Error('Retry time exhausted');
    }
    if (options.attempt > 5) {
        // End reconnecting with built in error
        return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
}
});

client.on('ready', () => {
  console.log('Redis is ready. Happy caching!');
});

client.on("error",  (err) =>  {
  console.log("Cache Error " + err);
});

client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
  this.useCache = true && client.connected;
  this.hashKey = JSON.stringify(options.key || '');
  return this;
};

mongoose.Query.prototype.exec = async function() {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  );

  let t0=0, t1=0;

  t0 = performance.now();

  // See if we have a value for 'key' in redis
  const cacheValue = await client.hget(this.hashKey, key);

  t1 = performance.now();

  // If we do, return that
  if (cacheValue) {
    console.log(`Call to cached key ${key} took ${(t1 - t0)} milliseconds.`);
    const doc = JSON.parse(cacheValue);

    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  t0 = performance.now();
  // Otherwise, issue the query and store the result in redis
  const result = await exec.apply(this, arguments);

  t1 = performance.now();
  console.log(`Call to non-cached key ${key} took ${(t1 - t0)} milliseconds.`);

  client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);

  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
};
