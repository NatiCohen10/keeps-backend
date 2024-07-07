const jwt = require("jsonwebtoken");
const Task = require("../models/tasks.model");

const { JWT_SECRET } = process.env;

function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }
  const splitToken = token.split(" ")[1];
  try {
    const decoded = jwt.verify(splitToken, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = verifyToken;
