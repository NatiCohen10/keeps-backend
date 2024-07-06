const express = require("express");
const {
  register,
  login,
  getLoggedInUser,
} = require("../controllers/auth.controller");
const verifyToken = require("../middleware/userAuth.middleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", verifyToken, getLoggedInUser);

module.exports = router;
