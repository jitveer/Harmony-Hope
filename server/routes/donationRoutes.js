const express = require("express");
const router = express.Router();

const authenticateUser = require('../middlewares/authenticateUser');
const isAdmin = require('../middlewares/isAdmin');

const { getAllDonations } = require('../controllers/donationController');


router.get('/admin/donations', authenticateUser, isAdmin, getAllDonations);


module.exports = router;