require("dotenv").config();
const ethers = require("ethers");
const router = require("express").Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const auth = require("./auth");
const validateSignature = require("./signature");

// game engine contract abi
const GAME_ENGINE_ABI = require("./kitty_engine_abi.json");
const KITTY_NFT_ABI = require("./kitty_nft_abi.json");

// fantom json rpc provider & signer wallet
const provider = new ethers.providers.JsonRpcProvider(
  process.env.NETWORK_RPC,
  parseInt(process.env.NETWORK_CHAINID)
);
// signer wallet
const wallet = new ethers.Wallet(process.env.SIGNER_PK, provider);

// game engine contract
let gameEngineContract = new ethers.Contract(
  process.env.GAME_ENGINE,
  GAME_ENGINE_ABI,
  wallet
);

// kitty nft contract
let kittyNftContract = new ethers.Contract(
  process.env.KITTY_CONTRACT,
  KITTY_NFT_ABI,
  wallet
);

router.post(
  "/submitAnswer",
  /*auth,*/ async (req, res) => {
    try {
      let kittyID = parseInt(req.body.kittyID);
      let mode = parseInt(req.body.mode);
      let signature = req.body.signature;
      //   get kitty nft owner here from id
      let address = await kittyNftContract.ownerOf(kittyID);
      let isCorrectAnswer = req.body.isCorrectAnswer;
      isCorrectAnswer = isCorrectAnswer == "true" ? true : false;
      let isValidSignature = await validateSignature(address, signature);

      if (!isValidSignature)
        return res.json({
          status: false,
          data: "Invalid Wallet Singature",
        });
      if (kittyID >= 10000 || mode > 3)
        return res.json({
          status: false,
          data: "Invalid kittyID or game mode",
        });
      // submit answer tx
      let tx = await gameEngineContract.submitAnswer(
        kittyID,
        mode,
        isCorrectAnswer,
        {
          gasLimit: 300000,
        }
      );
      await tx.wait();
      return res.json({
        status: tx ? true : false,
        data: `${
          tx ? "Answer submitted successfully" : "submit answer failed"
        }`,
      });
    } catch (error) {
      console.log(error);
      return res.json({
        status: false,
        data: "Internal error",
      });
    }
  }
);

router.get(
  "/nonce/:address",
  /*auth,*/ async (req, res) => {
    try {
      let address = toLowerCase(req.params.address);
      let user = await User.findOne({
        address,
      });
      if (user) {
        let nonce = user.nonce;
        return res.json({
          status: true,
          data: nonce,
        });
      } else {
        user = new User();
        user.address = address;
        await user.save();
        return res.json({
          status: true,
          data: 0,
        });
      }
    } catch (error) {
      console.log(error);
      return res.json({});
    }
  }
);

const toLowerCase = (val) => {
  if (!val) return val;
  return val.toLowerCase();
};
module.exports = router;
