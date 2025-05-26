const request = require('supertest');
const app = require('../app');
const { sequelize, User, Address, Subject, UserSubjectRel } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create sample subjects for association
  await Subject.bulkCreate([
    { id: 1, name: 'Math' },
    { id: 2, name: 'Physics' }
  ]);
});

afterAll(async () => {
  await sequelize.close();
});

describe('User Routes', () => {
  const userData = {
    user_id: 'abc123',
    name: 'John Doe',
    role: 'tutor',
    email: 'john@example.com',
    phone_number: '1234567890',
    gender: 'male',
    bio: 'Experienced teacher',
    years_of_experience: 5,
    rating: 4.5,
    profile_img: 'profile.jpg',
    hobbies: 'reading, swimming',
    coin_balance: 10,
    status: 'active',
    subject_ids: [1, 2],
    address: {
      address_line_1: '123 Main St',
      country: 'India',
      country_code: 'IN'
    }
  };

  it('should create a new user', async () => {
    const res = await request(app).post('/users').send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(userData.email);
    expect(res.body.existingUser).toBe(false);
  });

  it('should return existing user if already created', async () => {
    const res = await request(app).post('/users').send(userData);
    expect(res.statusCode).toBe(200);
    expect(res.body.existingUser).toBe(true);
  });

  it('should update an existing user with PUT', async () => {
    const updatedData = {
      ...userData,
      name: 'Updated John',
      subject_ids: [1],
      address: {
        address_line_1: '456 Main St',
        country: 'India',
        country_code: 'IN'
      }
    };
    const res = await request(app).put(`/users/${userData.email}`).send(updatedData);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe('Updated John');
    expect(res.body.user.address.address_line_1).toBe('456 Main St');
  });

  it('should fetch a user by email', async () => {
    const res = await request(app).get(`/users/${userData.email}`);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].email).toBe(userData.email);
  });

  it('should fetch all users when no email provided', async () => {
    const res = await request(app).get( `/users`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return 404 when user not found by email', async () => {
    const res = await request(app).get('/users/nonexistent@email.com');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('User not found');
  });

  it('should delete a user by email', async () => {
    const res = await request(app).delete(`/users/${userData.email}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User deleted successfully');
  });

  it('should return 404 when deleting non-existent user', async () => {
    const res = await request(app).delete(`/users/ghost@example.com`);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('User not found');
  });

  it('should handle invalid subject_ids', async () => {
    const invalidData = { ...userData, email: 'new@example.com', subject_ids: [999] };
    const res = await request(app).post('/users').send(invalidData);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });

  it('should return 500 on invalid PUT update', async () => {
    const res = await request(app).put(`/users/invalid@@`).send({});
    expect(res.statusCode).toBe(500);
  });
});
