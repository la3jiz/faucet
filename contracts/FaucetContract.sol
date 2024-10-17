// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "./Owned.sol";
import "./IFaucet.sol";

contract Faucet is Owned, IFaucet {

uint public numOfFunders;
mapping(address=>uint256) public funders;
mapping(uint=>address) public lufunders;

modifier limitWithdraw(uint _amount){
    require(_amount<=100000000000000000,"cannot withdraw more than 0.1 ether");
    _;
}


function test1() public onlyOwner{}


function transferOwnership(address _newOwner) public onlyOwner{
    owner=_newOwner;
}


receive() external payable{}

function addFunds() override public payable{  
  if(funders[msg.sender]>0){
        funders[msg.sender]=funders[msg.sender]+ msg.value;
  }else{
      lufunders[numOfFunders]=msg.sender;
      numOfFunders++;
      funders[msg.sender]=msg.value;
  }

}

function withdraw(uint _amount) override public limitWithdraw(_amount){
    payable(msg.sender).transfer(_amount);
    
}

function getAllFunders() public view returns(address[] memory){
    address[] memory _funders=new address[](numOfFunders);
    for(uint i=0;i<numOfFunders;i++){
        _funders[i]=lufunders[i];
    }
    return _funders;
}








/*

uint public numOfFunders;
mapping(uint=>address) public funders;

receive() external payable{}

function addFunds() public payable{
    bool _funderExist=findFunderAddress(msg.sender);
    require(_funderExist == false, "Funder already exist !");
    uint index=numOfFunders++;
    funders[index]=msg.sender;
}

function getAllFunders() public view returns(address[] memory){
    address[] memory _funders=new address[](numOfFunders);
    for(uint i=0;i<numOfFunders;i++){
        _funders[i]=funders[i];
    }
    return _funders;
}



function findFunderAddress(address _funderAddress) public view returns(bool){
    address[] memory _funders=getAllFunders();
    bool _funderExist=false;
    for(uint i=0;i<_funders.length;i++){
        if(_funders[i]==_funderAddress){
            _funderExist=true;
            break;
        }
    }
    return _funderExist;
}

*/
    
}