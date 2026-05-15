import mongoose from "mongoose";
// const mongoose = require(mongoose);

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // aapke User model ka naam jo bhi ho
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["success", "warning", "error", "info"],
      default: "info",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
// module.exports = Notification;
