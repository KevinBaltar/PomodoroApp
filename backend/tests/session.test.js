// tests/session.test.js
const request = require('supertest');
const app = require('../server');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

describe('Session API', () => {
  let authToken;
  let testUser;

  beforeEach(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      testUser = await User.create({
        nome: 'Test User',
        email: 'test.session@example.com',
        senha: 'password123'
      });
      authToken = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  it('should create a new session (201)', async () => {
    const res = await request(app)
      .post('/api/sessions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ 
        tipo_sessao: 'foco',
        duracao_configurada: 25
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.data.sessao).toHaveProperty('_id');
    expect(res.body.data.sessao.usuario_id).toEqual(testUserId.toString());
  });

  it('should reject unauthorized requests (401)', async () => {
    const res = await request(app)
      .post('/api/sessions')
      .send({ tipo_sessao: 'foco' });
    
    expect(res.statusCode).toEqual(401);
  });

  it('should validate session data (400)', async () => {
    const res = await request(app)
      .post('/api/sessions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({}); // Dados inválidos
    
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toContain('tipo_sessao');
  });
});
