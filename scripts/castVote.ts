import * as dotenv from "dotenv";
import { ethers, Contract } from "ethers";
import fs from 'fs';
import * as customBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import { CustomBallot, MyToken } from "../typechain";


dotenv.config();

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

   const ballotContractAddress = "0x43F81d27d0E5Db45D6d980Cc0F08E4616834eE6D"

   // create ballot contract instance   
   const ballotContract: CustomBallot = new Contract(
    ballotContractAddress,
    customBallotJson.abi,
     signer

   ) as CustomBallot
   //address array
//    const address = ["0x26175874485De9143f1a90146bedf851599d47f6",'0xdf3e18d64bc6a983f673ab319ccae4f1a57c7097']
   
    console.log('casting vote...');
    const castVote = await ballotContract.vote(2, 1);
     castVote.wait();
    
         console.log(`transaction hash is ${castVote.hash}`); 
 
}
 
 main().catch((error) => {
   console.error(error);
   process.exitCode = 1;
 });
