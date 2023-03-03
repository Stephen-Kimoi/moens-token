// Contract address: 0x644F94c2d99428b89Bc0D161f5Dd8C64c169BC27
// Contract address:  0x88B46D4C174a7FB14705cdE6C7A21eC4664a6530
// Moens Token contract address:  0xBBB42E7d7563EB7776a8ca59fc7C022f9D831d08
// Moens Token contract address:  0x9d8B187243d08885fCCF5654350A3C2636c3FcE6
// Moens Token contract address:  0xf9cC2fADB876dE6F427bf212f3906181968e5489
// Moens Token contract address:  0xEF8B47AD932032dcCF234Ca6F2CC4fa28323772a
// Moens Token contract address:  0xcE7d4c2ee2deA91623Ee4E7143d5bDA982471435
// Moens Token contract address:  0x83ECee941C67C3BE17EC689e66F7C956153B19CF
// Moens Token contract address:  0x930586348BbF2c46F0603D70af8c597094533dEB
// Moens Token contract address:  0x619d3A8A0c47b42a09dc5ae8fEb73b01cFb82108
// Moens Token contract address:  0x62F0371059f298af6aBB5cD41FCD506667223083
// Moens Token contract address:  0xbD521EcF42F312f91718521Ac140BFB9Df7a9BB6
// Moens Token contract address:  0xf7bf855BA61E29679733a97d24892E10f897194b
// Moens Token contract address:  0x08E3f9c55413758b71887294910eaD42ABD6b5bb
// Moens Token contract address:  0xfdF5c153c2C1Bd24DE5021D7d396C04AB3A1534f

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

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });