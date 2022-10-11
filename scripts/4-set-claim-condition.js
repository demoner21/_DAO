import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("0xf1551412B6540d51b8c353A7A87d08d0f28E8d55");

(async () => {
  try {
    // Especifique as condições.
    const claimConditions = [{
      // Quando as pessoas vão poder reivindicar seus NFTs
      startTime: new Date(),
      // Número máximo de NFTs
      maxQuantity: 50_000,
      // o preço do NFT (grátis)
      price: 0,
      // Quantos NFTs podem ser reivindicados por transação.
      quantityLimitPerTransaction: 1,
      // tempo de espera entre transações infinito significa que cada
      // pessoa só pode solicitar um único NFT.
      waitInSeconds: MaxUint256,
    }]


        await editionDrop.claimConditions.set("0", claimConditions);

        console.log("conditions accepted, your transactions was sucess");
    } catch (error) {
        console.error("Fail, please try again", error);
    }
})()