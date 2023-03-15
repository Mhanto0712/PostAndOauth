import express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute.js";
import profileRoute from "./routes/profileRoute.js";
import passport from "passport";
import "dotenv/config";
import "./config/passport.js";
import session from "express-session";
import flash from "connect-flash";
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/googleDB")
  .then(() => {
    console.log("已連接googleDB。");
  })
  .catch((e) => {
    console.log("連接失敗！");
    console.log(e);
  });

//middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

//route
app.use("/auth", authRoute);
app.use("/profile", profileRoute);

app.get("/", (req, res) => {
  return res.render("index", { user: req.user });
});

app.listen("8080", () => {
  console.log("Server is running on port 8080.");
});
