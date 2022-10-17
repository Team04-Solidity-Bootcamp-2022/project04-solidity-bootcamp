# Project 04 - Encode Solidity Bootcamp

This project implements a voting DApp with the following features:
 - Cast votes
 - Delegate
 - Query Results on chain

## Backend - NestJS
- API specification (Swagger available on http://localhost:3000/docs):
  - **GET /get-contract-address** -> Returns current MyToken Address
  - **POST /add-whitelist** -> Adds a new user to the whitelist giving name and id
  - **POST /claim-tokens** -> Mints tokens on backend, for whitelisted users
  - **GET /query-results**
  - **GET /recent-votes**
  - **POST /read-contract**

Usage:
```shell
yarn install
yarn run start:dev
```
## Frontend - Angular
Several frontends were implemented:
- /frontend -> angular frontend (francisco's version)
- /frontend-stefano -> angular frontend (stefano's version)
- /frontend-react-ts (feature/patrick-branch)

Usage:
```shell
yarn install
ng serve
```
## Smart contracts - Hardhat

Contracts implemented:
 - MyToken (ERC20 token having ERC20Votes extension)
 - TokenizedBallot (Ballot contract, adapted to use MyToken as voting power)


Try running some of the following tasks:

```shell
yarn install
yarn hardhat clean
yarn hardhat compile

```

