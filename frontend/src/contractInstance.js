
export const getProviderOrSigner = async (needSigner = false) => {
    try {
      const { ethereum } = window; 
      let signer; 
      let provider; 

      if(ethereum){
        provider = new ethers.providers.Web3Provider(ethereum); 
        if (needSigner){
          signer = provider.getSigner(); 
          return signer; 
        } 
        return provider; 
      }
    } catch(error) {
      console.error(error); 
    }
  }
