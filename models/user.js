const mongoose = require("mongoose");

const schema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      hash: {
         type: String,
         required: true,
      },
   },
   {
      timestamps: true,
   }
);

const model = mongoose.model("user", schema);
module.exports = model;
