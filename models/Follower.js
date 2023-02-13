const mongoose = require("mongoose");

const followerSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  profile: String,
  following_by: {
    type: String,
    required: true,
  },
  id: String,
});

const Follower = mongoose.model("follower", followerSchema);

module.exports = Follower;
