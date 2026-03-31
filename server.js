const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// Schema
const resumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  education: String,
  skills: String,
  projects: String,
  photo: String
});

const Resume = mongoose.model("Resume", resumeSchema);

// Multer setup (for file upload)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// Routes

// Save Resume
app.post("/save", upload.single("photo"), async (req, res) => {
  try {
    const newResume = new Resume({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      education: req.body.education,
      skills: req.body.skills,
      projects: req.body.projects,
      photo: req.file ? req.file.filename : null
    });

    await newResume.save();

    res.send("Saved Successfully ✅");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving data");
  }
});

// Get all resumes
app.get("/resumes", async (req, res) => {
  try {
    const data = await Resume.find().sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching data");
  }
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});