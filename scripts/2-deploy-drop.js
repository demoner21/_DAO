import { useEdition } from '@thirdweb-dev/react'

export default function Component() {
  const edition = useEdition("0x769ddFA6222BDd6B63AA196E9442F0197f144D1a")

  // Now you can use the edition contract in the rest of the component
  (async () => {

  try {

    const editionDropAddress = await sdk.deployer.deployEditionDrop({

      // O nome da coleção, ex. CryptoPunks

      name: "Membro da royalSociety",

      // Uma descrição para a coleção.

      description: "A DAO pra financiamento cientifico",

      // Uma imagem para a coleção que vai aparecer no OpenSea.

      image: readFileSync("scripts/assets/mtb.png"),

      // Nós precisamos passar o endereço da pessoa que vai estar recebendo os rendimentos das vendas dos nfts do módulo.

      // Nós estamos planejando não cobrar as pessoas pelo drop, então passaremos o endereço 0x0

      // você pode configurar isso para sua própria carteira se você quiser cobrar pelo drop.

      primary_sale_recipient: AddressZero,

    });



    // essa inicialização retorna o endereço do nosso contrato

    // usamos para inicializar o contrato no sdk

    const editionDrop = sdk.getEditionDrop(editionDropAddress);



    // com isso, temos os metadados no nosso contrato

    const metadata = await editionDrop.metadata.get();

    

    console.log(

      "✅ Contrato editionDrop implantado com sucesso, endereço:",

      editionDropAddress,

    );

    console.log(

      "✅ bundleDrop metadados:",

      metadata,

    );

  } catch (error) {

    console.log("falha ao implantar contrato editionDrop", error);

  }

})()

}