const Web3 = require("web3"); 
const { utils } = require("ethers"); 
require("dotenv").config({ path: ".env" }); 
const { MOENSNFT_CONTRACT_ADDRESS, contractAbi, contractAddress } = require('./constants')

const accountAddress = process.env.ACCOUNT_ADDRESS; 
const privateKey = process.env.PRIVATE_KEY; 


const web3 = new Web3(`https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`); 
const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);  
web3.eth.accounts.wallet.add(privateKey); 

const mintTokens = async() => {

    const mint = await contractInstance.methods.mint(1).send( 
        {
            from: accountAddress, 
            value: utils.parseEther("0.1"), 
            gasPrice: "20000000000",
            gas: "21204",
            debug: true, 
        }
    )
    
    console.log(mint); 
}

mintTokens(); 