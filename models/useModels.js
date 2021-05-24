const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      maxLength: 25,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      maxLength: 25,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "data:image/jpeg;base64,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",
    },
    role: {
      type: String,
      default: "user",
    },
    gender: {
      type: String,
      default: "male",
    },
    mobile: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    story: {
      type: String,
      default: "",
      maxLength: 200,
    },
    website: {
      type: String,
      default: "",
    },
    followers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    following: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    timeStamp: true,
  }
);

module.exports = mongoose.model("user", userSchema);
