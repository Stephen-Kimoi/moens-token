const { ethers} = require("hardhat"); 

const MOENSNFT_CONTRACT_ADDRESS = "0xA8E18CB9D8dbA3f225a833110f29eB975763B685"


async function main() {
    const contractFactory = await ethers.getContractFactory("MoensToken"); 
    const deployedContract = await contractFactory.deploy(MOENSNFT_CONTRACT_ADDRESS); 
    
    await deployedContract.deployed(); 

    let txn1 = await deployedContract.mint(
        1, 
        { value: ethers.utils.parseEther("0.001")}
    )

    await txn1.wait(); 
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