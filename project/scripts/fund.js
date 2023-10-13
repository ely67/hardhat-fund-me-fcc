const { ethers } = require("hardhat")

async function main() {
  const fundMeFactory = await ethers.getContractFactory("fundMe")
  console.log("Deploying contract...")
  const fundMe = await fundMeFactory.deploy("0x694AA1769357215DE4FAC081bf1f309aDC325306")
  await fundMe.deployed()
  console.log(`Deployed contract to: ${fundMe.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })







