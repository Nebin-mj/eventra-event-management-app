require("dotenv").config();
const PORT = process.env.PORT || 5000;

const express = require("express");
const { create } = require("express-handlebars");
const flash = require("express-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

const hbsConfig = require("./config/handlebars.js");
const { flashSetup } = require("./middlewares/flash-setup.js");

const indexRouter = require("./routes/index.js");
const authRouter = require("./routes/auth.js");
const eventRouter = require("./routes/event.js");

const errorMiddleware = require("./middlewares/error.js");

const app = express();

const hbs = create(hbsConfig);
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

const sessionStore = new MongoStore({
   mongoUrl: process.env.MONGO_URI,
   collectionName: "sessions",
});
app.use(
   session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: sessionStore,
      cookie: {
         maxAge: 1000 * 60 * 60 * 6,
         httpOnly: true,
      },
   })
);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport.js");
app.use(flashSetup);

app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/event", eventRouter);

app.all("*", (req, res) => {
   res.status(404).render("error", {
      title: "Error",
      status: 404,
      message: "The page you are looking for not found.",
   });
});

app.use(errorMiddleware);

require("./config/mongoose.js");
app.listen(PORT, () => {
   console.log(`App running on port: ${PORT}.`);
});
