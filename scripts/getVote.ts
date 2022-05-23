import * as dotenv from "dotenv";
import { ethers, Contract } from "ethers";
import fs from 'fs';
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { MyToken } from "../typechain";


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

   const tokenContractAddress = "0xcd72856933A1aFb1B5B1FCBefdEce2bD24bBa99c"

   // create token contract instance   
   const tokenContract: MyToken = new Contract(
    tokenContractAddress,
     tokenJson.abi,
     signer

   ) as MyToken
   //address array
   const address = ["0xdd2fd4581271e230360230f9337d5c0430bf44c0",
   '0xdf3e18d64bc6a983f673ab319ccae4f1a57c7097', "0x26175874485De9143f1a90146bedf851599d47f6"]
   
    console.log('checking for vote power');
    const VotePower = await tokenContract.getVotes(
        address[2]
      );
    // const formatVotePower = Number(ethers.utils.formatEther(VotePower))
         console.log(`vote power is ${VotePower}`); 
 
}
 
 main().catch((error) => {
   console.error(error);
   process.exitCode = 1;
 });
