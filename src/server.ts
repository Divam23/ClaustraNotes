import {app} from "./app";
import { configDotenv } from "dotenv";
import { connectDB } from "./config/db.config";

configDotenv();

const PORT = process.env.PORT || 1500;

connectDB().then(
    ()=>{
        app.listen(PORT, ()=>{
            console.log(`Server is running on PORT:${PORT}`)
        } )
    }
).catch(
    (error)=>{
        console.log("Mongo DB Connection failed---", error)
    }
)
