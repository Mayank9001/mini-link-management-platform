const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
const Link = require("../models/link.model");
const VisitLog = require("../models/visitLogs.model");

router.get("/getlogs", auth, async (req, res) => {
  const id = req.user.id;
  if (!id) {
    return res.status(400).json({ status: false, message: "Not allowed!!" });
  }
  try {
    const links = await Link.find({ userId: id });
    if (!links) {
      return res
        .status(400)
        .json({ status: false, message: "No links found!!" });
    }
    const shortLinks = links.map((link) => link.shortLink);
    const logs = await VisitLog.find({ shortLink: { $in: shortLinks } });
    if (!logs) {
      return res
        .status(400)
        .json({ status: false, message: "No logs found!!" });
    }
    return res.status(200).json({
      status: true,
      message: "All Logs fetched successfully!!",
      logs: logs,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "Error", message: "Internal Server Error !!" });
  }
});

module.exports = router;
