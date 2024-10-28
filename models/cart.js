// Importing necessary modules
const mongoose = require("mongoose");
const Joi = require("joi");

// Cart schema
const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true
  }],
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
});

// Creating the Mongoose model
const Cart = mongoose.model("cart", cartSchema);

// JOI validation function
const validateCart = (data) => {
  const schema = Joi.object({
    user: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    products: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).min(1).required(),
    totalPrice: Joi.number().min(0).required()
  });

  return schema.validate(data);
};

module.exports = {
    cartModel:mongoose.model("cart",cartSchema),
  validateCart
};
