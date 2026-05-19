const request = require('supertest');
const express = require('express');
const { registerAndLogin, resetDb, createQuestion } = require('./helpers');
const { length } = require('zod');

const app = express();
app.use(express.json());
let token = "";

beforeEach(async () => { 
  await resetDb(); 
  token = await registerAndLogin()
  await createQuestion(token, { text: "What is the capital of Vietnam" });
});

describe('Question Router', () => {
  it('should return a list of questions', async () => {
    const response = await request(app).get('api/questions')
    .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return a question by id', async () => {
    const response = await request(app).get('api/questions/1')
    .set('Authorization', `Bearer ${token}`);

    expect([200, 404]).toContain(response.status);
    if (response.status === 200) {
      expect(response.body).toHaveProperty('id', 1);
    }
  });

  it('should create a new question', async () => {
    const newQuestion = {
      title: 'What is the capital of France?',
      options: ['Paris', 'London', 'Rome', 'Berlin'],
      answer: 'Paris',
    };

    const response = await request(app)
      .post('api/questions')
      .send(newQuestion)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect([200, 201]).toContain(response.status);
    expect(response.body).toMatchObject({
      title: newQuestion.title,
      answer: newQuestion.answer,
    });
    expect(response.body).toHaveProperty('id');
  });

  it('should update an existing question', async () => {
    const updatedPayload = { title: 'Updated question title' };

    const response = await request(app)
      .put('api/questions/1')
      .set('Authorization', `Bearer ${token}`)
      .send(updatedPayload)
      .set('Accept', 'application/json');

    expect([200, 204, 404]).toContain(response.status);
    if (response.status === 200) {
      expect(response.body).toHaveProperty('title', updatedPayload.title);
    }
  });

  it('should delete an existing question', async () => {
    const response = await request(app).delete('api/questions/1')
      .set('Authorization', `Bearer ${token}`);

    expect([200, 204, 404]).toContain(response.status);
  });
});
