import * as dotenv from "dotenv";

import { ethers, Contract } from "ethers";
import fs from 'fs';
import * as customBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";

import { CustomBallot } from "../typechain";


const PRIVATE_KEY = fs.readFileSync(".secret").toString().trim(); 
  


async function main() {
    // create wallet signer
   const wallet = new ethers.Wallet(PRIVATE_KEY);
   console.log(`Using address ${wallet.address}`);
   // connect to rpc network
   const provider = ethers.providers.getDefaultProvider("ropsten");
   const signer = wallet.connect(provider);
   //check balance
   const balanceBN = await signer.getBalance();
   console.log(signer);
   const balance = await Number(ethers.utils.formatEther(balanceBN));
   console.log(`Wallet balance ${balance}`);

   if (balance < 0.001) {
     throw new Error("Not enough ether");
   }
   // ballot contract address
   const ballotContract = "0x43F81d27d0E5Db45D6d980Cc0F08E4616834eE6D"

   // create contract instance   
   const customBallot: CustomBallot = new Contract(
       ballotContract,
       customBallotJson.abi,
       signer

   ) as CustomBallot
   //proposal array
   const proposalsLength = 3
   let index = 0
   //Query proposals for each ballot
   while (index < proposalsLength) {
    const ballotProposal = await customBallot.proposals(index)
   // convert bytes to string
    const byteToString = ethers.utils.parseBytes32String(ballotProposal.name)
    console.log(`proposal ${index} :  ${byteToString}`)
    index ++;
   }
      
 
}
 
 main().catch((error) => {
   console.error(error);
   process.exitCode = 1;
 });
 