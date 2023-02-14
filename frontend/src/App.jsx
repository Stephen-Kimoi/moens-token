import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { contractAddress } from "../constants"; 
import { moensTokenContract } from './contractInstance';
import { utils } from 'ethers';
// import { ethers } from 'ethers';

function App() {
  const [count, setCount] = useState(0)
  const [walletConnected, setWalletConnected] = useState(); 
  const [walletAddress, setWalletAddress] = useState(); 
  const [currentChainId, setCurrentChainId] = useState(""); 


  const setChainName = async () => {
    try {
      const chainId = await ethereum.request({ method: "eth_chainId" }); 
      if (chainId == "0x1"){
        setCurrentChainId("Ethereum Mainnet")
      } else if (chainId == "0x3"){
        setCurrentChainId("Ropsten Test Network")
      } else if (chainId == "0x4"){
        setCurrentChainId("Rinkeby Test Network")
      } else if (chainId == "0x5"){
        setCurrentChainId("Goerli Test Network")      
      } else if (chainId == "0x2a"){
        setCurrentChainId("Kovan Test Netowork")      
      }
    } catch(error){
      console.error(error); 
    }
  }

  const connectWallet = async () => { 
    console.log("Connecting wallet")
    try { 
      const { ethereum } = window; 
      
      if(typeof ethereum !== "undefined"){
        console.log("Metamask installed")
      } else {
        window.alert("Kindly install metamask")
      } 

      const accounts = await ethereum.request({ method: "eth_requestAccounts" }); 
      const account = accounts[0]; 
      setWalletAddress(account); 
      
      setWalletConnected(true); 
      console.log("Account connected is: ", account); 

      setChainName(); 

    } catch (error) {
      console.error(error)
    }  
  } 

  const changeChainId = async () => {
    const { ethereum } = window; 
    const chainId = await ethereum.request({ method: "eth_chainId" });  
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain", 
        params: [{ chainId: "0x5" }], 
      }); 
    } catch(error) {
      console.error(error)
    }
    setChainName(); 
    connectWallet(); 
    window.location.reload(); 
  } 

  const getBalances = async () => {
    console.log('Getting balances...'); 
    try {
      const mtkContract = await moensTokenContract(false); 
      const mtkContract2 = await moensTokenContract(true); 
      const mintedTokens = await mtkContract.totalSupply(); 
      const addressBalance = await mtkContract.balanceOf("0x13Ef924EB7408e90278B86b659960AFb00DDae61"); 
      // const remainingTokens = await mtkContract2.calculateRemainingSupply(); 
      console.log('Minted tokens are: ', utils.formatEther(mintedTokens)); 
      console.log('Address balance is: ', utils.formatEther(addressBalance)); 
      // console.log('Remaining tokens: ', utils.formatEther(remainingTokens)); 
    } catch(error){
      console.error(error); 
    }
  }

  const mintToken = async () => {
    console.log("Minting token...")
    try {
      const mtkContract  = await moensTokenContract(true); 
      const tx = await mtkContract.mint(2, {
        value: utils.parseEther("0.002")
      }); 
      console.log("Sending tokens...."); 
      await tx.wait(); 
      
      console.log("Tokens bought succesfully!"); 
      getBalances(); 
    } catch (error){
      console.error(error)
    }
  }

  useEffect(() => {
    getBalances(); 
  })

  return (
    <div className="App">
      <h1>Moens Tokens</h1>
   
      <div className="card">
        {
          walletConnected ? (
            <p>
              { walletAddress }
            </p>
          ) : (
            <button onClick={connectWallet}>
              Connect Wallet
            </button>
          )
        }

        {
          walletConnected && currentChainId != "Goerli Test Network" && (
            <button onClick={changeChainId}>
               Switch to goerli
            </button>
          )
        }
      </div> 
      
      {
        walletConnected && (
          <div className='mint'>
            <div>
              <input 
                type="number"
                placeholder="Amount of MTK you want"
                onChange={ (e) => {
                  
                }}
              />
              <button onClick={mintToken}>
                Buy Token
              </button>
            </div>
          </div>
        )
      }
      
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
