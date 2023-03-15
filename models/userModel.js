import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  googleID: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  thumbnail: {
    type: String,
  },
  // local login
  email: {
    type: String,
  },
  password: {
    type: String,
    minLength: 8,
    maxLength: 1024,
  },
});

export default mongoose.model("User", userSchema);
