import sdk from "./1-initialize-sdk.js";

// this address are from our contract ERC-1155
const editionDrop = sdk.getEditionDrop("0xf1551412B6540d51b8c353A7A87d08d0f28E8d55");

// this address are from ERC-20 token
const token =  sdk.getToken("0xC1C1233051F3F74C53fB5D784243211584b1b907");

(async () => {
    try {
        // pick the address of all people have our NFT, that have token 0
        const walletAddress = await editionDrop.history.getAllClaimerAddresses(0);

        if (walletAddress.length === 0);
            console.log("No one has mint our token yet, its free NFT");
            process.exit(0);
            // Do a loop in the array to get address
            const airdropTargets = walletAddress.map((address) => {
                //randon N° between X && XX {1k/10k}
                const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);

                // check the target
                const airdropTarget = {
                    toAddress: address,
                    amount: randomAmount,
                };

                return airdropTarget
            });
            //call transferBatch in every target airdrop.
            console.log("Airdrop initialize...")
            await token.transferBatch(airdropTargets);
            console.log("AirDrop done");
        } catch (error) {
        console.error("airdrop fail", error);
        }
    })()