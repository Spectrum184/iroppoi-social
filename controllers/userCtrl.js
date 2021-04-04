const Users = require("../models/useModels");

const userCtrl = {
  searchUser: async (req, res) => {
    try {
      const users = await Users.find({
        username: { $regex: req.query.username.toLowerCase() },
      })
        .limit(10)
        .select("fullname username avatar");

      res.json({ users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userCtrl;
