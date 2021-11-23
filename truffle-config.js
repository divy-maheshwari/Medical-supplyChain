const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = "https://rinkeby.infura.io/v3/e8480bab06e3446b91128720fd85dd0d";
module.exports = {
  contracts_directory: './src/contracts/',
  contracts_build_directory: "./src/build/contracts/",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby:{
      provider: function(){return new HDWalletProvider("spend never fatal clay wedding vicious puppy laptop organ reopen rice stamp",infuraKey) ;},
      network_id:'*',
      gas:4500000,
      gasPrice:1000000000,
    }
  },
  compilers: {
    solc: {
      version: "^0.8.9",
      optimiser: {
        enabled: true,
        runs: 200
      }
    }
  }
};