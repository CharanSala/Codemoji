// mongodb+srv://salacharan81:<db_password>@cluster0.s8n2p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const express = require('express')
const connectDB =require('./db.js')

const app= express()
connectDB()

app.listen(3000,()=>{
    console.log("app is running");
})