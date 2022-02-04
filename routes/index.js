const express = require("express");
const eventModel = require("../models/event.js");

const router = express.Router();

router.get("/", async (req, res, next) => {
   try {
      const currentDate = new Date();
      const oncommingEvents = await eventModel
         .find({ time: { $gte: currentDate } })
         .sort({ time: "desc" })
         .lean();
      const pastEvents = await eventModel
         .find({ time: { $lt: currentDate } })
         .sort({ time: "desc" })
         .lean();

      res.render("home", {
         title: "Home",
         oncommingEvents,
         pastEvents,
      });
   } catch (err) {
      next(err);
   }
});

module.exports = router;
