const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
app.use(cors());

const authRouter = require("./routes/auth.js");
const questionsRouter = require('./routes/questions.js');
const geminiRouter = require('./routes/gemini.js');
const multer = require("multer");
const { NotFoundError, BadRequestError } = require("./lib/error.js");

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
// app.use(errorHandler);
const pinoHttp = require("pino-http");
const logger = require("./lib/logger");
app.use(pinoHttp({
  logger,
  autoLogging: { ignore: (req) => req.url.startsWith("/uploads") },
}));

app.use('/api/auth', authRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/gemini', geminiRouter);

app.use((req, res, next) => {
  throw new NotFoundError("Page not found");
});
const prisma = require("./lib/prisma");

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info({ port: PORT }, "server listening");
});

async function shutdown() {
 await prisma.$disconnect();
 server.close(() => process.exit(0));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Graceful shutdown
process.on("SIGINT", async () => {
 await prisma.$disconnect();
 process.exit(0);
});
process.on("SIGTERM", async () => {
 await prisma.$disconnect();
 process.exit(0);
});
