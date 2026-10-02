
const cl = console.log;

const todoForm = document.getElementById('todoForm');
const formControl = document.getElementById('formControl');
const updateBtn = document.getElementById('updateBtn');
const addBtn = document.getElementById('addBtn');



const BASE_URL = `https://crud-i-d1819-default-rtdb.asia-southeast1.firebasedatabase.app/`;
const TODOS_URL = `${BASE_URL}/todos.json`;


const state = {
  todosArr : [],
  editID : null
}

function showHideSpinar(flag) {
  if (flag) {
    spinner.classList.remove('d-none')
  } else {
    spinner.classList.add('d-none')
  }
}

function snackBar(msg , icon){
  Swal.fire({
    title : msg,
    icon : icon,
    timer : 3000
  })
}

function objToArr(obj){
    for (const key in obj) {
        obj[key].id = key;
        state.todosArr.unshift(obj[key])      
    }
}

function renderTodos(arr){
  const todosContainer = document.getElementById('todosContainer')
  let res = ``;
  arr.forEach(t => {
    res += `
              <li class="list-group-item d-flex justify-content-between" id="${t.id}">
                        <strong>${t.todoName}</strong>
                            <div>
                                <button onclick="onEditTodo(this)" class="btn btn-outline-warning"> EDIT</button>
                                <button onclick="onRemoveTodo(this)" class="btn btn-outline-danger removeBtn"> REMOVE</button>
                           </div>
                           </li>
    `
  })
  todosContainer.innerHTML = res;

}


function fetchTodos(){
  showHideSpinar(true)
  fetch(TODOS_URL, {
    method : "GET",
    body : null,
    headers : {
      "content-type" : "application/json",
      "Auth" : "JWT TOKEN from LS"
    }
  })
  .then(res => {
    // cl(res)
    if(!res.ok){
      throw new Error(`Error.....`)
    }
    return res.json()
  })
  .then(data => {
    // cl(data)
    objToArr(data)
    renderTodos(state.todosArr)
  })
  .catch( err =>{
    snackBar(err)
  })
  .finally(() =>{
    showHideSpinar()
  })
}
fetchTodos()



function onTodoCreate(eve){
  eve.preventDefault();

  let newObj = {
      todoName : formControl.value
  }
  showHideSpinar(true)
  fetch(TODOS_URL, {
    method : "POST",
    body : JSON.stringify(newObj),
    headers : {
          "content-type" : "applicaiton/json",
          "Auth" : "JWT TOKEN from LS"
    }    
  })
  .then(res => {
      if(!res.ok){
        throw new Error(`Error.....`)
      }
      return res.json()
    })
    .then(data => {
      newObj.id = data.name
      let li = document.createElement('li');
      li.className = `list-group-item d-flex justify-content-between`;
      li.id = data.name;
      li.innerHTML = `
                       <strong>${newObj.todoName}</strong>
                            <div>
                                <button onclick="onEditTodo(this)" class="btn btn-outline-warning"> EDIT</button>
                                <button onclick="onRemoveTodo(this)" class="btn btn-outline-danger removeBtn"> REMOVE</button>
                           </div>
      `
      todosContainer.prepend(li)
      todoForm.reset()
      snackBar(`The todo is Added Successfully !!!`, 'success')
    })
    .catch(err => [
        snackBar(err)
    ])
    .finally(() =>{
      showHideSpinar()
    })
}

function onEditTodo(ele){
  let EDIT_ID = ele.closest('li').id
  state.editID = EDIT_ID
  let EDTI_URL = `${BASE_URL}/todos/${EDIT_ID}.json`
  showHideSpinar(true)
  fetch(EDTI_URL, {
    method: "GET",
    body: null
  })
  .then(res => {
    if(!res.ok){
      throw new Error(`Error.....!`)
    }
    return res.json()
  })
  .then(data => {
      formControl.value = data.todoName
      let li = document.getElementById(EDIT_ID)
      li.querySelector('.removeBtn').disabled = true;
      updateBtn.classList.remove('d-none')
      addBtn.classList.add('d-none')
  })
  .catch(err => {
    snackBar(err)
  })
  .finally(() => {
    showHideSpinar()
  })
  
}

function onUpdateTodo(ele){
  let UPDATE_ID = state.editID
  // cl(UPDATE_ID)
  let UPDATE_URL =`${BASE_URL}/todos/${UPDATE_ID}.json`

  let updateOBJ = {
    todoName : formControl.value,
    id : UPDATE_ID
  }
// cl(updateOBJ)
  fetch(UPDATE_URL, {
    method : "PATCH",
    body : JSON.stringify(updateOBJ),
    headers : {
      "content-type" : "application/json",
      "Aut" : "JWT TOKEN from LS"
    }
  })
  .then(res => {
    if(!res.ok){
      throw new Error('Error.....')
    }
    return res.json()
  })
  .then(data => {
      let getIndex = state.todosArr.findIndex(t => t.id === UPDATE_ID)
      state.todosArr[getIndex] = updateOBJ
      let li = document.getElementById(UPDATE_ID);
      li.innerHTML = `<strong>${updateOBJ.todoName}</strong>
                            <div>
                                <button onclick="onEditTodo(this)" class="btn btn-outline-warning"> EDIT</button>
                                <button onclick="onRemoveTodo(this)" class="btn btn-outline-danger removeBtn"> REMOVE</button>
                           </div>`

                      todoForm.reset()
                      updateBtn.classList.add('d-none')
                      addBtn.classList.remove('d-none')
      snackBar(`The todo is Updated Successfully !!!`, 'success')
            
  })
  .catch(err => {
    snackBar(err)
  })

}

function onRemoveTodo(ele){
  let REMOVE_ID = ele.closest('li').id;
  // cl(REMOVE_ID)
  let REMOVE_URL = `${BASE_URL}/todos/${REMOVE_ID}.json`;
   Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, Remove it!"
}).then((result) => {
  if (result.isConfirmed) {
     showHideSpinar(true)
  fetch(REMOVE_URL, {
    method : "DELETE",
    body : null,
    headers : {
      "content-type" : "application/json",
      "Auth" : "JWT TOKEN from LS"
    }
  })
  .then(res => {
      if(!res.ok){
        throw new Error('Error.....!')
      }
      return res.json()
  })
  .then(data => {
      let getIndex = state.todosArr.findIndex(t => t.id === REMOVE_ID)
    state.todosArr.splice(getIndex, 1)
    ele.closest('li').remove()
      snackBar(`The todo is Removed Successfully !!!`, 'success')
  })
  .catch(err => {
    snackBar(err)
  })
  .finally(() => {
    showHideSpinar()
  })
  
  }
});
 
}

todoForm.addEventListener('submit', onTodoCreate)
updateBtn.addEventListener('click', onUpdateTodo)







//    Swal.fire({
//   title: "Are you sure?",
//   text: "You won't be able to revert this!",
//   icon: "warning",
//   showCancelButton: true,
//   confirmButtonColor: "#3085d6",
//   cancelButtonColor: "#d33",
//   confirmButtonText: "Yes, delete it!"
// }).then((result) => {
//   if (result.isConfirmed) {
//     let getIndex = state.todosArr.findIndex(t => t.id === REMOVE_ID)
//     state.todosArr.splice(getIndex, 1)
//     ele.closest('li').remove()
//       snackBar(`The todo is Removed Successfully !!!`, 'success')
  
//   }
// });



























