// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Swap {
    IUniswapV2Router02 public uniswapRouter;

    /// @param _router The address of a UniswapV2Router02–style contract
    constructor(address _router) {
        uniswapRouter = IUniswapV2Router02(_router);
    }

    /// @notice Swap an exact `amount` of `fromToken` for as many `toToken` as possible
    function swap(
        address fromToken,
        address toToken,
        uint256 amount
    ) external {
        require(amount > 0, "Amount must be > 0");

        // 1) Transfer tokens from caller to this contract
        IERC20(fromToken).transferFrom(msg.sender, address(this), amount);
        // 2) Approve the router to spend them
        IERC20(fromToken).approve(address(uniswapRouter), amount);

        // 3) Build the path array
        address[] memory path = new address[](2);
        path[0] = fromToken;
        path[1] = toToken;

        // 4) Execute the swap via injected router
        uniswapRouter.swapExactTokensForTokens(
            amount,
            0,             // accept any output amount
            path,
            msg.sender,    // send output tokens back to caller
            block.timestamp
        );
    }
}
