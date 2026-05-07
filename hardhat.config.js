require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config();
require("./tasks");
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy-ethers");
require("hardhat-deploy");

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  mocha: {
    timeout: 300000, // 5 minutes
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL || "",
      /* url : "https://eth-sepolia.g.alchemy.com/v2/your-api-key",
         url: "https://sepolia.infura.io/v3/your-project-id"
      */
      accounts: PRIVATE_KEY ? [PRIVATE_KEY, PRIVATE_KEY_1].filter(Boolean) : [],
      chainId: 11155111,
    },
  },
  solidity: "0.8.24",
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    firstAccount: {
      default: 0, // here this will by default take the first account as deployer
    },
    secondAccount: {
      default: 1, // here this will by default take the second account as deployer
    },
  },
  gasReporter: {
    enabled: false,
  }
};
