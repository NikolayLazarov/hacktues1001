import styles from './EntryForm.module.css';
import React, { useState } from 'react';

function EntryForm(){

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

        let tempContract = new ethers.Contract(contractAddress, ... , tempSigner);
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

    return (
        <form /*style={styles.form} */ onSubmit={entryFormHandler} /* onSubmit={JO}*/ >

            {/* <h1>Entry data</h1>
        <input type = "text" placeholder='First name' />
        <input type = "text" placeholder='Lastname' />
        <input style={styles.input}  type = "text" placeholder ='Pesronal ID'/>
        <input type = "password" placeholder='password' /> */}

            <button >Enter and {connectionButtonText}</button>
            <h3>Address: {defaultAccount}</h3>
            {errorMessage}
            
      </form>   
    );
}

export default EntryForm;