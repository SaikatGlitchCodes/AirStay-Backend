const express = require('express');
const router = express.Router();
const { Subject } = require('../../models');
const { UniqueConstraintError, ValidationError } = require('sequelize');

// GET /subjects — fetch all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.findAll();

    if (!subjects || subjects.length === 0) {
      return res.status(200).json({ message: 'No subjects found', subjects: [] });
    }

    return res.status(200).json(subjects);
  } catch (error) {
    console.error('[GET /subjects] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /subjects — create one or many subjects
router.post('/', async (req, res) => {
  const { subjects } = req.body;

  // Input validation
  if (!subjects || (!Array.isArray(subjects) && typeof subjects !== 'object')) {
    return res.status(400).json({
      error: 'Invalid input. "subjects" should be a single object or an array of objects.',
    });
  }

  try {
    const subjectArray = Array.isArray(subjects) ? subjects : [subjects];

    // Check for required fields
    const invalidSubjects = subjectArray.filter(sub => !sub.name);
    if (invalidSubjects.length > 0) {
      return res.status(400).json({
        error: 'Each subject must have "name" and "slug" fields.',
      });
    }

    const createdSubjects = await Subject.bulkCreate(subjectArray, { returning: true });

    return res.status(201).json({
      message: `${createdSubjects.length} subject(s) added successfully`,
      subjects: createdSubjects,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      // Handle duplicate slug error
      return res.status(409).json({
        error: 'Duplicate entry. One or more subjects have a slug that already exists.',
        details: error.errors.map(e => e.message),
      });
    }

    if (error instanceof ValidationError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors.map(e => e.message),
      });
    }

    console.error('[POST /subjects] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
