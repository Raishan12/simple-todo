import mongoose from "mongoose"

const todoSchema = new mongoose.Schema({
    task: {type:String, required:true},
    image: {type:Array, required:true},
    status: {type:Boolean, required:true, default: false},
    date: {type: Date, required:true, default:Date.now}
})

export default mongoose.model.Todos || mongoose.model("Todo",todoSchema)