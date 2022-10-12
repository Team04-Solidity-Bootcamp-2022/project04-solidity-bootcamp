# Project 03 - Encode Solidity Bootcamp

This project implements a tokenized version of Ballot contract.

Contracts implemented:
 - MyToken (ERC20 token having ERC20Votes extension)
 - TokenizedBallot (Ballot contract, adapted to use MyToken as voting power)

Scripts implemented for goerli:
 - Cast.ts
 - CheckVotingPower.ts
 - Delegate.ts
 - DeployTokenizedBallot.ts
 - DeployToken.ts
 - MintTokens.ts
 - QueryResults.ts

*Notes:*
 - .env file was used to get most of configs/addresses/private keys and so on
 - Format can be checked on .env.example

Try running some of the following tasks:

```shell
yarn install
yarn hardhat clean
yarn hardhat compile

# Deploy contracts, and perform several interactions (hardhat network)
yarn hardhat run scripts/TestDeployTokenizedBallot.ts
```
