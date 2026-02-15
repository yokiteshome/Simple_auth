// Import the jsonwebtoken library to handle JWT creation and signing
const jwt = require("jsonwebtoken");

// Define a function that generates a JWT and sets it as an HTTP-only cookie on the response object
const generateTokenandSetCookie = (res, newUser) => {
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  // Set the 'jwt' cookie on the response object
  res.cookie("jwt", token, {
    // maxAge: 15 days in milliseconds (15 * 24h * 60m * 60s * 1000ms)
    maxAge: 15 * 24 * 60 * 60 * 1000,
    // httpOnly: true ensures the cookie cannot be accessed via JavaScript on the frontend (prevents XSS)
    httpOnly: true,
    // sameSite: "strict", // Optional: csrf protection (often recommended)
    // secure: process.env.NODE_ENV !== "development", // Optional: Use secure cookies in production (HTTPS)
  });
};

module.exports = { generateTokenandSetCookie };
