console.log("Success");
async function getData(){
    const res = await fetch("/getdata")
    const data = await res.json()
    console.log(data);

    let str = ""
    data.forEach(e=>{
        str+=`
        <div class="todolist" id="todolist">
            <div class="task">${e.task}</div>
            <div class="buttons">
                <button type="submit" onclick="updatefn('${e._id}', '${e.task}')">Edit</button>
                <a href="/delete/${e._id}"><div class="btn bt">Delete</div></a>
            </div> 
        </div>
        `
    })
    document.getElementById("todo").innerHTML=str
}
getData()

function updatefn(id, task){
    console.log("asdasd")
    
    document.getElementById("task").value = task
    document.getElementById("sbtn").value = "Update"
    const form = document.getElementById("taskForm")
    form.action = `/update/${id}`
}