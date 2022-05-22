import * as dotenv from "dotenv";

import { ethers, Contract } from "ethers";
import fs from 'fs';
import * as customBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";

import { CustomBallot } from "../typechain";


const PRIVATE_KEY = fs.readFileSync(".secret").toString().trim(); 

function convertBytes32ToString(array: any) {
    const stringArray = [];
    for (let index = 0; index < array.length; index++) {
        stringArray.push(ethers.utils.parseBytes32String(array[index]));
    }
    return stringArray;
  }
  


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
   const ballotContract = "0xCF1C269B722196f081B036be48e4e6B1631aE7D8"

   // create contract instance   
   const customBallot: CustomBallot = new Contract(
       ballotContract,
       customBallotJson.abi,
       signer

   ) as CustomBallot
   //proposal array
   const proposals = ["peter obi", "saraki", "osibanjo"]
   let index = 0
   //Query proposals for each ballot
   while (index < proposals.length) {
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
 