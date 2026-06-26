const express = require("express");
const routes = express();
const authRoutes = require("./authRoutes.js");
const userRoutes = require("./userRoutes.js");
const adminRoute = require("./adminRoutes.js");



routes.use('/auth', authRoutes);
routes.use('/user', userRoutes);
routes.use('/admin', adminRoute);

module.exports = routes;