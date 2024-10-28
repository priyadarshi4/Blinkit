// Importing necessary modules
const mongoose = require("mongoose");
const Joi = require("joi");

// Category schema
const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  }
});

// Creating the Mongoose model
const Category = mongoose.model("category", categorySchema);

// JOI validation function
const validateCategory = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required()
  });

  return schema.validate(data);
};

module.exports = {
    categoryModel:mongoose.model("category",categorySchema),
  validateCategory
};
