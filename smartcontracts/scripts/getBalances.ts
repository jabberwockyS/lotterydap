import { providers, Wallet, Contract, utils, BigNumber } from "ethers";
import * as fs from "fs";

//dev
import config from "./config.json"

const getBalances = async () => {
  const rpcProvider = new providers.JsonRpcProvider(config.providerUrl);
  const toAddress2 = config.acctoun2
  const toAddress3 = config.account3

  const wallet = new Wallet(config.account1PK).connect(rpcProvider);
  const FromAddress = await wallet.getAddress();

  const contractMetadata = JSON.parse(
    fs.readFileSync("./../build/contracts/SirGeoToken.json").toString()
  );

  const sirgeoTokenContract = new Contract(
    config.sirgeoTokenAddress,
    contractMetadata.abi
  );

  const conectedToken1 = sirgeoTokenContract.connect(wallet);

  const sirgeoBalance = await conectedToken1.balanceOf(FromAddress);
  console.log(`original account balance: ${sirgeoBalance}`);

  const sirgeoBalance2 = await conectedToken1.balanceOf(toAddress2);
  console.log(`second account balance: ${sirgeoBalance2}`);

  const sirgeoBalance3 = await conectedToken1.balanceOf(toAddress3);
  console.log(`third account balance: ${sirgeoBalance3}`);

  const contractBalance = await conectedToken1.balanceOf(
    config.lotteryContractAddress
  );
  console.log(`contract account balance: ${contractBalance}`);
};


getBalances().catch(console.error);
