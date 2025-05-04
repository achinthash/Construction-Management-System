import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../Loading';

function AssignedTasks() {
    const [token, setToken] = useState(sessionStorage.getItem('token') || '');
    const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [statusTypes, setStatusTypes] = useState([]);

    const [expandTask, setExpandTask] = useState('');



    const usersTasks = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/my-tasks/${userInfo.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLoading(false);
            setMyTasks(response.data);

            const statusTypes = [...new Set(response.data.map(tasks => tasks.status))];
            setStatusTypes(statusTypes);

        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        usersTasks();
    }, []);

    const [searchTerm, setSearchTerm] = useState("");
    const handleSearch = (e) =>{
        setSearchTerm(e.target.value);
    }

    const filteredTasks = myTasks
    .filter((tasks) => tasks.title.toLowerCase().includes(searchTerm.toLowerCase()))
     .filter((tasks) => !statusFilter || tasks.status === statusFilter);
  

    if (loading) {
        return <Loading />;
    }

  
    const currentDate = new Date().toISOString().split('T')[0];

    return (
        <div className=" bg-gray-100 min-h-screen ">




            <div  className="bg-[#ddd6fee2]   dark:bg-gray-900  rounded flex md:flex-row flex-col p-1.5  my-1 mr-1 justify-between ">
                <h1 className="text-left sm:text-lg font-bold text p-1 text-[#5c3c8f] dark:text-white ">My Tasks</h1>
                
                <div className='flex justify-end'>
                    <input type='text' value={searchTerm} onChange={handleSearch}  className="bg-gray-50 border w-32 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 mr-2" placeholder="Search"  />

                    <select  value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1.5 mr-2"  >
                        <option value="">All</option>

                        {
                            statusTypes.map((status)=> (
                                <option key={status} value={status}>{status}</option>
                            ))
                        }
                       
                 
                    </select>
            
                </div>
            </div>


            <div className=" mx-auto p-3  -z-10">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                            <div  onClick={() => setExpandTask(prev => prev === task.id ? '' : task.id)}  key={task.id} className={`bg-white shadow-lg relative rounded-lg p-4 border-l-4 
                                ${task.status === 'pending' ? 'border-yellow-500' : task.status === 'planning' ? 'border-blue-500' : 'border-green-500'}
                                ${task.date === currentDate ? 'bg-yellow-100' : ''}`}>

                                <span className='flex justify-between items-center flex-wrap mb-2'> 
                                    <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                                    <p className="text-gray-500 font-bold text-right text-xs">Date: {task.date}</p>
                                </span>


                                <p className={`text-sm font-semibold mt-2 text-right ${task.status === 'pending' ? 'text-green-500' : task.status === 'planning' ? 'text-blue-500' : 'text-red-500'} `} >
                                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                </p>


                                <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                        
                               
                                <p className="text-gray-600 text-sm">Project: {task.project_name}</p>
                                <p className="text-gray-600 text-sm">Task: {task.task_name}</p>
                                                            

                                <div className='w-full col-span-4'>
                                    <hr className='border-t-3 border-gray-800 my-2'></hr>
                                </div>

                                <span className='flex justify-between items-center flex-wrap mb-2'> 
                                    <p className="text-gray-700 text-xs">Start Time: {task.start_time || 'N/A'}</p>
                                    <p className="text-gray-700 text-xs">End Time: {task.end_time || 'N/A'}</p>
                                    <p className="text-gray-700 text-xs">Work Quality: {task.work_quality || 'N/A'}</p>
                                </span>

                                {
                                    expandTask === task.id && (
                                        <div className=" p-2 mt-2 rounded">
                                            <p className="text-sm text-gray-700 mb-1"><strong>Description:</strong> {task.description || 'None'}</p>
                                        
                                        </div>
                                    )
                                }


                                {/* const [expandTask, setExpandTask] = useState(''); */}

                                

                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No tasks found</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AssignedTasks;
