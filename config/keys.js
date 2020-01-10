if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod'); 
    console.log("Env. PROD");
} else if (process.env.NODE_ENV === 'CI') { 
    module.exports = require('./ci');
    console.log("Env. CI");
} else  {
    module.exports = require('./dev');
    console.log("Env. DEV");
}