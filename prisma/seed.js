const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // clean database
  await prisma.like.deleteMany({});
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

  // user created quizes
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '$2b$10$BZAfH2fzdJ1YA1xg.w0XtulnNBltGkVJWUHMgejHti1ETVUw69ZKG',
    },
  });

  // user created questions
  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: '$2b$10$UGZgMGbEO.SID2XqdR2LB.4RqZAb2fjttEQlrDHT3Z7FFZWrpfEQ6',
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
      userId: user1.id,
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
      userId: user2.id,
      imageUrl: 'https://64.media.tumblr.com/943d43bfccceb91a4e229ea5a6646eec/ad8005ced6743590-31/s1280x1920/6e444bf2e562081f729101f6b4bfd1e8a2b47de5.jpg',
      difficulty: 'easy',
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
      userId: user2.id,
      imageUrl: 'https://i.pinimg.com/474x/71/5d/06/715d061852b34ffb207ffc2cd35cd1fc.jpg',
      difficulty: 'medium',
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
      userId: user2.id,
      imageUrl: 'https://images.stockcake.com/public/5/e/3/5e3701ca-65a0-4714-9c76-f1a59aa7ca0e_large/cozy-work-space-stockcake.jpg',
      difficulty: 'hard',
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
      userId: user2.id,
      imageUrl: 'https://its-asia.hk/wp-content/uploads/2024/08/222406721_l_normal_none-1-1920x1440.jpg',
      difficulty: 'medium',
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
      userId: user2.id,
      imageUrl: 'https://miro.medium.com/v2/resize:fit:1200/1*meNkllQQfzrFr--qahGu0A.jpeg',
      difficulty: 'medium',
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
      userId: user2.id,
      imageUrl: 'https://static.vecteezy.com/system/resources/previews/030/630/208/large_2x/a-modern-office-with-a-view-of-a-city-free-photo.jpg',
      difficulty: 'medium',
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
      userId: user2.id,
      imageUrl: 'https://img.freepik.com/premium-photo/modern-office-with-large-windows-view-city-there-is-desk-chair-computer-plant-office_14117-517719.jpg',
      difficulty: 'medium',
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

  await prisma.like.createMany({
    data: [
      { userId: user1.id, questionId: question1.id },
      { userId: user1.id, questionId: question2.id },
      { userId: user1.id, questionId: question3.id },
      { userId: user2.id, questionId: question1.id },
      { userId: user2.id, questionId: question3.id },
      { userId: user2.id, questionId: question7.id },
      { userId: user1.id, questionId: question7.id },
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
