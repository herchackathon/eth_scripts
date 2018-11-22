# eth_scripts

## Installation

Clone the repo and run `npm install` to install all the dependencies.

*Note: Please be sure to have Truffle and Ganache-cli installed on your computer.*

## Test

To run a test, first you need to run a local network. A basic Ganache instance can be launched with `npm run ganache`. Then, in another terminal window, simple run `truffle test test/filename.js`.

## Deploy

To deploy to a network (Ropsten or Mainnet), you need to create a `.env` file in your local repo.
The `.env` needs to contain the following:

```
MNEMONIC=your mnemonic goes here
INFURA=Put your INFURA API key here
```

Then, simple run `truffle migrate --network ropsten` or `truffle migrate --network live` to deploy the contract.
You can edit the `migrations/2_deploy_contracts.js` file to chose the contracts that will be deployed.
Also, you can edit `truffle.js` to change parameters, such as gas or gas price.
