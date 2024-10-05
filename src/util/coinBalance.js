const moment = require('moment');
const {Request, Transaction} = require('../models');

const coinCostBalance = async (requestId) => {
    const request = await Request.findByPk(requestId);
    if (!request) {
        throw new Error('Request not found');
    }

    const baseCoinCost = 5; // Initial base cost of opening a request
    const timeSinceCreated = moment().diff(moment(request.createdAt), 'hours'); // Time in hours

    // Get the number of users who opened the request
    const usersOpenedRequest = await Transaction.count({
        where: {
            request_id: request.id,
            transaction_type: 'spend'
        }
    });

    // Validate price amount
    const priceAdjustment = request.price_amount ? Math.floor(request.price_amount / 10) : 0;

    // Calculate initial coin cost
    let coinCost = baseCoinCost + usersOpenedRequest + priceAdjustment;

    // Gradually reduce the coin cost over 72 hours
    const maxHours = 72;
    if (timeSinceCreated < maxHours) {
        const reductionFactor = (timeSinceCreated / maxHours);
        coinCost = Math.max(0, Math.ceil(coinCost * (1 - reductionFactor))); // Ensure cost doesn't go negative
    } else {
        coinCost = 0; // After 72 hours, cost drops to 0
    }

    return coinCost;
};

module.exports = coinCostBalance;