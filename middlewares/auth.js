const serverError = require("../config/serverError.js");
const eventModel = require("../models/event.js");

const isAuthenticated = (req, res, next) => {
   if (req.isAuthenticated()) {
      return next();
   } else {
      req.flash("loginMsg", "Please login to perform this action.");
      res.redirect("/login");
   }
};

const isNotAuthenticated = (req, res, next) => {
   if (!req.isAuthenticated()) {
      next();
   } else {
      req.flash(
         "loggedinMsg",
         "You Are Already Logged In Logout to Register/Login."
      );
      res.redirect("/dashboard");
   }
};

const isPublic = async (req, res, next) => {
   try {
      const event = await eventModel.findById(req.params.id).lean();
      if (event == null) {
         throw new serverError(404, "The event you are looking for not found.");
      }
      req.event = event;
      if (req.isAuthenticated()) return next();
      if (event.status == "Public") return next();
      else throw new serverError(404, "Event not found.");
   } catch (err) {
      next(err);
   }
};

module.exports = {
   isAuthenticated,
   isNotAuthenticated,
   isPublic,
};
