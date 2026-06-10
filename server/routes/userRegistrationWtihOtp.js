const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Otp = require("../models/Otp");
const transporter = require("../config/nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// function to generate otp
const generateOtp = (length = 6) =>
  Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");

// ================== REGISTER (Send OTP) ==================

router.post("/register", async (req, res) => {
  // Added role to destructure
  const { name, email, phone, password, role, profileImage } = req.body;
  const nameRegex = /^[A-Za-z\s]{3,20}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

  console.log(profileImage);

  let imageUrl = profileImage;
  if (!profileImage) {
    imageUrl = "https://share.google/images/gNxasBoWF5ILF4xWm"; // fallback default
  }

  console.log(profileImage);

  // FORM VALIDATAION
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  if (!nameRegex.test(name)) {
    return res.status(400).json({
      message: "Name must be 3-20 letters only (no numbers or special chars)",
    });
  }

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email address." });
  }

  if (!phoneRegex.test(phone)) {
    return res
      .status(400)
      .json({ message: "Phone must be a valid 10-digit Indian number" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be 8–20 chars, with at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character.",
    });
  }

  ////////////////////////////

  try {
    const existingUser = await User.findOne({ email });

    // if already registered & verified
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "User already registered" });
    }

    //HASH PASSWORD
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // generate OTP
    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.deleteMany({ email }); // remove old otp

    // Store all signup data inside Otp collection temporarily
    await Otp.create({
      email,
      otp: otpCode,
      expiresAt,
      name,
      phone,
      password: hashedPassword,
      profileImage: imageUrl,
      role: role || "user", // if not provided, set default role "user"
    });


    // SEND MAIL
    await transporter.sendMail({
      from: "support@harmonyhopefoundation.com",
      to: email,
      subject: "HarmonyHope OTP Verification",
      html: `<p>Your OTP is <b>${otpCode}</b>. It is valid for 10 minutes.</p>`,
    });

    res.json({ message: "OTP sent successfully to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong backend" });
  }
});




// ================== VERIFY OTP ( Create User) ==================
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const existingOtp = await Otp.findOne({ email });

    if (!existingOtp || existingOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const now = new Date();
    if (now > existingOtp.expiresAt) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Create user if not exists
    let user = await User.findOne({ email });
    if (!user) {
      // Use data stored in OTP collection
      user = new User({
        name: existingOtp.name,
        email,
        phone: existingOtp.phone,
        password: existingOtp.password,
        role: existingOtp.role || "user",
        isVerified: true,
      });
      await user.save();
    } else {
      user.isVerified = true;
      await user.save();
    }

    // Delete OTP after successful verification
    await Otp.deleteOne({ email });

    // Generate JWT with role
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error in verifyOtp:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// THIS CODE WILL GO INSIDE REGISTRATON API . THAT IS ABOVE

// VERIFYING CAPTCHA FROM BACKEND SIDE ALSO

// const axios = require("axios");

// app.post("/verify-captcha", async (req, res) => {
//     const { token } = req.body;
//     const secret = "6LeiubIrAAAAAClTQUNZ9ElS_AsthHJj6ad3k7QU";
//     const response = await axios.post(
//         `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
//     );

//     if (response.data.success) {
//         res.json({ success: true });
//     } else {
//         res.json({ success: false });
//     }
// });

module.exports = router;
