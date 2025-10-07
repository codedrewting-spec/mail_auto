import { ethers } from 'hardhat';

async function main() {
  const factory = await ethers.getContractFactory('SBTFocusBadge');
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  console.log('SBTFocusBadge deployed to:', await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
