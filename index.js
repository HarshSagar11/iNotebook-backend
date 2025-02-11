const connectToMongo = require('./db');

connectToMongo();

const express = require('express')
const app = express()
var cors = require('cors')

app.use(cors())
const port = 5001

app.use(express.json())

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port,()=>{
    console.log(`Expample of listening at${port}`)
})