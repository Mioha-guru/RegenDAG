require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: process.env.RPC_URL || "http://127.0.0.1:7545",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1337,
     },

    // BlockDAG Testnet (⚡ For Wave-3 interactions)
    mainnet: {
      url: "https://rpc.awakening.bdagnetwork.com", 
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 200000,
    
    },
  },
};
