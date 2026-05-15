const jwt = require("jsonwebtoken");


const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // CHECKING TOKEN IS THERE OF NOT
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            // console.log("AuthenticateUser Done");
            next();
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    } else {
        return res.status(401).json({ message: "Authorization token missing" });
    }

};


module.exports = authenticateUser;