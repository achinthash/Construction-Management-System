
import React, { useState, useEffect } from "react";
import axios from 'axios';
import Loading from "../Loading";
import { Link } from 'react-router-dom';

export default function UserSummary() {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:8000/api/users-all`, {
             headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });
            setData(response.data);

          } catch (error) {
            console.error(error);
          }
          setLoading(false);
        };
    
        fetchData();
      }, []);

    // Users summary

    const totalUsers = data.length;
    const activeUsers = data.filter(item => item.status === 'active').length;
    const labors = data.filter(item => item.role === 'labor').length;

    if (loading) {
    return <Loading />;
    }


  return (
    <div className="bg-white shadow-sm rounded-xl p-4 space-y-2">
        <div className="flex flex-col  gap-2 ">
            <h2 className='text-center text-lg font-semibold'> 👥 Users & Roles </h2>
            <p className='text-sm'>Total Users: {totalUsers}</p>
            <p className='text-sm'>Active Users: {activeUsers}</p>
            <p className="text-sm flex">Total Labors: {labors} </p>
        </div>
        <Link to={'/users'} className="w-full mt-2 px-4 py-2 border rounded hover:bg-gray-100 bg-violet-100 block text-center">Manage Users </Link>
    </div>

  )
}


