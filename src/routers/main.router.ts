
  
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import mongoose from "mongoose";
import { DB_URL } from "../config";
import { Cat } from "../models/cats";

const home = async (request: FastifyRequest, reply: FastifyReply) => {
    await mongoose.connect(DB_URL).then(() => console.log(`Connected to ${DB_URL}`));
    const cats = await Cat.find().lean();
    console.log("We have cats");
    const data = { title: "Cats' Palace", cats }
    reply.view("views/home", data);
}

export const main_router: FastifyPluginAsync = async (app) => {
    app.get("/", home)
}