import { useAddress, useMetamask, useEditionDrop, useToken, useVote, useNetwork } from '@thirdweb-dev/react';

import { ChainId } from '@thirdweb-dev/sdk'

import { useState, useEffect, useMemo } from 'react';

import { AddressZero } from "@ethersproject/constants";




const App = () => {
  // using hook to connectwallet give to us from thirdweb
    // Use o hook connectWallet que o thirdweb nos dá.
  const address = useAddress();
  const network = useNetwork();

  const connectWithMetamask = useMetamask();
  console.log("Address:", address);

  //init the contract
  const editionDrop = useEditionDrop("0xf1551412B6540d51b8c353A7A87d08d0f28E8d55");
  const token = useToken("0xC1C1233051F3F74C53fB5D784243211584b1b907");
  const vote = useVote("0x6444A9C1A7cf08765C08E80c0ec033AE9158675e");

  // variable to check with the user has our NFT.

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  const [isClaiming, setIsClaiming] = useState(false);

// keep the quantaty of token which member has in a variable states
const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
// O array keep address of our member
const [memberAddresses, setMemberAddresses] = useState([]);

// Showlett address of our member
const shortenAddress = (str) => {
  return str.substring(0, 6) + "..." + str.substring(str.length - 4);
};

const [proposals, setProposals] = useState([]);

const [isVoting, setIsVoting] = useState(false);

const [hasVoted, setHasVoted] = useState(false);



// Recupere todas as propostas existentes no contrato. 

useEffect(() => {

  if (!hasClaimedNFT) {

    return;

  }

  // Uma chamada simples para vote.getAll() para pegar as propostas.

  const getAllProposals = async () => {

    try {

      const proposals = await vote.getAll();

      setProposals(proposals);

      console.log("Proposals:", proposals);

    } catch (error) {

      console.log("Failed to search proposals", error);

    }

  };

  getAllProposals();

}, [hasClaimedNFT, vote]);



// Nós também precisamos checar se o usuário já votou.

useEffect(() => {

  if (!hasClaimedNFT) {

    return;

  }



  // Se nós não tivermos terminado de recuperar as propostas do useEffect acima

  // então ainda nao podemos checar se o usuário votou!

  if (!proposals.length) {

    return;

  }



  const checkIfUserHasVoted = async () => {

    try {

      const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);

      setHasVoted(hasVoted);

      if (hasVoted) {

        console.log("user already vote");

      } else {

        console.log("User still not vot yet");

      }

    } catch (error) {

      console.error("failed to check wallet", error);

    }

  };

  checkIfUserHasVoted();



}, [hasClaimedNFT, proposals, address, vote]);


// this useEffect getr all address of our members has a NFT
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // the same away in the file 7, take users has our NFT
  const getAllAddresses = async () => {
    try {
      const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
      setMemberAddresses(memberAddresses);
      console.log("🚀 Endereços de membros", memberAddresses);
    } catch (error) {
      console.error("falha ao pegar lista de membros", error);
    }

  };
  getAllAddresses();
}, [hasClaimedNFT, editionDrop.history]);

// this useEffect take # tokens of which member.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // take every balance
  const getAllBalances = async () => {
    try {
      const amounts = await token.history.getAllHolderBalances();
      setMemberTokenAmounts(amounts);
      console.log("Amount", amounts);
    } catch (error) {
      console.error("Sorry, we can get Amount", error);
    }
  };
  getAllBalances();
}, [hasClaimedNFT, token.history]);


// combine memberAddress with our memberTokenAmounts in a single array
const memberList = useMemo(() => {
  return memberAddresses.map((_address) => {
    // if address doesnt have our memberTokenAmounts, its mean they dont have our token
    const member = memberTokenAmounts?.find(({ holder }) => holder === _address);

    return {
      address,
      tokenAmount: member?.balance.displayValue || "0",
    }
  });
}, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    // if they dont have a wallet conected
    if (!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        // if the balance < 0, they has our NFT
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("Hello, are your ready ?")
        } else {
          setHasClaimedNFT(false);
          console.log("You are not still our member");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("there is no balance", error);
      }
    };
    checkBalance();
  }, [address, editionDrop]);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log(`Mint with sucess! Look at OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("failed to mint NFT", error);
    } finally {
      setIsClaiming(false);
    }
  };

  if (address && (network?.[0].data.chain.id !== ChainId.Rinkeby)) {

    return (

      <div className="unsupported-network">

        <h2>Please connect to the Rinkeby network</h2>

        <p>

        This dapp only works with the Rinkeby network, please

        switch networks in your wallet.

        </p>

      </div>

    );

  }




  if (!address) {
  return (
    <div className="landing">
      <h1>_DAO</h1>
      <button onClick={connectWithMetamask} className="btn-hero">Connect Wallet</button>
      <h3>AK. Demoner</h3>
    </div>);
  }


  if (hasClaimedNFT) {
    return (
    <div className="member-page">
      <h1>👾 Página dos membros da DAO 👾</h1>
      <p>👾👾 | Enjoy the ride | 👾👾</p>
      <div>
        <div>
          <h2>List of our partners</h2>
          <table className='card'>
            <thead>
              <tr>
                <th>Address</th>
                <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Propostas Ativas</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                e.stopPropagation()

                //antes de fazer as coisas async, desabilitamos o botão para previnir duplo clique
                setIsVoting(true)

                // pega os votos no formulário 
                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    //abstenção é a escolha padrão
                    vote: 2,
                  }
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    )

                    if (elem.checked) {
                      voteResult.vote = vote.type
                      return
                    }
                  })
                  return voteResult
                })

                // certificamos que o usuário delega seus tokens para o voto
                try {
                  //verifica se a carteira precisa delegar os tokens antes de votar
                  const delegation = await token.getDelegationOf(address)
                  // se a delegação é o endereço 0x0 significa que eles não delegaram seus tokens de governança ainda
                  if (delegation === AddressZero) {
                    //se não delegaram ainda, teremos que delegar eles antes de votar
                    await token.delegateTo(address)
                  }
                  // então precisamos votar nas propostas
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        // antes de votar, precisamos saber se a proposta está aberta para votação
                        // pegamos o último estado da proposta
                        const proposal = await vote.get(proposalId)
                        // verifica se a proposta está aberta para votação (state === 1 significa está aberta)
                        if (proposal.state === 1) {
                          // se está aberta, então vota nela
                          return vote.vote(proposalId, _vote)
                        }
                        // se a proposta não está aberta, returna vazio e continua
                        return
                      })
                    )
                    try {
                      // se alguma proposta está pronta para ser executada, fazemos isso
                      // a proposta está pronta para ser executada se o estado é igual a 4
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          // primeiro pegamos o estado da proposta novamente, dado que podemos ter acabado de votar
                          const proposal = await vote.get(proposalId)

                          //se o estado é igual a 4 (pronta para ser executada), executamos a proposta
                          if (proposal.state === 4) {
                            return vote.execute(proposalId)
                          }
                        })
                      )
                      // se chegamos aqui, significa que votou com sucesso, então definimos "hasVoted" como true
                      setHasVoted(true)
                      console.log("successfully voted")
                    } catch (err) {
                      console.error("failed to execute votes", err)
                    }
                  } catch (err) {
                    console.error("failed to vote", err)
                  }
                } catch (err) {
                  console.error("failed to delegate tokens")
                } finally {
                  // de qualquer modo, volta isVoting para false para habilitar o botão novamente
                  setIsVoting(false)
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => {
                      const translations = {
                        Against: "Against",
                        For: "In favor",
                        Abstain: "Abstention",
                      }
                      return (
                        <div key={type}>
                          <input
                            type="radio"
                            id={proposal.proposalId + "-" + type}
                            name={proposal.proposalId}
                            value={type}
                            //valor padrão "abster" vem habilitado
                            defaultChecked={type === 2}
                          />
                          <label htmlFor={proposal.proposalId + "-" + type}>
                            {translations[label]}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                    ? "You have already voted"
                    : "Submit votes"}
              </button>
              {!hasVoted && (
                <small>
                  This will submit several transactions that you will need to sign.
                </small>
              )}
            </form>
          </div>
        </div>
      </div>
    )
   }

   return (
    <div className="mint-nft">
      <h1>Free mintNft</h1>
      <button
        disabled={isClaiming}
        onClick={mintNft}
      >
        {isClaiming ? "Mint..." : "Mint your NFT (Free)"}
      </button>
    </div>
  );
  
}

export default App