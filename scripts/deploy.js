// Contract address: 0x644F94c2d99428b89Bc0D161f5Dd8C64c169BC27
// Contract address:  0x88B46D4C174a7FB14705cdE6C7A21eC4664a6530

const { ethers } = require("hardhat"); 
require("dotenv").config({ path: ".env" }); 
const { MOENSNFT_CONTRACT_ADDRESS } = require('../constants'); 

async function main() {
    const contractFactory = await ethers.getContractFactory("MoensToken"); 
    const deployedContract = await contractFactory.deploy(MOENSNFT_CONTRACT_ADDRESS); 
    
    await deployedContract.deployed(); 

    console.log("Moens Token contract address: ", deployedContract.address); 

    await deployedContract.mint(1, {
      value: ethers.utils.parseEther("0.001")
    }); 

    await deployedContract.claim(); 
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });