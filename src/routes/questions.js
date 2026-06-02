const express = require("express");
const prisma = require("../lib/prisma");
const router = express.Router();
const authenticate = require("../middleware/auth");
const isOwner = require("../middleware/isOwner");
const multer = require("multer");
const { BadRequestError, NotFoundError } = require("../lib/error.js");

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError ||
      err?.message === "Only image files are allowed") {
    throw new BadRequestError(err.message);
 }
 next(err); // pass through to global handler
});

router.use(authenticate);

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err?.message === "Only image files are allowed") {
    throw new BadRequestError(err.message);
  }
  next(err);
});

function formatQuestion(question) {
  return {
    ...question,
    keywords: question.keywords.map((k) => k.name),
    userName: question.user?.name || null,
    likesCount: question._count?.likes ?? 0,
    liked: question.likes ? question.likes.length : 0,
    user: undefined,
    likes: undefined,
    _count: undefined,
  };
}

function parseKeywords(keywords) {
  if (Array.isArray(keywords)) 
    return keywords;
  if (typeof keywords === "string") {
    return keywords.split(",").map((k) =>
        k.trim()).filter(Boolean);
  }
  return [];
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
    const filteredQuestions = await Promise.all([prisma.question.findMany({
      where,
      include: {keywords: true, options: true, user: true, 
        likes: { where: { userId: req.user.userId }, take: 1 },
        _count: { select: { likes: true } },},
      orderBy: {id: "asc"}
    })]);
    return res.json( {
      data: filteredQuestions,
    });
  }
  else {
    // List all questions
    const allQuestions = await Promise.all([prisma.question.findMany({
      include: {
        keywords: true, options: true, user: true, 
        likes: { where: { userId: req.user.userId }, take: 1 },
        _count: { select: { likes: true } },
      },
      orderBy: {id: "asc"}
    })]);
    return res.json({
      data: allQuestions
    });
  }
});

// Show a specific question by ID
// GET /api/questions/1
router.get("/:questionId", isOwner, async(req, res) => {
  const questionId = Number (req.params.questionId);
  
  const question = await Promise.all([prisma.question.findUnique({
    where: {id: questionId},
    include: {keywords: true, user: true, options: true,
      likes: { where: { userId: req.user.userId }, take: 1 },
              _count: { select: { likes: true } },},
  })]);

  if (!question) {
    throw new NotFoundError("Question not found");
  }

  return res.json({
    data :question[0],
  });
});

// Add answer to a question
// POST /api/questions/1/answer
router.post("/:questionId/answer", async (req, res) => {
  const questionId = Number(req.params.questionId);
  const { answered } = req.body;

  if (!answered) {
    throw new BadRequestError("POST: Answer text is required");
  }

  const newAnswer = await prisma.quizResult.create({
    data: {
      answered,
      question: { connect: { id: questionId } },
      user: { connect: { id: req.user.userId } },
      selectedOption: answered ? { connect: { id: Number(answered) } } : undefined,
    },
    include: { user: true },
  });

  return res.status(201).json({ data: newAnswer });
});

// create new question
// POST
router.post("/", async (req, res) => {

  const {text, options, difficulty, quizId, keywords} = req.body;

  if (!text || !options || !quizId) {
    throw new BadRequestError("POST: Required data is missing");
  }

  const newQuestion = await Promise.all([prisma.question.create({
    data: {
      text,
      options: {create: options},
      difficulty,
      quiz: {connect: {id: Number(quizId)}},
      keywords: keywords ? {connect: keywords.map(kw => ({name: kw}))} : undefined,
    },
    include: {keywords: true, options: true, user: true, 
      likes: { where: { userId: req.user.userId }, take: 1 },
                _count: { select: { likes: true } },},
    orderBy: {id: "asc"}
  })]);

  return res.status(201).json({
    data: formatQuestion(newQuestion),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    });
});

// Edit a question
// PUT
router.put("/:questionId", isOwner, async (req, res) => {
  const questionId = Number(req.params.questionId);
  const {text, options, difficulty, keywords} = req.body;

  if (!questionId){
    throw new BadRequestError("PUT: Question Id is missing");
  }

  if (!text || !options) {
    throw new BadRequestError("PUT: Required data is missing");
  }

  const updatedQuestion = await Promise.all([prisma.question.update({
    where: {id: questionId},
    data: {
      text: text,
      options: {deleteMany: {}, create: options,},
      difficulty: difficulty,
      keywords: keywords ? {connect: keywords.map(kw => ({name: kw}))} : undefined,
    },
    include: {keywords: true, options: true, user: true, 
      likes: { where: { userId: req.user.userId }, take: 1 },
      _count: { select: { likes: true } },},
    orderBy: {id: "asc"}
  })]);

  return res.status(201).json({data: formatQuestion(updatedQuestion)});
});

// Unlike a question
// DELETE /api/questions/:questionId/like
router.delete("/:questionId/like", async (req, res) => {
  const questionId = Number(req.params.questionId);

  if (!questionId) {
    throw new BadRequestError("DELETE: Missing question ID");
  }

  const deletedLike = await prisma.like.deleteMany({
    where: { questionId, userId: req.user.userId }
  });

  if (deletedLike.count === 0) {
    throw new NotFoundError("Like not found");
  }

  return res.json({ message: "Question unliked" });
});

// delete a question
// DELETE
router.delete("/:questionId", isOwner, async (req, res) => {
  const questionId = Number (req.params.questionId);
  if (!questionId) {
    throw new BadRequestError("DELETE: Missing question ID");
  }

  if (questionId === -1) {
    throw new BadRequestError("DELETE: Invalid question ID");
  }

  const deletedQuestion = await Promise.all([prisma.question.deleteMany({
    where: {id: questionId}
  })]);

  if (!deletedQuestion || deletedQuestion.count === 0) {
    return res.status(201).json({message: "No record affected"});
  }

  return res.status(201).json({message: "Question was deleted", data : deletedQuestion});
});

module.exports = router;