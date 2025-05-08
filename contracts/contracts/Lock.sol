// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

contract Lock {
    uint public unlockTime;
    address payable public owner;

    event Withdrawal(uint amount, uint when);

    constructor(uint _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function withdraw() public {
        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        uint amount = address(this).balance;
        emit Withdrawal(amount, block.timestamp);

        owner.transfer(amount);
    }

    // Optional: allow the contract to receive additional ETH after deployment
    receive() external payable {}
}
