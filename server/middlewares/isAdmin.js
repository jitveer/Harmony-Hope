const User = require("../models/User");

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("role is admin");

    const flag = user?.role === "admin" || user?.isAdmin === true;
    if (!flag) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    // console.log("Admin Done");
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = isAdmin;