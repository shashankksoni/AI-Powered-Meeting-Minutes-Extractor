require("dotenv").config();

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const processMeeting = require("./routes/processMeeting");

const app = express();


const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    
    if (file.mimetype === "text/plain" || file.originalname.endsWith(".txt")) {
      cb(null, true);
    } else {
      cb(new Error("Only .txt files are allowed!"), false);
    }
  },
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});


app.get("/", (req, res) => {
  res.json({
    message: "Meeting Minutes Extractor API",
    status: "running",
    endpoints: {
      "POST /process-meeting": "Process meeting notes from file or text",
    },
  });
});


app.post("/process-meeting", upload.single("file"), async (req, res) => {
  try {
    const result = await processMeeting(req, res);

    
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    return result;
  } catch (error) {
    
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    console.error("Error processing meeting:", error);
    res.status(500).json({ error: error.message });
  }
});


app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({ error: error.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
