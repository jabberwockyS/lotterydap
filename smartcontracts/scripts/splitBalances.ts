import { providers, Wallet, Contract, utils, BigNumber } from "ethers";
import * as fs from "fs";

//dev
import config from "./config.json"


const splitTokens = async () => {
  const rpcProvider = new providers.JsonRpcProvider(config.providerUrl);

  const wallet = new Wallet(config.account1PK).connect(rpcProvider);
  const FromAddress = await wallet.getAddress();
  const toAddress1 = config.acctoun2;
  const toAddress2 = config.account3;

  const contractMetadata = JSON.parse(
    fs.readFileSync("./../build/contracts/SirGeoToken.json").toString()
  );

  const sirgeoToken = new Contract(
    config.sirgeoTokenAddress,
    contractMetadata.abi
  ).connect(wallet);

  const sirgeoBalance = await sirgeoToken.balanceOf(FromAddress);
  console.log(sirgeoBalance);

  console.log("third: ", sirgeoBalance.div("3"));

  const tx1 = await sirgeoToken.transfer(toAddress1, sirgeoBalance.div("3"));
  console.log(tx1);
  const receipt1 = await tx1.wait();

  const tx2 = await sirgeoToken.transfer(toAddress2, sirgeoBalance.div("3"));
  console.log(tx2);
  const receipt2 = await tx2.wait();
  console.log(receipt2);
};



splitTokens().catch(console.error);
