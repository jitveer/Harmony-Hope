const jwt = require("jsonwebtoken");
const User = require('../models/User');
const Otp = require("../models/Otp");
const bcrypt = require("bcrypt");





// ID-based profile (GET /api/user/:id)
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id; // route params se
    const user = await User.findById(userId).select('-password -__v -isVerified');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error('getUserById error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};



//UPDATE USER PROFILE DATA
const updateUserData = async (req, res) => {

  try {
    const userId = req.params.id;
    const { name, email, phone, password } = req.body;
    //HASH PASSWORD
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (password != "") {
      const updatedUser = await User.findByIdAndUpdate(userId, { name, email, phone, password: hashedPassword }, { new: true }
      );

      if (!updatedUser) return res.status(404).json({ message: "User not found" });

      res.status(200).json({ user: updatedUser });
    } else {
      const updatedUser = await User.findByIdAndUpdate(userId, { name, email, phone }, { new: true }
      );

      if (!updatedUser) return res.status(404).json({ message: "User not found" });

      res.status(200).json({ user: updatedUser });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }

};



module.exports = {
  getUserById,
  updateUserData
}