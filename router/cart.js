const express = require("express");
const router = express.Router();
const {cartModel , validateCart} = require("../models/cart")
const  {validateAdmin , userIsLoggedIn} = require("../middleware/adminmiddleware");
const { productModel } = require("../models/product");
const { object } = require("joi");


router.get("/",userIsLoggedIn,async function(req,res){
try{
        let cart = await cartModel.findOne({user:req.session.passport.user})
        .populate("products");
        

        let cartDataStructure = {};

        cart.products.forEach((product) => {
            let key = product._id.toString();
            if(cartDataStructure[key]){
                cartDataStructure[key].quantity +=1;
            }
            else{
                cartDataStructure[key] = {
                    ...product._doc,
                    quantity:1,
                };
            };
        });

       let finalarray = Object.values(cartDataStructure);

       let finalprice = cart.totalPrice + 34;

        res.render("cart",{cart:finalarray,finalprice:cart.totalPrice});
    }
    catch(err){
        console.log(err)
        res.send(err.message)
    }
        });


router.get("/add/:id",userIsLoggedIn,async(req,res)=>{
    try{
        let cart = await cartModel.findOne({user:req.session.passport.user});
        let product = await productModel.findOne({_id:req.params.id})
    if(!cart){
        cart = await cartModel.create({
            user:req.session.passport.user ,
            products :[req.params.id],
            totalPrice:Number(product.price)
        })
    }
    else{
        cart.products.push(req.params.id)
        cart.totalPrice = Number(cart.totalPrice) +Number(product.price)

       await cart.save()
    }
    res.redirect("back");
    }
    catch(err){
        res.send(err.message)
    }

})
router.get("/remove/:id",userIsLoggedIn,async(req,res)=>{
    try{
        let cart = await cartModel.findOne({user:req.session.passport.user});
        let product = await productModel.findOne({_id:req.params.id})
    if(!cart){
       return res.send("nothing in the cart")
    }
    else{
        let prodId = cart.products.indexOf(req.params.id);
        cart.products.splice(prodId,1);
        cart.totalPrice = Number(cart.totalPrice) - Number(product.price)

       await cart.save()
    }
    res.redirect("back");
    }
    catch(err){
        res.send(err.message)
    }

})


router.get("/remove/:id",userIsLoggedIn,async(req,res)=>{
   try{
    let cart =await cartModel.findOne({ user:req.session.passport.user})
    if(!cart) return res.send("something went wrong")
        let index = cart.products.indexOf(req.params.id);
    if(index !== -1)cart.products.splice(index, 1);
    else return res.send ("item is not in the cart")
    await cart.save();
    res.redirect("back")
   }
   catch(err){
    res.send(err.message)
    console.log(err.message)
   }
})




module.exports = router ;