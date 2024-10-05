const express = require('express');
const router = express.Router();
const { Subject } = require('../models'); // Assuming Subject model is defined in the models folder

// GET route to fetch all subjects
router.get('/', async (req, res) => {
    try {
      const subjects = await Subject.findAll();
  
      if (!subjects || subjects.length === 0) {
        return res.status(404).json({ message: 'No subjects found' });
      }
  
      res.status(200).json(subjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// POST route to add one or many subjects
router.post('/', async (req, res) => {
  const { subjects } = req.body; // `subjects` is expected to be an array of subjects or a single subject object
  console.log('[Subjects]', subjects);
  if (!subjects || !Array.isArray(subjects) && typeof subjects !== 'object') {
    return res.status(400).json({ error: 'Invalid input. Please provide one or many subjects.' });
  }

  try {
    // If it's a single subject, convert it into an array for consistent handling
    const subjectArray = Array.isArray(subjects) ? subjects : [subjects];

    // Insert subjects into the database
    const createdSubjects = await Subject.bulkCreate(subjectArray, { returning: true });

    res.status(201).json({ message: 'Subjects added successfully', subjects: createdSubjects });
  } catch (error) {
    console.error('Error adding subjects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
