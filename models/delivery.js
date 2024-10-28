// Importing necessary modules
const mongoose = require("mongoose");
const Joi = require("joi");

// Delivery schema
const deliverySchema = mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryBoy: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  status: {
    type: String,
    required: true,
    enum: ["assigned", "in transit", "delivered", "failed"]
  },
  trackingURL: {
    type: String,
    match: /^https?:\/\/[^\s$.?#].[^\s]*$/,
  },
  estimatedDeliveryTime: {
    type: Number,
    required: true,
    min: 0
  }
});

// Creating the Mongoose model
const Delivery = mongoose.model("delivery", deliverySchema);

// JOI validation function
const validateDelivery = (data) => {
  const schema = Joi.object({
    order: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    amount: Joi.number().min(0).required(),
    deliveryBoy: Joi.string().min(3).max(50).required(),
    status: Joi.string().valid("assigned", "in transit", "delivered", "failed").required(),
    trackingURL: Joi.string().uri(),
    estimatedDeliveryTime: Joi.number().min(0).required()
  });

  return schema.validate(data);
};

module.exports = {
    deliveryModel:mongoose.model("delivery",deliverySchema),
  validateDelivery
};
