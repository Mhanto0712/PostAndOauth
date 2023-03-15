import express from "express";
import passport from "passport";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
const router = express.Router();

router.get("/login", (req, res) => {
  return res.render("login", { user: req.user });
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "登入失敗，輸入資訊有誤。",
  }),
  (req, res) => {
    res.redirect("/profile");
  }
);

router.get("/logout", (req, res) => {
  req.logOut((e) => {
    if (e) return res.send(e);
    return res.redirect("/");
  });
});

router.get("/signup", (req, res) => {
  return res.render("signup", { user: req.user });
});
router.post("/signup", async (req, res) => {
  let { name, email, password } = req.body;
  if (name.length < 2 || password.length < 8) {
    req.flash("error_msg", "長度過短，請再輸入一次。");
    return res.redirect("/auth/signup");
  }
  let checkUser = await User.findOne({ email }).exec();
  if (checkUser) {
    req.flash("error_msg", "此信箱已使用，請輸入別的信箱。");
    return res.redirect("/auth/signup");
  } else {
    let hashValue = await bcrypt.hash(password, 12);
    let newUser = new User({ name, email, password: hashValue });
    await newUser.save();
    req.flash("success_msg", "恭喜註冊成功！登入後即可使用。");
    res.redirect("/auth/login");
  }
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  return res.redirect("/profile");
});

export default router;
