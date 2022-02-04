const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.js");
const { setPrevDetails } = require("../middlewares/flash-setup.js");

const router = express.Router();

router.get("/signup", setPrevDetails, (req, res) => {
   res.render("signup", {
      title: "Sign Up",
   });
});

router.get("/login", (req, res) => {
   res.render("login", {
      title: "Login",
   });
});

router.post("/signup", async (req, res) => {
   const { name, email, password1, password2 } = req.body;
   const errors = [];
   if (!(name && email && password1 && password2)) {
      errors.push({ error: "Fill all the fields" });
   }
   if (password1 != password2) {
      errors.push({ error: "Passwords does not match" });
   } else if (password1.length < 8) {
      errors.push({
         error: "Passwords should be more than 8 characters long.",
      });
   }
   if (email) {
      try {
         const user = await userModel.findOne({ email });
         if (user) {
            errors.push({
               error: "User with same Email ID already exists, try again with another Email.",
            });
         }
      } catch (err) {
         console.log(err);
         errors.push({ error: "User check failed" });
      }
   }
   if (errors.length == 0) {
      try {
         const hash = await bcrypt.hash(password1, 10);
         const newUser = new userModel({
            name,
            email,
            hash,
         });
         await newUser.save();
         req.flash(
            "registeredMsg",
            "You have successfully registered and can now login."
         );
         return res.redirect("/login");
      } catch (err) {
         console.log(err);
         errors.push({ error: "Cannot register user try again later" });
      }
   }
   req.flash("prevDetails", {
      name,
      email,
      password1,
      password2,
      errors,
   });
   res.redirect("/signup");
});

router.post(
   "/login",
   passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      successFlash: true,
      failureFlash: true,
   })
);

router.get("/logout", (req, res) => {
   req.logout();
   res.redirect("/login");
});

module.exports = router;
