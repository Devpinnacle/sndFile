const mongoose = require("mongoose");
ObjectId = mongoose.Schema.ObjectId;

const Fileschema = new mongoose.Schema({
  name: {
    type: String,
    default: ""
  },

  orgname: {
    type: String,
    default: ""
  },

  from: {
    type: String,
    default: ""
  },

  to: {
    type: String,
    default: ""
  },

  date: {
    type: Date,
    default: Date.now,
  },

});

module.exports = File = mongoose.model("file", Fileschema);
