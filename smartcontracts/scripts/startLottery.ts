import { providers, Wallet, Contract, utils, BigNumber } from "ethers";
import * as fs from "fs";

//dev
import config from "./config.json"

const startLottery = async () => {
  const rpcProvider = new providers.JsonRpcProvider(config.providerUrl);

  const wallet = new Wallet(config.account1PK).connect(rpcProvider);

  const contractMetadata = JSON.parse(
    fs.readFileSync("../build/contracts/Lottery.json").toString()
  );

  const tokenMetadata = JSON.parse(
    fs.readFileSync("../build/contracts/SirGeoToken.json").toString()
  );

  const mainWalletLottery = new Contract(
    config.lotteryContractAddress,
    contractMetadata.abi
  ).connect(wallet);

  const tokenContract = new Contract(
    config.sirgeoTokenAddress,
    tokenMetadata.abi
  );

  console.info("👀starting loterry...");
  const lotteryStartTx = await mainWalletLottery.startLoterry();
  await lotteryStartTx.wait();
  console.info("👀lottery started");

  //fist

  const mainWalletConectedToken = tokenContract.connect(wallet);
  let firstParticipantEnterTx = await mainWalletConectedToken.approve(
    config.lotteryContractAddress,
    BigNumber.from(100000000000)
  );
  await firstParticipantEnterTx.wait();
  console.log("👀first participant approved");
  let tx = await mainWalletLottery.enter();
  await tx.wait();
  console.log("👀first participant entered");

  //second
  const wallet2 = new Wallet(config.account2PK, rpcProvider);
  const lotteryOnWallet2 = new Contract(
    config.lotteryContractAddress,
    contractMetadata.abi,
    wallet2
  );

  const wallet2ConectedToken = new Contract(
    config.sirgeoTokenAddress,
    tokenMetadata.abi,
    wallet2
  );
  let secondApproval = await wallet2ConectedToken.approve(
    config.lotteryContractAddress,
    100000000000
  );
  await secondApproval.wait();
  console.log("👀second participant approved");

  let tx2 = await lotteryOnWallet2.enter();
  await tx2.wait();
  console.log("👀second participant entered");

  

  //trird
  const wallet3 = new Wallet(config.account3PK).connect(rpcProvider);
  const lotteryOnWallet3 = new Contract(
    config.lotteryContractAddress,
    contractMetadata.abi
  ).connect(wallet3);

  const wallet3ConectedToken = tokenContract.connect(wallet3);
  let thirdApproval = await wallet3ConectedToken.approve(
    config.lotteryContractAddress,
    BigNumber.from(1000000000)
  );
  await thirdApproval.wait();

  let tx3 = await lotteryOnWallet3.enter();
  await tx3.wait();
  console.log("👀third participant entered");

 

  const endTx = await mainWalletLottery.endLottery();
  await endTx.wait();
  console.info("👀lottery ended");

  const winner = await mainWalletLottery.recentWinner();
  console.log("👀winner: ", winner);
};

startLottery().catch(console.error);
