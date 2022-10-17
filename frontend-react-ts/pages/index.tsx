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
  const [signer, setSigner] = useState("");

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

        const res = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        await accountsChanged(res[0]);

        const signer = provider.getSigner(res[0]);

        setSigner(signer);
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

  const buyTokens = async () => {
    try {
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_TOKENIZEDBALLOT_CONTRACT_ADDRESS,
        abi.abi,
        signer
      );

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
          Balance: {balance} {balance ? "ETH" : null}
        </p>

        {errorMessage ? <div color="red">Error: {errorMessage}</div> : null}

        {account ? (
          <button type="button" onClick={buyTokens}>
            Purchase 0.01 Tokens
          </button>
        ) : null}

        {successMessage ? (
          <div color="red">Success: {successMessage}</div>
        ) : null}
      </main>
    </div>
  );
};

export default Home;
