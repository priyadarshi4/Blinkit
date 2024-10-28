const GoogleStratergy = require("passport-google-oauth20")
const passport = require("passport")
const {userModel} = require("../models/user")

passport.use(new GoogleStratergy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async function(accessToken, refreshToken, profile, done) {
    try{
      let user = await userModel.findOne({
        email:profile.emails[0].value
      });
      if(!user){
        user = new userModel({
          name:profile.displayName,
          email:profile.emails[0].value,
        });
        await user.save();
        done(null,user);
      }
    }
    catch(err){
      done(err,false);
    }
  }
));
passport.serializeUser((user,done)=>{
    return done(null,user._id)
})

passport.deserializeUser(async(id,done)=>{
 let user = await userModel.findOne({_id:id});
    done(null,user);
})

module.exports = passport;