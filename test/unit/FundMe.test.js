const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Fund me contract tests", function () {
      let fundMe;
      let mockV3Aggregator;
      let deployer;
      const sendValue = ethers.utils.parseEther("1");

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });

      describe("Constructor", function () {
        it("Assigned the correct price feed contract addresses", async function () {
          const response = await fundMe.getPriceFeed();
          assert.equal(response, mockV3Aggregator.address);
        });
      });

      // fund function tests
      describe("Fund funciton tests", function () {
        it("It should fail when enough eth is not sent", async function () {
          //   await fundMe.fund();
          await expect(fundMe.fund()).to.be.revertedWith(
            "Did not send enought Ether"
          );
        });

        it("Add the deployer address to funders list", async function () {
          await fundMe.fund({ value: sendValue });
          const response = await fundMe.getFunders(0);
          assert.equal(response, deployer);
        });

        it("updated the funded amount data structure", async function () {
          await fundMe.fund({ value: sendValue });
          const response = await fundMe.getFundersToAmount(deployer);
          assert.equal(response.toString(), sendValue.toString());
        });
      });

      // withdraw function tests
      describe("Withdraw", function () {
        beforeEach(async function () {
          await fundMe.fund({ value: sendValue });
        });

        it("withdrawn amount is correct", async function () {
          //Arrange
          //inital balances
          const initialFundMeBalance = await ethers.provider.getBalance(
            fundMe.address
          );
          const initialDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          //Act
          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);

          //Assert
          //Get the updated balances
          const updatedFundMeBalance = await ethers.provider.getBalance(
            fundMe.address
          );
          const updatedDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          assert.equal(
            initialFundMeBalance.add(initialDeployerBalance).toString(),
            updatedDeployerBalance.add(gasCost).toString()
          );
          assert.equal(updatedFundMeBalance, 0);
        });

        it("Fund amount data structure should be reset", async function () {
          await fundMe.withdraw();
          const response = await fundMe.getFundersToAmount(deployer);
          assert.equal(response.toString(), "0");
        });

        it("should reset the list of funders", async function () {
          let accounts = await ethers.getSigners();
          accounts = accounts.slice(1, 5);
          accounts.forEach(async (acc) => {
            const connectedFundMe = await fundMe.connect(acc);
            await connectedFundMe.fund({ value: sendValue });
          });

          const funders = await fundMe.getFunders(0);
          console.log(funders);
          const transactionReceipt = await fundMe.withdraw();
          await transactionReceipt.wait(1);
          await expect(fundMe.getFunders(0)).to.be.reverted;
        });

        //Cheaper withdraw
        it("withdrawn amount is correct using cheaper withdraw", async function () {
          //Arrange
          //inital balances
          const initialFundMeBalance = await ethers.provider.getBalance(
            fundMe.address
          );
          const initialDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          //Act
          const transactionResponse = await fundMe.cheaperWithdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);

          //Assert
          //Get the updated balances
          const updatedFundMeBalance = await ethers.provider.getBalance(
            fundMe.address
          );
          const updatedDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          assert.equal(
            initialFundMeBalance.add(initialDeployerBalance).toString(),
            updatedDeployerBalance.add(gasCost).toString()
          );
          assert.equal(updatedFundMeBalance, 0);
        });
      });
    });
