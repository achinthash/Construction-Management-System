import React, { useState, useEffect } from 'react'
import axios from "axios";
import NavigationBar from '../NavigationBar';
import Company_icon from '../Company_icon';
import NewUser from './NewUser';
import CustomSimpleTable from '../Tables/CustomSimpleTable';
import Loading from '../Loading';
import EditUserDetails from './EditUserDetails';

export default function Users() {

  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const [users , setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  
 const [roles, setRoles] = useState([])
 const [selectedRole, setSelectedRole] = useState("");
 const [searchTerm, setSearchTerm] = useState(""); 


  const allUsers = async() =>{
    
    try{
        const response = await axios.get("http://localhost:8000/api/users-all",{
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

  useEffect(()=>{
    allUsers();
  },[token])
  

 const columns = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone_number', label: 'Phone Number' },
  { id: 'role', label: 'Role' },
  { id: 'status', label: 'Status' },
  { id: 'action', label: 'Action' }
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

   // new user

  const [isNewUser, setIsNewUser] = useState(false);

 const newUser = () => {
  setIsNewUser(!isNewUser);
  
 }


 const [isEditUser, setIsEditUser] = useState(false);
 const [selectedUser, setSelectedUser] = useState("");

 const EditUser = (selectedId) =>{
  setSelectedUser(selectedId);
  setIsEditUser(!isEditUser);

 }


 if (loading) {
  return (
      <Loading />
  );
}
  
  return (
    <div className='overflow-y-hidden h-[90vh]'>

    

      <Company_icon />
      <NavigationBar />


         {/* new user */}
         {
        isNewUser && (
          <div className="flex absolute inset-0 items-center justify-center z-0 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] '>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  New User </h1>
                <button  onClick={newUser} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <NewUser />
                
            </div>
          </div>
        )
      }


      
        {/* Edit user */}
        {
        isEditUser && (
          <div className="flex absolute inset-0 items-center justify-center z-0 bg-black bg-opacity-75  h-full" > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] '>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  Edit User </h1>
                <button  onClick={EditUser} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <EditUserDetails selectedUserId={selectedUser}/>
                
            </div>
          </div>
        )
      }

      <div id="header" className="bg-[#ddd6fee2]   dark:bg-gray-900  rounded flex md:flex-row flex-col p-2  my-1 mx-1 justify-between">
        <h1 className="text-left sm:text-xl font-bold text p-2 text-[#5c3c8f] dark:text-white ">Users</h1>
        
        <div className='flex justify-end'>
          <input type='text'  value={searchTerm} onChange={handleSearchChange}  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-2" placeholder="Search"  />

          <select value={selectedRole} onChange={handleRoleFilterChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-2"  >
            <option value="">All Roles</option>
              {roles.map(roles => (
                  <option key={roles} value={roles}>{roles}</option>
              ))} 
          </select>

          <button onClick={newUser} className="py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 hidden md:block"> New User  </button>

          <button onClick={newUser} className="md:hidden block py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>  </button>
        </div>
       
      </div>

      <div className='mx-1 bg-black'>

        <CustomSimpleTable columns={columns} data={filteredData} linkField="user"  onDelete={handleDeleteUser} onEdit={EditUser}/>

      </div>

     
   





    </div>
  )
}
