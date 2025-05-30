const request = require('supertest');
const app = require('../app');
const { sequelize, Subject, User, Transaction, Request } = require('../models');

let studentEmail = 'student@example.com';
let tutorEmail = 'tutor@example.com';
let requestId;

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Full API Flow Test', () => {

  test('1. Create subjects', async () => {
    const res = await request(app).post('/subjects').send({
      subjects: [
        { name: 'Mathematics', slug: 'math' },
        { name: 'Physics', slug: 'physics' }
      ]
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.subjects.length).toBe(2);
  });

  test('2. Register student user', async () => {
    const res = await request(app).post('/users').send({
      email: studentEmail,
      name: 'Student One',
      role: 'student',
      phone_number: '1234567890'
    });

    expect(res.statusCode).toBe(201);
  });

  test('3. Student creates request', async () => {
    const res = await request(app).post('/requests').send({
      user_email: studentEmail,
      name: 'Student One',
      type: 'tutoring',
      status: 'active',
      level: 'Beginner',
      tutors_want: '1',
      gender_preference: 'Any',
      description: 'Need math help',
      nature: 'Regular',
      phone_number: '1234567890',
      subject: [1], // Subject IDs
      meeting_options: {
        Online: { state: true },
        Offline: { state: false },
        Travel: { state: false }
      },
      price_amount: 100,
      price_currency: 'INR',
      price_currency_symbol: '₹',
      price_option: 'fixed',
      i_need_someone: 'urgent',
      language: [{ value: 'en', label: 'English' }],
      address: {
        address_line_1: '123 Main St',
        country: 'India',
        country_code: 'IN',
        state: 'West Bengal',
        state_code: 'WB',
        city: 'Kolkata',
        zip: '700075'
      }
    });

    expect(res.statusCode).toBe(201);
    requestId = res.body.id;
  });

  test('4. Register tutor user with coin and subjects', async () => {
    const res = await request(app).post('/users').send({
      email: tutorEmail,
      name: 'Tutor One',
      role: 'tutor',
      phone_number: '9876543210',
      coin_balance: 100,
      subject_ids: [1] // subject match
    });

    expect(res.statusCode).toBe(201);
    tutorId = res.body.user;
  });

  test('5. Get coin cost of request', async () => {
    const res = await request(app).get(`/open_requests/${requestId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.coinCost).toBeDefined();
  });

  test('6. Tutor opens request (spends coins)', async () => {
    const res = await request(app).post(`/open_requests/${requestId}`).send({
      user_email: tutorEmail
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/coins deducted/i);
  });

  test('7. Transaction created for tutor', async () => {
    const tx = await Transaction.findAll({ where: { user_email: tutorEmail, request_id: requestId } });
    expect(tx.length).toBe(1);
    expect(tx[0].transaction_type).toBe('spend');
  });

});
