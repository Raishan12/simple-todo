async function getData(){
    const res = await fetch("http://localhost:3000/gettasks")
    const data = await res.json()
    console.log(data);

    let str = ""
    data.forEach(e=>{
        str+=`
        <div class="todolist" id="todolist">
            <div class="task" ><input type="checkbox" ${e.status?"checked":""}/><span >${e.task}</span></div>
            <div class="buttons">
                <button onclick="updatefn('${e._id}', '${e.task}')">Edit</button>
                <button onClick='deleteTask("${e._id}")'>Delete</button>
            </div> 
        </div>
        `
    })
    document.getElementById("todo").innerHTML=str
}
getData()

current_id=null
 
function updatefn(id, task){
    document.getElementById("task").value = task
    document.getElementById("sbtn").value = "Update"
    current_id = id
}

document.getElementById('taskForm').addEventListener('submit', async (e)=>{
    e.preventDefault()
    let task = document.getElementById("task").value
    if(current_id){
        await updateTask(current_id,task)
        current_id = null
    }
    else{
        await addTask(task)
    }
})


async function addTask(task){
    try{

        const res = await fetch('http://localhost:3000/addtask',{
            method:"POST",
            headers:{'Content-Type':"application/json"},
            body:JSON.stringify({task})
        })
        const data = await res.json()
        if(res.status==201){
            getData()
            document.getElementById("task").value=""
            alert("Task Added")
        }
        else{
            alert(data.error)
        }
    }
    catch(error){
        console.log(error)
    }
}

async function updateTask(id,updated_task) {
    try{
        const response = await fetch(`http://localhost:3000/update/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: updated_task }),
        });
        if (response.ok) {
            alert("Task Updated");
            document.getElementById("task").value=""
            document.getElementById("sbtn").value = "Submit"
            getData();
        }
    }
    catch(error){
        console.log(error)
    }
}



async function deleteTask(id) {
    
    const res = await fetch(`http://localhost:3000/delete/${id}`)
    const data = res.json()
    if(res.status==200){
        getData()
        alert("Task Deleted")
    } else {
        alert(data.error)
    }
  }



// document.getElementById("taskForm").addEventListener("submit", async(e)=>{
//     e.preventDefault()
//     try {
//         const task = document.getElementById("task").value
//         const res = await fetch("http://localhost:3000/addtask",{
//             method: "POST",
//             headers: {"Content-Type":"application/json"},
//             body: JSON.stringify({ task })
//         })

//         const data = await res.json()
//         if(res.status==201){
//             getData()
//             document.getElementById("task").value=""
//             alert("Task Added")
//         } else {
//             alert(data.error)
//         }
//     } catch(err) {
//         console.log(err)
//     }
// })
