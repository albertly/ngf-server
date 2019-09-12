const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: { type: Schema.ObjectId, unique: true },
    eventId: { type: Schema.ObjectId, unique: true },
    purchaseDate :  { type: Date, unique: true },
  });

const ModelClass = mongoose.model('order', orderSchema);

// Export the model
module.exports = ModelClass;
