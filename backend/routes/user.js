const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth.js");
const User = require("../models/user.model");
const Link = require("../models/link.model");
const VisitLog = require("../models/visitLogs.model");
const { getUserClickAnalytics } = require("../utils/analytics");

router.post("/register", async (req, res) => {
  const { name, email, password, mobileNo, confirmPassword } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format check
  const mobileRegex = /^\d{10}$/; // Checks for exactly 10 digits
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numberRegex = /\d/;
  const specialCharRegex = /[@$!%*?&]/;

  if (
    !name ||
    !email ||
    !password ||
    !mobileNo ||
    !confirmPassword ||
    password !== confirmPassword
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required!" });
  }
  if (!email.includes("@")) {
    return res.status(400).json({ success: false, message: "Email must contain '@' symbol!" });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false,message: "Invalid email format!" });
  }
  if (!/^\d+$/.test(mobileNo)) {
    return res.status(400).json({ success: false,message: "Mobile number must contain only digits!" });
  }
  if (mobileNo.length !== 10) {
    return res.status(400).json({ success: false,message: "Mobile number must be exactly 10 digits!" });
  }
  if (password.length < 8) {
    return res.status(400).json({ success: false,message: "Password must be at least 8 characters long!" });
  }
  if (!uppercaseRegex.test(password)) {
    return res.status(400).json({ success: false,message: "Password must contain at least one uppercase letter!" });
  }
  if (!lowercaseRegex.test(password)) {
    return res.status(400).json({ success: false,message: "Password must contain at least one lowercase letter!" });
  }
  if (!numberRegex.test(password)) {
    return res.status(400).json({ success: false, message: "Password must contain at least one number!" });
  }
  if (!specialCharRegex.test(password)) {
    return res.status(400).json({ success: false, message: "Password must contain at least one special character (@$!%*?&)!" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords do not match!" });
  }
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(401)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPass,
      mobileNo: mobileNo,
    });
    await newUser.save();
    res
      .status(200)
      .json({ success: true, message: "User Registed Succesfully!!" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required!" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found!!" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobileNo: user.mobileNo,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "12h",
    });

    const { password: hashedPass, ...userDetails } = user._doc;
    res.status(200).json({
      success: true,
      message: "Login Successfull!!",
      token: token,
      user: userDetails,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: "Error", message: "Internal Server Error !!" });
  }
});

router.put("/update", auth, async (req, res) => {
  const { newName, newEmail, newMobileNo } = req.body;
  if (!newName || !newEmail || !newMobileNo) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid User" });
    }
    await User.findByIdAndUpdate(req.user.id, {
      name: newName,
      email: newEmail,
      mobileNo: newMobileNo,
    });
    res
      .status(200)
      .json({ success: true, message: "Changes Saved Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: "Error", message: "Internal Server Error !!" });
  }
});

router.delete("/delete", auth, async (req, res) => {
  const id = req.user.id;
  try {
    // const links = Link.find({ userId: id });
    // const visits = await VisitLog.
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid User" });
    }
    const userLinks = await Link.find({ userId: id });
    // console.log("userLinks", userLinks);
    const shortLinks = userLinks.map((link) => link.shortLink);
    // console.log("ShortLinks", shortLinks);
    // Delete all links associated with the user
    await Link.deleteMany({ userId: id });

    // Delete all visit logs associated with the user's links
    await VisitLog.deleteMany({ shortLink: { $in: shortLinks } });
    return res
      .status(200)
      .json({ success: true, message: "Account Deleted Succesfully!!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: "Error", message: "Internal Server Error !!" });
  }
});

router.get("/dashboard", auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid User" });
    }
    // console.log(userId);
    const analytics = await getUserClickAnalytics(userId);
    const dateWiseClicks = analytics.dateWiseClicks;
    const deviceTypeClicks = analytics.deviceTypeClicks;
    const totalClicks = analytics.totalClicks;
    res.status(200).json({
      status: true,
      message: "Data fetched successfully!",
      data: { totalClicks, dateWiseClicks, deviceTypeClicks },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: "Error", message: "Internal Server Error !!" });
  }
});

module.exports = router;
