import sdk from "./1-initialize-sdk.js";

import { ethers } from "ethers";


// Nosso contrato de votação.

const vote = sdk.getVote("0x6444A9C1A7cf08765C08E80c0ec033AE9158675e");



// Nosso contrato ERC-20.

const token = sdk.getToken("0xC1C1233051F3F74C53fB5D784243211584b1b907");



(async () => {

  try {

    const amount = 350_000;

    // Crie uma proposta para cunhar 420.000 novos tokens para o tesouro.

    const description = "Mint for the DAO an additional amount of " + amount + " tokens ?";



    const executions = [

      {

        // Nosso token module que de fato executa a cunhagem.

        toAddress: token.getAddress(),

        // Nosso nativeToken é ETH. nativeTokenValue é a quantidade de ETH que nós queremos 

        // mandar nessa proposta. Nesse caso, estamos mandando 0 ETH.

        // Nós estamos apenas cunhando novos tokens para o tesouro. Então, deixe 0.

        nativeTokenValue: 0,

          // Estamos fazendo uma cunhagem! E, estamos cunhando no vote, que está

          // agindo como nosso tesouro.

          // nesse caso, usamos ethers.js para converter a quantidade

          // ao formato correto. Isso porque a quantidade precisa ser em wei

        transactionData: token.encoder.encode(

          "mintTo", [

            vote.getAddress(),

            ethers.utils.parseUnits(amount.toString(), 18),

          ]

        ),

      }

    ];



    await vote.propose(description, executions);





    console.log("Proposal to mint tokens successfully created!");

  } catch (error) {

    console.error("failed to create first proposal", error);

    process.exit(1);

  }



  try {

    // Crie uma proposta para transferir para nós mesmos 6,900 tokens por sermos irados.

    const amount = 3_500;



    const description = "A DAO should transfer " + amount + " tokens to " +

      process.env.WALLET_ADDRESS + " to be a legen- wait for -daddy?";



    const executions = [

      {

        // Novamente, estamos mandando para nós mesmos 0 ETH. Apenas mandando nosso próprio token.

        nativeTokenValue: 0,

        transactionData: token.encoder.encode(

          // Nós estamos fazendo uma transferência do tesouro para a nossa carteira.

          "transfer",

          [

            process.env.WALLET_ADDRESS,

            ethers.utils.parseUnits(amount.toString(), 18),

          ]

        ),



        toAddress: token.getAddress(),

      },

    ];



    await vote.propose(description, executions);



    console.log(

      "Proposal to create a time machine, let's hope you vote yes!"

    );

  } catch (error) {

    console.error("falha ao criar segunda proposta", error);

  }

})();