const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

const formatUser = (user) => ({
  id: user._id.toString(),
  email: user.email,
  state: user.state || "",
  district: user.district || "",
  regionCompleted: Boolean(user.regionCompleted),
});

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const user = await User.create({
      email: email.toLowerCase().trim(),
      password,
    });
    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: formatUser(user),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
      "+password"
    );
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = signToken(user._id);
    user.password = undefined;
    res.json({
      token,
      user: formatUser(user),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  res.json({ user: formatUser(req.user) });
};

exports.updateRegion = async (req, res) => {
  try {
    const { state, district } = req.body;
    if (!state || !district) {
      return res.status(400).json({ error: "State and district required" });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.state = String(state).trim();
    user.district = String(district).trim();
    user.regionCompleted = true;
    await user.save();
    res.json({ user: formatUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
