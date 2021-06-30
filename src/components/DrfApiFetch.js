import React, {useState, useEffect} from 'react';
import axios from 'axios';

const DrfApiFetch = () => {

  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState([])
  const [id, setId] = useState(1)
  const [editedTask, setEditedTask] = useState({id:'', title:''})

  useEffect(()=>{
    axios.get('http://localhost:8000/api/tasks/',{
      headers: {
        'Authorization': 'Token 4880bc758087d512163b7568425e60f6c50e5f7a',
      }
    })
    .then(res => setTasks(res.data))
  },[])

  const getTask = () => {
    axios.get(`http://localhost:8000/api/tasks/${id}/`,{
      headers: {
        'Authorization': 'Token 4880bc758087d512163b7568425e60f6c50e5f7a',
      }
    })
    .then(res => setSelectedTask(res.data))
  }

  const deleteTask = (id) => {
    axios.delete(`http://localhost:8000/api/tasks/${id}/`,{
      headers: {
        'Authorization': 'Token 4880bc758087d512163b7568425e60f6c50e5f7a',
      }
    })
    .then(res => {setTasks(tasks.filter(task=> task.id !== id)); setSelectedTask([])})
  }

  const newTask = (task) => {

    const data = {
      title: task.title,
    }

    axios.post(`http://localhost:8000/api/tasks/`, data,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token 4880bc758087d512163b7568425e60f6c50e5f7a',
      }
    })
    .then(res => setTasks([...tasks, res.data]))
  }

  const editTask = (task) => {

    axios.put(`http://localhost:8000/api/tasks/${task.id}/`, task,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token 4880bc758087d512163b7568425e60f6c50e5f7a',
      }
    })
    .then(res => {setTasks(
      tasks.map(task=> (task.id === editedTask.id ? res.data: task))
    )
    setEditedTask({id: '', title: ''})
    })
  }

  const handleInputChange = (evt) => {
    const value = evt.target.value;
    const name = evt.target.name;
    setEditedTask({...editedTask, [name]: value})
  }


  return (
    <div>
      <ul>
        {
          tasks.map(task=> <li key={task.id}>{task.title} {task.id}
          <button onClick={()=>deleteTask(task.id)}>
            Delete
          </button>
          <button onClick={()=>setEditedTask(task)}>
            Edit
          </button>
          </li>)
        }
      </ul>

      Set id<br/>
      <input type='text' value={id} onChange={evt=>setId(evt.target.value)}></input>
      <br/>
      <button type='button' onClick={getTask}>Get task</button>

      <h3>{selectedTask.title} {selectedTask.id}</h3>

      <input type="text" name='title' value={editedTask.title}
        onChange={handleInputChange}
        placeholder='new Task'/>
      { editedTask.id? 
      <button onClick={()=>editTask(editedTask)}>Update</button>:
      <button onClick={()=>newTask(editedTask)}>Create</button>}
    </div>
  )
}

export default DrfApiFetch
