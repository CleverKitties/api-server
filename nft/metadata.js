const fs = require("fs");

const baseURL = "/Volumes/Data/CleverKitties/cat/";

const ipfsUrlImage =
  "https://cleverkitties.mypinata.cloud/ipfs/QmcP5HdDCdgAPypu2rNAwrFkU77MaXnGLQz1qFwSDBfZC2/";

const updateMetadata = () => {
  fs.readdir(baseURL + "json", (err, files) => {
    files.forEach((file) => {
      let cardinalOrder = file.split(".")[0];
      let rawData = fs.readFileSync(baseURL + "json/" + file);
      let metadata = JSON.parse(rawData);
      metadata.name = `Clever Kitty #${cardinalOrder}`;
      metadata.description =
        "Clever Kitties Official NFT Collection. Clever Kitties is the first of it's kind P2E guess game using NFTs powered on Fantom Opera Blockchain.By holding our clever cats, holders can earn our $FISHY token by playing the game or NFTs can be traded freely on major Marketplaces.";
      metadata.image = `${ipfsUrlImage}${cardinalOrder}.png`;
      delete metadata.compiler;
      //   console.log(metadata);
      fs.writeFileSync(baseURL + "json/" + file, JSON.stringify(metadata));
    });
  });
};

updateMetadata();
