const express = require("express");
const router = express.Router();
const gemini = require("../lib/gemini");


router.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    
    const answer = await gemini.askGemini(prompt);

    res.json({
      success: true,
      answer
    });

  } catch (err) {
    throw new ServerError("Error communicating with Gemini API: " + err.message);
  }
});

module.exports = router;