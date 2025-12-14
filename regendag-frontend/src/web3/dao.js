// src/web3/dao.js
import { ethers } from "ethers";

const DAO_ADDRESS = "0x0371099454f20106Bc41653ea1F12F2F2845b57e"; // your contract
const abi = [
  "function owner() view returns (address)",
  "function aid() view returns (address)",
  "function setAidDistribution(address) external",
  "function daoRegister(address,uint256) external"
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
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(DAO_ADDRESS, abi, signer);
}
