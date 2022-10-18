// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.10;
pragma experimental ABIEncoderV2;

import "./icompound/ICErc20.sol";
import "./icompound/ICEther.sol";

import "./uniswap/UniswapV2Library.sol";
import "./uniswap/IUniswapV2Factory.sol";
import "./uniswap/IUniswapV2Router02.sol";
import "./uniswap/IUniswapV2Callee.sol";
import "./uniswap/IUniswapV2Pair.sol";
import "./uniswap/IWETH.sol";

contract NearLiquidator is IUniswapV2Callee {
    using SafeERC20 for IERC20;

    address private constant ETHER = address(0);
    address private CETH;
    address private WETH;
    address private ROUTER;
    address private FACTORY;

    address payable private recipient;

    event RevenueWithdrawn(address recipient, address token, uint256 amount);

    constructor(
        address ceth,
        address weth,
        address router,
        address factory
    ) public {
        recipient = msg.sender;

        CETH = ceth;
        WETH = weth;
        ROUTER = router;
        FACTORY = factory;
    }

    function liquidate(
        address pair,
        uint256 amount0,
        uint256 amount1,
        bytes memory data
    ) public {
        IUniswapV2Pair(pair).swap(amount0, amount1, address(this), data);
    }

    /**
     * The function that gets called in the middle of a flash swap
     *
     * @param (address): the caller of `swap()`
     * @param amount0 (uint): the amount of token0 being borrowed
     * @param amount1 (uint): the amount of token1 being borrowed
     * @param data (bytes): data passed through from the caller
     */
    function uniswapV2Call(
        address,
        uint256 amount0,
        uint256 amount1,
        bytes calldata data
    ) external override {
        // Unpack parameters sent from the `liquidate` function
        // NOTE: these are being passed in from some other contract, and cannot necessarily be trusted
        (
            address borrower,
            address repayCToken,
            address seizeCToken,
            address[] memory path
        ) = abi.decode(data, (address, address, address, address[]));

        address token0 = IUniswapV2Pair(msg.sender).token0();
        address token1 = IUniswapV2Pair(msg.sender).token1();
        require(
            msg.sender == IUniswapV2Factory(FACTORY).getPair(token0, token1),
            "Incorrect Pair"
        );

        uint256 amount;
        address source;
        address estuary;
        if (amount0 != 0) {
            amount = amount0;
            source = token0;
            estuary = token1;
        } else {
            amount = amount1;
            source = token1;
            estuary = token0;
        }

        /*//////////////////////////////////////////////////////////////
                                LIQUIDATE
        //////////////////////////////////////////////////////////////*/
        if (repayCToken == CETH) {
            // Convert WETH to ETH
            IWETH(WETH).withdraw(amount);

            // Perform the liquidation
            ICEther(repayCToken).liquidateBorrow{value: amount}(
                borrower,
                seizeCToken
            );
        } else {
            // Perform the liquidation
            IERC20(source).safeApprove(repayCToken, amount);

            ICErc20(repayCToken).liquidateBorrow(borrower, amount, seizeCToken);
        }
        // Redeem cTokens for underlying ERC20
        // Compute debt and pay back pair

        /*//////////////////////////////////////////////////////////////
                                  REPAY
        //////////////////////////////////////////////////////////////*/
        if (seizeCToken == CETH) {
            // Swap WETH to NEAR then use NEAR to repay
            if (path.length > 0) {
                // Redeem cTokens for underlying ERC20 or ETH
                uint256 seized_uUnits = ICEther(CETH).balanceOfUnderlying(
                    address(this)
                );
                ICErc20(seizeCToken).redeem(
                    IERC20(seizeCToken).balanceOf(address(this))
                );

                (uint256 reserveOut, uint256 reserveIn) = UniswapV2Library
                    .getReserves(FACTORY, source, estuary);
                uint256 debt = UniswapV2Library.getAmountIn(
                    amount,
                    reserveIn,
                    reserveOut
                );

                IUniswapV2Router02(ROUTER).swapETHForExactTokens{
                    value: seized_uUnits
                }(debt, path, address(this), now + 1 minutes);
                // IERC20(seizeUToken).safeApprove(ROUTER, 0);

                // Pay back pair
                IERC20(estuary).transfer(msg.sender, debt);
            } else {
                // Convert ETH to WETH
                ICErc20(seizeCToken).redeem(
                    IERC20(seizeCToken).balanceOf(address(this))
                );

                IWETH(WETH).deposit{value: address(this).balance}();

                // Compute debt and pay back pair
                (uint256 reserveOut, uint256 reserveIn) = UniswapV2Library
                    .getReserves(FACTORY, source, WETH);
                IERC20(WETH).transfer(
                    msg.sender,
                    UniswapV2Library.getAmountIn(amount, reserveIn, reserveOut)
                );
            }
        } else if (repayCToken == seizeCToken) {
            // Redeem cTokens for underlying ERC20
            ICErc20(seizeCToken).redeem(
                IERC20(seizeCToken).balanceOf(address(this))
            );
            // Compute debt and pay back pair
            IERC20(estuary).transfer(msg.sender, ((amount * 1000) / 997) + 1);
        } else {
            if (path.length == 0) {
                // Redeem cTokens for underlying ERC20
                ICErc20(seizeCToken).redeem(
                    IERC20(seizeCToken).balanceOf(address(this))
                );

                (uint256 reserveOut, uint256 reserveIn) = UniswapV2Library
                    .getReserves(FACTORY, source, estuary);
                IERC20(estuary).transfer(
                    msg.sender,
                    UniswapV2Library.getAmountIn(amount, reserveIn, reserveOut)
                );
            } else {
                // Redeem cTokens for underlying ERC20 or ETH
                uint256 seized_uUnits = ICErc20(seizeCToken)
                    .balanceOfUnderlying(address(this));
                ICErc20(seizeCToken).redeem(
                    IERC20(seizeCToken).balanceOf(address(this))
                );
                address seizeUToken = ICErc20Storage(seizeCToken).underlying();

                // Compute debt
                (uint256 reserveOut, uint256 reserveIn) = UniswapV2Library
                    .getReserves(FACTORY, source, estuary);
                uint256 debt = UniswapV2Library.getAmountIn(
                    amount,
                    reserveIn,
                    reserveOut
                );

                if (seizeUToken == estuary) {
                    // Pay back pair
                    IERC20(estuary).transfer(msg.sender, debt);
                } else {
                    IERC20(seizeUToken).safeApprove(ROUTER, seized_uUnits);
                    IUniswapV2Router02(ROUTER).swapTokensForExactTokens(
                        debt,
                        seized_uUnits,
                        path,
                        address(this),
                        now + 1 minutes
                    );
                    IERC20(seizeUToken).safeApprove(ROUTER, 0);

                    // Pay back pair
                    IERC20(estuary).transfer(msg.sender, debt);
                }
            }
        }

        address seizeUToken = ICErc20Storage(seizeCToken).underlying();
        withdraw(seizeUToken);
    }

    function withdraw(address _assetAddress) public {
        uint256 assetBalance;
        if (_assetAddress == ETHER) {
            address self = address(this); // workaround for a possible solidity bug
            assetBalance = self.balance;
            recipient.transfer(assetBalance);
        } else {
            assetBalance = IERC20(_assetAddress).balanceOf(address(this));
            IERC20(_assetAddress).safeTransfer(recipient, assetBalance);
        }
        emit RevenueWithdrawn(recipient, _assetAddress, assetBalance);
    }
}
