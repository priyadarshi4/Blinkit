// Importing necessary modules
const mongoose = require("mongoose");
const Joi = require("joi");

// Order schema
const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  products: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "confirmed", "shipped", "delivered", "canceled"]
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "payment",
    required: true
  },
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "delivery",
    required: true
  }
});

// Creating the Mongoose model
const Order = mongoose.model("order", orderSchema);

// JOI validation function
const validateOrder = (data) => {
  const schema = Joi.object({
    user: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    products: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    totalPrice: Joi.number().min(0).required(),
    address: Joi.string().min(5).max(200).required(),
    status: Joi.string().valid("pending", "confirmed", "shipped", "delivered", "canceled").required(),
    payment: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    delivery: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
  });

  return schema.validate(data);
};

module.exports = {
    orderModel:mongoose.model("order",orderSchema),
  validateOrder
};
