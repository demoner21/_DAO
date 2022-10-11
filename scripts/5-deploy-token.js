import { AddressZero } from "@ethersproject/constants";

import sdk from "./1-initialize-sdk.js";



(async () => {

  try {

    // Faça o Deploy de um contracto ERC-20 padrão.

    const tokenAddress = await sdk.deployer.deployToken({


            // name of the token
            name: "Governance token of _Dao",
            // symbol token
            symbol: "R3d",
            //this case if we wanna sell our tokens
            //that case we dont, cause of that AddressZero again
            primary_sale_recipient: AddressZero,
        });
        console.log("Token model was sucess. Address:", tokenAddress);
    } catch (error) {
        console.log("Token model was fail.", error);
    }
})();