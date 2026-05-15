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

    profileImage: {
        type: String,
        required: false,
        default: process.env.DEFAULT_USER_IMAGE
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);