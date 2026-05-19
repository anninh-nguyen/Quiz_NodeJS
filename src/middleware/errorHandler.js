const { ZodError } = require("zod");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { AppError } = require("../lib/error");
function errorHandler(err, req, res, next) {
 if (err instanceof ZodError) {
    throw new BadRequestError("Invalid input", err.issues);
 }
 if (err instanceof multer.MulterError) {
    throw new BadRequestError(err.message);
 }
 if (err instanceof jwt.JsonWebTokenError ||
 err instanceof jwt.TokenExpiredError) {
    throw new UnauthorizedError("Invalid token");
 }
 if (err instanceof AppError) {
    throw new AppError(err.message, err.status);
 }
 if (err.type === "entity.parse.failed") { 
    throw new BadRequestError("Invalid JSON in request body");
 }
 // req.log?.error({ err }, "unhandled error");
//  throw new ServerError("Internal server error");
}
module.exports = errorHandler;