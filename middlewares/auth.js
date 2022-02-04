const serverError = require("../config/serverError.js");

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

//checking whether if the user owns the blog which he is trying to edit
/* const isOwner = async (req, res, next) => {
   try {
      const blog = await blogModel.findById(req.params.id);
      if (blog == null) throw new serverError(404, "Blog not found.");
      if (blog.user != req.user.id) {
         throw new serverError(
            403,
            "You are forbidden to perform this action."
         );
      }
      req.blog = blog;
      next();
   } catch (err) {
      console.log(err);
      next(err);
   }
}; */

/* const checkPrivateBlog = async (req, res, next) => {
   try {
      const blog = await blogModel
         .findById(req.params.id)
         .populate("user", { name: 1, profilePicture: 1 })
         .lean();
      if (blog == null) throw new serverError(404, "Blog not found");
      if (blog.status == "Public") {
         req.blog = blog;
         return next();
      }
      if (!req.isAuthenticated()) {
         throw new serverError(
            403,
            "You are forbidden to perform this action."
         );
      }
      if (blog.user._id != req.user.id) {
         throw new serverError(
            403,
            "You are forbidden to perform this action."
         );
      }
      req.blog = blog;
      return next();
   } catch (err) {
      console.log(err);
      next(err);
   }
}; */

module.exports = {
   isAuthenticated,
   isNotAuthenticated,
   /* isOwner,
   checkPrivateBlog, */
};
