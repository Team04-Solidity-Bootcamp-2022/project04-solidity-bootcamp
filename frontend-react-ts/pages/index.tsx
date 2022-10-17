import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../assets/abi.json";

const Home: NextPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [contract, setContract] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [provider, setProvider] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [myTokenBalance, setMyTokenBalance] = useState(null);
  const [votePower, setVotePower] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accountsChanged);
      window.ethereum.on("chainChanged", chainChanged);
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "goerli"
        );

        setProvider(provider);

        const res = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        await accountsChanged(res[0]);

        const signer = provider.getSigner(res[0]);

        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_TOKENIZEDBALLOT_CONTRACT_ADDRESS,
          abi.abi,
          signer
        );

        setContract(contract);
      } catch (err) {
        console.log(err);
      }
    } else {
      setErrorMessage("Install MetaMask");
    }
  };

  const accountsChanged = async (newAccount) => {
    setAccount(newAccount);
    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [newAccount.toString(), "latest"],
      });
      setBalance(ethers.utils.formatEther(balance));
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem connecting to MetaMask");
    }
  };

  const getBlock = async () => {
    if (blockNumber) {
      setBlockNumber(null);
      return;
    }

    try {
      const blockNumber = await provider.getBlock("latest");
      setBlockNumber(blockNumber.number);
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem obtaining blocks");
    }
  };

  const buyTokens = async () => {
    try {
      const buyTokensTx = await contract.buyTokens({
        value: ethers.utils.parseEther("0.01"),
      });
      await buyTokensTx.wait();
      setSuccessMessage("Purchase complete!");
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem buying tokens");
    }
  };

  const getAllProposals = async () => {
    try {
      if (proposals.length) {
        setProposals([]);
        return;
      }
      const rawProposals = await contract.allProposals();
      const cleanProposals = [];
      let id = 0;
      for (let x of rawProposals) {
        const name = ethers.utils.parseBytes32String(x[0]);
        const count = ethers.utils.formatUnits(x[1]);
        cleanProposals.push({
          id: id,
          name: name,
          count: count,
        });
        id++;
      }

      setProposals(cleanProposals);
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem obtaining proposals");
    }
  };

  const vote = async (e) => {
    const id = e.currentTarget.getAttribute("data-id");

    try {
      const voteTx1 = await contract.vote(id, ethers.utils.parseEther("0.01"));
      await voteTx1.wait();
      setSuccessMessage("Vote complete!");
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem voting");
    }
  };

  const getTotalSupply = async () => {
    if (totalSupply) {
      setTotalSupply(null);
      return;
    }

    try {
      let totalSupply = await contract.getTotalSupply();
      totalSupply = ethers.utils.formatUnits(totalSupply);
      setTotalSupply(totalSupply);
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem obtaining total supply");
    }
  };

  const getMyBalance = async () => {
    if (myTokenBalance) {
      setMyTokenBalance(null);
      return;
    }

    try {
      let myTokenBalance = await contract.getBalance(account);
      myTokenBalance = ethers.utils.formatUnits(myTokenBalance);
      setMyTokenBalance(myTokenBalance);
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem obtaining token balance");
    }
  };

  const selfDelegate = async () => {
    try {
      let delegateTx = await contract.delegate(account);
      await delegateTx.wait();
      setSuccessMessage("Self delegate complete");
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem self delegating");
    }
  };

  const getVotingPower = async () => {
    if (votePower) {
      setVotePower(null);
      return;
    }

    try {
      let votePower = await contract.getPastVotes();
      votePower = ethers.utils.formatUnits(votePower);
      setVotePower(votePower);
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem obtaining total supply");
    }
  };

  const chainChanged = () => {
    setErrorMessage("");
    setAccount("");
    setBalance("");
  };

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Welcome to <a href="/">Ice Cream Voting!</a>
        </h1>

        <button type="button" onClick={connectWallet}>
          Connect Wallet!
        </button>
        <p>Account: {account}</p>
        <p>
          Eth Balance: {balance} {balance ? "ETH" : null}
        </p>

        {errorMessage ? <div color="red">Error: {errorMessage}</div> : null}

        {account ? (
          <p>
            <button type="button" onClick={getAllProposals}>
              Show All Proposals
            </button>

            <button type="button" onClick={getTotalSupply}>
              Show Total Supply
            </button>

            <button type="button" onClick={getMyBalance}>
              My Token Balance
            </button>

            <button type="button" onClick={getBlock}>
              Get Block
            </button>

            <button type="button" onClick={selfDelegate}>
              Self Delegate
            </button>

            <button type="button" onClick={getVotingPower}>
              Get Vote Power
            </button>

            <button type="button" onClick={buyTokens}>
              Purchase 0.01 Tokens
            </button>
          </p>
        ) : null}

        {proposals.map((data) => (
          <p key={data.id}>
            {data.name} : {data.count}
            <button data-id={data.id} type="button" onClick={vote}>
              Vote {data.name}
            </button>
          </p>
        ))}

        {blockNumber ? <p>Block Number: {blockNumber}</p> : null}

        {totalSupply ? <p>Total Supply: {totalSupply}</p> : null}

        {myTokenBalance ? <p>My Token Balance: {myTokenBalance}</p> : null}

        {votePower ? <p>Vote Power: {votePower}</p> : null}

        {successMessage ? (
          <div color="green">Success: {successMessage}</div>
        ) : null}
      </main>
    </div>
  );
};

export default Home;
