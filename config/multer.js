const path = require("path");
const multer = require("multer");
const uuid = require("uuid").v4;

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "..", "public", "images"));
   },
   filename: (req, file, cb) => {
      const newName = `${uuid()}--${file.originalname}`;
      cb(null, newName);
      req[file.fieldname] = newName;
   },
});
const upload = multer({ storage });
module.exports = upload;
