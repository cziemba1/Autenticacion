const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// Load User authentication features
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
