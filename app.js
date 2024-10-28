const express = require("express");
const app = express();


require("dotenv").config();
const connectionToDb = require("./confrigation/mongooseconnection");
const passport = require("passport");
const expressSession = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser")
const  multer = require("multer")


const indexRouter = require("./router/index");
const authRouter = require("./router/auth");
const adminRouter = require("./router/admin");
const productRouter = require("./router/product");
const userRouter = require("./router/user")
const cartRouter = require("./router/cart")





connectionToDb();
require("./confrigation/passport");
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(expressSession({
    secret:process.env.EXPRESS_SECRET,
    resave:false,
    saveUninitialized:false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine","ejs");
app.use(cookieParser());






app.use("/",indexRouter);
app.use("/auth",authRouter);
app.use("/admin",adminRouter)
app.use("/products",productRouter)
app.use("/users",userRouter)
app.use("/cart",cartRouter)



app.listen(process.env.PORT || 3000)
