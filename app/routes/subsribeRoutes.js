const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscribeController');

router.post('/', subscriptionController.createSubscription);
// router.get('/', subscriptionController.getAllSubscriptions);
// router.get('/:id', subscriptionController.getSubscriptionById);
router.get('/isSubscriped', subscriptionController.isSubscriped);
// router.put('/:id', subscriptionController.updateSubscription);
// router.delete('/:id', subscriptionController.deleteSubscription);

module.exports = router;
