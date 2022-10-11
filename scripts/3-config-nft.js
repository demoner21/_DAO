import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop("INSERT_EDITION_DROP_ADDRESS");

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "Galaxy Eye",
        description: "You can´t beat death but you can beat death in life, sometimes. and the more often you learn to do it, the more light there will be. your life is your life. know it while you have it.",
        image: readFileSync("scripts/assets/galaxy.jpg"),
      },
    ]);
    console.log("NFT  Sucess Create");
  } catch (error) {
    console.error("Sorry, try again");
  }
})()