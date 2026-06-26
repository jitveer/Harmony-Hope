const express = require("express");
const router = express.Router();

const { getAllRequests, updateRequestStatus } = require("../controllers/requestController");
const { getAllDonations } = require('../controllers/donationController');
const { getUserById, updateUserData } = require("../controllers/userController");

const authenticateUser = require('../middlewares/authenticateUser');
const isAdmin = require('../middlewares/isAdmin');



// TOKEN VERIFICATION 
router.get("/verify", authenticateUser, (req, res) => {
    res.json({ message: "Welcome! You are logged in.", user: req.user.id, role: req.user.role });
});

// Admin: all donations
router.get('/admin/donations', authenticateUser, isAdmin, getAllDonations);


// Admin: all requests
router.get("/admin", authenticateUser, isAdmin, getAllRequests);

// GET USER BY ID
router.get("/:id", authenticateUser, getUserById);

//UPDATE USER BY ID
router.put("/:id", authenticateUser, updateUserData);

// Admin: Approve
router.patch("/status/:id", authenticateUser, isAdmin, updateRequestStatus);

// Admin: update status
router.patch("/:id/status", authenticateUser, isAdmin, updateRequestStatus);















module.exports = router;