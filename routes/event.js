const express = require("express");
const upload = require("../config/multer.js");
const eventModel = require("../models/event.js");
const serverError = require("../config/serverError.js");
const { setPrevDetails } = require("../middlewares/flash-setup.js");
const { isAuthenticated } = require("../middlewares/auth.js");
const isValidMongooseId = require("../middlewares/mongooseIdCheck.js");

const router = express.Router();

router.get("/add", isAuthenticated, setPrevDetails, (req, res) => {
   res.render("addEditEvent", {
      layout: "editor",
      title: "Add Event",
   });
});

router.get("/:id", isValidMongooseId, async (req, res, next) => {
   try {
      const event = await eventModel.findById(req.params.id).lean();
      if (event == null) throw new serverError(404, "Event not found.");
      res.render("event", {
         title: event.name,
         ...event,
         eventName: event.name,
      });
   } catch (err) {
      next(err);
   }
});

router.get("/edit/:id", isValidMongooseId, async (req, res, next) => {
   try {
      const event = await eventModel.findById(req.params.id).lean();
      if (event == null) {
         throw new serverError(
            404,
            "The event you are trying to edit not found."
         );
      }
      res.render("addEditEvent", {
         layout: "editor",
         title: "Edit Event",
         ...event,
      });
   } catch (err) {
      next(err);
   }
});

router.post(
   "/add",
   isAuthenticated,
   upload.fields([
      { name: "bannerImage", maxCount: 1 },
      { name: "fullImage", maxCount: 1 },
   ]),
   async (req, res, next) => {
      const errors = [];
      const { name, status, description, length, time } = req.body;
      if (!req.bannerImage) errors.push({ error: "Banner Image is required." });
      if (!name) {
         errors.push({ error: "Name is required for an event." });
      }
      if (!status) {
         errors.push({ error: "Visibility status is required for an event." });
      }
      if (length <= 1) {
         errors.push({ error: "Description is required for an event." });
      }
      let timeObj;
      if (!time) {
         errors.push({ error: "Date And Time is required for an event." });
      } else {
         try {
            timeObj = new Date(time);
            if (timeObj.toString() == "Invalid Date") {
               errors.push({ error: "Invalid date format." });
            }
         } catch (err) {
            errors.push({ error: "Invalid date format." });
         }
      }

      if (errors.length !== 0) {
         req.flash("prevDetails", {
            name,
            status,
            description,
            errors,
            time,
         });
         return res.redirect("/event/add");
      }
      try {
         const event = new eventModel({
            name,
            status,
            description,
            time: timeObj,
            bannerImage: `/images/${req.bannerImage}`,
            fullImage: req.fullImage ? `/images/${req.fullImage}` : null,
            createdBy: req.user.id,
         });
         const newEvent = await event.save();
         res.status(201).redirect(`/event/${newEvent._id}`);
      } catch (err) {
         console.log(err);
         return next(
            new serverError(
               500,
               "Something went wrong. Couldn't add the event. Try again."
            )
         );
      }
   }
);

router.post(
   "/edit/:id",
   isValidMongooseId,
   isAuthenticated,
   upload.fields([
      { name: "bannerImage", maxCount: 1 },
      { name: "fullImage", maxCount: 1 },
   ]),
   async (req, res, next) => {
      try {
         const event = await eventModel.findById(req.params.id);
         if (event == null) {
            throw new serverError(
               404,
               "The event you are trying to edit not found."
            );
         }

         const { name, status, description, length, time } = req.body;
         const errors = [];
         if (!name) {
            errors.push({ error: "Name is required for an event." });
         }
         if (!status) {
            errors.push({
               error: "Visibility status is required for an event.",
            });
         }
         if (length <= 1) {
            errors.push({ error: "Description is required for an event." });
         }
         let timeObj;
         if (!time) {
            errors.push({ error: "Date And Time is required for an event." });
         } else {
            try {
               timeObj = new Date(time);
               if (timeObj.toString() == "Invalid Date") {
                  errors.push({ error: "Invalid date format." });
               }
            } catch (err) {
               errors.push({ error: "Invalid date format." });
            }
         }

         event.name = name;
         event.time = time;
         event.description = description;
         event.lastUpdatedBy = req.user.id;
         event.bannerImage = req.bannerImage
            ? `/images/${req.bannerImage}`
            : event.bannerImage;
         event.fullImage = req.fullImage
            ? `/images/${req.fullImage}`
            : event.fullImage;

         const updatedEvent = await event.save();
         if (updatedEvent == null) {
            throw new serverError(
               500,
               "Something went wrong. Failed updating the event."
            );
         }
         return res.status(204).redirect(`/event/${updatedEvent.id}`);
      } catch (err) {
         next(err);
      }
   }
);

module.exports = router;
