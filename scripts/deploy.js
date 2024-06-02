// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const Namekeeper = await hre.ethers.getContractFactory("Namekeeper");
  const namekeeper = await Namekeeper.deploy();
  await namekeeper.deployed();

  console.log(` Namekeeper deploy to ${namekeeper.address}`);

  const namekeep  = await hre.ethers.getContractAt("Namekeeper", namekeeper.address);

  const setname = await namekeep.setname("Victor");

  const getname = await namekeep.getname();
  console.log(getname, "getname")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});