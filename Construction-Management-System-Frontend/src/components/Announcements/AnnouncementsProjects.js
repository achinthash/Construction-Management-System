import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import Loading from "../Loading";

export default function AnnouncementsProjects() {

    const { projectId } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
           
           
            const response = await axios.get(`http://127.0.0.1:8000/api/announcements-project/${projectId}`, {
            headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}`,},
            });
            setData(response.data);

          } catch (error) {
            console.error(error);
          }
          setLoading(false);
        };
    
        fetchData();
      }, [projectId]);


      if (loading) {
        return <Loading />;
      }


  return (
    <>
    
    {
      data.length > 0 ? (

        <>
          <h1 className="text-center font-bold text-black text-2xl my-2 "> Announcements </h1>

            {
              data.map((announcements)=>(
              <div key={announcements.id} className="bg-white rounded-2xl p-5 shadow-[0_3px_10px_rgb(0,0,0,0.2)] mb-2">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">{announcements.title}</h2>
                  <span className="text-sm text-gray-500">Expires: {new Date(announcements.expires_at).toLocaleDateString()}</span>
                </div>

                <p className="text-gray-700 mb-3">{announcements.message}</p>

                <div className=" flex justify-between items-center text-sm text-gray-600">
                  <div><strong>Priority:</strong> <span className={`font-semibold ${announcements.priority === 'High' ? 'text-red-600' : 'text-yellow-600'}`}>{announcements.priority}</span></div>
                  <div><strong>Status:</strong> {announcements.status}</div>
                  <div><strong>Target:</strong> {announcements.target_type}</div>
                </div>
              </div>
              ))
            }
        </>
      
      )

      : 

      (
        <>

        </>
      )
      
    }      



    </>
  )
}
