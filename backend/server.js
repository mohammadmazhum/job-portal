const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passportConfig = require("./lib/passportConfig");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// MongoDB
mongoose
  .connect("mongodb://localhost:27017/jobPortal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// Initialising directories
const publicDir = path.join(__dirname, "public");
const resumeDir = path.join(publicDir, "resume");
const profileDir = path.join(publicDir, "profile");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}

if (!fs.existsSync(profileDir)) {
  fs.mkdirSync(profileDir, { recursive: true });
}

const app = express();
const port = 4444;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setting up middlewares
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Job Portal API is running.",
    endpoints: [
      "/auth",
      "/api",
      "/upload",
      "/host",
    ],
  });
});

// Routing
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/apiRoutes"));
app.use("/upload", require("./routes/uploadRoutes"));
app.use("/host", require("./routes/downloadRoutes"));

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});