// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library Conversion {
    function getLatestPrice(AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint256)
    {
        (, int price, , , ) = priceFeed.latestRoundData();
        return uint256(price * 1e10);
    }

    function getConversionRate(
        uint256 _ethValue,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getLatestPrice(priceFeed);
        uint256 ethInUsd = (_ethValue * ethPrice) / 1e18;
        return ethInUsd;
    }
}
