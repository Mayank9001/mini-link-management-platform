const mongoose = require("mongoose");
const VisitLog = require("../models/visitLogs.model");
const Link = require("../models/link.model");

const getUserClickAnalytics = async (userId) => {
  try {
    const shortLinks = await Link.find({ userId: userId });
    // console.log("sl", shortLinks);
    const shortLinkValues = shortLinks.map((link) => link.shortLink);
    // console.log("slv", shortLinkValues);

    // Device Type Clicks
    const deviceTypeClicks = await VisitLog.aggregate([
      { $match: { shortLink: { $in: shortLinkValues } } },
      { $group: { _id: "$deviceType", clicks: { $sum: 1 } } },
    ]);

    // Date-Wise Clicks
    const dateClicks = await VisitLog.aggregate([
      { $match: { shortLink: { $in: shortLinkValues } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%d-%m-%Y", date: "$timestamp" },
          },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    let runningSum = 0;
    const preSumClicks = dateClicks.map(({ _id, clicks }) => {
      runningSum += clicks;
      return { _id, clicks: runningSum };
    });
    const dateWiseClicks = preSumClicks;

    // total clicks
    const totalClick = await Link.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // Match the user's links
      { $group: { _id: null, totalClicks: { $sum: "$clicks" } } }, // Sum the clicks
    ]);

    // Return the total clicks or 0 if no links are found
    const totalClicks = totalClick.length > 0 ? totalClick[0].totalClicks : 0;
    return { deviceTypeClicks, dateWiseClicks, totalClicks };
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    throw error;
  }
};

module.exports = { getUserClickAnalytics };
