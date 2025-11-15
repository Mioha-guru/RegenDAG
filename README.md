# 🌱 RegenDAG — Decentralized Humanitarian & Climate Relief System on BlockDAG  
### Wave 1 & Wave 2 Submission

RegenDAG is a decentralized humanitarian aid coordination and climate-resilience distribution system built on the **BlockDAG Awakening Testnet**.  
It eliminates fraud, ensures transparency, and guarantees fair and efficient delivery of aid to beneficiaries through blockchain automation, DAO oversight, and eligibility verification.

---

# 🚨 Problem Summary (Wave 1 Requirement)
Humanitarian aid distribution faces major issues:

- Fraudulent registrations  
- Double claiming within households  
- Corruption & political manipulation  
- No transparency or audit trail  
- Slow, manual, inefficient payout processes  

RegenDAG solves these problems by bringing **on-chain trust, transparency, and automation** to humanitarian aid.

---

# 🌍 Vision
To build a **global decentralized infrastructure** for climate relief, humanitarian assistance, and transparent donor funding — powered by the speed and scalability of BlockDAG.

---

# 🎯 Core Components (Wave 2 Milestone)

### ✔ 1. REGEN Token (ERC-20)
Programmable token used for aid payouts and future governance.

### ✔ 2. AliefVerification (Anti-Fraud Engine)
Wave-2 version performs basic fraud checks.  
Wave-4 version will integrate machine learning + oracle.

### ✔ 3. AidDistribution Contract
The heart of RegenDAG:
- Registers beneficiaries  
- Verifies identity  
- Prevents double payouts  
- Ensures household-level uniqueness  
- Transfers aid using REGEN token  
- DAO-controlled actions  

### ✔ 4. RegenDAO (Owner DAO)
Controls the entire system:
- Approves registration  
- Approves verification  
- Executes payouts  
- Owns/updates contracts  

Wave-4 upgrade → full governance.

---

# 🧱 System Architecture (Wave 2)
                     ┌────────────────────┐
                     │   RegenDAO (Owner) │
                     └──────────┬─────────┘
                                │ Controls
                                ▼
            ┌─────────────────────────────────────┐
            │        AidDistribution.sol          │
            │  - Registers wallets                │
            │  - Verifies beneficiaries           │
            │  - Prevents double claims           │
            │  - Transfers REGEN tokens           │
            └──────────┬──────────┬──────────────┘
                       │          │
                       │          ▼
                       │   AliefVerification.sol
                       │   (Fraud / Eligibility Engine)
                       │
                       ▼
                 RegenToken.sol
               (ERC20 programmable)

---

# 📦 Repository Structure

RegenDAG/
│
├── contracts/
│   ├── RegenToken.sol
│   ├── AliefVerification.sol
│   ├── AidDistribution.sol
│   └── RegenDAO.sol
│
├── scripts/
│   └── deploy_all.mjs
│
├── frontend/
├── docs/
│
├── .env
├── .env.example
├── hardhat.config.js
├── package.json
└── README.md


---

# 🔧 Local Development (Hardhat)

### 1️⃣ Install Dependencies
npm install


### 2️⃣ Configure .env
RPC_URL="https://rpc.awakening.bdagscan.com"
PRIVATE_KEY="0xYOUR_PRIVATE_KEY"


### 3️⃣ Compile Contracts
npx hardhat compile


### 4️⃣ Deploy (When RPC is back OR Ganache)
npx hardhat run scripts/deploy_all.mjs --network blockdag


---

# 🚀 deploy_all.mjs (Wave 2 Deployment Script)

import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
const [deployer] = await ethers.getSigners();
console.log("Deploying with account:", deployer.address);

const initialSupply = ethers.parseUnits("1000000", 18);
const RegenToken = await ethers.getContractFactory("RegenToken");
const token = await RegenToken.deploy(initialSupply);
await token.waitForDeployment();
console.log("RegenToken deployed at:", token.target);

const Alief = await ethers.getContractFactory("AliefVerification");
const alief = await Alief.deploy();
await alief.waitForDeployment();
console.log("AliefVerification deployed at:", alief.target);

const AidDistribution = await ethers.getContractFactory("AidDistribution");
const aid = await AidDistribution.deploy(token.target, alief.target);
await aid.waitForDeployment();
console.log("AidDistribution deployed at:", aid.target);

const DAO = await ethers.getContractFactory("RegenDAO");
const dao = await DAO.deploy();
await dao.waitForDeployment();
console.log("RegenDAO deployed at:", dao.target);

const tx = await dao.setAidDistribution(aid.target);
await tx.wait();
console.log("DAO linked to AidDistribution.");
}

main().catch((error) => {
console.error(error);
process.exitCode = 1;
});


---

# 📚 Tech Stack
- Solidity 0.8.20  
- Hardhat 2.27  
- OpenZeppelin v5  
- Node.js  
- Ethers.js v6  
- BlockDAG Testnet  
- Ganache (for stable local testing)  

---

# 🧪 Wave 2 Achievements Completed

- ✔ Smart Contract Scaffolds  
- ✔ Architecture Flow  
- ✔ Deployment Script  
- ✔ Repo Cleaned  
- ✔ README Updated  
- ✔ `.env.example` Added  
- ✔ Hardhat Compiled Successfully  
- ✔ Ganache-ready Deployment  

---

# 🔮 Roadmap (Judges Need This)

### Wave 3 — Prototype  
- UI  
- Wallet connect  
- On-chain interaction  

### Wave 4 — Governance + ML  
- DAO voting  
- Oracle + ML fraud detection  

### Wave 5 — Polishing  
- UI/UX  
- Documentation  
- Testnet deployment  

### Wave 6 — Final Demo  
- Live deployment  
- Video demo  
- Impact report  

---

# 🧑‍⚖️ Judge Summary

RegenDAG provides:

- Transparent aid delivery  
- DAO governance  
- Fraud prevention  
- Eligibility logic  
- Tokenized assistance  
- Real humanitarian impact  

Suitable for governments, NGOs, UN agencies, disaster relief bodies, donors, and climate networks.

---

# 🏁 Conclusion

RegenDAG bridges blockchain technology with real-world humanitarian impact — delivering fast, fair, corruption-resistant support to vulnerable communities through decentralized infrastructure.

---

# © Copyright
**© 2025 RegenDAG — Created by Mustapha Ismail Ogunleye (Mioha)**  
All rights reserved.