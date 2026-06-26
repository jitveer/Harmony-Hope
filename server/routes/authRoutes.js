const express = require('express');
const { authlogin, register, sendRegistrationOtp, resendRegistrationOtp, verifyRegistrationOtp } = require('../controllers/authController');
const { otpRateLimiter } = require('../middlewares/rateLimiter');
const router = express.Router();


router.post('/admin-login', authlogin);
router.post('/user-login', authlogin);

router.post('/register', otpRateLimiter, register);
router.post('/send-otp', otpRateLimiter, sendRegistrationOtp);
router.post('/resend-otp', otpRateLimiter, resendRegistrationOtp);
router.post('/verify-otp', otpRateLimiter, verifyRegistrationOtp);

module.exports = router;