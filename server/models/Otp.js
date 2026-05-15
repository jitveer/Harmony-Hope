const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }, 
    },
    name: String,        // added for registration
    phone: String,       // added for registration
    password: String     // added for registration
})

module.exports = mongoose.model('Otp', otpSchema)