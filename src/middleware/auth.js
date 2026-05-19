const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../lib/error");
const SECRET = process.env.JWT_SECRET;

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        throw new UnauthorizedError("Authorization header must be in the format: Bearer <token>");
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        throw new UnauthorizedError("Invalid or expired token");
    }
}
module.exports = authenticate;