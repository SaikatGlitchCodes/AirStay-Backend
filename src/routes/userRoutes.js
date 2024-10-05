const express = require('express');
const router = express.Router();
const { User, UserSubjectRel, Subject, Address } = require('../models');

router.put('/:email', async (req, res) => {
  console.log('[Updating User]', req.params.email);
  const {
    phone_number,
    gender,
    address, // Address object to update
    bio,
    years_of_experience,
    rating,
    profile_img,
    hobbies,
    subject_ids, // Array of subject IDs for the update
    coin_balance,
    status
  } = req.body;

  try {
    // Find the user by Email and include current subjects using alias 'subjects'
    const user = await User.findOne({
      where: { email: req.params.email },
      include: [{ model: Subject, as: 'subjects' }] // Use alias 'subjects'
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prepare object to update user fields (except email and name)
    const updateFields = {};
    if (phone_number !== undefined) updateFields.phone_number = phone_number;
    if (gender !== undefined) updateFields.gender = gender;
    if (bio !== undefined) updateFields.bio = bio;
    if (years_of_experience !== undefined) updateFields.years_of_experience = years_of_experience;
    if (rating !== undefined) updateFields.rating = rating;
    if (profile_img !== undefined) updateFields.profile_img = profile_img;
    if (hobbies !== undefined) updateFields.hobbies = hobbies;
    if (coin_balance !== undefined) updateFields.coin_balance = coin_balance;
    if (status !== undefined) updateFields.status = status;

    // Update the user's fields
    await user.update(updateFields);

    // If an address is provided, update or create it
    if (address) {
      if (user.address_id) {
        // Update the existing address
        const existingAddress = await Address.findByPk(user.address_id);
        if (existingAddress) {
          await existingAddress.update(address);
        }
      } else {
        // Create a new address if the user didn't have one
        const newAddress = await Address.create(address);
        user.address_id = newAddress.id;
        await user.save();
      }
    }

    // Update subjects if provided
    if (subject_ids && subject_ids.length > 0) {
      // Ensure user.Subjects is defined
      const currentSubjectIds = user.subjects ? user.subjects.map(subject => subject.id) : [];

      // Find subjects to add
      const subjectsToAdd = subject_ids.filter(id => !currentSubjectIds.includes(id));

      // Find subjects to remove
      const subjectsToRemove = currentSubjectIds.filter(id => !subject_ids.includes(id));

      // Remove old subjects
      if (subjectsToRemove.length > 0) {
        await user.removeSubjects(subjectsToRemove);
      }

      // Add new subjects
      if (subjectsToAdd.length > 0) {
        await user.addSubjects(subjectsToAdd);
      }
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  const {
    user_id,
    name,
    role,
    phone_number,
    gender,
    email,
    address,
    bio,
    years_of_experience,
    rating,
    profile_img,
    hobbies,
    subject_ids, // Array of subject IDs
    status
  } = req.body;
  try {
    // Check if the user with the provided email already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(200).json({ error: 'User already exists', existingUser: true }); // Conflict error if user already exists
    }
    let address_id = null;
    // Check if address data is provided and create the address if it is
    if (address) {
      const createdAddress = await Address.create({
        address_line_1: address.address_line_1,
        address_line_2: address.address_line_2,
        lat: address.lat,
        lon: address.lon,
        offset_std: address.offset_std,
        abbreviation_std: address.abbreviation_std,
        zip: address.zip,
        country: address.country,
        country_code: address.country_code,
        state: address.state,
        state_code: address.state_code,
        city: address.city,
        street: address.street
      });
      address_id = createdAddress.id; 
    }

    // Create the user with the address ID 
    const user = await User.create({
      user_id,
      name,
      role,
      phone_number,
      gender,
      email,
      address_id, // Save the created address ID (or null if no address provided)
      bio,
      years_of_experience,
      rating,
      profile_img,
      hobbies,
      status
    });

    // Associate user with subjects
    if (user && subject_ids && subject_ids.length > 0) {
      await Promise.all(subject_ids.map(subject_id => {
        return UserSubjectRel.create({ user_id: user.id, subject_id });
      }));
    }

    res.status(201).json({user, existingUser: false});
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:email?', async (req, res) => {
  try {
    const { email } = req.params;

    // Fetch the user with the provided email, or all users if email is not provided
    const user = await User.findAll({
      where: email ? { email: email } : {},
      include: [
        {
          model: Subject,
          as: 'subjects', // Alias for the many-to-many relation
          through: { model: UserSubjectRel } // Specify the through table
        },
        {
          model: Address,
          as: 'address' // Alias for the address association
        }
      ]
    });

    // Check if user data is found
    if (!user || user.length === 0) {
      return res.status(404).json({ error: 'User not found' }); // Return custom error message
    }

    // Return the user data
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Error Fetching Users!' });
  }
});

router.delete('/:email', async (req, res) => {
  const email = req.params.email;

  try {
    // Find the user by Email
    const user = await User.findOne({
      where: { email: email },
      include: [{ model: Subject, as: 'subjects' }] // Include subjects if needed for any cleanup
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Optionally: Remove associations with subjects before deleting the user
    await user.setSubjects([]); // Remove all subject associations (if needed)

    // Delete the user
    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
