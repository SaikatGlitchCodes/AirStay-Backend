const express = require('express');
const router = express.Router();

const { Transaction, User } = require('../models');
const coinCostBalance = require('../util/coinBalance');

router.post('/:requestId', async (req, res) => {
    const userId = req.body.user_id;
    const requestId = req.params.requestId;

    console.log('[userId]', userId);
    console.log('[requestId]', requestId);
    try {
        // Check if the user has already opened this request
        const existingTransaction = await Transaction.findOne({
            where: {
                user_id: userId,
                request_id: requestId,
                transaction_type: 'spend'
            }
        });

        if (existingTransaction) {
            return res.status(400).json({ message: 'Coins have already been deducted for this request.' });
        }

        const coinCost = await coinCostBalance(requestId);

        // Ensure the user has enough coins
        const user = await User.findOne({ where: { id: userId } });
        console.log('[User]', user);
        if (!user || user.coin_balance < coinCost) {
            return res.status(400).json({ message: 'Not enough coins', coinsRequested: coinCost, coinsWithUser: user.coin_balance });
        }

        // Deduct coins from user's balance
        user.coin_balance -= coinCost;
        await user.save();

        // Log the transaction
        await Transaction.create({
            user_id: userId,
            request_id: requestId,
            transaction_type: 'spend',
            amount: coinCost
        });

        res.status(200).json({ message: `Request opened successfully. ${coinCost} coins deducted.` });
    } catch (error) {
        console.error('Error opening request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:requestId', async (req, res) => {
    const requestId = req.params.requestId;
    try {
        const coinofRequest = await coinCostBalance(requestId);
        res.status(200).json({ coinBalance : coinofRequest });
    } catch (error) {
        console.error('Error fetching request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;