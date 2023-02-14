import { contractAbi, contractAddress, nftContractAbi, nftContractAddress } from "../constants"; 
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
    const signerForAmount = await getProviderOrSigner(true); 
    const address = await signerForAmount.getAddress(); 
    if (signer) {
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
  
    return { mtkContract, provOrSigner, address }; 

  } catch (error){
    console.error(error)
  }
}

export const moensNftContract = async (signer) => {
  try {
    let nftContract;  
    const provOrSigner = await getProviderOrSigner(signer); 
    const signerForAmount = await getProviderOrSigner(true); 
    const address = await signerForAmount.getAddress(); 
    if (signer) {
      nftContract = new Contract(
        nftContractAddress, 
        nftContractAbi, 
        provOrSigner
      );  
    } else {
      nftContract = new Contract(
        nftContractAddress, 
        nftContractAbi, 
        provOrSigner
      )
    } 
  
    return { nftContract, provOrSigner, address };  
  } catch (error){
    console.error(error)
  }
}
