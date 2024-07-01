import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Web3 from "web3";

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      setWeb3(web3);
    } else {
      setErrorMsg("MetaMask is not installed.");
    }
  }, []);

  const handleConnectWallet = async () => {
    try {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (account.length > 0) {
        setAccount(account[0]);
        const amount = await web3.eth.getBalance(account[0]);
        setAmount(web3.utils.fromWei(amount, "ether"));
      }
    } catch (err) {
      setErrorMsg("MetaMask not connected.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Connecting to Wallet - Web 3.0 Project</h1>
        <hr />
        {errorMsg && <p className="error-msg">{errorMsg}</p>}
        {web3 ? (
          <>
            {account && amount ? (
              <>
                <h2>Connected Account:</h2>
                <p>{account}</p>
                <h2>Account amount: </h2>
                <p>{parseFloat(amount).toFixed(3)}</p>
              </>
            ) : (
              <button onClick={handleConnectWallet}>Connect MetaMask</button>
            )}
          </>
        ) : (
          <p>MetaMask is not installed.</p>
        )}
      </header>
    </div>
  );
}

export default App;
