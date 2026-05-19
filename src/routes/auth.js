const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const SECRET = process.env.JWT_SECRET;
const { BadRequestError, ConflictError, UnauthorizedError } = require("../lib/error.js");

// POST /api/auth/register
router.post("/register", async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        throw new BadRequestError("email, password and name are required");
    }
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email },});
    if (existingUser) {
        throw new ConflictError("Email already registered");
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the user
    const user = await prisma.user.create({
        data: { email, password: hashedPassword, name },
    });
    // Generate a token
    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "24h" });
    res.status(201).json({
        message: "User registered successfully",
        token,
    });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("email and password are required");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find the user
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new UnauthorizedError("Invalid credentials");
    }
    // Verify the password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new UnauthorizedError("Invalid credentials");
    }
    // Generate a token
    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "1h" });
    return res.status(200).json({ token });
});

module.exports = router;