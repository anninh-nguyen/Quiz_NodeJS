const { ForbiddenError } = require("../lib/error");
const prisma = require("../lib/prisma");
async function isOwner(req, res, next) {
    const questionId = Number(req.params.questionId);
    const question = await prisma.question.findUnique({
                                            where: { id: questionId },
                                            include: { keywords: true },
                                        });
    if (!question) {
        throw new NotFoundError("Question not found");
    }
    if (question.userId !== req.user.userId) {
        throw new ForbiddenError("You can only modify your own data");
    }
    // Attach the record to the request so the route handler can reuse it
    req.resource = question;
    next();
}
module.exports = isOwner;