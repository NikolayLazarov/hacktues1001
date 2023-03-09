import styles from './EntryForm.module.css';
import React, { useState } from 'react';
import contractABI from '../../../contractDetails/Storage.json'
import ContractAddress from "../../../contractDetails/address.json"
import {ethers} from 'ethers' 

// D:\NikiL\School\2022-2023\HackTues1001\Project\hacktues1001\contractDetails\address.json
// hacktues1001\contractDetails\address.json
function EntryForm(){

    const contractAddress = ContractAddress.Storage;
    
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connectionButtonText, setConnectionButtonText] = useState('Connect Wallet');
    
    const [currentContractVallue,setCurrentContractValue] = useState(null);

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
 
    function entryFormHandler(event){
        event.preventDefault();
        if(window.ethereum){
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result => {
                accountChangedHandler(result[0]);
                setConnectionButtonText('WalletConnected');
            });
        }else{
            setErrorMessage('Need to install MetaMask!'); 
        }
    }
    function accountChangedHandler(newAccount){
        	setDefaultAccount(newAccount);
            updateEthers();
    }

    function updateEthers(){
        let tempProvider = new ethers.providers.WebProvider(window.ethereum);
        setProvider(tempProvider);
        
        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress, contractABI.abi , tempSigner);
        setContract(tempContract);
    }
//     function JO(event){
//         const data = { username: "example" };

//         event.preventDefault();
//         fetch( 'http://10.1.186.33:3000/m', {
//         method: "POST", // or 'PUT'
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//         })
//   .then((response) => response.json())
//   .then((data) => {
//     console.log("Success:", data);
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });
//     }
async function getCurrentVal(){
    let val = await contract.get();
    setCurrentContractValue(val);
}

function setHandler(event){
    event.preventDefault();
    contract.set(event.target.setText.value);
}

    return (
        <form /*style={styles.form} */ onSubmit={entryFormHandler} /* onSubmit={JO}*/ >

            {/* <h1>Entry data</h1>
        <input type = "text" placeholder='First name' />
        <input type = "text" placeholder='Lastname' />
        <input style={styles.input}  type = "text" placeholder ='Pesronal ID'/>
        <input type = "password" placeholder='password' /> */}

            <button >Enter and {connectionButtonText}</button>
            <h3>Address: {defaultAccount}</h3>

            <form   onSubmit={setHandler}>
                <input id="setText" type='text' />
                <button>Update Contract</button> 
            </form>


            <button onClick={getCurrentVal} >Get current Value </button>
            {currentContractVallue}
            {errorMessage}
            
      </form>   
    );
}

export default EntryForm;



