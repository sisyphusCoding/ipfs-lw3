import { ethers } from "hardhat";

require('dotenv').config({path:'.env'})

async function main() {

  const metadataURL  = "ipfs://Qmbygo38DWF1V8GttM1zy89KzyZTPU2FLUzQtiDvB7q6i5"


  const lw3PunksContract = await ethers.getContractFactory('LW3Punks')

  const thisDeploy = await lw3PunksContract.deploy(metadataURL)


  await thisDeploy.deployed()

  console.log('lw3Punks Contract Address:', thisDeploy.address )


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
