const express = require("express")
const router = express.Router();
const {productModel, validateProduct} = require("../models/product")
const upload = require("../confrigation/multerconnection");
const { categoryModel,validateCategory } = require("../models/category");
const { string } = require("joi");
const {validateAdmin , userIsLoggedIn} = require("../middleware/adminmiddleware");
const { cartModel } = require("../models/cart");



router.get("/",userIsLoggedIn,async(req,res)=>{
  let somethingInCart = false;
  const resultArray = await productModel.aggregate([
    {
      $group: {
        _id: "$category",
        products: { $push: "$$ROOT" }
      }
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        products: { $slice: ["$products", 10] }
      }
    },

  ]);

  let cart =await cartModel.findOne({user:req.session.passport.user});
  if(cart && cart.products.length > 0 ) somethingInCart = true;

  let rnproducts = await productModel.aggregate([{
    $sample :{size:3}
  }]);

const resultObject = resultArray.reduce((acc,item)=>{
acc[item.category] = item.products;
return acc;
},{});


res.render("index",{products:resultObject,rnproducts,somethingInCart,cartCount:cart ? cart.products.length:0,});
});
  


router.get("/delete/:id",validateAdmin,async(req,res)=>{
  if(req.user.admin){
 let prods =await productModel.findOneAndDelete({_id:req.params.id});
  return res.redirect("/admin/products");
}
res.send("not an admin")
});
router.post("/delete",validateAdmin,async(req,res)=>{
  if(req.user.admin){
 let prods =await productModel.findOneAndDelete({_id:req.body.product_id});
  return res.redirect("/admin/products");
}
res.send("not an admin")
});

router.post("/",upload.single("image"),async(req,res)=>{
     let{name,price,category,stock,description,image} = req.body;
   let {error} = validateProduct({
    name,price,category,stock,description, image
   });
    if(error) return res.send(error.message)

      let iscategory = await categoryModel.findOne({name:category})
      console.log(iscategory);
      if(!iscategory){
      let categoryCreated = await categoryModel.create({name:category})
      }
      let product = productModel.create({
            name,
            price,
            category,
            image:req.file.buffer,
            description,
            stock,
      })
        res.redirect("/admin/dashboard")
})

router.post("/categories/create",async(req,res)=>{
  
  let category = await categoryModel.create({name:req.body.name})
  res.redirect("/admin/dashboard")
})


module.exports = router