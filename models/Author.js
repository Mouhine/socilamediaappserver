const { default: mongoose } = require("mongoose");

const authorSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  job: String,
  profile: String,
});

const Author = mongoose.model("author", authorSchema);

module.exports = Author;
