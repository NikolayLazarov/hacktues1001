const express = require('express')

const app = express()
const port = 3000
const hostname = '0.0.0.0';

const pushData = async (req,res) => {
    console.log(req.body);
    
    res.send({"ok":1});
}

app.use(express.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === "OPTIONS"){
        res.header('Access-Control-Allow-Methods','PUT, PATCH, DELETE, GET, POST');
        return res.status(200).json({})
    }
    next()
})


app.get('/date', (req, res) => {
    const date = new Date();
    let d = date.getDate().toString()+"/"
        +(date.getMonth()+1).toString()+"/"
        +date.getFullYear().toString()
    res.send({'date':d})
})

app.post('/m', pushData)

app.listen(port, hostname, () => {
  console.log(`Example app listening  ${hostname} on port ${port}`)
})
