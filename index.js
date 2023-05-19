const express=require('express')
const app = express()
const cors =require('cors')
require("dotenv").config();
const port =process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())



app.get('/',(req,res)=>{
    res.send("robot toy store is Booking");
})

app.listen(port,()=>{
    console.log(`robot toy store is running port: ${port}`)
})
