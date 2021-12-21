# mongoose
1. [Introducción  yarn](#schema1)
2. [Arrancar yarn](#schema2)
3. [Instalar los paquetes necesarios](#schema3)
4. [Añadir el script para que compile Typescript y ejecutarlo](#schema4)
5. [Configurar eslint](#schema5)
6. [Añadir nuestras reglas a eslint](#schema6)
7. [Instalar mongoose](#schema7)
8. [Creamos un schema de datos para typescipt](#schema8)
9. [Arrancamos mongo compas y conectar  a mongo](#schema9)
10. [Cerramos la conexión de mongoose](#schema10)
11. [Refactorizando el código](#schema11)
12. [Creando seed de gatos y borramos la colecciónt](#schema12)
13. [Promise all](#schema13)
14. [Guardar el resultado en un archivo json con fs-extra](#schema14)

<hr>

<a name="schema1"></a>

# 1 Instalar Yarn 
Comprobar con 
~~~bash
yarn --version
~~~
Si tienen versión, no hace falta volver a instalar. Sino hay que hacer lo siguiente:
~~~bash
npm install --global yarn
~~~
<hr>

<a name="schema2 "></a>

# 2 Arrancar yarn
~~~bash
yarn init -y
~~~
<hr>

<a name="schema3"></a>

# 3 Instalar los paquetes necesarios
~~~bash
yarn add typescript ts-node-dev eslint  
~~~
<hr>

<a name="schema4"></a>

# 4 Añadir el script para que compile Typescript y ejecutarlo
~~~js
 "scripts": {
    "build": "tsc"
  },
~~~
~~~bash
yarn build tsc --init
~~~
<hr>

<a name="schema5"></a>

# 5 Configurar eslint
~~~bash
yarn run eslint --init
~~~

Después de esto hay que borrar la carpeta node-modules
y volver a instalar yarn
~~~bash
yarn install
~~~

<hr>

<a name="schema6"></a>

# 6 Añadir nuestras reglas a eslint
~~~js
  "rules": {
		"quotes": ["error", "double"],
		"no-console": "off",
		"indent": ["error", "tab"],
		"allowIndentationTabs": true
	}
~~~

<hr>

<a name="schema7"></a>
<hr>

# 7 Instalar mongoose
~~~bash
yarn add mongoose
~~~

<a name="schema8"></a>
<hr>

# 8 Creamos un schema de datos para typescipt
~~~ts
export interface Cat extends Document{
    name:string
}

const schema = new Schema ({
    name:String
})

const Cat = mongoose.model<Cat>('Cat',schema)
~~~

<a name="schema9"></a>
<hr>

# 9 Arrancamos mongo compas y conectar  a mongo
~~~
sudo systemctl start mongod
~~~
~~~
mongodb-compass
~~~
~~~
mongodb://localhost:27017
~~~
<a name="schema10"></a>
<hr>

# 10 Cerramos la conexión de mongoose
~~~ts
const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => {
    console.log('meow');
    mongoose.disconnect().then(()=> console.log("byebye"));
});

~~~

<a name="schema11"></a>
<hr>

# 11 Refactorizando el código
~~~ts
(async ()=>{
    await mongoose.connect('mongodb://localhost:27017/test');

    const Cat = mongoose.model<Cat>('Cat',schema)
    const kitty = new Cat({ name: 'Zildjian' });
    const doc = await kitty.save();
    console.log('meow',doc._id);
    await mongoose.disconnect().then(()=> console.log("byebye"));

})();
~~~
<a name="schema12"></a>
<hr>

# 12 Creando seed de gatos y borramos la colección
~~~ts
(async ()=>{
    await mongoose.connect('mongodb://localhost:27017/test');
    const Cat = mongoose.model<Cat>('Cat',schema)

    await Cat.collection.drop();
    for (let i = 0; i < 10; i += 1) {
        const kitty = new Cat({ name: `Garfield-${i + 1}`, peso: 40 });
        const doc = await kitty.save();
        console.log(`meow! Created cat ${kitty.name} with objectid ${doc._id}`, doc._id);
    }
   
    await mongoose.disconnect().then(()=> console.log("byebye"));

})();
~~~
<a name="schema13"></a>
<hr>

# 13 Creamos modelo de `cats.ts`
~~~ts
import mongoose,{ Document, Schema } from "mongoose";

export interface Cat extends Document{
    name:string
}

const schema = new Schema ({
    name:String,
    color: { type: String, default: "orange" },
    peso: { type: Number, required: true }
})
mongoose.connect('mongodb://localhost:27017/test');

export const Cat = mongoose.model<Cat>('Cat',schema)

~~~
<a name="schema14"></a>
<hr>

# 14 Instalamos  y creamos el archivo `seed.ts`
~~~
yarn add fastify fastify-static handlebars pino pino-pretty point-of-view fastify-formbody dotenv
~~~

El archivo `seed.ts` solo rellena la bbdd con información doomie
<a name="schema15"></a>
<hr>

# 15  Archivo `config.ts`
~~~ts
import dotenv from "dotenv"
dotenv.config();

const checkEnv = (envVar: string) => {
    if (!process.env[envVar]) {
        throw new Error(`Please define the Enviroment variable ${envVar}`)
    } else {
        return process.env[envVar] as string
    }
}

export const PORT: number = parseInt(checkEnv("PORT"), 10);
export const DB_URL: string = checkEnv("URL");
~~~

Y añadimos al archivo `seed.ts` 
~~~ts
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
~~~

<a name="schema16"></a>
<hr>

# 16 Archivo `server.ts`
~~~ts
import fastify from "fastify";
import { main_app } from "./app";
import { PORT } from "./config"

const server = fastify({
    logger: {
        prettyPrint: true
    },
    disableRequestLogging: false
})

server.register(main_app);

server.listen(PORT);
~~~

# 17 Traer todos lo gatos de la BBDD
~~~
const cats = await Cat.find().lean();
~~~

# 18 Archivo `main.router.ts` y  `add.router.ts`
`main.router.ts`
~~~ts
  
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
~~~

`add.router.ts`
~~~ts
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
~~~
