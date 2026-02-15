const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

//Middleware intercepts requests before they reach the route handler
const authMiddleware = async (req, res, next) => {
  try {
    //show us your ID token, if you dont have an ID token, you cant enter
    //reads the jwt token from the cookies in the incoming request
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized, no token provided" });
    }
    //let me verify if the ID entered is legit, if it is, give me the user info associated with that ID
    //if the ID is not legit, you cant enter
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized,invalid token" });
    }
    //Fetches the user from the database using the ID from the token, excluding the password field.
    const user = await User.findById(decoded.id).select("-password");
    //if the user is not found in the database, return an unauthorized error.
    // This could happen if the token is valid but the user has been deleted or does not exist.
    if (!user) {
      return res.status(404).json({ message: "Unauthorized,user not found" });
    }
    //If the user is found, attach the user object to the request object (req.user)
    // and call next() to pass control to the next middleware or route handler.
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { authMiddleware };
