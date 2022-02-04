const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const userModel = require("../models/user.js");

const veryfyCb = async (email, password, done) => {
   try {
      const user = await userModel.findOne({ email });
      if (!user) {
         done(null, false, {
            message: "User with given Email Id not found.",
         });
      } else if (await bcrypt.compare(password, user.hash)) {
         done(null, user, {
            message: "You have successfully logged in.",
         });
      } else {
         done(null, false, {
            message: "Wrong password",
         });
      }
   } catch (err) {
      console.log("Error");
      console.log(err);
      done(err.message);
   }
};

passport.use(new localStrategy({ usernameField: "email" }, veryfyCb));

passport.serializeUser((user, done) => {
   done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
   try {
      const user = await userModel.findById(id, { hash: 0 });
      done(null, user);
   } catch (err) {
      done(err.message);
   }
});
