
import React, { useState, useEffect } from "react";
import axios from 'axios';
import Loading from "../Loading";
import { Link } from 'react-router-dom';

export default function AnnouncementsSummary() {

    const [loading, setLoading] = useState(true);
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://127.0.0.1:8000/api/announcement-all`, {
             headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });
            setAnnouncements(response.data);
       
          } catch (error) {
            console.error(error);
          }
          setLoading(false);
        };
    
        fetchData();
      }, []);

    // Announcementsc summary

    const totalAnnouncements= announcements.length;
    const activeAnnouncements = announcements.filter(item => item.status === 'active').length;
    const highPriorityAnnouncements =  announcements.filter(item => item.priority === 'high').length;

    if (loading) {
    return <Loading />;
    }


  return (
    <div className="bg-white shadow-lg rounded-xl p-4 space-y-2">
        <div className="flex flex-col  gap-2 ">
            <h2 className='text-center text-lg font-semibold'> 🧰  Announcements  </h2>
            <p className='text-sm'>Total Announcements: {totalAnnouncements}</p>
            <p className='text-sm'>Active Announcements: {activeAnnouncements}</p>
            <p className='text-sm'> High Priority Announcements: {highPriorityAnnouncements}</p>
        </div>
        <Link to={'/announcements'}  className="w-full mt-2 px-4 py-2 border rounded hover:bg-gray-100 bg-violet-100  block text-center"> Manage Announcements  </Link>
    </div> 
  )
}


