const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['Payed', 'basic'],
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  }
}, { timestamps: true });
SubscriptionSchema.pre(/^find/,function(next){
  this.find({ endDate: { $gt: Date.now() } });
    next();
})
module.exports = mongoose.model('Subscription', SubscriptionSchema);
