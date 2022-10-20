require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: {
      default: 0,
    },
    deployerOne: {
      default: 1,
    },
  },
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 5,
      blockConfirmations: 6,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
  },
  solidity: "0.8.17",
  gasReporter: {
    enabled: true,
    outputFile: "./gasReport.txt",
    noColors: true,
    token: "ETH",
  },
};
