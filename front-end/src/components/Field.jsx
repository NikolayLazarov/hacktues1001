import React, { useEffect } from 'react';
import { useState } from 'react';
import './Field.css'


function Field(props)
{   
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

  const [contract, setContract] = useState(null);

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    }
    
      const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    }
    // useEffect(()=>{
    //     let tempContract = new ethers.Contract(contractAddress,contractABI.abi, props.signer);
    //     setContract(tempContract);
    // });
    //     // json ->string ->hex -> 
    //     // lekar-> Ime, Lastname, egn, parola, date
    // async function postNewData(){
    //     props.hash.map(()=>{
            
    //     });
    // }
    return (
        <div className="field">
            <input className="input" type="text" value="Title" onChange={handleTitleChange}/>
            <input className ="input" type="text" value="Description" onChange={handleDescriptionChange}/>
            <button> Submit </button>
        </div>
    );
    

}

export default Field;