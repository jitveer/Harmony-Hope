const express = require("express");
const cors = require("cors");
require("dotenv").config();
const routes = require("./routes/routes.js");
const connectDB = require("./config/mongodb.js");
const app = express();


//Database Connection
connectDB();


app.use(cors());
app.use(express.json());



//Home
app.use("/", (req, res) => {
  res.json("Hello i am a api");
});

//Api
app.use("/api/", routes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`),
);
