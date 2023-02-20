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
    mapping (address => bool) addedAddress; 
    mapping (address => uint256) nftBalances; 
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


    function claim(uint256 _amount) public returns (string memory) {
        // uint256 balance = IMoensNFTs(contractAddr).balanceOf(msg.sender); 
        // nftBalances[msg.sender] = balance; 
        uint256 amount = _amount * tokenPerNft;

        if(addedAddress[msg.sender] == true){  
          uint256 addressBalance = nftBalances[msg.sender]; 
           require(addressBalance >= _amount, "Insufficient NFT balance to claim tokens!"); 
           _mint(msg.sender, amount); 
           nftBalances[msg.sender] -= _amount; 
        } else {
            uint256 balance = IMoensNFTs(contractAddr).balanceOf(msg.sender); 
            require(balance > 0, "You do not own any NFTs!"); 
            _mint(msg.sender, amount); 
            addedAddress[msg.sender] = true;
            nftBalances[msg.sender] = balance - _amount; 
        }

        return "Tokens sent"; 

        // require(balance > 0, "You do not own any Moens NFTs"); 
        // require(usersBalance >= _amount, "Insufficient NFT balance to claim tokens!"); 
        // uint256 amount = _amount * tokenPerNft;
        // _mint(msg.sender, amount); 

        // uint256 remainigNFTs = balance - _amount; 
        // nftBalances[msg.sender] = remainigNFTs; 

        // require(claimedTokens[msg.sender] != true, "You've claimed all your NFTs"); 
        // claimedTokens[msg.sender] = true; 
    }

    // function nftsRemaining() public view returns (uint256) {
    //     uint256 amount = claimedNfts[msg.sender]; 
    //     return amount; 
    // }

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