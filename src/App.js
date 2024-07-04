import React, { useState, useEffect } from "react";
import "./App.css";
import Web3 from "web3";
import { walletNetworks } from "./utilis/walletNetwork";
import Modal from "./Modal";

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modal
  const showModal = () => {
    setShow(true);
  };

  const hideModal = () => {
    setShow(false);
  };

  // Web3
  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      setWeb3(web3);
    } else {
      setErrorMsg("MetaMask is not installed.");
    }
  }, []);

  // Wallet Connection
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

  // Switch Network
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
        await handleAddNetwork(networkName);
        return;
      }
    }
  };

  // Add Network
  const handleAddNetwork = async (networkName) => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [walletNetworks[networkName]],
      });
    } catch (err) {
      console.error("Error switching network:", err.message);
    }
  };

  // Submit Transaction
  const handleSubmit = async (data) => {
    setFormData(data);
    console.log("Form Data Submitted: ", data);

    try {
      const valueInWei = web3.utils.toWei(data.amount.toString(), "ether");
      const receipt = await web3.eth.sendTransaction({
        from: data.sender,
        to: data.receiver,
        value: valueInWei,
      });
      console.log("Transaction Receipt: ", receipt);
      getBlock(receipt.blockNumber);
    } catch (error) {
      console.error("Transaction Error: ", error);
    }
  };

  // Get Block
  const getBlock = async (blockNumberOrHash) => {
    try {
      const block = await web3.eth.getBlock(blockNumberOrHash);
      console.log("Block Data: ", block);
      checkTransactionsForAddress(block.transactions);
    } catch (error) {
      console.error("Error retrieving block: ", error);
    }
  };

  const checkTransactionsForAddress = async (transactions) => {
    let address = "0x504162cEeE6a61A94359C189161458C93783fFae";
    for (const tx of transactions) {
      try {
        const receipt = await web3.eth.getTransaction(tx);
        if (receipt) {
          setLoading(false);
          if (receipt.from.toLowerCase() === address.toLowerCase()) {
            console.log(receipt);
            console.log("Transaction Receipt for Address: ", receipt);
            setTransaction(receipt);
          }
        } else {
          console.log(
            "Transaction Receipt not found for transaction hash: ",
            tx.hash
          );
        }
      } catch (error) {
        console.error(
          "Error retrieving transaction receipt for hash: ",
          tx.hash,
          error
        );
      }
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
            <hr />
            <h1>Transaction</h1>
            <button className="transaction-modal-btn" onClick={showModal}>
              Send Transaction
            </button>
            <Modal
              show={show}
              handleClose={hideModal}
              handleSubmit={handleSubmit}
              setLoading={setLoading}
            />
            {loading && <div className="spinner"></div>}
            {transaction && transaction ? (
              <div className="latest-recipt">
                <h1>Latest Receipt</h1>
                <table border="1">
                  <tbody>
                    <tr>
                      <th>Value</th>
                      <td>{transaction.value.toString()}</td>
                    </tr>
                    <tr>
                      <th>Type</th>
                      <td>{transaction.type.toString()}</td>
                    </tr>
                    <tr>
                      <th>From</th>
                      <td>{transaction.from}</td>
                    </tr>
                    <tr>
                      <th>To</th>
                      <td>{transaction.to}</td>
                    </tr>
                    <tr>
                      <th>Gas Price</th>
                      <td>{transaction.gasPrice.toString()}</td>
                    </tr>
                    <tr>
                      <th>Hash</th>
                      <td>{transaction.hash}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-trans">No transaction data available.</div>
            )}
          </>
        )}
      </header>
    </div>
  );
}

export default App;
