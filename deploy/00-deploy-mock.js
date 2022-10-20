const { network } = require("hardhat");

const DECIMALS = 8;
const INITIAL_PRICE = 150000000000;

async function deployfunc({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (chainId == 31337) {
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      args: [DECIMALS, INITIAL_PRICE],
      log: true,
    });
  }
  log("Mocks deployed..!");
  log("----------------------------------------------------");
}

module.exports = deployfunc;
module.exports.tags = ["all", "mocks"];
