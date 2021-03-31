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
        "https://scontent-lax3-2.cdninstagram.com/v/t51.2885-15/e35/p1080x1080/130593310_394949901947087_5735645687084275763_n.jpg?tp=1&_nc_ht=scontent-lax3-2.cdninstagram.com&_nc_cat=111&_nc_ohc=DzuLBRx07NcAX_hE2Ug&ccb=7-4&oh=816ebf3080e8fbb88d314f6d1027e58e&oe=608B1598&_nc_sid=4f375e",
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
