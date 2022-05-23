import * as dotenv from "dotenv";
import { ethers } from "ethers";
import fs from 'fs';
import * as customBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";

dotenv.config();

const PRIVATE_KEY = fs.readFileSync(".secret").toString().trim(); 

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

// Deploying both MyToken contract and customized ballot
async function main() {
   // create wallet signer
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(PRIVATE_KEY);
  console.log(`Using address ${wallet.address}`);
  // connect to rpc network
  const provider = ethers.providers.getDefaultProvider("ropsten");
  const signer = wallet.connect(provider);
  //check balance
  const balanceBN = await signer.getBalance();
  console.log(signer);
  const balance = await Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.0000001) {
    throw new Error("Not enough ether");
  }

  console.log("Deploying MyToken contract");

   const addr = await signer.getAddress();
   console.log(addr);
  //  Token deployment
  const tokenFactory  = new ethers.ContractFactory(
    tokenJson.abi,
    tokenJson.bytecode,
    signer
  ) 
  const tokenContract = await tokenFactory.deploy()
  console.log("Awaiting confirmations");
  await tokenContract.deployed();
  console.log("Completed");
  console.log(`MyToken Contract is deployed at ${tokenContract.address}`);
  console.log("Deploying Custom ballot contract");
  console.log("Proposals: ");
  //poposals
  const proposals = ["peter obi", "saraki", "osibanjo"]
  if (proposals.length < 2) throw new Error("Not enough proposals provided");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  // Deploy ballot
  const customBallotFactory = new ethers.ContractFactory(
    customBallotJson.abi,
    customBallotJson.bytecode,
    signer
  );
  const customBallotContract = await customBallotFactory.deploy(
    convertStringArrayToBytes32(proposals),
    tokenContract.address
  );
  console.log("Awaiting confirmations");
  await customBallotContract.deployed();
  console.log("Completed");
  console.log(`Ballot Contract deployed at ${customBallotContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
