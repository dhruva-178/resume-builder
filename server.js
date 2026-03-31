const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config(); // ✅ for cloud

const app = express();
app.use(cors());
app.use(express.json());

// serve frontend
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// ✅ CONNECT TO MONGODB ATLAS
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// schema
const ResumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  education: String,
  skills: String,
  projects: String,
  photo: String
});

const Resume = mongoose.model("Resume", ResumeSchema);

// upload setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});
const upload = multer({ storage });

// save API
app.post("/save", upload.single("photo"), async (req, res) => {
  try {
    const data = new Resume({
      ...req.body,
      photo: req.file ? req.file.filename : ""
    });

    await data.save();
    res.send("Saved Successfully ✅");
  } catch (err) {
    res.status(500).send(err);
  }
});

// get data
app.get("/resumes", async (req, res) => {
  const data = await Resume.find();
  res.json(data);
});

// ✅ PORT FIX FOR CLOUD
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));