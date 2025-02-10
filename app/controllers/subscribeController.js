const subscriptionService = require('../services/subscribeService');

exports.createSubscription = async (req, res) => {
    const {type} = req.body

    const user= req.user.id
  try {
    const subscription = await subscriptionService.createSubscription({user,type});
    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 

// exports.getAllSubscriptions = async (req, res) => {
//   try {
//     const subscriptions = await subscriptionService.getAllSubscriptions();
//     res.status(200).json(subscriptions);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getSubscriptionById = async (req, res) => {
//   try {
//     const subscription = await subscriptionService.getSubscriptionById(req.params.id);
//     if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
//     res.status(200).json(subscription);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.updateSubscription = async (req, res) => {
//   try {
//     const updatedSubscription = await subscriptionService.updateSubscription(req.params.id, req.body);
//     if (!updatedSubscription) return res.status(404).json({ message: 'Subscription not found' });
//     res.status(200).json(updatedSubscription);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// exports.deleteSubscription = async (req, res) => {
//   try {
//     const deletedSubscription = await subscriptionService.deleteSubscription(req.params.id);
//     if (!deletedSubscription) return res.status(404).json({ message: 'Subscription not found' });
//     res.status(200).json({ message: 'Subscription deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
exports.isSubscriped = async (req,res)=>{
    const userId = req.user.id
    try {
        const isSubscripped =await  subscriptionService.isSubscriped(userId)
        
  
        res.status(200).json(isSubscripped);

       
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
}
