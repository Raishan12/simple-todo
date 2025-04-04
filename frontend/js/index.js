async function getData(){
    const res = await fetch("http://localhost:3000/gettasks")
    const data = await res.json()
    console.log(data);

    let st = ""
    
    data.forEach(e=>{
        let simgs = ""
        e.image.forEach(el=>{
            simgs += `&nbsp;<img src="${el}" id="todoimg">`
        })


        st+=`
        <div class="todolist" id="todolist">
        <div class="buttons">
        <div class="task" ><input onchange="statusChange('${e._id}','${e.status}')" type="checkbox" ${e.status?"checked":""}/><span style="text-decoration:${e.status?'line-through':''}">${e.task}</span>&nbsp;${simgs}</div>
                <button onclick="updatefn('${e._id}', '${e.task}')">Edit</button>
                <button onClick='deleteTask("${e._id}")'>Delete</button>
            </div> 
        </div>
        `
    })
    document.getElementById("todo").innerHTML=st
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
            body:JSON.stringify({task,image})
        })
        const data = await res.json()
        if(res.status==201){
            getData()
            document.getElementById("task").value=""
            document.getElementById("file").value=""
            document.getElementById("img").innerHTML=""
            image = []
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
        if (response.status==200) {
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

let image=[]

document.getElementById("taskForm").addEventListener("change",async(e)=>{
    console.log(e.target.files)
    let str = ""
    i=0
    for (let file of e.target.files) {
        let resu = await convertBase64(file)
        image.push(resu)
        str += `<img src="${resu}" alt="no image selected" id="imgs"></img>`
    }
    console.log(image);
    
    
    document.getElementById("img").innerHTML=str
})

function convertBase64(file){


    return new Promise((resolve, reject)=>{
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)

        fileReader.onload=()=>{
            resolve(fileReader.result)
        }

        fileReader.onerror=(error)=>{
            reject(error)
        }

    })
    
}


async function statusChange(id, status){
    if(status=="true"){
        console.log("true");
        
        cstatus = false
    }else{
        console.log("false");
        
        cstatus = true
    }


    try{
        const response = await fetch(`http://localhost:3000/status/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status : cstatus}),
        });
        if (response.status==200) {
            alert("Task Completed");
            getData();
        }
    }
    catch(error){
        console.log(error)
    }
}




// document.querySelectorAll("input[type=checkbox]").forEach(e=>{
//     e.addEventListener("change",async()=>{
//         console.log("checked");
        
//      let torf;
//      let id =this.id
//         try{
    
//             if(this.checked){
//                 torf = true
//             }else{
//                 torf = false
//             }
    
//             const response = await fetch(`http://localhost:3000/status/${id}`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ status: torf }),
//             });
//             if (response.status==200) {
//                 alert("Task Completed");
//                 getData();
//             }
//         }
//         catch(error){
//             console.log(error)
//         }
//     })
// })







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
