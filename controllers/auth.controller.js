const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;
const SALT_ROUNDS = 10;

async function register(req, res) {
  try {
    const { password, ...userData } = req.body;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({
      ...userData,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    console.log(savedUser);
    res.status(201).json({ message: "User registered successfuly" });
  } catch (err) {
    if (err.code === 11000) {
      console.log("user already exists");
      return res.status(400).json({ error: "User already exists" });
    }
    console.log(err.message);
    res.status(500).json({ error: "registration failed" });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Login failed" });
  }
}

async function getLoggedInUser(req, res) {
  const { userId } = req;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404), json({ error: "User not found" });
    }
    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    if (error.name === "CastError") {
      console.log(
        "auth.controller, getLoggedInUser, user not found with id",
        userId
      );
      return res.status(404).json({ message: "user not found" });
    }
    console.log(
      "auth.controller, getLoggedInUser, error while getting user with id",
      userId,
      error.name
    );
    res.status(500).json({ message: error.message });
  }
}

module.exports = { register, login, getLoggedInUser };
