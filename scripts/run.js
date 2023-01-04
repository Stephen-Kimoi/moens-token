const { ethers} = require("hardhat"); 
const { MOENSNFT_CONTRACT_ADDRESS } = require('../constants')


async function main() {
    const contractFactory = await ethers.getContractFactory("MoensToken"); 
    const deployedContract = await contractFactory.deploy(MOENSNFT_CONTRACT_ADDRESS); 
    
    await deployedContract.deployed(); 

    let txn1 = await deployedContract.mint(
        1, 
        { value: ethers.utils.parseEther("0.001")}
    )

    await txn1.wait(); 

    let txn2 = await deployedContract.withdraw(); 

    await txn2.wait(); 

    let txn3 = await deployedContract.claim(); 

    await txn3.wait(); 
}

const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
runMain();