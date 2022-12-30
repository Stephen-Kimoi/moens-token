const { ethers } = require("hardhat"); 
require("dotenv").config({ path: ".env" }); 
const { MOENSNFT_CONTRACT_ADDRESS } = require('../constants'); 

async function main() {
    const contractFactory = await ethers.getContractFactory("MoensToken"); 
    const deployedContract = await contractFactory.deploy(MOENSNFT_CONTRACT_ADDRESS); 
    
    await deployedContract.deployed(); 

    console.log("Moens Token contract address: ", deployedContract.address); 
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });