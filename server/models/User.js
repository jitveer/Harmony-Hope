const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["user", "admin", "superadmin"],
        default: "user"
    },
    isVerified: { type: Boolean, default: false },

    // OTP and Lock System Fields
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    otpAttempts: { type: Number, default: 0 },
    otpSendCount: { type: Number, default: 0 },
    otpWindowStart: { type: Date, default: null },
    failedAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    lockLevel: { type: Number, default: 0 },

    profileImage: {
        type: String,
        required: false,
        default: process.env.DEFAULT_USER_IMAGE
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);