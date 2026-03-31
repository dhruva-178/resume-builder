const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// make uploads folder if missing
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use("/uploads", express.static(uploadsDir));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error:", err));

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

app.post("/save", upload.single("photo"), async (req, res) => {
  try {
    const newResume = new Resume({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      education: req.body.education,
      skills: req.body.skills,
      projects: req.body.projects,
      photo: req.file ? req.file.filename : ""
    });

    await newResume.save();
    res.status(200).send("Saved Successfully ✅");
  } catch (err) {
    console.log("Save Error:", err);
    res.status(500).send("Error saving data");
  }
});

app.get("/resumes", async (req, res) => {
  try {
    const data = await Resume.find().sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    console.log("Fetch Error:", err);
    res.status(500).json({ error: "Error fetching resumes" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});