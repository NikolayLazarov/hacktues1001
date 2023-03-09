const fetch = require('node-fetch');

fetch("http://10.1.186.33:3000/m", {
  method: "POST", // or 'PUT'
  headers: {
    "Content-Type": "application/json",
  },
  body: {"ok":1}
})