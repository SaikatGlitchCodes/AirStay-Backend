const request = require('supertest');
const app = require('../app'); // your Express app
const { Subject, sequelize } = require('../models');

describe('Subject API Routes', () => {
  // Before all tests, sync db and clear subjects table
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  // After all tests, close connection
  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /subjects', () => {
    test('should return 404 if no subjects exist', async () => {
      const res = await request(app).get('/subjects');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'No subjects found');
    });

    test('should return all subjects if exist', async () => {
      // Insert some test data
      await Subject.bulkCreate([
        { name: 'Math', slug: 'math', description: 'Mathematics subject' },
        { name: 'Physics', slug: 'physics' },
      ]);

      const res = await request(app).get('/subjects');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('slug');
    });
  });

  describe('POST /subjects', () => {
    beforeEach(async () => {
      // Clear the table before each POST test
      await Subject.destroy({ where: {} });
    });

    test('should create a single subject successfully', async () => {
      const newSubject = { name: 'Chemistry', slug: 'chemistry', description: 'Chemistry subject' };

      const res = await request(app)
        .post('/subjects')
        .send({ subjects: newSubject });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message');
      expect(res.body.subjects).toHaveLength(1);
      expect(res.body.subjects[0]).toMatchObject({
        name: newSubject.name,
        slug: newSubject.slug,
        description: newSubject.description,
      });
    });

    test('should create multiple subjects successfully', async () => {
      const subjectsArray = [
        { name: 'Biology', slug: 'biology' },
        { name: 'English', slug: 'english', description: 'English subject' },
      ];

      const res = await request(app)
        .post('/subjects')
        .send({ subjects: subjectsArray });

      expect(res.statusCode).toBe(201);
      expect(res.body.subjects).toHaveLength(subjectsArray.length);
      expect(res.body.subjects[0]).toMatchObject({ name: 'Biology', slug: 'biology' });
      expect(res.body.subjects[1]).toMatchObject({ name: 'English', slug: 'english' });
    });

    test('should return 400 if input is invalid (not array or object)', async () => {
      const res = await request(app)
        .post('/subjects')
        .send({ subjects: 123 });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('should return 400 if required fields missing', async () => {
      const invalidSubjects = [
        { slug: 'no-name' }, // no name
        { name: 'No Slug' }, // no slug
      ];

      const res = await request(app)
        .post('/subjects')
        .send({ subjects: invalidSubjects });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('should return 409 on duplicate slug', async () => {
      // First insert a subject
      await Subject.create({ name: 'History', slug: 'history' });

      // Try to insert duplicate
      const duplicateSubject = { name: 'History 2', slug: 'history' };

      const res = await request(app)
        .post('/subjects')
        .send({ subjects: duplicateSubject });

      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/duplicate/i);
    });

    test('should handle empty array gracefully', async () => {
      const res = await request(app)
        .post('/subjects')
        .send({ subjects: [] });

      // You can choose behavior here; this example will create 0 subjects and succeed
      expect(res.statusCode).toBe(201);
      expect(res.body.subjects).toHaveLength(0);
    });
  });
});
