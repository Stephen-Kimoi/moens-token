import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { contractAddress } from "../constants"; 
import { moensNftContract, moensTokenContract } from './contractInstance';
import { BigNumber, utils } from 'ethers';
import Loader from './Loader/Loader';
import { BallTriangle } from 'react-loader-spinner'; 
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
  const [mtkToBeClaimed, setMtkToBeClaimed] = useState(0); 
  const [loading, setLoading] = useState(false); 
  const [success, setSuccess] = useState(false); 
  const [error, setError] = useState(false); 
  const [nftsAmout, setNftsAmount] = useState(0); 
  const [ballTriangle, setBallTriangle] = useState(false); 
  const [goerli, setGoerli] = useState(true); 
  const [claimedNFTAmount, setClaimedNFTAmount] = useState(0); 
  const [redeemNFTs, setRedeemNFTs] = useState(false); 
 
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
    setLoading(true); 
    setBallTriangle(true); 
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
      const chainId = await ethereum.request({ method: "eth_chainId" });  

      if (chainId != 5){
        setGoerli(false); 
      }
   
      setChainName(); 
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false); 
      }, 5000); 
    } catch (error) {
      console.error(error)
      setTimeout(() => {
        setError(true); 
      }, 5000); 
      setError(false)
    }  
    setLoading(false); 
    setBallTriangle(false); 
  } 

  const changeChainId = async () => {
    const { ethereum } = window; 
    const chainId = await ethereum.request({ method: "eth_chainId" });  
    setBallTriangle(true); 
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain", 
        params: [{ chainId: "0x5" }], 
      }); 
      setGoerli(true); 
    } catch(error) {
      console.error(error)
      setError(true); 
    }
    setChainName(); 
    connectWallet(); 
    setBallTriangle(false); 
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
    setLoading(true); 
    setBallTriangle(true); 
    try {
      const { mtkContract }  = await moensTokenContract(true); 
      const tx = await mtkContract.mint(mtkAmount, {
        value: utils.parseEther(ethAmount.toString()),
        gasLimit: 100000,
      }); 
      console.log("Sending tokens...."); 
      await tx.wait(); 
      
      console.log("Tokens bought succesfully!"); 
      getBalances(); 
      setEthAmount(0); 
      setSuccess(true); 
      setTimeout(() => {
        setSuccess(false)
        setLoading(false)
        setBallTriangle(false)
      }, 5000)
    } catch (error){
      console.error(error)
      setError(true); 
      setTimeout(() => {
        setError(false)
        setLoading(false)
        setBallTriangle(false)
      }, 5000)
    }
  }

  const nftBalances = async () => {
    console.log("Getting nft balance..."); 
    try {
      const { nftContract ,provOrSigner, address} = await moensNftContract(false); 
      const addressBalance = await nftContract.balanceOf(address); 
      setNftBalance(Number(addressBalance)); 
      setMtkToBeClaimed(Number(addressBalance) * 10); 

      if (claimedNFTAmount === nftBalance){
        setRedeemNFTs(true)
      } else {
        setRedeemNFTs(false)
      }

    } catch(error){
      console.error(error)
    }
  } 

  const claimNfts = async () => {
    console.log('Claiming tokens...'); 
    setLoading(true)
    setBallTriangle(true); 
    try {
      const { mtkContract } = await moensTokenContract(true); 
      const tx = await mtkContract.claim(nftsAmout, {
        gasLimit: 100000, 
      }); 
      console.log("Sending your tokens..."); 
      await tx.wait(); 
      console.log('Tokens sent succesfully!'); 
      getBalances(); 
      // getNftsBalance(); 
      setSuccess(true); 
      let claimedNfts; 
      const currentValue = localStorage.getItem(claimedNfts); 
      const newValue = currentValue ? parseInt(currentValue) + parseInt(nftsAmout) : nftsAmout; 
      localStorage.setItem(claimedNfts, newValue.toString()); 
      console.log("New value: ", newValue); 
      setClaimedNFTAmount(curr => parseInt(curr) + parseInt(newValue)); 
      // setClaimedNFTAmount(newValue); 
      setTimeout(() => {
        setSuccess(false)
        setLoading(false)
        setBallTriangle(false)
      }, 5000)      
    } catch(error) {
      console.error(error)
      setError(true); 
      setTimeout(() => {
        setError(false)
        setLoading(false)
        setBallTriangle(false)
      }, 5000)
    }
  }

  const setClaimedNft = () => {
    let claimedNfts; 
    const currentValue = localStorage.getItem(claimedNfts);
    setClaimedNFTAmount(currentValue);
  }

  useEffect(() => {
    getBalances(); 
    nftBalances(); 
    setClaimedNft(); 
  })

  return (
    <div className="App">
   
      <div className="card">

        <div className="header">
        <h1>Moens Tokens</h1>
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
      
       
        <div className='body'> 
          {
            loading && (
              <Loader loading={loading} success={success} error={error} currentChainId={currentChainId}/>
            )
          }

          {
            !goerli && (
              <div className='goerli'>
                Switch to goerli
              </div>
            )
          }

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
            !walletConnected && !ballTriangle && (
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
          walletConnected && buyTab && !ballTriangle && (
            <div className='mint'>
              <h2>Buy Tokens</h2>
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
          walletConnected && claimTab && !ballTriangle && (
            <div> 
              <h2>Claim Tokens</h2>

              <div>
                <p>You have { nftBalance } Moens NFTs.<br/>
                  So far you've already redeemed { claimedNFTAmount } NFTs
                </p>
              </div>

              <div>
                <p>You can only claim a total of { mtkToBeClaimed } Moens Tokens.
                  Buy more <a href='https://moens-nft-collection.netlify.app/'> Moens NFTs </a>
                </p>
                
                {
                  redeemNFTs ? (
                    <div className='warning redeem'>
                      <p>
                      You've redeemed all your NFTs<br/>
                      Buy more <a href='https://moens-nft-collection.netlify.app/'> Moens NFTs </a>
                      </p>
                    </div>
                  ) : (
                    <div>
                    <input 
                      className='claim-input'
                      type="number"
                      placeholder="Number of NFTs"
                      onChange={ (e) => { 
                        setNftsAmount(e.target.value ); 
                      }}
                    />

                    <button onClick={claimNfts}>
                      Claim your tokens
                    </button>
                </div>
                  )
                }

              </div>

            </div>
          )
        }

        { ballTriangle && (
            <BallTriangle
              height="100"
              width="100"
              color="rgba(105,26,103,1)"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              outerCircleColor=""
              innerCircleColor=""
              barColor=""
              ariaLabel='circles-with-bar-loading'
            />
          )
        }

      </div>
    </div>
    </div>
  )
}

export default App
