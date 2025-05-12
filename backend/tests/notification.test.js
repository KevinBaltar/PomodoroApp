const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

describe('Notification API', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    // Configuração inicial do teste
    testUser = await User.create({
      nome: 'Notification Test User',
      email: 'notification.test@example.com',
      senha: 'password123'
    });

    authToken = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  });

  afterAll(async () => {
    await User.deleteMany({ email: 'notification.test@example.com' });
  });

  it('should register a push token (200)', async () => {
    const res = await request(app)
      .post('/api/users/push-tokens')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ token: 'ExpoPushToken[ExampleToken123]' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain('sucesso');
  });

  it('should reject invalid tokens (400)', async () => {
    const res = await request(app)
      .post('/api/users/push-tokens')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ token: '' });

    expect(res.statusCode).toEqual(400);
  });
});