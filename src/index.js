const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies (will be useful in later steps)
app.use(express.json());

const questionsRouter = require('./routes/questions.js');

app.use('/api/questions', questionsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});