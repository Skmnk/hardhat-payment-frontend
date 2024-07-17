
import {ethers} from "./ethers-5.2.esm.min.js"
import {abi, contractAddress} from "./constant.js"


const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("getBalance");
const withdrawButton =  document.getElementById("withdraw");

connectButton.onclick = connect;

fundButton.onclick = fund;

balanceButton.onclick = getBalance

withdrawButton.onclick = withdraw

//console.log(ethers);

async function connect() {
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Meta Mask Connected Successfully");
      connectButton.innerHTML = "Connected";
    } else {
      connectButton.innerHTML = "Please Install Metamask";
    }
  }

  async function fund(){
    const ethAmount = document.getElementById("ethAmount").value
     console.log(`Funding with ${ethAmount} eth ...`);
    if (typeof window.ethereum !== "undefined") {
      const provider =  new ethers.providers.Web3Provider(window.ethereum) // getting api form meta mask
      const signer =  provider.getSigner();  //get signer from the API 
      //console.log(signer)
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try{
      const transactionResponse = await contract.fund({
        value : ethers.utils.parseEther(ethAmount)
      })
      await listenForTransactionMine(transactionResponse,provider);
      console.log("Done")
      document.getElementById("done").innerText = "Done Now check the balance";

    }catch(error){
      console.log(error);
    }


    }

  }

  function listenForTransactionMine(transactionResponse, provider){
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) =>{
      provider.once(transactionResponse.hash, (transactionReceipt) =>{
        console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
        resolve()
      })
    })
   
  }

  async function getBalance(){
    if (typeof window.ethereum !== "undefined") {
      const provider =  new ethers.providers.Web3Provider(window.ethereum) // getting api form meta mask
      const balance = await provider.getBalance(contractAddress)
      console.log(ethers.utils.formatEther(balance))
      //balanceButton.innerHTML = `${ethers.utils.formatEther(balance)} eth`;
      document.getElementById("balanceDisplay").innerText = ethers.utils.formatEther(balance);

    }

  }

  async function withdraw(){
    if (typeof window.ethereum !== "undefined") {
      console.log("Withdrawing...")
      const provider =  new ethers.providers.Web3Provider(window.ethereum) // getting api form meta mask
      const signer =  provider.getSigner();  //get signer from the API 
      const contract = new ethers.Contract(contractAddress, abi, signer); // copied from backend and imported

      try{
        const transactionResponse = await contract.withdraw()
        await listenForTransactionMine(transactionResponse,provider);
      console.log("Withdrawal done")
      document.getElementById("withdone").innerText = "Amount has been withdrawn from the contract refresh the balance";

      }catch(error){
        console.log(error)
      }
    }

  }
