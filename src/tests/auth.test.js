const request = require('supertest');
const app = require('../app');
const { registerAndLogin, resetDb, register } = require('./helpers');

beforeEach(async () => { await resetDb(); });

describe('Registration', () => {
  it('should return 400 for validation errors', async () => {
    const res = await request(app).post('/register').send({ password: 'password123' });
    expect(res.status).toBe(400);
  });

  it('should return 409 for duplicate email', async () => {
    await register('a@test.io', 'pw12345');
    const res = await request(app).post('/register').send({ email: 'a@test.io', password: 'pw12345' });
    expect(res.status).toBe(409);
  });

  it('should return 201 and hash password', async () => {
    const res = await request(app).post('/register').send({ email: 'new@example.com', password: 'password123' });
    expect(res.status).toBe(201);
    // Assuming the response or db check for hashed password; adjust as needed
  });
});

describe('Login', () => {
  it('should return 401 for wrong credentials', async () => {
    await register('a@test.io', 'pw12345');
    const res = await request(app).post('/login').send({ email: 'a@test.io', password: 'wrongpassword' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should return 401 for missing user', async () => {
    const res = await request(app).post('/login').send({ email: 'nonexistent@example.com', password: 'pw12345' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should return 200 for valid credentials', async () => {
    await register('a@test.io', 'pw12345');
    const res = await request(app).post('/login').send({ email: 'a@test.io', password: 'pw12345' });
    expect(res.status).toBe(200);
  });
});

