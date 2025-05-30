const express = require('express');
const router = express.Router();
const { Request, Address, Subject, User, Transaction, sequelize } = require('../../models');

// POST /requests - Create new request
router.post('/', async (req, res) => {
  const {
    user_email,
    phone_number,
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
    address,
    subject = [],
    language
  } = req.body;

  try {
    const [online, offline, travel] = [
      meeting_options?.Online?.state || false,
      meeting_options?.Offline?.state || false,
      meeting_options?.Travel?.state || false
    ];

    const addressRecord = address ? await Address.create(address) : null;

    const request = await Request.create({
      user_email,
      phone_number,
      type: type?.toLowerCase(),
      status,
      level,
      tutors_want,
      gender_preference,
      description,
      nature,
      online_meeting: online,
      offline_meeting: offline,
      travel_meeting: travel,
      get_tutors_from,
      price_amount,
      price_currency_symbol,
      price_currency,
      price_option,
      upload_file,
      i_need_someone,
      language,
      address_id: addressRecord?.id || null
    });

    if (subject.length) await request.setSubjects(subject);

    return res.status(201).json(request);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// GET all requests
router.get('/', async (_, res) => {
  try {
    const requests = await Request.findAll({
      include: [
        { model: Subject, as: 'subjects' },
        { model: Address, as: 'address' }
      ]
    });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET requests by user email
router.get('/:email', async (req, res) => {
  try {
    const requests = await Request.findAll({
      where: { user_email: req.params.email },
      include: [
        { model: Subject, as: 'subjects' },
        { model: Address, as: 'address' }
      ]
    });

    if (!requests.length) {
      return res.status(200).json({ message: 'No requests found for this email', requests: [] });
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /requests/:id - Update request
router.put('/:id', async (req, res) => {
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
    subjects = [],
    language
  } = req.body;

  try {
    const request = await Request.findOne({
      where: { id: req.params.id },
      include: [
        { model: Address, as: 'address' },
        { model: Subject, as: 'subjects' }
      ]
    });

    if (!request) return res.status(404).json({ error: 'Request not found' });

    const updateFields = {
      type: type?.toLowerCase(),
      status,
      level,
      tutors_want,
      gender_preference,
      description,
      nature,
      online_meeting: meeting_options?.Online?.state || false,
      offline_meeting: meeting_options?.Offline?.state || false,
      travel_meeting: meeting_options?.Travel?.state || false,
      price_amount,
      price_currency_symbol,
      price_currency,
      price_option,
      upload_file,
      i_need_someone,
      language
    };

    await request.update(updateFields);

    if (address) {
      if (request.address_id) {
        const existingAddress = await Address.findByPk(request.address_id);
        if (existingAddress) await existingAddress.update(address);
      } else {
        const newAddress = await Address.create(address);
        request.address_id = newAddress.id;
        await request.save();
      }
    }

    if (subjects.length) {
      const currentSubjectIds = request.subjects.map(s => s.id);
      const toAdd = subjects.filter(id => !currentSubjectIds.includes(id));
      const toRemove = currentSubjectIds.filter(id => !subjects.includes(id));
      if (toRemove.length) await request.removeSubjects(toRemove);
      if (toAdd.length) await request.addSubjects(toAdd);
    }

    res.status(200).json(request);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /requests/get/:id - Get request details with user and transaction
router.get('/get/:id', async (req, res) => {
  try {
    const request = await Request.findOne({
      where: { id: req.params.id },
      include: [
        { model: User, attributes: ['email', 'name'] },
        { model: Address, as: 'address' },
        {
          model: Transaction,
          where: { transaction_type: 'spend' },
          attributes: [[sequelize.fn('COUNT', sequelize.col('Transactions.user_email')), 'userCount']],
          required: false
        }
      ],
      group: ['Request.id', 'User.id', 'address.id']
    });

    if (!request) return res.status(404).json({ message: 'Request not found' });

    const userCount = request.Transactions?.[0]?.dataValues?.userCount || 0;

    res.status(200).json({
      ...request.dataValues,
      userCount,
      address: request.address
    });
  } catch (error) {
    console.error('Error fetching request details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
