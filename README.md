# Hardhat Fund Me Project
<sub>Disclaimer: This project was coded as a part of the Blockchain, Solidity & Hardhat course by Free Code camp for learining purposes</sub>

## Overview
This project entails the core logic of a crowd funding application. It allows users to send funds to the smartcontract and it keeps track of the differnt addresses that has sent funds along with a mapping of the amount of funds each addresses have sent.

## Tech used and learnings:
1. Hardhat for setting up the development enviroment.
2. `harhat-deploy` plugin to make deploying scripts and contracts less cumbersome as it keeps track of all deployed contracts.
3. `@nomicfoundation/hardhat-toolbox` plugin to avail various tools such as the `gas-reporter` for gas expenditure detalis, `coverage` for analysing testing coveragea and other tools like `Chai`, `ethereum-waffle` that aid in writing tests.
4. `@chainlink/contracts` to connect to the ChainLink DON and have access to price feeds. (V3Aggregator)


