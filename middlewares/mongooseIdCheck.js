const mongoose = require("mongoose");
const isValidMongooseId = (req, res, next) => {
   if (mongoose.Types.ObjectId.isValid(req.params.id)) return next();
   return next("route");
};

module.exports = isValidMongooseId;
