const mongoose = require("mongoose");
ObjectId = mongoose.Schema.ObjectId;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    default: ""
  },

  name: {
    type: String,
    default: ""
  },

  password: {
    type: String,
    default: ""
  },

  dob: {
    type: String,
    default: ""
  },

  address: {
    type: String,
    default: ""
  },

});

module.exports = users = mongoose.model("users", userSchema);
