// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.10;

interface ICEther {
    function mint() external payable;

    function redeem(uint256 redeemTokens) external returns (uint256);

    function redeemUnderlying(uint256 redeemAmount) external returns (uint256);

    function borrow(uint256 borrowAmount) external returns (uint256);

    function repayBorrow() external payable;

    function repayBorrowBehalf(address borrower) external payable;

    function liquidateBorrow(address borrower, address cTokenCollateral)
        external
        payable;

    function balanceOfUnderlying(address account) external returns (uint256);

    function borrowBalanceCurrent(address account) external returns (uint256);
}
