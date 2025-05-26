const express = require('express');
const router = express.Router();
const { User, UserSubjectRel, Subject, Address } = require('../../models');

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
  console.log('[Updating/Creating User]', req.params.email);
  const { address, subject_ids = [] } = req.body;
  try {
    const [user, created] = await User.findOrCreate({
      where: { email: req.params.email },
      defaults: buildUserFields(req.body)
    });

    await user.update(buildUserFields(req.body));

    if (address) {
      const existingAddress = user.address_id && await Address.findByPk(user.address_id);
      const updatedAddress = existingAddress
        ? await existingAddress.update(address)
        : await Address.create(address);

      if (!existingAddress) await user.update({ address_id: updatedAddress.id });
    }

    if (subject_ids.length > 0) {
      const currentSubjectIds = (await user.getSubjects()).map(s => s.id);
      const subjectsToAdd = subject_ids.filter(id => !currentSubjectIds.includes(id));
      const subjectsToRemove = currentSubjectIds.filter(id => !subject_ids.includes(id));

      if (subjectsToRemove.length) await user.removeSubjects(subjectsToRemove);
      if (subjectsToAdd.length) await user.addSubjects(subjectsToAdd);
    }

    const updatedUser = await User.findOne({
      where: { email: req.params.email },
      include: [
        { model: Subject, as: 'subjects' },
        { model: Address, as: 'address' }
      ]
    });

    res.status(created ? 201 : 200).json({
      message: created ? 'User created and updated successfully' : 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating/creating user:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.post('/', async (req, res) => {
  const { address, subject_ids = [], email } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(200).json({ error: 'User already exists', existingUser: true });

    const address_id = address ? (await Address.create(address)).id : null;

    const user = await User.create({ ...req.body, address_id });

    if (subject_ids.length > 0) {
      await Promise.all(subject_ids.map(subject_id => UserSubjectRel.create({ user_id: user.id, subject_id })));
    }

    res.status(201).json({ user, existingUser: false });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:email?', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findAll({
      where: email ? { email } : {},
      include: [
        { model: Subject, as: 'subjects', through: { model: UserSubjectRel } },
        { model: Address, as: 'address' }
      ]
    });

    if (!user || user.length === 0) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Error Fetching Users!' });
  }
});

router.delete('/:email', async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.params.email },
      include: [{ model: Subject, as: 'subjects' }]
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.setSubjects([]);
    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
