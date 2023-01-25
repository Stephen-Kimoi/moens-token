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
    address contractAddr; 
    // IMoensNFTs MoensNFT; 

    mapping (uint256 => bool) public tokenIdsClaimed;

    constructor(address _MoensNftContract) ERC20("Moens Token", "MTK") {
    //   MoensNFT = IMoensNFTs(_MoensNftContract);    
        contractAddr = _MoensNftContract; 
    }

    function mint(uint256 amount) public payable {
        uint256 _requiredAmount = tokenPrice * amount; 
        require(msg.value >= _requiredAmount, "Ether sent is not enough!"); 

        uint256 _amountWithDecimals = amount * 10 ** 18; 
        require(
            (totalSupply() + _amountWithDecimals) <= maxTotalSuppy, 
            "Amount exceeds maximum total supply"
        );

        _mint(msg.sender, _amountWithDecimals); 

        console.log(msg.sender, " just got ", amount, " tokens"); 
    } 

    // THIS FUNCTION HAS AN ERROR
    function claim() public {
        
        address sender = msg.sender; 
        console.log("Sender is: ", sender); 
        uint256 balance = IMoensNFTs(contractAddr).balanceOf(sender); 
        console.log("Balance is: ", balance);

        require(balance > 0, "You do not own any Moens NFTs"); 

        uint256 amount = 0; 
        for(uint256 i = 0; i < balance; i++){
            // uint256 tokenId = MoensNFT.tokenOfOwnerByIndex(sender, i);
            uint256 tokenId = IMoensNFTs(contractAddr).tokenOfOwnerByIndex(sender, i);

            if(!tokenIdsClaimed[tokenId]){
                amount += 1; 
                tokenIdsClaimed[tokenId] = true; 
            }
        }

        require(amount > 0,"You have claimed all the tokens");

        _mint(msg.sender, amount * tokenPerNft); 

    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance; 
        require(amount > 0, "Nothing in the account to withdraw"); 

        address _owner = owner(); 
        (bool sent, ) = _owner.call{value: amount}(""); 

        require(sent, "Falied to transfer amount"); 

        console.log("Account: ", _owner, " just recieved ", amount); 
    }

    receive() external payable {} 

    fallback() external payable {} 
}