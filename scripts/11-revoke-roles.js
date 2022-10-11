import sdk from "./1-initialize-sdk.js";



const token = sdk.getToken("0xC1C1233051F3F74C53fB5D784243211584b1b907");



(async () => {

  try {

    // Mostre os papeis atuais.

    const allRoles = await token.roles.getAll();



    console.log("Roles that exist now:", allRoles);



    // Remova todos os superpoderes que sua carteira tinha sobre o contrato ERC-20.

    await token.roles.setAll({ admin: [], minter: [] });

    console.log(

      "Roles after removing ourselves",

      await token.roles.getAll()

    );

    console.log("Repealed our superpowers over ERC-20 tokens");



  } catch (error) {

    console.error("failed to remove our rights to the DAO treasure", error);

  }

})();
