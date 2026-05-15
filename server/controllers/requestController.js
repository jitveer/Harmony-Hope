const Request = require("../models/Request");
const User = require("../models/User");
const Notification = require("../models/Notifications");

// Create new Request (User)

exports.createRequest = async (req, res) => {
  try {
    const { amount, requestCategorie, reasonForRequest, daysToReturn } = req.body;
    const userId = req.user.userId;

    if (!amount || !requestCategorie || !reasonForRequest || !daysToReturn) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (amount <= 0 || daysToReturn <= 0) {
      return res.status(400).json({ message: "Invalid amount or daysToReturn" });
    }

    const doc = await Request.create({ user: userId, amount, requestCategorie, reasonForRequest, daysToReturn });
    res.status(201).json({ message: "Request submitted", request: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// Request status
exports.requestStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const list = await Request.find({ user: userId }).sort({ createdAt: -1 });
    res.status(201).json({ requests: list });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server Error" });
  }
}


// REQUEST DELETE
exports.requestDelete = async (req, res) => {
  try {
    const userId = req.user.userId; // token se aaya user
    const requestId = req.params.id; // route se aaya requestId

    // Check request exist karti hai ya nahi
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Check ki yeh request usi user ki hai
    if (request.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this request" });
    }

    // Delete karo
    const deletedRequest = await Request.findByIdAndDelete(requestId);

    res.status(200).json({
      message: "Request deleted successfully",
      deletedRequest
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};








// Admin: Get all requests (with optional ?status=pending/approved/rejected)
exports.getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const list = await Request.find(filter)
      .populate("user", "name email")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ requests: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error hai" });
  }
};







// Admin: Update status (approve/reject)
// exports.updateRequestStatus = async (req, res) => {
//   try {
//     const adminId = req.user.userId;
//     const { id } = req.params;
//     const { status } = req.body; // "approved" | "rejected"

//     const message = `Your request is ${status}`;


//       console.log(adminId, id, status);

//     if (!["approved", "rejected"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const update = {
//       status,
//       reviewedBy: adminId,
//       approvedAt: status === "approved" ? new Date() : undefined,
//     };

//     const doc = await Request.findByIdAndUpdate({ _id: id }, update, { new: true });
//     if (!doc) return res.status(404).json({ message: "Request not found" });

//     res.json({ message: "Status updated", request: doc });


//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };





// Admin: Update status (approve/reject)
exports.updateRequestStatus = async (req, res) => {
  try {
    const adminId = req.user.userId;
    const { id } = req.params;
    const { status } = req.body; // "approved" | "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const update = {
      status,
      reviewedBy: adminId,
      approvedAt: status === "approved" ? new Date() : undefined,
    };

    const doc = await Request.findByIdAndUpdate({ _id: id }, update, { new: true });
    if (!doc) return res.status(404).json({ message: "Request not found" });




    // // CREATE NOTIFICATION

    // // 🔹 Step 1: Title & Message set karo
    // const title = status === "approved" ? "Request Approved" : "Request Rejected";
    // const message =
    //   status === "approved"
    //     ? "Your request has been approved successfully."
    //     : "Your request has been rejected. Please review the reason or contact admin.";

    // // 🔹 Step 2: Notification DB me insert karo
    // try {
    //   await Notification.create({
    //     userId: doc.userId, // jis user ka request tha
    //     title,
    //     message,
    //     type: status === "approved" ? "success" : "warning",
    //   });
    // } catch (notifError) {
    //   console.error("Notification creation failed:", notifError.message);
    // }

    // res.json({ message: "Status updated", request: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};














// // USER HELP REQUEST SENT

// const submitRequest = async (req, res) => {

//     try {
//         const { reasonForRequest, amountRequested, category } = req.body;
//         if (!reasonForRequest) {
//             return res.status(400).json({ message: 'reason for request is required' })
//         }

//         const newReq = new Request({
//             user: req.user.id, reasonForRequest, amountRequested, category
//         });

//         await newReq.save();
//         alert("Sucessful")
//         return res.status(201).json({ sucess: true, data: newReq });

//     } catch (error) {
//         console.error(err);
//         return res.status(500).json({ message: "Server error" })
//     }
// }





// module.exports = { submitRequest };