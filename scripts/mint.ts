import * as dotenv from "dotenv";
import { ethers, Contract } from "ethers";
import fs from 'fs';
import * as customBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
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

   if (balance < 0.0001) {
     throw new Error("Not enough ether");
   }
   // token contract address
   const tokenContractAddress = "0xcd72856933A1aFb1B5B1FCBefdEce2bD24bBa99c"

   // create token contract instance   
   const tokenContract: MyToken = new Contract(
    tokenContractAddress,
     tokenJson.abi,
     signer

   ) as MyToken
   //address array
   const address = ['0x1cbd3b2770909d4e10f157cabc84c7264073c9ec', '0xdf3e18d64bc6a983f673ab319ccae4f1a57c7097',
    "0xdd2fd4581271e230360230f9337d5c0430bf44c0", "0x26175874485De9143f1a90146bedf851599d47f6"]
   let vote_power = 15
   
   
      console.log('minting...');
      const Mint = await tokenContract.mint(
        address[3],
        ethers.utils.parseEther(vote_power.toFixed(18))
      );
     await  Mint.wait();
      console.log(`minting complete.`); 
      console.log(Mint.hash)
      
 
}
 
 main().catch((error) => {
   console.error(error);
   process.exitCode = 1;
 });
