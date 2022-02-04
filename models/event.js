const mongoose = require("mongoose");

const schema = new mongoose.Schema({
   name: {
      type: String,
      require: true,
   },
   description: {
      type: String,
      required: true,
   },
   bannerImage: {
      type: String,
      required: true,
   },
   time: {
      type: Date,
      required: true,
   },
   fullImage: {
      type: String,
      required: false,
   },
   createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
   },
   lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
   },
});

const model = mongoose.model("event", schema);
module.exports = model;
