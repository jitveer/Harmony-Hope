const express = require("express");
const router = express.Router();

const authenticateUser = require("../middlewares/authenticateUser"); // your existing file
const isAdmin = require("../middlewares/isAdmin");


const {
  createRequest,
  requestStatus,
  requestDelete,
  getAllRequests,
  updateRequestStatus,
} = require("../controllers/requestController");


// User: create request
router.post("/", authenticateUser, createRequest);

//USER REQUEST STATUS
router.get("/request_status", authenticateUser, requestStatus);

// DELETE REQUEST 
router.delete("/:id",authenticateUser, requestDelete);

// Admin: all requests
router.get("/admin", authenticateUser, isAdmin, getAllRequests);

// Admin: Approve
router.patch("/status/:id", authenticateUser, isAdmin, updateRequestStatus);

// // Admin: update status
// router.patch("/:id/status", authenticateUser, isAdmin, updateRequestStatus);

module.exports = router;