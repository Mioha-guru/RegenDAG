const { ethers } = require("hardhat");
require("dotenv").config();

const DAO_ADDRESS = "0x0371099454f20106Bc41653ea1F12F2F2845b57e";
const AID_ADDRESS = "0x65625522ce0AF8a7100409d9c7660555b8E51796";

async function main() {
  const provider = new ethers.JsonRpcProvider("https://rpc.awakening.bdagnetwork.com");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const signerAddress = await wallet.getAddress();

  const abi = [
    "function owner() view returns (address)",
    "function aid() view returns (address)",
    "function setAidDistribution(address) external",
    "function daoRegister(address,uint256) external"
  ];

  const dao = new ethers.Contract(DAO_ADDRESS, abi, wallet);

  console.log("\n🔍 Checking contract...");
  console.log("Signer:", signerAddress);
  console.log("Owner():", await dao.owner());
  console.log("Aid():", await dao.aid());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
