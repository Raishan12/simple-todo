import express from "express"
import connection from "./connection.js"
import todoSchema from "./models/todo_model.js"
import path from "path"
import { fileURLToPath } from "url"
const app = express()
const port = 3000

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const frontend = path.join(__dirname, "..", "frontend")

app.use(express.static(frontend))
app.use(express.json({limit:"100mb"}))

app.post("/addtask", async (req, res) => {
    console.log(req.body);
    try {
        const { task,image } = req.body
        console.log(task)
        if(!task)
            return res.status(404).send({error: "task is required"})
        const data = await todoSchema.create( {task,image} )
        res.status(201).send(data)
    }catch(err) {
        res.status(500).send({error:err})
    }
})

app.get("/gettasks", async(req,res)=>{
    try {
        const data = await todoSchema.find()
        res.status(200).send(data)
    } catch(err) {
        res.status(500).send({error: err})
    }
})

app.post("/update/:id", async (req, res) => {
    try {
        const { id } = req.params
        let task = req.body.task
        const data = await todoSchema.findByIdAndUpdate(
            id,
            {task},
            {new:true}
        )
        res.status(200).send(data)
    } catch(err) {
        res.status(500).send({error: err})
    }
});

app.get('/delete/:id',async(req,res)=>{
    try {
        const { id } = req.params
        const data = await todoSchema.findByIdAndDelete(
            id,
            {new:true}
        )
        res.status(200).send(data)
    } catch(err) {
        res.status(500).send({error: err})
    }
})

app.post("/status/:id", async (req, res) => {
    try {
        const { id } = req.params
        console.log(id);
        
        let status = req.body.status
        console.log(status);
        
        const data = await todoSchema.findByIdAndUpdate(
            id,
            {status},
            {new:true}
        )
        res.status(200).send(data)
    } catch(err) {
        res.status(500).send({error: err})
    }
});


console.log("asdasd");


connection().then(() => {
    console.log("xzczxczxc");
    
    app.listen(port, () => {
        console.log(`server running at http://localhost:${port}`)
    })
}).catch((err)=>console.log(err))