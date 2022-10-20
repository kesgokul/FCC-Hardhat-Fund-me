const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");

async function deployfunc({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  log(chainId);

  let ethUsdPriceFeedAddress;
  if (chainId == 31337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
  }

  log("-----------------------------------------------------------");
  log("Deploying FundMe");
  const fundMe = await deploy("FundMe", {
    contract: "FundMe",
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log(`FundMe deployed at: ${fundMe.address}`);
  log("------------------------------------------------------------");
}

module.exports = deployfunc;
module.exports.tags = ["all", "fund"];
