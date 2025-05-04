import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import Loading from "../Loading";

export default function EstimationSummary() {


    const { projectId } = useParams();
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(sessionStorage.getItem("token") || "");


    const [summary, setSummary] = useState([]);

    useEffect(() => {
        const estimationSummary = async () => {
          try {
            const response = await axios.get(`http://127.0.0.1:8000/api/estimation-summary/${projectId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
    
            setSummary(response.data);
            
          } catch (error) {
            console.error(error);
          }
          setLoading(false);
        };
    
        estimationSummary();
      }, [projectId]);


    const [isSummary, setIsSummary] = useState(false);
    
    const handleSummaryClick = () =>{
        setIsSummary(!isSummary);
    }
    

      if (loading) {
        return <Loading />;
      }


  return (
    <div  className="bg-[#c5bfe9e2] mt-2  dark:bg-gray-900  rounded-md p-1   ">
      
        <div className="flex justify-between">
            <div className='flex'> 
                <svg className={` transition-transform duration-500 ease-in-out  ${isSummary? 'rotate-0' : 'rotate-180'} `}   xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"> <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/></svg> 
                <h1 onClick={handleSummaryClick} className="text-left  font-bold text-sm p-1 text-[#000000] dark:text-white ">   Summary </h1> 
            </div>
        

            <h1 className="text-left font-bold text-sm p-1 text-[#000000] dark:text-white "> Toatal Amount: LKR {summary.overall_total_cost ? summary.overall_total_cost : '-' } </h1> 
        </div>

      {
        isSummary && (

            <div className="">
                
                <ul>
                    {
                        summary.cost_types.map((cost)=>(
                            <li key={cost.id} className="flex justify-between p-2 bg-slate-200 hover:bg-indigo-300 rounded-lg my-1 ">
                                <span>{cost.cost_type}</span> <span>{cost.total_cost}</span>
                            </li>
                        ))
                    }

                    <hr className="bg-black border border-black mt-3"/>

                    <li className="flex justify-between p-2  "> 
                        <span> Toatal Amount: LKR </span> 
                        <span> {summary.overall_total_cost ? summary.overall_total_cost : '-' } </span>
                    </li>
                </ul>
            </div>
        )
      }


            
    </div>
  )
}
