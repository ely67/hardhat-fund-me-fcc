import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"



const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
const getFunderButton = document.getElementById("getFunderButton")
connectButton.onclick = connect
fundButton.onclick = Fund
balanceButton.onclick = getBalance
withdrawButton.onclick = Withdraw
getFunderButton.onclick = getFunders


async function connect() {
    if (typeof window.ethereum !== "undefind") {
        try {
          await ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected"
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }
}


async function Withdraw() {
    console.log(`Withdrawing...`)
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      try {
        const transactionResponse = await contract.withdraw()
        await listenForTransactionMine(transactionResponse, provider)
        // await transactionResponse.wait(1)
      } catch (error) {
        console.log(error)
      }
    } else {
      withdrawButton.innerHTML = "Please install MetaMask"
    }
}

async function getFunders() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const funderCount = await contract.getFunderCount()
      //await listenForTransactionMine(transactionResponse, provider)
      console.log("Number of funders:", funderCount)
    } catch (error) {
      console.log(error)
    } 
  } else {
      getFunderButton.innerHTML = "Please install MetaMask"
    }  
}


async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      try {
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
      } catch (error) {
        console.log(error)
      }
    } else {
        balanceButton.innerHTML = "Please install MetaMask"
    }
}


async function Fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      try {
        const transactionResponse = await contract.fund({
          value: ethers.utils.parseEther(ethAmount),
        })
        await listenForTransactionMine(transactionResponse, provider)
        console.log("Done")
      } catch (error) {
        console.log(error)
      }
    } else {
      fundButton.innerHTML = "Please install MetaMask"
    }
}


function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
        try {
            provider.once(transactionResponse.hash, (transactionResponse) => {
                console.log(
                    `Completed with ${transactionResponse.confirmations} confirmations.`
                )
                resolve()
            })
        } catch (error) {
            reject(error)
        }
    })
}




