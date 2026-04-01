const express = require("express");
const router = express.Router();

const questions = require('../data/questions.js');

// GET /questions
router.get("/", (req, res) => {

  // List all questions
  // res.json(questions);
  
  // List questions filtered by keyword
  const {keyword} = req.query;
  if (!keyword) {
    return res.json(questions);
  }

  // Show a specific question by ID
  router.get(":postId", (req, res) => {
    const questionId = Number (req.params.questionId);
    const question = this.post.find( q => q.id === questionId);

    if (!question) {
      return res.status(404).json({message: "Question not found"});
    }

    res.json(question);
  });

  const filteredQuestions = questions.filter(q => questions.keywords.includes(keyword.toLowerCase()));
  res.json(filteredQuestions);
});

module.exports = router;