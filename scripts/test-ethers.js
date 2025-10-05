import hre from "hardhat";

console.log("hre:", typeof hre);
console.log("hre.ethers:", typeof hre.ethers);

if (hre.ethers) {
  console.log("✅ ethers 可用");
  const signers = await hre.ethers.getSigners();
  console.log("签名者数量:", signers.length);
  console.log("第一个签名者:", signers[0].address);
} else {
  console.log("❌ ethers 不可用");
  console.log("hre 的keys:", Object.keys(hre));
}
