// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./lib/Conversion.sol";

error FundMe__NotOwner();
error FundMe_WithdrawFailed();

contract FundMe {
    using Conversion for uint256;

    uint256 constant MIN_USD_AMOUNT = 50;
    address[] private s_funders;
    address private immutable i_owner;
    mapping(address => uint256) private s_fundersToAmount;

    AggregatorV3Interface private s_priceFeed;

    constructor(address s_priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(s_priceFeedAddress);
    }

    modifier onlyOwner() {
        // require(msg.sender == owner, "You are not the owner");
        if (msg.sender != i_owner) revert FundMe__NotOwner(); // new gas optimized way
        _;
    }

    // Fallbacks
    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable {
        //1. get the conversion rate usd/eth
        //2. check if it meets the min usd val
        require(
            msg.value.getConversionRate(s_priceFeed) >= MIN_USD_AMOUNT,
            "Did not send enought Ether"
        );
        s_funders.push(msg.sender);
        s_fundersToAmount[msg.sender] = msg.value;
    }

    //Function to withdraw funds from the contract and reset the mapping of s_funders
    function withdraw() public onlyOwner {
        //1. reset mapping of s_fundersToAmount
        for (uint256 i = 0; i < s_funders.length; i++) {
            address funder = s_funders[i];
            s_fundersToAmount[funder] = 0;
        }

        //2. reset the s_funders array
        s_funders = new address[](0);

        //3. Withdraw the contract funds to the owner
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Transfer failed");
    }

    function cheaperWithdraw() public onlyOwner {
        address[] memory funders = s_funders;
        for (uint256 i = 0; i < funders.length; i++) {
            address funder = funders[i];
            s_fundersToAmount[funder] = 0;
        }

        s_funders = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        if (!callSuccess) revert FundMe_WithdrawFailed();
    }

    // view and pure functions
    function getFunders(uint256 _index) public view returns (address) {
        return s_funders[_index];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFundersToAmount(address _funder) public view returns (uint256) {
        return s_fundersToAmount[_funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
