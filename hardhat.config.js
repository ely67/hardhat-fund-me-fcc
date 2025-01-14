require("@nomiclabs/hardhat-waffle")
require("dotenv").config()
require("hardhat-deploy")
require("@nomiclabs/hardhat-etherscan")
require("./tasks/block-number")
require("hardhat-gas-reporter")
require("solidity-coverage")
require('@openzeppelin/hardhat-upgrades');

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL 
const PRIVATE_KEY = process.env.PRIVATE_KEY 
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY


/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
        chainId: 31337,
        // gasPrice: 130000000000,
    },
    sepolia: {
        url: SEPOLIA_RPC_URL,
        accounts: [PRIVATE_KEY],
        chainId: 11155111,
        blockConfirmations: 6,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      
      chainId: 31337,
      
     },
    },
    etherscan: {
      apiKey: ETHERSCAN_API_KEY,
      // customChains: [], // uncomment this line if you are getting a TypeError: customChains is not iterable
  },

    solidity: {
      compilers: [
        {
            version: "0.8.19",
        },
        {
            version: "0.6.6",
        },
      ],
  },
    namedAccounts: {
      deployer: {
        default: 0, 
        
      },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
};
