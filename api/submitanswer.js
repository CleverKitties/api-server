require("dotenv").config();
const ethers = require("ethers");
const router = require("express").Router();

// game engine contract abi
const GAME_ENGINE_ABI = require("./abi.json");

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

router.post("/submitAnswer", async (req, res) => {
  let origin = req.get("origin");
  console.log(origin);
  // if (origin != "https://api.cleverkitties.io")
  //   return res.json({
  //     status: false,
  //     data: "api call from invalid origin",
  //   });
  let kittyID = parseInt(req.body.kittyID);
  let mode = parseInt(req.body.mode);
  if (kittyID >= 10000 || mode > 3)
    return res.json({
      status: false,
      data: "invalid kittyID or game mode",
    });
  // submit answer tx
  let answer = await gameEngineContract.submitAnswer(kittyID, mode, {
    gasLimit: 300000,
  });
  console.log(answer);
  return res.json({
    status: answer ? true : false,
    data: `${
      answer ? "answer submitted successfully" : "submit answer failed"
    }`,
  });
});

module.exports = router;
