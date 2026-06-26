const jwt = require("jsonwebtoken");
const User = require('../models/User');
const Otp = require("../models/Otp");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const transporter = require("../config/nodemailer");

// Helper function to generate a secure 6-digit OTP
const generateSecureOtp = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

// Helper function to check lockout status of a user
const isUserLocked = (user) => {
    if (user.lockUntil && user.lockUntil > new Date()) {
        return true;
    }
    return false;
};

// Helper function to send OTP email
const sendOtpEmail = async (email, otpCode) => {
    await transporter.sendMail({
        from: "support@harmonyhopefoundation.com",
        to: email,
        subject: "HarmonyHope - OTP Verification Code",
        html: `<p>Your secure OTP is <b>${otpCode}</b>. It is valid for 10 minutes.</p>`,
    });
};

// Helper function definition wrapper
async function handleSendOtpFlow(user, res) {
    if (isUserLocked(user)) {
        const timeLeft = Math.ceil((user.lockUntil - new Date()) / 1000 / 60);
        return res.status(403).json({
            message: `Account is temporarily locked. Try again in ${timeLeft} minutes.`,
        });
    }

    const now = new Date();

    if (!user.otpWindowStart || (now - user.otpWindowStart) > 10 * 60 * 1000) {
        user.otpWindowStart = now;
        user.otpSendCount = 0;
    }

    if (user.otpSendCount >= 3) {
        return res.status(429).json({
            message: "Too many OTP requests. Try again after 10 minutes.",
        });
    }

    const otpCode = generateSecureOtp();
    const hashedOtp = await bcrypt.hash(otpCode, 10);

    user.otp = hashedOtp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.otpAttempts = 0;
    user.otpSendCount += 1;

    await user.save();

    await sendOtpEmail(user.email, otpCode);

    return res.status(200).json({
        message: "OTP sent successfully to your email.",
        email: user.email,
    });
}





// ================== REGISTER USER ==================
const register = async (req, res) => {
    const { name, email, phone, password, role, profileImage } = req.body;

    const nameRegex = /^[A-Za-z\s]{3,20}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    // Validate Input Fields
    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (!nameRegex.test(name)) {
        return res.status(400).json({ message: "Name must be 3-20 letters only." });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Please enter a valid email address." });
    }

    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Phone must be a valid 10-digit Indian number." });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: "Password must be 8–20 chars, with at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character.",
        });
    }

    try {
        const existingUser = await User.findOne({ email });

        // Prevent registering if the user exists and is already verified
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({ message: "User already registered and verified." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const imageUrl = profileImage || "https://share.google/images/gNxasBoWF5ILF4xWm";

        let user;
        if (existingUser) {
            // If user exists but is unverified, update their details for registration retry
            existingUser.name = name;
            existingUser.phone = phone;
            existingUser.password = hashedPassword;
            existingUser.profileImage = imageUrl;
            existingUser.role = role || "user";
            user = await existingUser.save();
        } else {
            // Create new unverified user
            user = new User({
                name,
                email,
                phone,
                password: hashedPassword,
                profileImage: imageUrl,
                role: role || "user",
                isVerified: false,
            });
            await user.save();
        }

        // Call Send OTP flow
        return await handleSendOtpFlow(user, res);

    } catch (err) {
        console.error("Error in registration:", err);
        return res.status(500).json({ message: "Internal server error during registration." });
    }
};






// ================== SEND OTP ==================
const sendRegistrationOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return await handleSendOtpFlow(user, res);
    } catch (err) {
        console.error("Error sending OTP:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};






// ================== RESEND OTP ==================
const resendRegistrationOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Registration session not found. Please register." });
        }

        return await handleSendOtpFlow(user, res);
    } catch (err) {
        console.error("Error resending OTP:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// ================== VERIFY OTP ==================
const verifyRegistrationOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // 1. Check if user is locked
        if (isUserLocked(user)) {
            const timeLeft = Math.ceil((user.lockUntil - new Date()) / 1000 / 60);
            return res.status(403).json({
                message: `Your account is temporarily locked due to excessive failed attempts. Please try again in ${timeLeft} minutes.`,
            });
        }

        // 2. Check if OTP exists and is valid
        if (!user.otp || !user.otpExpires || user.otpExpires < new Date()) {
            return res.status(400).json({ message: "OTP has expired or is invalid. Please request a new one." });
        }

        // 3. Compare entered OTP with hashed OTP
        const isMatch = await bcrypt.compare(otp, user.otp);

        if (isMatch) {
            // SUCCESSFUL VERIFICATION
            user.isVerified = true;
            user.otp = null;
            user.otpExpires = null;
            user.otpAttempts = 0;
            user.failedAttempts = 0;
            user.lockUntil = null;
            user.lockLevel = 0;
            await user.save();

            // Generate JWT Token
            const token = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.JWT_SECRET || "MY_SECRET_KEY",
                { expiresIn: "7d" }
            );

            return res.status(200).json({
                message: "OTP verified successfully.",
                token,
                user: {
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        } else {
            // INCORRECT OTP
            user.otpAttempts += 1;
            user.failedAttempts += 1;

            let responseMessage = "Incorrect OTP.";

            // Handle locking states
            if (user.failedAttempts >= 9) {
                user.lockLevel = 3;
                user.lockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours lock
                user.otp = null; // Invalidate current OTP
                user.otpExpires = null;
                responseMessage = "Excessive failed attempts. Your account is locked for 24 hours. Please request a new OTP after 24 hours.";
            } else if (user.failedAttempts >= 6) {
                user.lockLevel = 2;
                user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes lock
                user.otp = null; // Invalidate current OTP
                user.otpExpires = null;
                responseMessage = "Excessive failed attempts. Your account is locked for 30 minutes. Please request a new OTP after 30 minutes.";
            } else if (user.failedAttempts >= 3) {
                user.lockLevel = 1;
                user.lockUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes lock
                user.otp = null; // Invalidate current OTP
                user.otpExpires = null;
                responseMessage = "Excessive failed attempts. Your account is locked for 10 minutes. Please request a new OTP after 10 minutes.";
            } else if (user.otpAttempts >= 3) {
                // Individual OTP wrong attempts exceeded (Max 3 wrong attempts)
                user.otp = null; // Invalidate current OTP
                user.otpExpires = null;
                responseMessage = "Too many wrong attempts for this OTP. It has been invalidated. Please request a new OTP.";
            } else {
                responseMessage = `Incorrect OTP. Please try again. You have ${3 - user.otpAttempts} attempts remaining for this OTP.`;
            }

            await user.save();
            return res.status(400).json({ message: responseMessage });
        }

    } catch (err) {
        console.error("Error in OTP verification:", err);
        return res.status(500).json({ message: "Internal server error during verification." });
    }
};









const authlogin = async (req, res) => {

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





// Otp Login for
const sendOtp = async (req, res) => {

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
const verifyOtp = async (req, res) => {

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






module.exports = {
    authlogin,
    sendOtp,
    verifyOtp,
    register,
    sendRegistrationOtp,
    resendRegistrationOtp,
    verifyRegistrationOtp
}