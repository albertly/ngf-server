const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: { type: Schema.ObjectId, unique: false, ref: 'user' },
    eventId: { type: Schema.ObjectId, unique: false, ref: 'event' },
    purchaseDate :  { type: Date, unique: false },
  });

const ModelClass = mongoose.model('order', orderSchema);

// Export the model
module.exports = ModelClass;
