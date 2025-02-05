const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user");
const linkRoutes = require("./routes/link");
const useragent = require("express-useragent");
const Link = require("./models/link.model");
const VisitLog = require("./models/visitLogs.model");
const logRoutes = require("./routes/visitlogs");
dotenv.config({});

const port = process.env.PORT || 3000;
app.set("trust proxy", true);
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res
    .status(200)
    .send({ status: "success", msg: "Mini Link API's is working well." });
});
app.use("/user", userRoutes);
app.use("/link", linkRoutes);
app.use("/logs", logRoutes);
app.use(useragent.express());

app.get("/visit/:shortLink", async (req, res) => {
  const shortLink = req.params.shortLink;
  const userAgent = req.useragent;
  // console.log(shortLink);

  try {
    const link = await Link.findOne({ shortLink });
    // console.log("Link", link);

    if (!link) {
      return res.status(404).send("Short link not found!");
    }

    const deviceType = userAgent.isMobile
      ? "Mobile"
      : userAgent.isTablet
      ? "Tablet"
      : userAgent.isDesktop
      ? "Desktop"
      : "Mobile";

    const platform = userAgent.isWindows
      ? "Windows"
      : userAgent.isMac
      ? "Mac"
      : userAgent.isiPhone || userAgent.isiPad
      ? "iOS"
      : userAgent.isAndroid
      ? "Android"
      : "Chrome";
    
    const ipAddress = req.headers["x-forwarded-for"]
      ? req.headers["x-forwarded-for"].split(",")[0].trim()
      : req.socket.remoteAddress;

    const timestamp = new Date();

    const currentStatus =
    timestamp < link.expirationDate || link.expirationDate === null ? "Active" : "Inactive";
    if (link.status !== currentStatus) {
      link.status = currentStatus;
      await link.save();
    }

    if (currentStatus === "Inactive") {
      return res.send(
        `<html>
          <head>
            <script>
              setTimeout(() => {
                window.location.href = "https://google.com";
              }, 2000);
            </script>
          </head>
          <body>
            <h3>Link Inactive....Opening Google</h3>
          </body>
        </html>`
      );
    }

    await Link.findOneAndUpdate({ shortLink }, { $inc: { clicks: 1 } });

    const visitLog = new VisitLog({
      shortLink: link.shortLink,
      originalLink: link.originalLink,
      deviceType: deviceType,
      platform: platform,
      ipAddress: ipAddress,
      timestamp: timestamp,
    });

    await visitLog.save();
    res.redirect(link.originalLink);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error!");
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
    });
});
