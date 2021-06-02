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
        "https://anh.eva.vn/upload/4-2018/images/2018-11-16/lay-loi-nhu-a-hau-huyen-my-de-nguyen-layout-makeup-di-event-roi-lao-di-xem-da-bong-4-1542381243-759-width800height1067.jpg",
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
    saved: [{ type: mongoose.Types.ObjectId, ref: "user" }],
  },
  {
    timeStamp: true,
  }
);

module.exports = mongoose.model("user", userSchema);
