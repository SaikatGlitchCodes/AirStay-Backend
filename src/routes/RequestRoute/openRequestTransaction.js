const express = require('express');
const router = express.Router();
const { Transaction, User } = require('../../models');
const coinCostBalance = require('../../util/coinBalance');

// POST /open_requests/:requestId — Deduct coins and log transaction
router.post('/:requestId', async (req, res) => {
  const user_email = req.body.user_email;
  const requestId = parseInt(req.params.requestId);

  if (!user_email || isNaN(requestId)) {
    return res.status(400).json({ error: 'Invalid or missing user_email/requestId' });
  }

  console.log('🔁 Processing transaction for:', { user_email, requestId });

  try {
    // Check if transaction already exists
    const existingTransaction = await Transaction.findOne({
      where: {
        user_email,
        request_id: requestId,
        transaction_type: 'spend'
      }
    });

    if (existingTransaction) {
      return res.status(409).json({ message: 'Coins have already been deducted for this request.' });
    }

    // Get required coin cost
    const coinCost = await coinCostBalance(requestId);

    // Get user and validate balance
    const user = await User.findOne({ where: { email: user_email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.coin_balance < coinCost) {
      return res.status(400).json({
        message: 'Not enough coins',
        required: coinCost,
        available: user.coin_balance
      });
    }

    // Deduct coins and save
    user.coin_balance -= coinCost;
    await user.save();

    // Log the transaction
    await Transaction.create({
      user_email,
      request_id: requestId,
      transaction_type: 'spend',
      amount: coinCost
    });

    return res.status(200).json({
      message: `Request opened successfully. ${coinCost} coins deducted.`,
      remainingBalance: user.coin_balance
    });
  } catch (error) {
    console.error('❌ Error processing transaction:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /open_requests/:requestId — Get cost of opening request
router.get('/:requestId', async (req, res) => {
  const requestId = parseInt(req.params.requestId);
  if (isNaN(requestId)) {
    return res.status(400).json({ error: 'Invalid requestId' });
  }

  try {
    const coinCost = await coinCostBalance(requestId);
    return res.status(200).json({ requestId, coinCost });
  } catch (error) {
    console.error('❌ Error fetching request coin value:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
