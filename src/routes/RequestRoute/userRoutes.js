const express = require('express');
const router = express.Router();
const { User, UserSubjectRel, Subject, Address, sequelize } = require('../../models');

// Helper: build user fields
const buildUserFields = (fields) => {
  const {
    name, phone_number, gender, bio, role = 'user', years_of_experience,
    rating, profile_img, hobbies = [], coin_balance = 0, status = 'active'
  } = fields;
  return {
    name, phone_number, gender, bio, role, years_of_experience,
    rating, profile_img, hobbies, coin_balance, status
  };
};

router.put('/:email', async (req, res) => {
  const { address, subject_ids = [] } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const [user, created] = await User.findOrCreate({
      where: { email: req.params.email },
      defaults: buildUserFields(req.body),
      transaction
    });

    await user.update(buildUserFields(req.body), { transaction });

    if (address) {
      const existingAddress = user.address_id && await Address.findByPk(user.address_id);
      const newOrUpdated = existingAddress
        ? await existingAddress.update(address, { transaction })
        : await Address.create(address, { transaction });

      if (!existingAddress) await user.update({ address_id: newOrUpdated.id }, { transaction });
    }

    // Update subjects if any
    if (Array.isArray(subject_ids)) {
      const currentSubjectIds = (await user.getSubjects({ transaction })).map(s => s.id);
      const toAdd = subject_ids.filter(id => !currentSubjectIds.includes(id));
      const toRemove = currentSubjectIds.filter(id => !subject_ids.includes(id));

      if (toRemove.length) await user.removeSubjects(toRemove, { transaction });
      if (toAdd.length) await user.addSubjects(toAdd, { transaction });
    }

    await transaction.commit();

    const updatedUser = await User.findOne({
      where: { email: req.params.email },
      include: [
        { model: Subject, as: 'subjects' },
        { model: Address, as: 'address' }
      ]
    });

    return res.status(created ? 201 : 200).json({
      message: created ? 'User created and updated successfully' : 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error in PUT /users/:email:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// POST /users — Create new user
router.post('/', async (req, res) => {
  const { address, subject_ids = [], email } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const exists = await User.findOne({ where: { email }, transaction });
    if (exists) {
      await transaction.rollback();
      return res.status(409).json({ error: 'User already exists', existingUser: true });
    }

    const address_id = address
      ? (await Address.create(address, { transaction })).id
      : null;

    const user = await User.create({ ...req.body, address_id }, { transaction });

    if (Array.isArray(subject_ids) && subject_ids.length > 0) {
      await user.addSubjects(subject_ids, { transaction });
    }

    await transaction.commit();

    const createdUser = await User.findByPk(user.id, {
      include: [
        { model: Subject, as: 'subjects' },
        { model: Address, as: 'address' }
      ]
    });

    // Return user directly at the top level to match test expectations
    return res.status(201).json({ 
      user: createdUser, 
      existingUser: false 
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error in POST /users:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// GET /users/:email? — Get user(s)
router.get('/:email?', async (req, res) => {
  try {
    const where = req.params.email ? { email: req.params.email } : {};
    const users = await User.findAll({
      where,
      include: [
        { model: Subject, as: 'subjects', through: { attributes: [] } },
        { model: Address, as: 'address' }
      ]
    });

    if (!users.length) return res.status(404).json({ error: 'User not found' });

    return res.status(200).json(users);
  } catch (err) {
    console.error('Error in GET /users:', err);
    return res.status(500).json({ error: 'Error fetching users' });
  }
});

// DELETE /users/:email — Delete user
router.delete('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.params.email } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.setSubjects([]); // Clear associations
    await user.destroy();

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /users/:email:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
