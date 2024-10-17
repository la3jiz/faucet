// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

interface IFaucet{
    // they cannot inherit from other smart contracts
// they can only inherit from other interfaces

// They cannot declare a constructor
// They cannot declare state variables
// all declared functions have to be external

    function addFunds() external payable;
    function withdraw(uint _withdrawAmount) external;
} 