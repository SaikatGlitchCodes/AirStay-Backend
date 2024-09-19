// src/routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const { Request, User, Address, Subject } = require('../models');

// Add a new request
router.post('/', async (req, res) => {
  try {
    const { student_id, type, status, level, tutors_want, gender_preference, description, nature, subject_id, address_id } = req.body;

    const request = await Request.create({
      student_id,
      type,
      status,
      level,
      tutors_want,
      gender_preference,
      description,
      nature,
      subject_id,
      address_id
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('Error adding request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
