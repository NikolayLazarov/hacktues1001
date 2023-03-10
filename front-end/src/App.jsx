import { useState } from "react";
import React from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Data from "./layout/Data";
import EntryForm from "./components/EntryForm";

// import contractABI from '../../../contractDetails/MedicalStorage.json'
// import contractAddress from "../../../contractDetails/address.json"
import { ethers } from "ethers";


function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connectionButtonText, setConnectionButtonText] =
    useState("Connect Wallet");

    const [hash, setHash] = useState();

  const [currentContractVallue, setCurrentContractValue] = useState(null);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  // new
  const [account, setAccount] = useState();
  const router = createBrowserRouter([
    {
      path: "/Data",
      element: <Data hash={hash}/>,
    },
    {
      path: "/",
      element: <EntryForm signer={signer} setHash={setHash} />,
    },
  ]);

  function metaMaskConnector(event) {
    event.preventDefault();

    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnectionButtonText("WalletConnected");
        });
    } else {
      setErrorMessage("Need to install MetaMask!");
    }
    const accountChangedHandler = (newAccount) => {
      setAccount(newAccount);
      updateEthers();
    };

    const updateEthers = () => {
      let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(tempProvider);
      let tempSigner = tempProvider.getSigner();
      setSigner(tempSigner);
    };
  }

  return (
    <div className="App">
      {errorMessage}
      {account && provider ? (
        <React.StrictMode>
          <RouterProvider router={router} />
        </React.StrictMode>
      ) : (
        <button onClick={metaMaskConnector}>{connectionButtonText}</button>
      )}
    </div>
  );
}

export default App;
