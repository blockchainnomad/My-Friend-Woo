
const env = require("dotenv");
require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");
require("@nomiclabs/hardhat-etherscan");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
// 현재 발행된 토큰의 개수(판매한 것을 제외하고 발행자가 소유한 토큰의 개수)
// task("minted", "Prints balance of ALS", async (taskArgs, hre) => {
//
//   const OWNER = "";
//   const f = await hre.ethers.getContractFactory("ALSnft");
//   const alsNft = await f.attach("0x219...6E50");
//
//   const balance = await alsNft.balanceOf(OWNER);
//   console.log(`${balance.toString()} minted`);
//
// });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
env.config()
const endpoint = process.env.ENDPOINT
const privateKey = [process.env.PRIVATE_KEY]
const address = process.env.ADDRESS
const etherscanKey = process.env.ETHERSCAN

module.exports = {

  networks: {
    rinkeby: {
      url: endpoint, // infura에서 발급받은 RPC-ENDPOINT
      accounts: privateKey
    }
  },

  namedAccounts: {
    deployer: {
      development: 0,
      rinkeby: address // Rinkeby 배포 계정(이더가 있어야 함)
    }
  },

  solidity: "0.8.4",

  etherscan: {
    apiKey: etherscanKey // 이더스캔에서 발급받은 API 키
  }

};
