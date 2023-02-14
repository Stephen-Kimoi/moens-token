import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { contractAddress } from "../constants"; 
import { moensNftContract, moensTokenContract } from './contractInstance';
import { BigNumber, utils } from 'ethers';
// import { ethers } from 'ethers';

function App() {
  const [walletConnected, setWalletConnected] = useState(); 
  const [walletAddress, setWalletAddress] = useState(); 
  const [currentChainId, setCurrentChainId] = useState(""); 
  const [ethAmount, setEthAmount] = useState(0);  
  const [mtkAmount, setMtkAmount] = useState(0);
  const [ethBalance, setEthBalance] = useState(0); 
  const [mtkBalance, setMtkBalance] = useState(0); 
  const [mintedMTK, setMintedMtk] = useState(0); 
  const [unmintedMtk, setUnmintedMtk] = useState(0); 
  const [buyTab, setBuyTab] = useState(false); 
  const [claimTab, setClaimTab] = useState(false); 
  const [nftBalance, setNftBalance] = useState(0); 

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
    // window.location.reload(); 
  } 

  const getBalances = async () => {
    console.log('Getting balances...'); 
    try {
      const { mtkContract, provOrSigner, address } = await moensTokenContract(false); 
      const mintedTokens = await mtkContract.totalSupply(); 
      const ethBalanceBigNum = await provOrSigner.getBalance(address); 
      const addressBalance = await mtkContract.balanceOf(address); 
      const remainingTokens = 10000 - utils.formatEther(mintedTokens); 
      // const remainingTokens = await mtkContract2.calculateRemainingSupply(); 
      setUnmintedMtk(remainingTokens); 
      setMintedMtk(utils.formatEther(mintedTokens)); 
      setMtkBalance(utils.formatEther(addressBalance));
      setEthBalance(utils.formatEther(ethBalanceBigNum)); 
      console.log('Eth : ', utils.formatEther(ethBalanceBigNum)); 
    } catch(error){
      console.error(error); 
    }
  }

  const mintToken = async () => {
    console.log("Minting token...")
    try {
      const { mtkContract }  = await moensTokenContract(true); 
      const tx = await mtkContract.mint(mtkAmount, {
        value: utils.parseEther(ethAmount.toString())
      }); 
      console.log("Sending tokens...."); 
      await tx.wait(); 
      
      console.log("Tokens bought succesfully!"); 
      getBalances(); 
      setEthAmount(0); 
    } catch (error){
      console.error(error)
    }
  }

  const nftBalances = async () => {
    console.log("Getting nft balance..."); 
    try {
      console.log("That will cost you: ", ethAmount); 
      const { nftContract ,provOrSigner, address} = await moensNftContract(false); 
      const addressBalance = await nftContract.balanceOf(address); 
      console.log("Nft balance is: ", Number(addressBalance)); 
      setNftBalance(Number(addressBalance)); 
    } catch(error){
      console.error(error)
    }
  }

  useEffect(() => {
    getBalances(); 
    nftBalances(); 
  })

  return (
    <div className="App">
   
      <div className="card">
        <h1>Moens<br/>Tokens</h1>
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

        <div className='balances'>

            <div className='account-balances'>
              <h2>YOUR BALANCE</h2>
              <p>Your ETH balance is: { ethBalance } </p>
              <p>Your MTK balance is: { mtkBalance } </p>
            </div>

            <div className='reserve-balances'>
              <h2>MTK RESERVE BALANCE</h2>
              <p>Total minted MTK tokens are: { mintedMTK } </p>
              <p>Remaining MTK tokens to be minted are: { unmintedMtk } </p>
            </div>
            
        </div>

        {
          !walletConnected && (
            <div className='warning'>
              Connect your wallet to continue
            </div>
          )
        }

        { 
          walletConnected  && (
            <div className='buttons'>
               <button
                onClick={ () => { 
                  setBuyTab(curr => !curr)
                  setClaimTab(false)
                }}
               >
                  Buy Tokens
               </button> 

               <button 
                onClick={ () => { 
                  setClaimTab(curr => !curr)
                  setBuyTab(false)
                }} 
               >
                 Claim Tokens
               </button>
            </div>
          )
        }
      
      {
        walletConnected && buyTab && (
          <div className='mint'>
            <div>
              <input 
                type="number"
                placeholder="Amount of MTK you want"
                onChange={ (e) => { 
                  setEthAmount(e.target.value * 0.001); 
                  setMtkAmount(e.target.value); 
                }}
              />
              <button onClick={mintToken}>
                Buy Token
              </button>
              <p>
                That will cost you { ethAmount } ETH 
              </p>
            </div>
          </div>
        )
      }

      {
        walletConnected && claimTab && (
          <div>
            <p>You have { nftBalance } Moens NFTs</p>
            <p>Buy <a href='https://moens-nft-collection.netlify.app/'> Moens NFTs </a></p>
            <p></p>
          </div>
        )
      }
    </div>
  )
}

export default App
