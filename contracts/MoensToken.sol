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
    uint256 public remainingSupply; 
    address contractAddr; 
    uint256 nftBalance; 
    mapping (address => bool) claimedTokens; 
    mapping (address => uint256) claimedNfts; 
    // IMoensNFTs MoensNFT; 

    mapping (uint256 => bool) public tokenIdsClaimed;

    constructor(address _MoensNftContract) ERC20("Moens Token", "MTK") {
        // MoensNFT = IMoensNFTs(_MoensNftContract);    
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
    } 


    // THIS FUNCTION HAS AN ERROR
    function claim(uint256 _amount) public {
        
        address sender = msg.sender; 
        console.log("Sender is: ", sender); 
        uint256 balance = IMoensNFTs(contractAddr).balanceOf(sender); 
        console.log("Balance is: ", balance);
        
        require(balance > 0, "You do not own any Moens NFTs"); 

        require(claimedNfts[sender] <= 0, "You've claimed all your NFTs"); 

        require(claimedTokens[sender] != true, "You've claimed all your NFTs"); 

        // uint256 tokenId; 
        uint256 amount = _amount * tokenPerNft;
        claimedNfts[sender] = balance - _amount; 

        if (claimedNfts[sender] == 0){
           claimedTokens[sender] = true; 
        }

        // for(uint256 i = 0; i < balance; i++){
        //     // uint256 tokenId = MoensNFT.tokenOfOwnerByIndex(sender, i);
        //     tokenId = IMoensNFTs(contractAddr).tokenOfOwnerByIndex(sender, i);

        //     // if(!tokenIdsClaimed[tokenId]){
        //     //     amount += 1; 
        //     //     tokenIdsClaimed[tokenId] = true; 
        //     // }
        // }

        // return tokenId; 

        // require(amount > 0,"You have claimed all the tokens");

        _mint(msg.sender, amount); 

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