// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.10;
pragma experimental ABIEncoderV2;

interface IPriceOracle {
    function getUnderlyingPrice(address cToken) external view returns (uint256);

    function postPrices(
        bytes[] calldata messages,
        bytes[] calldata signatures,
        string[] calldata symbols
    ) external;
}
