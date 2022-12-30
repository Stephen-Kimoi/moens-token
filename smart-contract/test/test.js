const { ethers } = require("hardhat"); 
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers"); 
const { expect } = require("chai"); 
const { useAccount } = require("@nomiclabs/hardhat-waffle"); 
// const { utils } = require("ethers"); 
// const { MOENSNFT_CONTRACT_ADDRESS } = require("../constants"); 

const MOENSNFT_CONTRACT_ADDRESS = "0xA8E18CB9D8dbA3f225a833110f29eB975763B685"

describe("Moens Token Contract", function() {
    async function deployContract() {
        const [owner, addressOne] = await ethers.getSigners(); 
        const moensTokenContract = await ethers.getContractFactory("MoensToken"); 
        const deployedContract = await moensTokenContract.deploy(MOENSNFT_CONTRACT_ADDRESS); 

        await deployedContract.deployed(); 

        return { deployedContract, owner, addressOne }
    }

    it("Mint function should emit a transfer event", async function() {
        const { deployedContract, owner, addressOne } = await loadFixture(deployContract); 

        await expect(deployedContract.mint(1, { value: ethers.utils.parseEther("0.01")}))
        .to.emit(deployedContract, "Transfer"); 
    })
    
    // Can't tun since claim() function has an error
    it("Should successfully mint the NFTs of the owner and emit a transfer event", async function() {
        const { deployedContract, owner } = await loadFixture(deployContract); 
        const accountAddress = "0x13Ef924EB7408e90278B86b659960AFb00DDae61"; 

        await expect(
            deployContract.useAccount(accountAddress).claim()
        ).to.emit(deployedContract, "Transfer"); 
    })

})