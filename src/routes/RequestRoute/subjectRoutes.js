const express = require('express');
const router = express.Router();
const { Subject } = require('../../models');
const { UniqueConstraintError, ValidationError } = require('sequelize');

// GET /subjects — Fetch all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.findAll();

    return res.status(200).json({
      message: subjects.length ? 'Subjects fetched successfully' : 'No subjects found',
      subjects
    });
  } catch (error) {
    console.error('[GET /subjects] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /subjects — Create one or many subjects
router.post('/', async (req, res) => {
  const { subjects } = req.body;

  if (!subjects || (!Array.isArray(subjects) && typeof subjects !== 'object')) {
    return res.status(400).json({
      error: 'Invalid input. "subjects" must be a single object or an array of objects.'
    });
  }

  const subjectArray = Array.isArray(subjects) ? subjects : [subjects];

  // Check for required fields
  const invalidSubjects = subjectArray.filter(sub => !sub.name );
  if (invalidSubjects.length > 0) {
    return res.status(400).json({
      error: 'Each subject must include both "name" and "slug" fields.',
      invalidSubjects
    });
  }

  try {
    const createdSubjects = await Subject.bulkCreate(subjectArray, { returning: true });
    return res.status(201).json({
      message: `${createdSubjects.length} subject(s) added successfully`,
      subjects: createdSubjects
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({
        error: 'Duplicate entry. One or more slugs already exist.',
        details: error.errors.map(e => ({
          message: e.message,
          path: e.path,
          value: e.value
        }))
      });
    }

    if (error instanceof ValidationError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors.map(e => ({
          message: e.message,
          path: e.path
        }))
      });
    }

    console.error('[POST /subjects] Unexpected Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
