// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

/// @title Time-locked Ether vault
contract Lock {
    uint256 public unlockTime;
    address payable public owner;

    event Withdrawal(uint256 amount, uint256 when);

    constructor(uint256 _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    /// @notice Withdraws all Ether once the unlock time has passed
    function withdraw() external {
        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        uint256 amount = address(this).balance;
        emit Withdrawal(amount, block.timestamp);

        owner.transfer(amount);
    }

    /// @notice Allows the contract to receive Ether
    receive() external payable {}
}
