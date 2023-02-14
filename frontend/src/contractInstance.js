import { contractAbi, contractAddress } from "../constants"; 
import Web3Modal, { providers } from "web3modal";
import { ethers, Contract } from 'ethers';

const getProviderOrSigner = async (needSigner = false) => {
    try {
      const web3Modal = new Web3Modal({
        network: "goerli", 
        providerOptions: {}, 
        disableInjectedProvider: false, 
      }); 

      const { ethereum } = window; 
      let signer; 
      let provider; 

      if(ethereum){
        const instance = await web3Modal.connect(); 
        provider = new ethers.providers.Web3Provider(instance); 

        if (needSigner){
          signer = provider.getSigner(); 
          return signer; 
        } 

        return provider; 
      } else {
        console.log('Kindly install metamask!'); 
      }
    } catch(error) {
      console.error(error); 
    }
}

export const moensTokenContract = async (signer) => {
  try {
    let mtkContract; 
    const provOrSigner = await getProviderOrSigner(signer); 
    if (signer) {
      console.log(signer)
      mtkContract = new Contract(
        contractAddress, 
        contractAbi, 
        provOrSigner
      );  
    } else {
      mtkContract = new Contract(
        contractAddress, 
        contractAbi, 
        provOrSigner
      )
    } 
  
    return mtkContract; 

  } catch (error){
    console.error(error)
  }
}
