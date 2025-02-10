const Subscription = require('../models/Subscription');

exports.createSubscription = async (data) => {
    const endDate = new Date();
    if (data.type == 'Payed') {
         endDate.setDate(endDate.getDate() + 90); 
    }else{
        endDate.setDate(endDate.getDate() + 30); 

    }
   
  
    return await Subscription.create({
      user: data.user,
      type: data.type,
      startDate: new Date(),
      endDate: endDate, 
    });

  };

// exports.getAllSubscriptions = async () => {
//   return await Subscription.find().populate('user');
// };

// exports.getSubscriptionById = async (id) => {
//   return await Subscription.findById(id).populate('user');
// };

// exports.updateSubscription = async (id, data) => {
//   return await Subscription.findByIdAndUpdate(id, data, { new: true, runValidators: true });
// };

// exports.deleteSubscription = async (id) => {
//   return await Subscription.findByIdAndDelete(id);
// };

exports.isSubscriped = async (userId)=>{
   const subscription = await Subscription.find({user:userId});
   return subscription.length > 0;

}
