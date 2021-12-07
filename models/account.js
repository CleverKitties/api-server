const mongoose = require("mongoose");

const User = mongoose.Schema({
  address: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  nonce: { type: Number, default: 0 },
});

mongoose.model("User", User);
