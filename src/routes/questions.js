const express = require("express");
const prisma = require("../lib/prisma");
const router = express.Router();

function formatQuestion(question) {
  return {
    question,
    keywords: question.keywords.map((k) => k.name),
  };
}

// List questions filtered by keyword
// GET /api/questions?keyword=http
router.get("/", async (req, res) => {
  if ('keyword' in req.query) {
    const {keyword} = req.query;
    if (!keyword) { 
      return res.json({message : "GET: Keyword is missing which is required"});
    }

    const where = keyword 
      ? {keywords : {some : {name: keyword}}}
      : {};
    const filteredQuestions = await prisma.quiz.findMany({
      where,
      include: {keywords: true},
      orderBy: {id: "asc"}
    });
  
    return res.json(filteredQuestions.map(formatQuestion));
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
  const {question, answers, date, keywords} = req.body;

  if (!question || !answers || !date) {
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

  if (!question || !date || !answers) {
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
router.delete("/:questionId", (req, res) => {
  const questionId = Number (req.params.questionId);
  if (!questionId) {
    res.status(401).json({message : "DELETE: Missing question ID"});
  }

  if (questionId === -1) {
    req.status(401).json({message : "DELETE: Invalid question ID"});
  }

  const questionToDelete = questions.find(q => q.id === questionId);
  if (!questionToDelete) {
    return res.json("Question to delete is not existed");
  }

  const questionDeleted = questions.splice(questionId, 1);

  return res.status(201).json({message : "Question was deleted", post : questionDeleted[0]})
});

module.exports = router;
