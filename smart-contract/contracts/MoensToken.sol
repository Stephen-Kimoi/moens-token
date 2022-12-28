// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0; 

import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; 
import "@openzeppelin/contracts/access/Ownable.sol"; 
import './IMoensNFTs.sol'; 

import "hardhat/console.sol"; 

contract MoensToken is ERC20, Ownable {
    uint256 public constant tokenPrice = 0.001 ether; 
    uint256 public constant tokenPerNft = 10 * 10**18; 
    uint256 public constant maxTotalSuppy = 10000 * 10**18; 
    IMoensNFTs MoensNFT; 

    constructor(address _MoensNftContract) ERC20("Moens Token", "MTK") {
      MoensNFT = IMoensNFTs(_MoensNftContract);    
    }

    function mint(uint256 amount) public payable {
        console.log("Amount is: ", amount); 
        uint256 _requiredAmount = tokenPrice * amount; 
        require(msg.value >= _requiredAmount, "Ether sent is not enough!"); 

        uint256 _amountWithDecimals = amount * 10**18; 
        require(
            (totalSupply() + _amountWithDecimals) <= maxTotalSuppy, 
            "Amount exceeds maximum total supply"
        );

        _mint(msg.sender, _amountWithDecimals); 
    } 

    receive() external payable {} 

    fallback() external payable {} 
}