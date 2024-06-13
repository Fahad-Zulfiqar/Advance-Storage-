import { useState, useEffect } from "react";
import { web3, contract, contractAddress } from "./lib/web3";
import { Buffer } from "buffer";
import "./App.css";

function App() {
  const [account, setAccount] = useState(null);
  const [ids, setIds] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // Connect to MetaMask
  const connect = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting to MetaMask", error);
    }
  };

  // Handle input change
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Add data to the smart contract
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (account && inputValue) {
      try {
        const nonce = await web3.eth.getTransactionCount(account, "latest"); // get latest nonce
        const gasPrice = await web3.eth.getGasPrice();
        const gasLimit = 3000000;

        const data = contract.methods.add(inputValue).encodeABI();
        const tx = {
          from: account,
          to: contractAddress,
          nonce: web3.utils.toHex(nonce),
          gas: web3.utils.toHex(gasLimit),
          gasPrice: web3.utils.toHex(gasPrice),
          data: data,
        };

        const PriKey = import.meta.env.VITE_KEY;
        const privateKey = Buffer.from(PriKey, "hex");

        const signedTx = await web3.eth.accounts.signTransaction(
          tx,
          privateKey
        );

        const receipt = await web3.eth.sendSignedTransaction(
          signedTx.rawTransaction
        );
        console.log("Transaction receipt:", receipt);

        setInputValue("");
        fetchAllData();
      } catch (error) {
        console.error("Error adding data", error);
      }
    }
  };

  // Fetch all data from the smart contract
  const fetchAllData = async () => {
    const data = await contract.methods.getAll().call();
    const formattedData = data.map((id) => id.toString());
    setIds(formattedData);
  };

  // Fetch data on load
  useEffect(() => {
    if (account) {
      fetchAllData();
    }
  }, [account]);

  return (
    <>
      <button onClick={connect} className="Acc-btn">
        Connect {account ? `: ${account}` : ""}
      </button>
      <div className="center">
        <h1>Advance Storage</h1>

        <form onSubmit={handleSubmit}>
          <label className="label">Set data (number)</label>
          <input
            id="addDataInput"
            type="number"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button type="submit">Submit</button>
        </form>

        <h3>Stored IDs:</h3>
        <ul>
          {ids.map((id, index) => (
            <li key={index} style={{ color: "#fff" }}>
              {id}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
