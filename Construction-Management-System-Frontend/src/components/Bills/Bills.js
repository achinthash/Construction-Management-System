import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Loading from "../Loading";
import NewBill from './NewBill';
import BillSummary from './BillSummary';
import BillsTable from './BillsTable';

export default function Bills() {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [activeSection, setActiveSection] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/bills-project/${projectId}`,{
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`},
          }
        );
        setBills(response.data);
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
        activeSection &&  (

        <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[90%] min-w-[90%] '>
                  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
            <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  New Bill </h1>
              <button onClick={() => setActiveSection(false)} type='reset'  className='ml-auto items-center col-span-1'>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
              
            <NewBill />
              
          </div>
        </div>

        )
      }


    <div id="header" className="bg-[#ddd6fee2]   dark:bg-gray-900  rounded flex  p-2  my-1  justify-between ">
      <h1 className="text-left sm:text-xl font-bold text p-2 text-[#5c3c8f] dark:text-white ">Bills  </h1> 

      {
        ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
          <>
            <button  onClick={() => setActiveSection(true)} className="py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 hidden md:block" > New Bill   </button>            
            <button  onClick={()=>setActiveSection(true)} className="md:hidden block py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>  </button>
          </>
        )
      }

        </div>

    

    <div className='max-h-[65vh] overflow-y-auto'>      
      <BillsTable bills={bills} />
      <BillSummary  bills={bills} />    
    </div>


   </>
  );
}
