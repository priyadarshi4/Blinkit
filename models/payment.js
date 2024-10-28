// Importing necessary modules
const mongoose = require("mongoose");
const Joi = require("joi");

// Payment schema
const paymentSchema = mongoose.Schema({
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
  method: {
    type: String,
    required: true,
    enum: ["credit card", "debit card", "UPI", "bank transfer", "cash on delivery"]
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "completed", "failed", "refunded"]
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  }
});

// Creating the Mongoose model
const Payment = mongoose.model("payment", paymentSchema);

// JOI validation function
const validatePayment = (data) => {
  const schema = Joi.object({
    order: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    amount: Joi.number().min(0).required(),
    method: Joi.string().valid("credit card", "debit card", "UPI", "bank transfer", "cash on delivery").required(),
    status: Joi.string().required(),
    transactionId: Joi.string().required()
  });

  return schema.validate(data);
};

module.exports = {
    paymentModel:mongoose.model("payment",paymentSchema),
  validatePayment
};
