const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // clean database
  await prisma.quizResult.deleteMany({});
  await prisma.quizAttempt.deleteMany({});
  await prisma.option.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.keyword.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.user.deleteMany({});

  // Reset auto-increment indexes to ensure all Postman test will get correct input
  await prisma.$executeRawUnsafe('ALTER TABLE users AUTO_INCREMENT = 1');
  await prisma.$executeRawUnsafe('ALTER TABLE quizzes AUTO_INCREMENT = 1');
  await prisma.$executeRawUnsafe('ALTER TABLE questions AUTO_INCREMENT = 1');
  await prisma.$executeRawUnsafe('ALTER TABLE options AUTO_INCREMENT = 1');
  await prisma.$executeRawUnsafe('ALTER TABLE keywords AUTO_INCREMENT = 1');
  await prisma.$executeRawUnsafe('ALTER TABLE quizAttempts AUTO_INCREMENT = 1');
  await prisma.$executeRawUnsafe('ALTER TABLE quizResults AUTO_INCREMENT = 1');

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      password: '$2b$10$hashedpassword1',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      password: '$2b$10$hashedpassword2',
    },
  });

  console.log('Created users:', user1.email, user2.email);

  // Create sample quizzes
  const quiz1 = await prisma.quiz.create({
    data: {
      title: 'JavaScript Fundamentals',
      description: 'Test your knowledge of JavaScript basics',
      userId: user1.id,
    },
  });

  const quiz2 = await prisma.quiz.create({
    data: {
      title: 'Node.js Basics',
      description: 'Introduction to Node.js concepts',
      userId: user2.id,
    },
  });

  const quiz3 = await prisma.quiz.create({
    data: {
      title: 'Web Development Quiz',
      description: 'General web development questions',
      userId: user1.id,
    },
  });

  console.log('Created quizzes:', quiz1.title, quiz2.title, quiz3.title);

  const keywordNames = [
    'variable',
    'Javascript',
    'declare',
    'type',
    'operator',
    'Node',
    'Node.js',
    'NodeJS',
    'web',
    'server',
    'html',
    'http',
    'method',
    'get',
    'router',
    'listen',
    'express'
  ];

  await prisma.keyword.createMany({
    data: keywordNames.map((name) => ({ name })),
    skipDuplicates: true,
  });

  console.log('Created keywords:', keywordNames.join(', '));

  // Create questions for quiz 1
  const question1 = await prisma.question.create({
    data: {
      text: 'What is the correct way to declare a variable in JavaScript?',
      quizId: quiz1.id,
      keywords: {
        connect: [
          { name: 'variable' },
          { name: 'Javascript' },
          { name: 'declare' },
        ],
      },
    },
  });

  const question2 = await prisma.question.create({
    data: {
      text: 'Which of the following is NOT a JavaScript data type?',
      quizId: quiz1.id,
      keywords: {
        connect: [
          { name: 'type' },
          { name: 'Javascript' },
          { name: 'declare' },
        ],
      },
    },
  });

  const question3 = await prisma.question.create({
    data: {
      text: 'What does the === operator do in JavaScript?',
      quizId: quiz1.id,
      keywords: {
        connect: [
          { name: 'type' },
          { name: 'Javascript' },
          { name: 'operator' },
        ],
      },
    },
  });

  // Options for question 1
  await prisma.option.createMany({
    data: [
      { text: 'var myVar = value;', isCorrect: false, questionId: question1.id },
      { text: 'let myVar = value;', isCorrect: true, questionId: question1.id },
      { text: 'const myVar = value;', isCorrect: false, questionId: question1.id },
      { text: 'variable myVar = value;', isCorrect: false, questionId: question1.id },
    ],
  });

  // Options for question 2
  await prisma.option.createMany({
    data: [
      { text: 'string', isCorrect: false, questionId: question2.id },
      { text: 'number', isCorrect: false, questionId: question2.id },
      { text: 'boolean', isCorrect: false, questionId: question2.id },
      { text: 'character', isCorrect: true, questionId: question2.id },
    ],
  });

  // Options for question 3
  await prisma.option.createMany({
    data: [
      { text: 'Assigns a value', isCorrect: false, questionId: question3.id },
      { text: 'Compares values and types', isCorrect: true, questionId: question3.id },
      { text: 'Compares only values', isCorrect: false, questionId: question3.id },
      { text: 'Creates a new variable', isCorrect: false, questionId: question3.id },
    ],
  });

  // Create questions for quiz 2
  const question4 = await prisma.question.create({
    data: {
      text: 'What is Node.js?',
      quizId: quiz2.id,
      keywords: {
        connect: [
          { name: 'Node' },
          { name: 'Node.js' },
          { name: 'NodeJS' },
        ],
      },
    },
  });

  const question5 = await prisma.question.create({
    data: {
      text: 'Which module is used to create a web server in Node.js?',
      quizId: quiz2.id,
      keywords: {
        connect: [
          { name: 'Node' },
          { name: 'web' },
          { name: 'server' },
        ],
      },
    },
  });

  // Options for question 4
  await prisma.option.createMany({
    data: [
      { text: 'A JavaScript framework', isCorrect: false, questionId: question4.id },
      { text: 'A JavaScript runtime environment', isCorrect: true, questionId: question4.id },
      { text: 'A database management system', isCorrect: false, questionId: question4.id },
      { text: 'A CSS preprocessor', isCorrect: false, questionId: question4.id },
    ],
  });

  // Options for question 5
  await prisma.option.createMany({
    data: [
      { text: 'fs', isCorrect: false, questionId: question5.id },
      { text: 'http', isCorrect: true, questionId: question5.id },
      { text: 'path', isCorrect: false, questionId: question5.id },
      { text: 'os', isCorrect: false, questionId: question5.id },
    ],
  });

  // Create questions for quiz 3
  const question6 = await prisma.question.create({
    data: {
      text: 'What does HTML stand for?',
      quizId: quiz3.id,
      keywords: {
        connect: [
          { name: 'html' },
        ],
      },
    },
  });

  const question7 = await prisma.question.create({
    data: {
      text: 'Which HTTP method is used to retrieve data from a server?',
      quizId: quiz3.id,
      keywords: {
        connect: [
          { name: 'http' },
          { name: 'method' },
          { name: 'get' },
        ],
      },
    },
  });

  // Options for question 6
  await prisma.option.createMany({
    data: [
      { text: 'HyperText Markup Language', isCorrect: true, questionId: question6.id },
      { text: 'High Tech Modern Language', isCorrect: false, questionId: question6.id },
      { text: 'Home Tool Markup Language', isCorrect: false, questionId: question6.id },
      { text: 'Hyperlink and Text Markup Language', isCorrect: false, questionId: question6.id },
    ],
  });

  // Options for question 7
  await prisma.option.createMany({
    data: [
      { text: 'POST', isCorrect: false, questionId: question7.id },
      { text: 'PUT', isCorrect: false, questionId: question7.id },
      { text: 'GET', isCorrect: true, questionId: question7.id },
      { text: 'DELETE', isCorrect: false, questionId: question7.id },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
