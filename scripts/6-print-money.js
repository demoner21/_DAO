import sdk from "./1-initialize-sdk.js";


// address from out contract ERC-20

const token = sdk.getToken("0xC1C1233051F3F74C53fB5D784243211584b1b907");

(async () => {
    try {
        // init suply
        const amount = 500_000;
        //interact with the contract && mint tokens
        await token.mintToSelf(amount);
        const totalSupply = await token.totalSupply();

        // show how many tokens there is now
        console.log("We have", totalSupply.displayValue, "$R3d");
    } catch (error) {
        console.error("fail to print token", error);
    }
})();