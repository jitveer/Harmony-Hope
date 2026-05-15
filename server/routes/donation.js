const express = require("express");
const router = express.Router();

const authenticateUser = require("../middlewares/authenticateUser");
const {
  submitDonation,
  getUserDonations,
  getAllDonations,
  getDonationSummary,
} = require("../controllers/donationController");
const isAdimin = require("../middlewares/isAdmin");

// User route: submit donation
router.post("/donate", authenticateUser, submitDonation);

router.get("/my", authenticateUser, getUserDonations);

router.get("/admin/donations", authenticateUser, isAdimin, getAllDonations);

router.get("donations/summary", authenticateUser, isAdimin, getDonationSummary);

module.exports = router;
