import express from "express";
import Post from "../models/postModel.js";
const router = express.Router();

function loginCheck(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect("/");
  }
}

router.get("/", loginCheck, async (req, res) => {
  let postFound = await Post.find({ author: req.user._id }).exec();
  return res.render("profile", { user: req.user, posts: postFound });
});

router.get("/post", loginCheck, (req, res) => {
  return res.render("post", { user: req.user });
});
router.post("/post", loginCheck, async (req, res) => {
  let { title, content } = req.body;
  let newPost = new Post({ title, content, author: req.user._id });
  try {
    await newPost.save();
    return res.redirect("/profile");
  } catch {
    req.flash("error_msg", "標題與內容皆需輸入才可發布貼文。");
    return res.redirect("/profile/post");
  }
});

export default router;
