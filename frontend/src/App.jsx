import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { contractAbi, contractAddress } from "../constants"; 

function App() {
  const [count, setCount] = useState(0)
  const [walletConnected, setWalletConnected] = useState(); 
  const [walletAddress, setWalletAddress] = useState(); 

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
      getAmounts(); 

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
    
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
