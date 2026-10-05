const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// Store uploaded files in memory temporarily
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// Make sure upload directories exist
const resumeDir = path.join(__dirname, "../public/resume");
const profileDir = path.join(__dirname, "../public/profile");

fs.mkdirSync(resumeDir, { recursive: true });
fs.mkdirSync(profileDir, { recursive: true });

/*
 * Upload Resume
 * Allowed: PDF only
 */
router.post("/resume", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a resume",
      });
    }

    const file = req.file;

    // Check MIME type
    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({
        message: "Only PDF files are allowed for resumes",
      });
    }

    // Check extension
    const extension = path.extname(file.originalname).toLowerCase();

    if (extension !== ".pdf") {
      return res.status(400).json({
        message: "Only PDF files are allowed for resumes",
      });
    }

    const filename = `${uuidv4()}.pdf`;
    const filepath = path.join(resumeDir, filename);

    fs.writeFileSync(filepath, file.buffer);

    return res.status(200).json({
      message: "Resume uploaded successfully",
      url: `/host/resume/${filename}`,
    });
  } catch (err) {
    console.error("Resume upload error:", err);

    return res.status(500).json({
      message: "Error while uploading resume",
    });
  }
});

/*
 * Upload Profile Image
 * Allowed: JPG, JPEG, PNG
 */
router.post("/profile", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a profile image",
      });
    }

    const file = req.file;

    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        message: "Only JPG, JPEG and PNG images are allowed",
      });
    }

    const extension = path.extname(file.originalname).toLowerCase();

    const allowedExtensions = [".jpg", ".jpeg", ".png"];

    if (!allowedExtensions.includes(extension)) {
      return res.status(400).json({
        message: "Only JPG, JPEG and PNG images are allowed",
      });
    }

    const finalExtension = extension === ".jpeg" ? ".jpg" : extension;

    const filename = `${uuidv4()}${finalExtension}`;
    const filepath = path.join(profileDir, filename);

    fs.writeFileSync(filepath, file.buffer);

    return res.status(200).json({
      message: "Profile image uploaded successfully",
      url: `/host/profile/${filename}`,
    });
  } catch (err) {
    console.error("Profile image upload error:", err);

    return res.status(500).json({
      message: "Error while uploading profile image",
    });
  }
});

module.exports = router;