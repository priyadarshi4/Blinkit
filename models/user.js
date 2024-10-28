// Importing necessary modules
const mongoose = require("mongoose");
const Joi = require("joi");

// Address schema
const AddressSchema = mongoose.Schema({
    state: {
        type: String,
        
        minlength: 2,
        maxlength: 50
    },
    Zip: {
        type: String,
        
        minlength: 5,
        maxlength: 10
    },
    city: {
        type: String,
        
        minlength: 2,
        maxlength: 50
    },
    address: {
        type: String,
        
        minlength: 5,
        maxlength: 100
    }
});

// User schema
const userSchema = mongoose.Schema({
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
        
        minlength: 8
    },
    phone: {
        type: Number,
        
        
    },
    
    
}, {
    timestamps: true
});

// Creating the Mongoose model
const User = mongoose.model("user", userSchema);

// JOI validation function
const validateUser = (data) => {
    const addressSchema = Joi.object({
        state: Joi.string().min(2).max(50),
        Zip: Joi.string().min(5).max(10),
        city: Joi.string().min(2).max(50),
        address: Joi.string().min(5).max(100),
    });

    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8),
        phone: Joi.string(),
        
    });

    return schema.validate(data);
};

module.exports = {
    userModel:mongoose.model("user",userSchema),
    validateUser
};
