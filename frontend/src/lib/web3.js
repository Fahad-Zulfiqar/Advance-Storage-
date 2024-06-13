import Web3 from "web3";
import AdvanceStorage from "./AdvancedStorage.json";

const Key = import.meta.env.VITE_PROJECT_ID;

const web3 = new Web3(
  Web3.givenProvider || `wss://eth-sepolia.g.alchemy.com/v2/${Key}`
);

const contractAddress = "0x8a62399dbA172804275B2071AE2E816c92A62D12";
const contract = new web3.eth.Contract(AdvanceStorage.abi, contractAddress);

export { web3, contract, contractAddress };
