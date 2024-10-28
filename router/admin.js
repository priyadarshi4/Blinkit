const express = require("express")
const router = express.Router()
const {adminModel} = require("../models/admin")
const {productModel} = require("../models/product")
const {validateAdmin} = require("../middleware/adminmiddleware")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
require("dotenv").config();

if(typeof process.env.NODE_ENV !== undefined && process.env.NODE_ENV ==="DEVELOPMENT"){
router.get("/create",async(req,res)=>{
try{
    
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash("admin",salt);
    let user = new adminModel({
        name:"priyadarshi",
        email:"priyadarshiprince04@gmail.com",
        password:hash,
        role:"admin",
    });
    await user.save();

   let token=  jwt.sign({email:"priyadarshiprince04@gmail.com ",admin:true},process.env.JWT_KEY);
   res.cookie("token",token);
   res.send("admin created succesfully")
}
catch(err){
    res.send(err.message)
}
})
}
router.get("/login",(req,res)=>{
    res.render("admin_login")
})


router.post("/login",async(req,res)=>{
    let {email , password } = req.body;
    let admin = await adminModel.findOne({email});
    if(!admin) return res.send("this admin is not exist");

   let valid  = await bcrypt.compare(password,admin.password)
   if(valid){
    let token=  jwt.sign({email:"priyadarshiprince04@gmail.com ",admin:true},process.env.JWT_KEY);
   res.cookie("token",token);
   res.redirect("/admin/dashboard")
   }
    
})

router.get("/dashboard",validateAdmin,async(req,res)=>{
    let prodcount = await productModel.countDocuments();
    let cadgcount =await productModel.countDocuments()
    res.render("admin_dashboard",{prodcount,cadgcount})
})

router.get("/products",validateAdmin,async(req,res)=>{
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
  
   const resultObject = resultArray.reduce((acc,item)=>{
    acc[item.category] = item.products;
    return acc;
   },{});

  
   res.render("admin_products",{products:resultObject});
});

router.get("/logout",validateAdmin,(req,res)=>{
    res.cookie("token","");
        res.redirect("/admin/login")
});


module.exports = router;