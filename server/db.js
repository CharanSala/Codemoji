const mongoose =require('mongoose');

const connectDB=async () =>{

    try{
        const conn=await mongoose.connect('mongodb+srv://salacharan81:Charan@081@cluster0.s8n2p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log('MongoDB connected: ${conn.connection.host}');
    }catch(error){
        console.error(error);
        process.exit(1);
    }
}
module.exports=connectDB;