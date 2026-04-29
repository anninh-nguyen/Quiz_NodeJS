const express = require("express");
const prisma = require("../lib/prisma");
const router = express.Router();
const authenticate = require("../middleware/auth");
const isOwner = require("../middleware/isOwner");

router.use(authenticate);

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
    const filteredQuestions = await prisma.question.findMany({
      where,
      include: {keywords: true, options: true},
      orderBy: {id: "asc"}
    });
  
    return res.json(filteredQuestions);
  }
  else {
    // List all questions
    const allQuestions = await prisma.question.findMany({
      include: {keywords: true},
      orderBy: {id: "asc"}
    });
    return res.json(allQuestions);
  }
});

// Show a specific question by ID
// GET /api/questions/1
router.get("/:questionId", isOwner, async(req, res) => {
  const questionId = Number (req.params.questionId);
  
  const question = await prisma.question.findUnique({
    where: {id: questionId},
    include: {keywords: true},
  });

  if (!question) {
    return res.status(404).json({message: "GET: Question not found"});
  }
  
  return res.json(question);
});

// create new question
// POST
router.post("/", async (req, res) => {

  const {text, options, quizId, keywords} = req.body;

  if (!text || !options || !quizId) {
    return res.status(400).json({message: "POST: Required data is missing"});
  }

  const newQuestion = await prisma.question.create({
    data: {
      text,
      options: {create: options},
      quiz: {connect: {id: Number(quizId)}},
      keywords: keywords ? {connect: keywords.map(kw => ({name: kw}))} : undefined,
    },
    include: {keywords: true, options: true}
  });

  return res.status(201).json(newQuestion);
});

// Edit a question
// PUT
router.put("/:questionId", isOwner, async (req, res) => {
  const questionId = Number(req.params.questionId);
  const {text, options, keywords} = req.body;

  if (!questionId){
    return res.json({message: "PUT: Question Id is missing"});
  }

  if (!text || !options) {
    return res.status(400).json({message: "PUT: Required data is missing"});
  }

  const updatedQuestion = await prisma.question.update({
    where: {id: questionId},
    data: {
      text: text,
      options: {deleteMany: {}, create: options,},
      keywords: keywords ? {connect: keywords.map(kw => ({name: kw}))} : undefined,
    },
    include: {keywords: true, options: true}
  });

  return res.status(201).json(updatedQuestion);
});

// delete a question
// DELETE
router.delete("/:questionId", isOwner, async (req, res) => {
  const questionId = Number (req.params.questionId);
  if (!questionId) {
    return res.status(401).json({message : "DELETE: Missing question ID"});
  }

  if (questionId === -1) {
    return res.status(401).json({message : "DELETE: Invalid question ID"});
  }

  const deletedQuestion = await prisma.question.deleteMany({
    where: {id: questionId}
  });

  if (!deletedQuestion || deletedQuestion.count === 0) {
    return res.status(201).json({message: "No record affected"});
  }

  return res.status(201).json({message: "Question was deleted", data : deletedQuestion});
});

module.exports = router;