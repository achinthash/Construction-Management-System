import React, { useState, useEffect } from 'react'
import axios from "axios";
import { useParams } from "react-router-dom";
import Loading from '../../Loading';


export default function UsersManagersSummary(props) {

    const [users , setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { projectId } = useParams();
   
        const allUsers = async() =>{
          
          try{
              const response = await axios.get(`http://localhost:8000/api/project-users/${projectId}`,{
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
              });
      
              setLoading(false);
              setUsers(response.data)
             
          }
          catch(error){
            console.error(error)
            setLoading(false);
          }
        }

        useEffect(()=>{

            if(!props.data){
                allUsers();
            }else{
                setUsers(props.data)
                setLoading(false);
            }
        },[projectId,props.data]);



    const totalUsers = users.length;

    const activeUsers = users.filter(item => item.status === 'active').length;

    const roleCount = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
    }, {});

    
    if (loading) {
        return (
            <Loading />
        );
    }


  return (
    <>

    {
        props.data ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-gray-200">

                <div className="p-2">
                <p className="text-sm text-gray-500">Total Users </p>
                <p className="text-sm font-bold">{totalUsers}</p>
                </div>

                <div className="p-2">
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-sm font-bold">{activeUsers}</p>
                </div>
        
                <div className="p-2 col-span-2">
                <p className="text-sm text-gray-500">Roles</p>
                <p className="text-sm font-bold flex">
                    
                {Object.entries(roleCount).map(([role, count]) => (
                        <li key={role} className="flex "> 
                            {role} : {count}  ,
                        </li>
                    ))}
                
                
                </p>
                </div>
    
            </div>
        ) : (
           
            <div className="w-full max-w-md md:max-w-2xl mx-auto bg-white rounded-xl p-6 ">
                <h2 className="text-lg font-semibold mb-6 text-gray-800 text-center">
                    Project Team Overview
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-blue-100 rounded-lg">
                    <p className="text-sm text-gray-600">Total Members</p>
                    <p className="text-xl font-bold text-blue-800">{totalUsers}</p>
                    </div>

                    <div className="p-4 bg-green-100 rounded-lg">
                    <p className="text-sm text-gray-600">Active Members</p>
                    <p className="text-xl font-bold text-green-800">{activeUsers}</p>
                    </div>

                    <div className="p-4 bg-yellow-100 rounded-lg col-span-2">
                    <p className="text-sm text-gray-600">Roles</p>
               
                    <ul className="text-xl font-bold   text-gray-700">
                        {Object.entries(roleCount).map(([role, count]) => (
                            <li key={role} className="flex justify-between">
                            <span className="capitalize text-xs">{role}</span>
                            <span className="capitalize text-xs">{count}</span>
                            </li>
                        ))} 
                        
                    </ul>
                    
                    </div>

                </div>
            </div>
        )
    }
     
    
    </>
  )
}
