import sdk from "./1-initialize-sdk.js";

// Esse é o nosso contrato de governança.
const vote = sdk.getVote("0x6444A9C1A7cf08765C08E80c0ec033AE9158675e");

// Esse é o nosso contrato ERC-20.
const token = sdk.getToken("0xC1C1233051F3F74C53fB5D784243211584b1b907");

(async () => {
  try {
    // Dê para a nosso tesouro o poder de cunhar tokens adicionais se necessário.
    await token.roles.grant("minter", vote.getAddress());

    console.log(
      "Votes module received permission to handle tokens successfully"
    );
  } catch (error) {
    console.error(
      "failed to give access to tokens to votes module",
      error
    );
    process.exit(1);
  }

  try {
    //Pegue o saldo de tokens da nossa carteira, lembre-se -- nós detemos basicamente o fornecimento inteiro agora!
    const ownedTokenBalance = await token.balanceOf(
      process.env.WALLET_ADDRESS
    );

    // Pegue 90% do fornecimento que nós detemos.
    const ownedAmount = ownedTokenBalance.displayValue;
    const percent75 = Number(ownedAmount) / 100 * 75;

    // Transfira 90% do fornecimento para nosso contrato de votação.
    await token.transfer(
      vote.getAddress(),
      percent75
    );

    console.log("Transfer " + percent75 + " tokens to successful voting module");
  } catch (err) {
    console.error("fails to transfer tokens to votes module", err);
  }
})();