import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const voteContractAddress = await sdk.deployer.deployVote({
      // Dê um nome para o seu contrato de governança.
      name: "_Dao - DAO teste",

      // Essa a localização do seu token de governança, nosso contrato ERC-20!
      voting_token_address: "0xC1C1233051F3F74C53fB5D784243211584b1b907",

      // Depois de uma proposta ser criada, quando os membros podem começar a votar?
      // Por agora, colocamos isso como imediatamente.
      voting_delay_in_blocks: 0,

      // Por quanto tempo membros podem votar em uma proposta quando ela é criada?
      // Aqui, nós configuramos como 1 dia (6570 blocos)
      voting_period_in_blocks: 6570,

      // A % mínima da oferta total que precisa vota 
      // para que a proposta sejá válida
      voting_quorum_fraction: 51,

      // Qual a # mínima de tokens que um usuário precisa para poder criar uma proposta?
      // Eu coloco 0. Significando que nenhum token é necessário para um usuário poder
      // criar uma proposta.
      proposal_token_threshold: 1,
    });

    console.log(
      "Voting module successfully deployed to address:",
      voteContractAddress,
    );
  } catch (err) {
    console.error("Failed to deploy votes module", err);
  }
})();
