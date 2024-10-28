// Importing necessary modules
const mongoose = require("mongoose");
const Joi = require("joi");

// Product schema
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    stock: {
        type:Number,
        required: true
    },
    description: {
        type: String,
        maxlength: 500
    },
    image: {
        type: Buffer,
        match: /\.(jpg|jpeg|png|gif)$/,
        
    }
});

// Creating the Mongoose model
const Product = mongoose.model("product", productSchema);

// JOI validation function
const validateProduct = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        price: Joi.number().min(0).required(),
        category: Joi.string().min(3).max(50).required(),
        stock: Joi.number().required(),
        description: Joi.string().max(500),
        image: Joi.string().pattern(/\.(jpg|jpeg|png|gif)$/)
    });

    return schema.validate(data);
};

module.exports = {
    productModel:mongoose.model("product",productSchema),
    validateProduct
};
