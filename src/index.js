const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

const authRouter = require("./routes/auth.js");
const questionsRouter = require('./routes/questions.js');
const multer = require("multer");

const path = require('path');
app.use(express.static(path.join(__dirname, '..', 'public')));
const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "public", "uploads"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
},
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));},
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Middleware to parse JSON bodies (will be useful in later steps)
app.use(express.json());
app.use(multer({ storage }).single('image'));

app.use("/api/auth", authRouter);
app.use('/api/questions', questionsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Page not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// // Graceful shutdown
// process.on("SIGINT", async () => {
//  await prisma.$disconnect();
//  process.exit(0);
// });
// process.on("SIGTERM", async () => {
//  await prisma.$disconnect();
//  process.exit(0);
// });
