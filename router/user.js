const express = require("express")
const router = express.Router();
const userModel = require("../models/user")


router.get("/login",(req,res)=>{
    res.render("user_login")
})
router.get("/profile",(req,res)=>{
    res.send("I M PROFILE PAGE")
})

router.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
req.session.destroy((err)=>{
    if(err) return next(err);
    res.clearCookie("connect.sid");
    res.redirect("/users/login")
    })
    });
  });

module.exports = router ;