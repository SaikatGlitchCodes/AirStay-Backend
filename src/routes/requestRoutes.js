const express = require('express');
const router = express.Router();
const { Request, Address, Subject, User, Transaction, sequelize } = require('../models');

router.post('/', async (req, res) => {
  const {
    email,
    type,
    status,
    level,
    tutors_want,
    gender_preference,
    description,
    nature,
    meeting_options,
    get_tutors_from,
    price_amount,
    price_currency_symbol,
    price_currency,
    price_option,
    upload_file,
    i_need_someone,
    phone_number,
    address, // Address details
    subjects // Array of subject IDs
  } = req.body;

  try {
    // Create or find the address
    let addressRecord;
    if (address) {
      addressRecord = await Address.create(address); // Adjust for your specific address structure
    }

    // Create the request
    const request = await Request.create({
      email,
      type,
      status,
      level,
      tutors_want,
      gender_preference,
      description,
      nature,
      meeting_options,
      get_tutors_from,
      price_amount,
      price_currency_symbol,
      price_currency,
      price_option,
      upload_file,
      phone_number,
      i_need_someone,
      address_id: addressRecord ? addressRecord.id : null
    });

    // Associate subjects with the request
    if (subjects && subjects.length) {
      await request.setSubjects(subjects);
    }

    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}); 
router.get('/', async (req, res) => {
  try {
    const requests = await Request.findAll({
      include: [
        { model: Subject, as: 'subjects' }, // Include associated subjects
        { model: Address, as: 'address' }   // Include associated address
      ]
    });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const requests = await Request.findAll({
      where: { email },
      include: [
        { model: Subject, as: 'subjects' }, // Include associated subjects
        { model: Address, as: 'address' }   // Include associated address
      ]
    });

    if (!requests || requests.length === 0) {
      return res.status(200).json({ error: 'No requests found for this email' });
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.put('/:id', async (req, res) => {
  const requestId = req.params.id;
  const {
    type,
    status,
    level,
    tutors_want,
    gender_preference,
    description,
    nature,
    meeting_options,
    price_amount,
    price_currency_symbol,
    price_currency,
    price_option,
    upload_file,
    i_need_someone,
    address,
    subjects
  } = req.body;

  try {
    // Find the request by ID
    const request = await Request.findOne({
      where: { id: requestId },
      include: [{ model: Address, as: 'address' }, { model: Subject, as: 'subjects' }]
    });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Update the request fields
    const updateFields = {};
    if (type !== undefined) updateFields.type = type;
    if (status !== undefined) updateFields.status = status;
    if (level !== undefined) updateFields.level = level;
    if (tutors_want !== undefined) updateFields.tutors_want = tutors_want;
    if (gender_preference !== undefined) updateFields.gender_preference = gender_preference;
    if (description !== undefined) updateFields.description = description;
    if (nature !== undefined) updateFields.nature = nature;
    if (meeting_options !== undefined) updateFields.meeting_options = meeting_options;
    if (price_amount !== undefined) updateFields.price_amount = price_amount;
    if (price_currency_symbol !== undefined) updateFields.price_currency_symbol = price_currency_symbol;
    if (price_currency !== undefined) updateFields.price_currency = price_currency;
    if (price_option !== undefined) updateFields.price_option = price_option;
    if (upload_file !== undefined) updateFields.upload_file = upload_file;
    if (i_need_someone !== undefined) updateFields.i_need_someone = i_need_someone;

    await request.update(updateFields);

    // Update the address if provided
    if (address) {
      if (request.address_id) {
        // Update the existing address
        const existingAddress = await Address.findByPk(request.address_id);
        if (existingAddress) {
          await existingAddress.update(address);
        }
      } else {
        // Create a new address if it didn't exist
        const newAddress = await Address.create(address);
        request.address_id = newAddress.id;
        await request.save();
      }
    }

    // Update subjects if provided
    if (subjects && subjects.length > 0) {
      const currentSubjectIds = request.subjects.map(subject => subject.id);

      // Find subjects to add
      const subjectsToAdd = subjects.filter(id => !currentSubjectIds.includes(id));

      // Find subjects to remove
      const subjectsToRemove = currentSubjectIds.filter(id => !subjects.includes(id));

      // Remove old subjects
      if (subjectsToRemove.length > 0) {
        await request.removeSubjects(subjectsToRemove);
      }

      // Add new subjects
      if (subjectsToAdd.length > 0) {
        await request.addSubjects(subjectsToAdd);
      }
    }

    res.status(200).json(request);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/get/:id', async (req, res) => {
  try {
      const requestId = req.params.id;

      const request = await Request.findOne({
          where: { id: requestId },
          include: [
              {
                  model: User,
                  attributes: ['email', 'name'], // Adjust fields as necessary
              },
              {
                  model: Address,
                  as: 'address', // Use the alias defined in the association
              },
              {
                  model: Transaction,
                  where: { transaction_type: 'spend' },
                  attributes: [[sequelize.fn('COUNT', sequelize.col('Transactions.user_id')), 'userCount']],
                  required: false
              }
          ],
          group: ['Request.id', 'User.id', 'address.id'] // Group by necessary fields
      });

      if (!request) {
          return res.status(404).json({ message: 'Request not found' });
      }

      // Include user count in the response
      const userCount = request.Transactions.length > 0 ? request.Transactions[0].dataValues.userCount : 0;

      res.status(200).json({
          ...request.dataValues,
          userCount,
          address: request.address // Include address details
      });
  } catch (error) {
      console.error('Error fetching request:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
