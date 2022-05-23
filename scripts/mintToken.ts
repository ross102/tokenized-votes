import * as dotenv from "dotenv";

import { Contract, ethers } from "ethers";
import { readKey } from "../utils/helpers";
import { MyToken } from "../typechain";
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";

const PRIVATE_KEY = readKey(".secret");

async function main() {
  // create wallet signer
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(PRIVATE_KEY);
  // connect to rpc network
  const provider = ethers.providers.getDefaultProvider("ropsten");
  console.log("====================  USING ADDRESS ==========================");
  console.log(`${wallet.address}`);
  console.log(
    "====================== end of address ========================="
  );
  const signer = wallet.connect(provider); // signer
  console.log("------------SIGNER-------------------");
  console.log(signer);
  console.log("-----------end of signer --------------------------------");
  console.log(
    "==================== WALLET BALANCE ==========================="
  );
  // check balance
  const balanceBN = await signer.getBalance();
  console.log("-: Signer", signer);
  const balance = await Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  console.log(
    "============================end of wallet balnace======================================="
  );

  const TokenContractAddress = "0xcd72856933A1aFb1B5B1FCBefdEce2bD24bBa99c";
  const myAddress = "0x26175874485De9143f1a90146bedf851599d47f6";
  console.log("***** Minting Token *******");

  const TokenContract: MyToken = new Contract(
    TokenContractAddress,
    tokenJson.abi,
    signer
  ) as MyToken;

  const decimals = 18;
  const input = "999"; // Note: this is a string, e.g. user input
  const amount = ethers.utils.parseUnits(input, decimals);

  const mintToken = await TokenContract.mint(myAddress, amount);
  console.log("******* MINTING IN PROCESSING STAGE ******************");
  //   mintToken.wait(5);
  console.log("===================== RESULTS ===============");
  const result = {
    reciver: mintToken.to,
    hash: mintToken.hash,
    blockNumber: mintToken.blockNumber,
    nounce: mintToken.nonce,
    timestamp: mintToken.timestamp,
  };
  console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
