const flashSetup = (req, res, next) => {
   res.locals.registeredMsg = req.flash("registeredMsg");
   res.locals.loginMsg = req.flash("loginMsg");
   res.locals.loggedoutMsg = req.flash("loggedoutMsg");
   res.locals.loggedinMsg = req.flash("loggedinMsg");
   res.locals.notOwnerMsg = req.flash("notOwnerMsg");

   //to know if a user is signed in or not in the handlebars template to show logout button
   res.locals.isAuthenticated = req.isAuthenticated();

   if (req.isAuthenticated()) {
      res.locals.signedInUser = {
         id: req.user.id,
         name: req.user.name,
         profilePicture: req.user.profilePicture,
      };
   }

   next();
};

const setPrevDetails = (req, res, next) => {
   const prevDetails = req.flash("prevDetails")[0];
   if (prevDetails) {
      res.locals = { ...res.locals, ...prevDetails };
   }
   next();
};

module.exports = {
   flashSetup,
   setPrevDetails,
};
