import React, { useState, useEffect,useRef } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Loading';
import ResponseMessages from '../ResponseMessages';
import EditTask from './EditTask';

export default function TasksList() {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const Navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tasksStatus, setTasksStatus] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [isEditTask, setEditTask] = useState('');

  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);

useEffect(()=>{
    const tasks = async() =>{

    try{
        const response = await axios.get(`http://127.0.0.1:8000/api/tasks-project/${projectId}`,{
          headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}`  }
        });

      setLoading(false);
      setTasks(response.data);

      const statusTypes = [...new Set(response.data.map(task=>task.status))];
      setTasksStatus(statusTypes);
        
    }catch(error){
      setLoading(false);
      console.error(error);
    }}

    tasks();

},[projectId]);

  const more = (taskId) =>{
    Navigate(`/project/${projectId}/task/${taskId}`)
  }

  const handleSearchChange = (event) =>{
    setSearchTerm(event.target.value);
  }

  const handleStatusFilterChange = (event) =>{
    setSelectedStatus(event.target.value);
  }

  const filterdDate = tasks
    .filter((tasks) =>tasks.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((tasks) => !selectedStatus || tasks.status === selectedStatus)


  const deleteTask = async(id)=>{

    if (window.confirm(`Are you sure you want to delete this Task`)) {
      try {
        const response =  await axios.delete(`http://localhost:8000/api/delete-task/${id}`, {
         headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
       });
       setSuccessMessage.current(response.data.message);

      }catch(error){
        setErrorMessage.current(`Error deleting Task:`, error);
      }
    }
    
  }

  
  

  if (loading) {
    return (
        <Loading />
    );
  }


  return (
    <div className='max-h-[75vh] overflow-y-auto bg-white '>

    {/* Edit task */}
    {
      isEditTask && (
        <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[80%]'>
                  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
              <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1"> Edit Task </h1>
              <button  onClick={()=>setEditTask('')} type='reset'  className='ml-auto items-center col-span-1'>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>
              
              <EditTask taskId={isEditTask} />
              
          </div>
        </div>
      )
    }

<ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

      <div  className="bg-[#ddd6fee2]   dark:bg-gray-900  rounded flex  p-2  my-1 mr-1 justify-between ">
    
        <input type='text' value={searchTerm}  onChange={handleSearchChange}  className="bg-gray-50 border w-32 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 mr-2" placeholder="Search"  />

        <select value={selectedStatus} onChange={handleStatusFilterChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 mr-2"  >
          <option value="">All Types</option>
          {
            tasksStatus.map(status =>(
              <option key={status} value={status}>{status}</option>
            ))
          }
        </select>
              
      </div>

    
      {
        filterdDate.map((task,index)=>(

          <div key={index}  className=" bg-gray-100 hover:bg-white shadow-xl rounded-xl p-4  z-0 my-2 mr-1 cursor-pointer ">
        
           <div onClick={(e)=>{e.stopPropagation(); more(task.id)}}>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-gray-900"> #{task.id} {task.name}</h3>
                
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${task.status === "In Progress" ? "bg-yellow-500/10 text-yellow-600" : "bg-green-500/10 text-green-600" }`}>{task.status}
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-2">{task.description}</p>

              <div className="flex justify-between items-center text-sm text-gray-600">
                <span className={`px-2 py-1 text-xs font-medium rounded-md ${task.priority === "High" ? "bg-red-500/10 text-red-600"  : task.priority === "Medium" ? "bg-orange-500/10 text-orange-600" : "bg-blue-500/10 text-blue-600" }`}> Priority: {task.priority}
                </span>
                <span className="font-medium">Progress: {task.progress}%</span>
              </div>

            </div>
           


            <div className='flex justify-between items-center '>

              <div className="mt-3 text-xs text-gray-500">
                <span className="font-semibold text-gray-800">Start:</span> {task.start_date} →  
                <span className="font-semibold text-gray-800"> End:</span> {task.end_date}
              </div>


              {
                ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                  <div className='flex space-x-1'>
          
                    <svg onClick={()=>setEditTask(task.id)}  xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z"/></svg>
                    <svg onClick={()=>deleteTask(task.id)} xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/></svg>

                  </div>
                )
              }

              
            </div>
          </div>

      ))
    }
    
    </div>
  )
}
