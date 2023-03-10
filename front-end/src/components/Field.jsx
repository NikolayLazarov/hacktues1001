import React from 'react';
import { useState } from 'react';
import './Field.css'


function Field()
{
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    }
    
      const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    }

    return (
        <div className="field">
            <input className="input" type="text" value="Title" onChange={handleTitleChange}/>
            <input className ="input" type="text" value="Description" onChange={handleDescriptionChange}/>
            <button> Submit </button>
        </div>
    );
    

}

export default Field;