// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

// It's a way for designer to say that
// "any child of the abstract contract has to implmenet speicifed methods"

abstract contract Logger {

  uint public testNum;

  constructor() {
    testNum = 1000;
  }

  function emitLog() public pure virtual returns(bytes32);

  function test3() external pure returns(uint) {
    return 100;
  }
}