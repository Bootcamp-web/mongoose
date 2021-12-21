
import mongoose,{ Document, Schema } from "mongoose";

export interface Cat extends Document{
    name:string
}

const schema = new Schema ({
    name:String,
    color: { type: String, default: "orange" },
    peso: { type: Number, required: true }
})


export const Cat = mongoose.model<Cat>('Cat',schema)
