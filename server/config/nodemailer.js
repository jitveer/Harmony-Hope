const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: parseInt(process.env.NODEMAILER_PORT),
  secure: process.env.SECURE === "true" || process.env.NODEMAILER_PORT === "465",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP Connection Failed:", error);
  } else {
    console.log("SMTP Server is ready to take messages");
  }
});

module.exports = transporter;
