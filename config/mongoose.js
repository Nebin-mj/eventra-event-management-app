const mongoose = require("mongoose");

(async () => {
   try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB Connected");
   } catch (err) {
      console.log(`Cannor connect to MongoDB Error: ${err.message}`);
   }
})();
