const express = require("express");
const router = express.Router();

const questions = require('../data/questions.js');

// List all questions
router.get("/", (req, res) => {
  res.json(questions);
});

// List questions filtered by keyword
// GET /api/questions/ , /api/questions?keyword=http
router.get("/", (req, res) => {  
  const {keyword} = req.query;
  if (!keyword) { // return all when keywork is empty
    return res.json(questions);
  }
  
  const filteredQuestions = questions.filter(q => 
    questions.keywords.includes(keyword.toLowerCase()));

    if (!filteredQuestions) {
      return res.status(404).json({message: "Question not found"});
    }
  
    res.json(filteredQuestions);
});

// Show a specific question by ID
router.get("/:qid", (req, res) => {
  const questionId = Number (req.params.qid);
  const question = questions.find(q => q.id === questionId);

  if (!question) {
    return res.status(404).json({message: "Question not found"});
  }

  res.json(question);
});

// create new question
router.post("/", (req, res) => {
  const {question, date, answers, keywords} = req.body;

  if (!question ||  !date || !answers) {
    return res.status(404).json({message: "Required data is missing"});
  }

  const currentId = Math.max(...questions.map(q=> q.id), 0);
  const newQuestion = {
    id : questions.length ? currentId + 1 : 1,
    date, question, answers, 
    keyword : Array.isArray(keywords) ? keywords : []
  };

  questions.push(newQuestion);
  res.status(201).json (newQuestion);
});

// delete a question
router.post("/", (req, res) => {
  const questionId = Number (req.params.qid);
  if (!questionId) {
    res.status(401).json({message : "Missing question ID"});
  }

  if (questionId === -1) {
    req.status(401).json({message : "Invalid question ID"});
  }

  const questionToDelete = questions.splice (questionId, 1);

  res.json({
    message : "Question was deleted",
    post : questionToDelete[0]
  })
});

module.exports = router;
