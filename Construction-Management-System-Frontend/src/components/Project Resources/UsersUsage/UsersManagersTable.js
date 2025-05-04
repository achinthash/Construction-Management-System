import React, { useState, useEffect } from 'react'
import axios from "axios";
import { useParams } from "react-router-dom";
import CustomSimpleTable from '../../Tables/CustomSimpleTable';
import Loading from '../../Loading';
import UsersManagersSummary from './UsersManagersSummary';

import NewUserProject from '../../Projects/NewUserProject';

export default function UsersManagersTable() {

    const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
    const [token, setToken] = useState(sessionStorage.getItem("token") || "");
    const [users , setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { projectId } = useParams();
    
   const [roles, setRoles] = useState([])
   const [selectedRole, setSelectedRole] = useState(""); 
   const [searchTerm, setSearchTerm] = useState(""); 
  
   useEffect(()=>{
   
    const allUsers = async() =>{
      
      try{
          const response = await axios.get(`http://localhost:8000/api/project-users/${projectId}`,{
            headers: { Authorization: `Bearer ${token}` }
          });
  
          setLoading(false);
          setUsers(response.data)
         
          const roles = [...new Set(response.data.map(user => user.role))]; 
          setRoles(roles);
      }
      catch(error){
        console.error(error)
        setLoading(false);
      }
    }
    allUsers();
   
    },[])




  
   const columns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'nic', label: 'NIC' },
    { id: 'email', label: 'Email' },
    { id: 'phone_number', label: 'Phone Number' },
    { id: 'role', label: 'Role' },

    { id: 'status', label: 'Status' }
  ];
  
  
  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };
  
   // Handle search term change
   const handleSearchChange = (event) => {
     setSearchTerm(event.target.value);
      
   };
  
   // Handle age filter change
   const handleRoleFilterChange = (event) => {
    setSelectedRole(event.target.value);
  
   };
  
   // Filter data based on search and role filter
   const filteredData = users
   .filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
     .filter((user) => !selectedRole || user.role === selectedRole);

     const [isNewManage, setIsNewManager] = useState(false);
     
 if (loading) {
    return (
        <Loading />
    );
  }



  return (
    <div>



  {/* selected uses logs */}
    {
      isNewManage && (
        <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[80%]'>
                  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
              <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  New User </h1>
              <button  onClick={()=>setIsNewManager(false)} type='reset'  className='ml-auto items-center col-span-1'>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>
              
              <NewUserProject />
              
          </div>
        </div>
      )
    }


        
      <div id="header" className="bg-[#ddd6fee2]   dark:bg-gray-900  rounded flex  p-2  my-1  mr-1 justify-between ">
        <h1 className="text-left sm:text-xl font-bold text p-1 text-[#5c3c8f] dark:text-white ">Project Management </h1> 

        {
          ( userInfo?.role === 'admin' ) && (
          <>
            <button onClick={()=>setIsNewManager(true)} className="py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 hidden md:block"> New User  </button>
            <button  onClick={()=>setIsNewManager(true)} className="md:hidden block py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>  </button>
          </>
        )}
      </div>

        
      <div className='mx-1 bg-white overflow-y-auto max-h-[80vh]'>

        <CustomSimpleTable columns={columns} data={filteredData} linkField="user"  />
        <UsersManagersSummary  data={users}/>
      </div>



    </div>
  )
}
