const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  amount: { type: Number, required: true }, // rupees
  transactionId: { type: String, required: true, unique: true }, // your own id
  gatewayOrderId: { type: String }, // id returned by gateway
  gatewayPaymentId: { type: String }, // payment id after success
  status: { type: String, enum: ['pending','success','failed','cancelled'], default: 'pending' },
  meta: { type: Object, default: {} }, // store entire gateway response if needed
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', DonationSchema);
