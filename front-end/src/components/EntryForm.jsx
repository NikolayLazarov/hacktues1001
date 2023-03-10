import styles from './EntryForm.module.css';
import React, { useState,useRef } from 'react';
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

    const firstName = useRef();
    const lastName = useRef();
    const personalId = useRef();
    const password = useRef();
    const startingDate = useRef();
    const endingDate = useRef();
 
    function metaMaskConnector(event){
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
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);
        
        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress, contractABI.abi , tempSigner);
        setContract(tempContract);
    }

async function getCurrentVal(){
    let val = await contract.get();
    setCurrentContractValue(val);
}

// function setHandler(event){
//     event.preventDefault();
//     contract.set(event.target.setText.value);
// }

    function entryFormHandler(event){
        event.preventDefault();
      
        const startingDateFormated = dateFormater(startingDate.current.value);
        const endingDateFormated = dateFormater(endingDate.current.value);
       
        
        console.log(startingDateFormated);
        console.log(endingDateFormated);
        
        const finalStartingString = finalStringMaker(startingDateFormated);
        const finalEndingString = finalStringMaker(endingDateFormated);
        
        // const hashStringStart = hashMaker(finalStartingString);
        // console.log(hashStringStart);
    }

    function dateFormater(date){
        const dateObject = new Date(date);
        const day =dateObject.getDate();
        const month =dateObject.getMonth ()+1;
        const year = dateObject.getFullYear();   
        return day + "\\" + month + "\\" + year; 
    }

    function finalStringMaker(formatedDate){
        const finalString = firstName.current.value + lastName.current.value + personalId.current.value + password.current.value + formatedDate;
        return finalString;
    }

    // function hashMaker(newString){
    //     const { createHash } = require('crypto');

    //     const hash = () => {
    //     return createHash('sha256').update(newString).digest('hex');
    //     }
    //     return hash;
    // }

    return (
        // <form /*style={styles.form} *//* onSubmit={JO}*/ >
        <div>
            <form onSubmit={entryFormHandler} > 
                <h1>Entry Data</h1>
                <input type = "text" placeholder='First name' ref={firstName} required/>
                <input type = "text" placeholder='Lastname' ref={lastName} required/>
            <input style={styles.input}  type = "text" placeholder ='Pesronal ID' ref={personalId} required/>
            <input type = "password" placeholder='password' ref={password} required/>
            <div>
            <input type="date" ref={startingDate} required/>

            <input type="date" ref={endingDate} required/>

            </div>

            <button>Submit </button>

            </form>
        </div>

    );
}

export default EntryForm;



 