// Importing necessary modules
const mongoose = require("mongoose");
const Joi = require("joi");

// Admin schema
const adminSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    required: true,
    enum: ["superadmin", "admin", "moderator"]
  }
});

// Creating the Mongoose model
const Admin = mongoose.model("admin", adminSchema);

// JOI validation function
const validateAdmin = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid("superadmin", "admin", "moderator").required()
  });

  return schema.validate(data);
};

module.exports = {
    adminModel:mongoose.model("admin",adminSchema),
  validateAdmin
};
