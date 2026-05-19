const request = require("supertest");
const app = require("../app");
const prisma = require("../lib/prisma");

async function resetDb() {
  await prisma.like.deleteMany({});
  await prisma.quizResult.deleteMany({});
  await prisma.quizAttempt.deleteMany({});
  await prisma.option.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.keyword.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.user.deleteMany({});
}

async function registerAndLogin() {
    await request(app).post("/api/auth/register")
        .send({ email: "a@test.io",
                password: "a@test.io", 
                name: "A" });
    const res = await request(app).post("/api/auth/login")
        .send({ email: "a@test.io",
                password: "a@test.io" });
    return res.body.token;
}

async function register() {
    const res = await request(app).post("/api/auth/register")
        .send({ email: "a@test.io",
                password: "pw12345",
                name: "A" });
    return res.body;
}

async function login() {
    const res = await request(app).post("/api/auth/login")
        .send({ email: "abc@test.io", password: "pw12345" });
    return res.body.token;
}

async function createQuestion(token, overrides = {}) {
 const res = await request(app).post("/api/questions")
 .set("Authorization", `Bearer ${token}`)
 .send({ title: "T", date: "2026-01-01", content: "C", ...overrides });
 return res.body;
}

module.exports = { resetDb, registerAndLogin, register, login, createQuestion, app, prisma };