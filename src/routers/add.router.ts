import { FastifyPluginAsync, FastifyReply } from "fastify";
import { AnyKeys } from "mongoose";
import { Cat } from "../models/cats";

const form = async (request: any, reply: FastifyReply) => {
    console.log("Tenemos DATA!");
    const { name, color, peso } = request.body;
    const kitty = new Cat({ name, peso, color });
    await kitty.save();
    reply.redirect("/")
}

export const add_router: FastifyPluginAsync = async (app) => {
    app.post("/form", form)
}