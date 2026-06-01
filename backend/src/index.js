import "dotenv/config";
import connectDB from "./db/index.db.js";
import app from "./app.js"
import mongoose from "mongoose";

// dotenv.config({
//     path: './.env',
// }); 

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server Running On ${process.env.PORT}`);
            console.log("Database:", mongoose.connection.name);
        });
    })
    .catch((e) => {
        console.log(`Database Connection Error: ${e}`);
    })