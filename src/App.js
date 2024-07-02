import React, { useState, useEffect } from "react";
import "./App.css";
import Web3 from "web3";
import { walletNetworks } from "./utilis/walletNetwork";

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);

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
      setWalletConnected(true);
    } catch (err) {
      setErrorMsg("MetaMask not connected.");
    }
  };

  const handleSwitchNetwork = async (networkName) => {
    const getChainId = await web3.eth.getChainId();
    console.log("getChainId", getChainId);
    console.log("networkName", networkName);
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          { chainId: web3.utils.toHex(walletNetworks[networkName].chainId) },
        ],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        console.log("Please add the Polygon network to MetaMask");
        await handleChangeNetwork(networkName);
        return;
      }
    }
  };

  const handleChangeNetwork = async (networkName) => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [walletNetworks[networkName]],
      });
    } catch (err) {
      console.error("Error switching network:", err.message);
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

        {walletConnected && (
          <>
            <hr />
            <h1>Change your network</h1>
            <div className="change-network">
              <button onClick={() => handleSwitchNetwork("sepolia")}>
                Switch to Sepolia
              </button>
              <button onClick={() => handleSwitchNetwork("polygon")}>
                Switch to Polygon
              </button>
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
