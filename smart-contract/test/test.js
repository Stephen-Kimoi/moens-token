const { ethers } = require("hardhat"); 
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers"); 
const { expect } = require("chai"); 
// const { utils } = require("ethers"); 
// const { MOENSNFT_CONTRACT_ADDRESS } = require("../constants"); 

const MOENSNFT_CONTRACT_ADDRESS = "0xA8E18CB9D8dbA3f225a833110f29eB975763B685"

describe("Moens Token Contract", function() {
    async function deployContract() {
        const [owner, addressOne] = await ethers.getSigners(); 
        const moensTokenContract = await ethers.getContractFactory("MoensToken"); 
        const deployedContract = await moensTokenContract.deploy(MOENSNFT_CONTRACT_ADDRESS); 

        await deployedContract.deployed(); 

        return { deployedContract, owner }
    }

    it("Mint function should emit a transfer event", async function() {
        const { deployedContract, owner } = await loadFixture(deployContract); 

        await expect(deployedContract.mint(1, { value: ethers.utils.parseEther("0.01")}))
        .to.emit(deployedContract, "Transfer");  
    })

})