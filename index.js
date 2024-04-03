const connectToMongo = require('./db');

connectToMongo();

const express = require('express')
const app = express()
const port = 5001

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(port,()=>{
    console.log(`Expample of listening at${port}`)
})