const { ethers } = require("hardhat")

async function main() {
  const FundMeFactory = await ethers.getContractFactory("FundMe")
  console.log("Deploying contract...")
  const fundMe = await FundMeFactory.deploy("0x694AA1769357215DE4FAC081bf1f309aDC325306", "0xA1d7f71cbBb361A77820279958BAC38fC3667c1a")
  await fundMe.deployed()
  console.log(`Deployed contract to: ${fundMe.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })







