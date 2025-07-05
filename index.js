
require("dotenv").config(); 

const express = require("express");
const multer = require("multer");
const processMeeting = require("./routes/processMeeting");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.json());

app.post("/process-meeting", upload.single("file"), processMeeting);

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
