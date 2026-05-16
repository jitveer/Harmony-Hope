const express = require("express");
const routes = express();
const userRegistrationWtihOtp = require("./userRegistrationWtihOtp.js");
const userLoginWithUserProfile = require("./userLoginWithUserProfile.js");
const requestRoutes = require("./requestRoutes.js");
const myDonation = require("./donation.js");

// USER RESGISTRATION AND OTP VERIFICATION
routes.use("/auth", userRegistrationWtihOtp);

// USER LOGIN & GET USER PROFILE
routes.use("/user", userLoginWithUserProfile);

// REQUEST API
routes.use("/requests", requestRoutes);

// DONATION API
routes.use("/", myDonation);

module.exports = routes;
