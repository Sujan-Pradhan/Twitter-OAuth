const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    require: true,
  },
  twitterId: String,
  photo: String,
});

module.exports = mongoose.model("User", userSchema);
