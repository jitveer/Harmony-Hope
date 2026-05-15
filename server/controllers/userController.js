const jwt = require("jsonwebtoken");
const User = require('../models/User');
const Otp = require("../models/Otp");
const bcrypt = require("bcrypt");


exports.getUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if verified
    if (!user.isVerified) {
      return res.status(403).json({ message: "User not verified" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }



    // ✅ Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "MY_SECRET_KEY",
      { expiresIn: "8h" }
    );

    // Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: { userId: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error("Error in getUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};





// ID-based profile (GET /api/user/:id)
exports.getUserById = async (req, res) => {
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
exports.updateUserData = async (req, res) => {

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





// Otp Login for
exports.sendOtp = async (req, res) => {

  try {
    const inputData = req.body;
    let query = null; // email ya phone number

    if (!inputData) {
      return res.status(400).json({ message: "Email or phone number is required" });
    }

    if ("email" == Object.keys(req.body)) {
      query = inputData;
    } else if ("phone" == Object.keys(req.body)) {
      query = inputData;
    }

    // Find user in database
    await Otp.deleteOne(query);
    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a 6-digit OTP
    const otpCode = Math.floor(10000000 + Math.random() * 90000000); // 8-digit random number

    // Save OTP to database
    await Otp.create({
      email: user.email,
      phone: user.phone,
      otp: otpCode,
      expiresAt: Date.now() + 1 * 60 * 1000,
    });

    // TODO: Send OTP to email or phone
    // console.log(`OTP for ${inputData}: ${otpCode}`);

    return res.status(200).json({
      message: "OTP sent successfully",
      userId: user._id, // frontend me use ho sakta hai
    });

  } catch (error) {
    console.error("Error in sendOtp:", error);
    return res.status(500).json({ message: "Server error" });
  }

};





// verify otp 
exports.verifyOtp = async (req, res) => {

  try {
    const { inputValue, otp } = req.body;

    let query = null;

    if (!inputValue || !otp) {
      return res.status(400).json({ message: "Fill all the field" });
    }


    function checkType(value) {
      // Number check
      if (!isNaN(value) && value.trim() !== "") {
        return "number";
      }
      return "string";
    }

    const valueType = checkType(inputValue);


    // console.log(valueType)
    if ("number" === valueType) {
      query = "phone";
    } else if ("string" === valueType) {
      query = "email";
    }

    // console.log("click on veriy =>" + query);
    // console.log("click on veriy =>" + inputValue);

    // Find user in database
    const user = await Otp.findOne({ [query]: inputValue });
    // console.log(user);

    const expiryDate = new Date(user.expiresAt);
    const nowDate = new Date();


    if (nowDate <= expiryDate) {


      if (user.otp === otp) {

        const findUserdata = await User.findOne({ email: user.email });
        // console.log(findUserdata)


        // ✅ Generate token
        const token = jwt.sign(
          { userId: findUserdata._id, role: findUserdata.role },
          process.env.JWT_SECRET || "MY_SECRET_KEY",
          { expiresIn: "8h" }
        );


        // Send response
        res.status(200).json({
          message: "Login successful",
          token,
          user: {
            userId: findUserdata._id,
            name: findUserdata.name,
            email: findUserdata.email,
            role: findUserdata.role
          }
        });
        await Otp.deleteOne({ [query]: inputValue });

      }



    }




  } catch (error) {
    // console.error("Error in getUser:", error);
    res.status(500).json({ message: "Server error" });
  }

}