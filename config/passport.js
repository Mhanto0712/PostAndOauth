import passport from "passport";
import googleStrategy from "passport-google-oauth20";
import localStrategy from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";

passport.serializeUser((user, done) => {
  console.log("Serializing");
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  console.log("Deserializing");
  let foundUser = await User.findOne({ _id });
  done(null, foundUser);
});

//googleStrategy
passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("已通過google strategy，拿取相關資料至第三方應用程式");
      let foundUser = await User.findOne({ googleID: profile.id }).exec();
      if (!foundUser) {
        console.log("尚未建立相關資料至數據庫");
        const newUser = new User({
          name: profile.displayName,
          googleID: profile.id,
          thumbnail: profile.photos[0].value,
          email: profile.emails[0].value,
        });
        let savedUser = await newUser.save();
        console.log("新建立一相關資料");
        done(null, savedUser);
      } else {
        console.log("已建立相關資料至數據庫");
        done(null, foundUser);
      }
    }
  )
);

//localStrategy
passport.use(
  new localStrategy(async (username, password, done) => {
    let checkUser = await User.findOne({ email: username }).exec();
    if (checkUser) {
      let checkPassword = await bcrypt.compare(password, checkUser.password);
      if (checkPassword) {
        done(null, checkUser);
      } else {
        done(null, false);
      }
    } else {
      done(null, false);
    }
  })
);
