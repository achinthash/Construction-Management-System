import React, { useState,useEffect,useRef } from 'react';
import NavigationBar from '../NavigationBar';
import NewProject from './NewProject';
import axios from 'axios';

import Loading from '../Loading';
import CustomSimpleTable from '../Tables/CustomSimpleTable';
import EditProject from './EditProject';

export default function Projects() {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));

  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState([]);
  const [isNewProject, setIsNewProject] = useState(false);
  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedProjectType, setSelectedProjectType] = useState("");
  
  useEffect(()=>{

    const projectsList = async() =>{

      try{

        const response = await axios.get(`http://localhost:8000/api/projects/${userInfo.id}`,{
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });

        const formattedProjects = response.data.map(project => ({
          ...project, 
          start_date : project.start_date ?  project.start_date.substring(0, 10) : '',
          end_date : project.end_date ? project.end_date.substring(0, 10) : '',
        }));

        setAllProjects(formattedProjects);

        const projectTypes = [...new Set(response.data.map(projects => projects.type))]
        setProjectTypes(projectTypes);

        setLoading(false);

      }catch(error){
        setLoading(false);
        console.error(error);
      }
    }

    projectsList();

  },[userInfo.id]);


  const statusTypes = allProjects.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
 

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'type', label: 'Type' },
    { id: 'progress', label: 'Progress' },
    { id: 'status', label: 'Status' },
    { id: 'start_date', label: 'Start Date' },
    { id: 'end_date', label: 'End Date' },

    
    ...(userInfo?.role === 'admin' ? [{ id: 'action', label: 'Action' }] : [])
    
    
  ];
  

  const [searchTerm, setSearchTerm] = useState(""); 

     // Handle search term change
 const handleSearchChange = (event) => {
  setSearchTerm(event.target.value);
   
};


const handleCategoryFilterChange = (event) => {
  setSelectedProjectType(event.target.value);

};

const handleDelete = (projectId) => {
  setAllProjects(allProjects.filter(projects => projects.id !== projectId));
};


  // Filter data based on search and role filter
  const filteredData = allProjects
  .filter((projects) => projects.name.toLowerCase().includes(searchTerm.toLowerCase()))
  .filter((projects) => !selectedProjectType || projects.type === selectedProjectType);


  // edit item
  const [itemEdit , setItemEdit] = useState(""); 

  const handleEdit  = (selectedId)=>{
    if(selectedId){
      setItemEdit(selectedId);
    }
  }

  


  if (loading) {
    return (
        <Loading />
    );
}


  return (
    <>
   {/* new project */}
   {
      isNewProject && (
        <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
              <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  New Project </h1>
              <button  onClick={()=>setIsNewProject(false)} type='reset'  className='ml-auto items-center col-span-1'>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>
              
              <NewProject />
              
          </div>
        </div>
      )
    }


      {/* edit item */}
      {
      itemEdit && (
        <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] '>  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
              <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  Edit Project </h1>
              <button  onClick={()=>setItemEdit('')} type='reset'  className='ml-auto items-center col-span-1'><svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
                          
              <EditProject selectedId={itemEdit}/> 
              
          </div>
        </div>
      )
    }

 

    <div className='overflow-y-hidden  h-screen'  > 

    <NavigationBar />
    

    <div id="header" className="bg-[#ddd6fee2]   dark:bg-gray-900  rounded flex flex-col sm:flex-row p-2  my-1 mx-1 justify-between ">
      <h1 className="text-left sm:text-xl font-bold text p-2 text-[#5c3c8f] dark:text-white ">Projects </h1> 

      <div className='flex items-center justify-end'>

        <input type='text'  value={searchTerm} onChange={handleSearchChange}  className="bg-gray-50 border sm:w-32 w-28 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-2" placeholder="Search"  />

        <select value={selectedProjectType} onChange={handleCategoryFilterChange} className="bg-gray-50 border sm:w-32 w-28 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-2"  >
        <option value="">All Types</option>
            {projectTypes.map(types => (
                <option key={types} value={types}>{types}</option>
            ))} 
        </select>

        {
          userInfo?.role === 'admin' && (
            <>
              <button onClick={()=>setIsNewProject(true)} className="py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 hidden md:block"> New Project  </button>
              <button  onClick={()=>setIsNewProject(true)} className="md:hidden block py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>  </button>
            </>
          )
        }

        
      </div>

    </div>


    <div className='overflow-y-auto  h-[80vh]'>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-4 mx-4 ml-2">
        {Object.entries(statusTypes).map(([status, count]) => (
          <div key={status} className="bg-[#f7f4f9] overflow-hidden shadow-lg border border-violet-300  rounded-lg text-center">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800">{status}</h2>
              <h2 className="text-lg font-semibold text-gray-800">{count}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className='mx-1 bg-white '>

        <CustomSimpleTable columns={columns} data={filteredData} linkField="project"  onDelete={handleDelete} onEdit={handleEdit} />

      </div>
    </div>


        
    </div>

    </>
  )
}
