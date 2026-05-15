const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ fixed (must match User.js model name)
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 100,
    },
    requestCategorie: {
      type: String,
      required: true,
      trim: true,
    },
    reasonForRequest: {
      type: String,
      required: true,
      trim: true,
    },
    daysToReturn: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ admin id
    },
    approvedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
 




 
 
 
 
 // const mongoose = require("mongoose");

  // const requestSchema = new mongoose.Schema(
  //   {
  //     user: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "user",
  //       required: true,
  //     },
  //     amount: {
  //       type: Number,
  //       required: true,
  //       min: 100,
  //     },
  //     requestCategorie: {
  //       type: String,
  //       required: true,
  //       trim: true,
  //     },
  //     reasonForRequest: {
  //       type: String,
  //       required: true,
  //       trim: true,
  //     },
  //     daysToReturn: {
  //       type: Number,
  //       required: true,
  //       min: 1,
  //     },
  //     status: {
  //       type: String,
  //       enum: ["pending", "approved", "rejected"],
  //       default: "pending",
  //     },
  //     reviewedBy: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "User", // admin id
  //     },
  //     approvedAt: Date,
  //   },
  //   { timestamps: true }
  // );

  // module.exports = mongoose.model("Request", requestSchema);

