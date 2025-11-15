// scripts/deploy_all.mjs
import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // 1️⃣ Deploy RegenToken (requires initialSupply)
  const initialSupply = ethers.parseUnits("1000000", 18); // 1,000,000 REGEN
  const RegenToken = await ethers.getContractFactory("RegenToken");
  const token = await RegenToken.deploy(initialSupply);
  await token.waitForDeployment();
  console.log("RegenToken deployed at:", token.target);

  // 2️⃣ Deploy AliefVerification
  const Alief = await ethers.getContractFactory("AliefVerification");
  const alief = await Alief.deploy();
  await alief.waitForDeployment();
  console.log("AliefVerification deployed at:", alief.target);

  // 3️⃣ Deploy AidDistribution (needs token + alief address)
  const AidDistribution = await ethers.getContractFactory("AidDistribution");
  const aid = await AidDistribution.deploy(token.target, alief.target);
  await aid.waitForDeployment();
  console.log("AidDistribution deployed at:", aid.target);

  // 4️⃣ Deploy DAO
  const DAO = await ethers.getContractFactory("RegenDAO");
  const dao = await DAO.deploy();
  await dao.waitForDeployment();
  console.log("RegenDAO deployed at:", dao.target);

  // 5️⃣ Set AidDistribution inside DAO
  const tx = await dao.setAidDistribution(aid.target);
  await tx.wait();
  console.log("DAO linked to AidDistribution.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});