const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/authenticateUser");
const { submitDonation, getUserDonations } = require("../controllers/donationController");

const { createRequest, requestStatus, requestDelete, updateRequest } = require("../controllers/requestController");


router.use(authenticateUser);


//DONATION ROUTES
router.post("/donate", submitDonation);
router.get("/donation-status", getUserDonations);




// REQUESTS ROUTES

// User: create request
router.post("/request", authenticateUser, createRequest);

//USER REQUEST STATUS
router.get("/requests", authenticateUser, requestStatus);

// DELETE REQUEST 
router.delete("/requests/:id", authenticateUser, requestDelete);

// EDIT REQUEST
router.put("/requests/:id", authenticateUser, updateRequest);







module.exports = router;