require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');

// Mongo DB Connections



// Middleware Connections
app.use(cors())
app.use(express.json())


// Routes


// Connection
const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log('App running in port: '+PORT)
})