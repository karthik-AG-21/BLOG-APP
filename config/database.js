import mongoose from 'mongoose';

const mongoDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("database is connected");
        
    }catch (err){
        console.log('something is wrong ', err);
        
    }
}
export default mongoDB;



