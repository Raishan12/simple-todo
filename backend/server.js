import express from "express"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
// import { mongoose } from "mongoose"
import { MongoClient, ObjectId } from "mongodb"

const client = new MongoClient("mongodb://127.0.0.1:27017")
const __dirname = dirname(fileURLToPath(import.meta.url))
const frontend = join(__dirname, "..", "frontend")

const app = express()
let collection;
async function connectDb() {
    try {
        await client.connect()
        const db = client.db("tododb")
        collection = db.collection("todo")
        console.log("DB Connected");
        app.listen(3000, () => {
            console.log("server running at http://localhost:3000")
        })

    } catch (error) {
        console.log(error);
    }
}
connectDb()

app.use(express.static(frontend))

app.use(express.urlencoded())

app.post("/send-data", async (req, res) => {
    console.log(req.body);
    await collection.insertOne(req.body)
    res.status(200).sendFile(join(frontend, "index.html"))
})

app.get("/getdata", async (req, res) => {
    const todo = await collection.find({}).toArray()
    console.log(todo);
    res.status(200).send(JSON.stringify(todo))
})

app.post("/update/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: req.body });
    res.status(200).sendFile(join(frontend, "index.html"))
});

app.get("/delete/:id", async (req, res) => {
    const { id } = req.params
    await collection.deleteOne({ _id: new ObjectId(id) })
    res.status(200).sendFile(join(frontend, "index.html"))
});