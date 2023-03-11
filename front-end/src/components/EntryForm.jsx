import styles from './EntryForm.module.css';
import React, { useState,useRef } from 'react';
import sha256 from 'js-sha256';
import { useNavigate } from "react-router-dom";





function EntryForm(props){
    const navigate = useNavigate();

    const firstName = useRef();
    const lastName = useRef();
    const personalId = useRef();
    const password = useRef();
    const startingDate = useRef();
    const endingDate = useRef();
    const [hashes,setHashes] = useState([]);

    function entryFormHandler(event){
        event.preventDefault();
    
        const formatedDates = dateFormater(startingDate.current.value,endingDate.current.value);
        
        const finalStringsArray = finalStringMaker(formatedDates);
        
        const hashStringStart = hashMaker(finalStringsArray);

        props.setHashes(hashStringStart);

        navigate("/Data");
        // return hashStringStart;
    }

    function dateFormater(dateStart, dateFinal){
        const dateObjectStart = new Date(dateStart);
        const dateObjectFinal = new Date(dateFinal);
        var daysOfYear = [];
        
        for (dateObjectStart; dateObjectStart <= dateObjectFinal; dateObjectStart.setDate(dateObjectStart.getDate() + 1)) {
                const day =dateObjectStart.getDate();
                const month =dateObjectStart.getMonth ()+1;
                const year = dateObjectStart.getFullYear(); 
            daysOfYear.push(day + "\\" + month + "\\" + year);   
        }
        
        return daysOfYear; 
    }

    function finalStringMaker(formatedDateArray){
        const finalStrings = []; 
        formatedDateArray.map((formatedData)=>{
            const finalString = firstName.current.value + lastName.current.value + personalId.current.value + password.current.value + formatedData;
                finalStrings.push(finalString);
        });
        return finalStrings;
        
    }

    function hashMaker(startingStrings){
        const hashes = [];
        startingStrings.map((newString)=>{
            hashes.push(sha256(newString).toString());
        });
        console.log(hashes);

        return hashes;
    }

    return <div >
        
        <form onSubmit={(event)=> {entryFormHandler(event);} } > 
                <h1>Entry Data</h1>
                <input type = "text" placeholder='First name' ref={firstName} required/>
                <input type = "text" placeholder='Lastname' ref={lastName} required/>
            <input style={styles.input}  type = "text" placeholder ='Pesronal ID' ref={personalId} required/>
            <input type = "password" placeholder='Password' ref={password} required/>
            <div>
            <input type="date" ref={startingDate} required/>

            <input type="date" ref={endingDate} required/>

            </div>
            <button>Submit</button>

            </form>
        </div>
    ;
}
export default EntryForm;



 