const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;
const SALT_ROUNDS = 10;

async function register(req, res) {
  try {
    const { username, password, email, lastName, firstName } = req.body;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
    });
    await user.save();
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

module.exports = { register, login };
