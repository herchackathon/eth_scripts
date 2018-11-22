require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');

const web3 = require('web3');

const mainnetUrl = `https://mainnet.infura.io/${process.env.INFURA}`;
const ropstenUrl = `https://ropsten.infura.io/${process.env.INFURA}`;

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
      gas: 7000000,
      gasPrice: web3.utils.toWei('2', 'gwei'),
    },
    ropsten: {
      provider() {
        return new HDWalletProvider(process.env.MNEMONIC, ropstenUrl, 0);
      },
      network_id: 3,
      gasPrice: web3.utils.toWei('50', 'gwei'),
      gas: 8000000,
    },
    live: {
      provider() {
        return new HDWalletProvider(process.env.MNEMONIC, mainnetUrl, 0);
      },
      network_id: 1,
      gasPrice: web3.utils.toWei('2', 'gwei'),
      gas: 7992222,
    },
  },
  mocha: {
    useColors: true,
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
