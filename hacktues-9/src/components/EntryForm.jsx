import styles from './EntryForm.module.css';

function EntryForm(){
    return (
        <form /*style={styles.form} */>

            <h1>Entry data</h1>
        <input type = "text" placeholder='First name' />
        <input type = "text" placeholder='Lastname' />
        <input style={styles.input}  type = "text" placeholder ='Pesronal ID'/>
        <input type = "password" placeholder='password' />

            <button>Enter</button>
      </form>   
    );
}

export default EntryForm;