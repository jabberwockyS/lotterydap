import { providers, Wallet, Contract, utils, BigNumber } from "ethers";
import * as fs from "fs";

//dev
import config from "./config.json"

const endLottery = async () => {
  const rpcProvider = new providers.JsonRpcProvider(config.providerUrl);

  const wallet = new Wallet(config.account1PK).connect(rpcProvider);

  const contractMetadata = JSON.parse(
    fs.readFileSync("../build/contracts/Lottery.json").toString()
  );

  const mainWalletLottery = new Contract(
    config.lotteryContractAddress,
    contractMetadata.abi
  ).connect(wallet);

  console.info("👀ending loterry...");
  const lotteryStartTx = await mainWalletLottery.endLottery();
  await lotteryStartTx.wait();
  console.info("👀lottery ended");
};

endLottery().catch(console.error);
