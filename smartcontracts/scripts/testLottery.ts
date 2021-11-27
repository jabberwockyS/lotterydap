import { providers, Wallet, Contract, utils } from "ethers";
import * as fs from "fs";

//dev
const config = {
  providerUrl: "http://localhost:7545",
  account1PK:
    "0ecf43d5ea366848bd6419e4be1562dbd1e2c5952940ed0aca3562144d923593",
  account2PK:
    "0edb2962f8b8cfa3c5e1f36c5fab53e6e46a66e717ee31386addf6c4251db2cc",
  account3PK:
    "6d35537c6a50114b0b9a0fb94a35f6a9193f71fde6c95f0c2226c16bfe3975c4",
  lotteryContractAddress: "0xf190cC53697F79B9b544a809Ec85887aF4834be9",
};

const main = async () => {
  const rpcProvider = new providers.JsonRpcProvider(config.providerUrl);

  const wallet = new Wallet(config.account1PK).connect(rpcProvider);

  const contractMetadata = JSON.parse(
    fs.readFileSync("../build/contracts/Lottery.json").toString()
  );

  const mainWalletLottery = new Contract(
    config.lotteryContractAddress,
    contractMetadata.abi
  ).connect(wallet);

  console.info("👀starting loterry...");
  await mainWalletLottery.startLoterry();
  console.info("👀lottery started");

  let overrides = {
    value: utils.parseEther("1.0"),
  };

  let tx = await mainWalletLottery.enter(overrides);
  console.log("👀first participant entered", tx);

  const wallet2 = new Wallet(config.account2PK).connect(rpcProvider);
  const lotteryOnWallet2 = new Contract(
    config.lotteryContractAddress,
    contractMetadata.abi
  ).connect(wallet2);

  let tx2 = await lotteryOnWallet2.enter(overrides);
  console.log("👀second participant entered", tx2);

  //trird
  const wallet3 = new Wallet(config.account3PK).connect(rpcProvider);
  const lotteryOnWallet3 = new Contract(
    config.lotteryContractAddress,
    contractMetadata.abi
  ).connect(wallet3);

  let tx3 = await lotteryOnWallet3.enter(overrides);
  console.log("👀third participant entered", tx3);

  await mainWalletLottery.endLottery();
  console.info("👀lottery ended");

  const winner = await mainWalletLottery.recentWinner();
  console.log("👀winner: ", winner);
};

main().catch(console.error);
