import React, { useState,useEffect } from 'react';
import axios from 'axios';

import Loading from '../Loading';
import CustomSimpleTable from '../Tables/CustomSimpleTable';

export default function UserAvailability() {

  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 
  const [date, setDate] = useState("");


  useEffect(()=>{

    const UsersList = async() =>{
      try{
        const response = await axios.get(`http://localhost:8000/api/user-logs-dates`,{
          headers: { Authorization: `Bearer ${token}` }
        });

        setUsers(response.data);
        const roles = [...new Set(response.data.map(user => user.role))]; 
        setRoles(roles);

        setLoading(false);

      }catch(error){
        setLoading(false);
        console.error(error);
      }
    }
  
    UsersList();
  },[]);

      
  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },

    { id: 'status', label: 'Status' },
    { id: 'role', label: 'Role' },
    { id: 'position', label: 'Position' },
    { id: 'log', label: 'Action' }
  ];

  // Handle search term change
 const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
 
  // Handle age filter change
  const handleRoleFilterChange = (event) => {
   setSelectedRole(event.target.value);
  };

  const handleLogDate = (event) =>{
    setDate(event.target.value);
  }
 
  // Filter data based on search and role filter
  const filteredData = users
  .filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((user) => !selectedRole || user.role === selectedRole)
    .filter((user) => {
     
      const hasLogForSelectedDate = user.user_logs.some(log => log.date === date);
  
      if (!date) return true;

      return !hasLogForSelectedDate;
    });


  if (loading) {
    return (
        <Loading />
    );
  }
    

  return (
    <div className='overflow-y-auto h-[80vh]'>
      
      <div className='flex sm:flex-row gap-2 p-2 flex-col justify-between'>
        <input type='text'  value={searchTerm} onChange={handleSearchChange}  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 mr-2" placeholder="Search"  />
        <select value={selectedRole} onChange={handleRoleFilterChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 mr-2"  >
        <option value="">All Roles</option>
          {roles.map(roles => (
              <option key={roles} value={roles}>{roles}</option>
          ))} 
        </select>
        <input type='date' value={date} onChange={handleLogDate}  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 mr-2" />

      </div>

      <div className='mx-2 bg-white overflow-y-auto h-[80vh]'>
        <CustomSimpleTable columns={columns} data={filteredData} linkField="User Logs"  />
      </div>

    </div>
  )
}
