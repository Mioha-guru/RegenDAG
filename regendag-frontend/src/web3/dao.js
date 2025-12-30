// src/web3/dao.js
import { ethers } from "ethers";

const DAO_ADDRESS = "0x6d568bbD6999Cc5A024D176D161FdBFc4fFfB0B6";
const abi = [
  "function owner() view returns (address)",
  "function aid() view returns (address)",
  "function setAidDistribution(address) external",
  "function daoRegister(address,uint256) external",
  "function daoVerify(address,bool) external"
];

// read-only contract (no signer)
export async function getReadContract() {
  if (typeof window !== "undefined" && window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return new ethers.Contract(DAO_ADDRESS, abi, provider);
  }
  // fallback: Infura/public provider? For now throw so UI can handle gracefully
  throw new Error("No injected provider for read contract (please install MetaMask)");
}

// signer contract for transactions
export async function getContract() {
  if (!window.ethereum) throw new Error("MetaMask not found");
  const provider = new ethers.BrowserProvider(window.ethereum,{
    name: "blockdag",
    chainId: 1043,
    ensAddress: null,
  });
  const signer = await provider.getSigner();
  return new ethers.Contract(DAO_ADDRESS, abi, signer);
}
