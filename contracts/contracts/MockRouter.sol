// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockRouter {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256, // amountOutMin (ignored)
        address[] calldata path,
        address to,
        uint256 // deadline (ignored)
    ) external returns (uint256[] memory amounts) {
        IERC20(path[1]).transfer(to, amountIn);

        amounts = new uint256[](2);
        amounts[0] = amountIn;
        amounts[1] = amountIn;
    }
}