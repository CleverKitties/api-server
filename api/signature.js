const ethUtil = require("ethereumjs-util");
const sigUtil = require("eth-sig-util");

const mongoose = require("mongoose");
const User = mongoose.model("User");

const toLowerCase = (val) => {
  if (!val) return val;
  return val.toLowerCase();
};

const validateSignature = async (address, signature) => {
  try {
    address = toLowerCase(address);
    let user = await User.findOne({ address });
    let nonce = user.nonce;
    let msg = `Confirm wallet ownership on CleverKitties : ${nonce}`;
    let msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, "utf8"));
    let _address = toLowerCase(
      sigUtil.recoverPersonalSignature({
        data: msgBufferHex,
        sig: signature,
      })
    );
    if (address == _address) {
      user.nonce = Math.floor(Math.random() * 9999999);
      await user.save();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
module.exports = validateSignature;
