const express = require("express");
const router = express.Router();
const questions = require('../data/questions.js');

// List questions filtered by keyword
// GET /api/questions?keyword=http
router.get("/", (req, res) => {
  if ('keyword' in req.query) {
    const {keyword} = req.query;
    if (!keyword) { 
      return res.json({message : "GET: Keyword is missing which is required"});
    }

    const filteredQuestions = questions.filter(q => q.keywords.includes(keyword.toLowerCase()));
    if (filteredQuestions.length == 0) {
      return res.json({message: "GET: Found no question match with keyword"});
    }
  
    return res.json(filteredQuestions);
  }
  else {
    // List all questions
    return res.json(questions);
  }
});

// Show a specific question by ID
// GET /api/questions/1
router.get("/:questionId", (req, res) => {
  const questionId = Number (req.params.questionId);
  const question = questions.find(q => q.id === questionId);

  if (!question) {
    return res.status(404).json({message: "GET: Question not found"});
  }

  return res.json(question);
});

// create new question
// POST
router.post("/", (req, res) => {
  const {question, date, answers, keywords} = req.body;

  if (!question || !date || !answers) {
    return res.status(404).json({message: "POST: Required data is missing"});
  }

  const currentId = Math.max(...questions.map(q=> q.id), 0);
  const newQuestion = {
    id : questions.length ? currentId + 1 : 1,
    date, question, answers, 
    keyword : Array.isArray(keywords) ? keywords : []
  };

  questions.push(newQuestion);
  return res.status(201).json(newQuestion);
});

// Edit a question
// PUT
router.put ("/:questionId", (req, res) => {
  const questionId = Number(req.params.questionId);
  const {question, date, answers, keywords} = req.body;

  if (!question || !date || answers) {
    return res.status(404).json({message: "PUT: Required data is missing"});
  }

  const editQuestion = questions.find(q => q.id === questionId);
  editQuestion.question = question;
  editQuestion.date = date;
  editQuestion.answers = answers;
  editQuestion.keywords = Array.isArray(keywords) ? keywords : [];

  return res.status(201).json(editQuestion);
});

// delete a question
// DELETE
router.delete("/", (req, res) => {
  const questionId = Number (req.params.qid);
  if (!questionId) {
    res.status(401).json({message : "DELETE: Missing question ID"});
  }

  if (questionId === -1) {
    req.status(401).json({message : "DELETE: Invalid question ID"});
  }

  const questionToDelete = questions.splice(questionId, 1);

  return res.status(201).json({message : "Question was deleted", post : questionToDelete[0]})
});

module.exports = router;
