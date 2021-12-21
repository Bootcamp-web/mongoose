
import mongoose,{ Document, Schema } from "mongoose";
import { Cat } from "./models/cats"
import {DB_URL} from "./config"



(async ()=>{
    await mongoose.connect(DB_URL);
   
    await Cat.collection.drop();
    for (let i = 0; i < 10; i += 1) {
        const kitty = new Cat({ name: `Garfield-${i + 1}`, peso:15});
        const doc = await kitty.save();
        console.log(`meow! Created cat ${kitty.name} with objectid ${doc._id}`, doc._id);
    }
   
    await mongoose.disconnect().then(()=> console.log("byebye"));

})();