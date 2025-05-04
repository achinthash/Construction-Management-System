import React, { useState, useEffect,useRef } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import Loading from '../Loading';
import NewMaterials from './NewMaterials';
import MaterialDefault from '../../assets/MaterialDefault.png';
import EditMaterialLog from './EditMaterialLog';
import ResponseMessages from "../ResponseMessages";

export default function MaterialsTasks() {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const { projectId, taskId } = useParams();  
  const [loading, setLoading] = useState(true);
  const [isNewMaterials, setIsNewMaterials] = useState(false);
  const [data, setData] = useState([]);
  const [selectedMaterialLogName, setSelectedMaterialLogName] = useState(null);
  
  const [isEditLog, setEditLog] = useState('');
  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);

  useEffect(()=>{

      const materials = async() =>{
  
        try{
          const response = await axios.get(`http://localhost:8000/api/materials-tasks/${taskId}`,{
            headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}`, }
          });

          setLoading(false);
          setData(response.data)

        }catch(error){
         setLoading(false);
          console.error(error);
        }
      }
  
      materials();
    },[taskId]);


    const materialLogExtra = (materialName) =>{
      setSelectedMaterialLogName(selectedMaterialLogName === materialName ? null : materialName);
    }



    // delete 

   const deleteMaterialLog = async (id) => {
    if (window.confirm(`Are you sure you want to delete this Material Log`)) {
      try {
        const response =  await axios.delete(`http://localhost:8000/api/delete-material-log/${id}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });
      setSuccessMessage.current(response.data.message);

       // fetchData();
      } catch (error) {
        setErrorMessage.current(`Error deleting Material Log:`, error);
      }
    }
  };

    
    if (loading) {
        return (
            <Loading />
        );
      }


  return (
    
    <div>


      {/* new material */}
      {
        isNewMaterials && (
            <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  New Material </h1>
                <button  onClick={()=>setIsNewMaterials(false)} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                <NewMaterials />
            </div>
          </div>
        )
      }

        {/* new material */}
        {
        isEditLog && (
            <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  Edit Material </h1>
                <button  onClick={()=>setEditLog('')} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                <EditMaterialLog  selectedMaterialId={isEditLog} />
            </div>
          </div>
        )
      }
      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>
        
        
      <div className="bg-[#cec8ecb7]  dark:bg-gray-900  rounded p-1.5 mt-1 mr-1 flex justify-between items-center ">
        <h1 className="text-left sm:text-xl font-bold text p-1 text-[#5c3c8f] dark:text-white ">Task Materials</h1>
      
          {
            ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
              <button   onClick={()=>setIsNewMaterials(true)} className="py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg> </button>
            )
          }
      </div>

    {/* <MaterialTaskTable /> */}
      {
        data.map((material)=>(

          <div key={material.name} className="p-4 bg-white shadow-md rounded-lg border border-gray-200 grid grid-cols-4 gap-2 w-full cursor-pointer hover:bg-slate-100 mt-2">
            <div onClick={(e) => { e.stopPropagation(); materialLogExtra(material.name); }} className="flex items-center gap-4 col-span-2">
              <img src={MaterialDefault}   alt={material.name}  className="w-12 h-12 rounded-full object-cover border border-gray-300"/>
              <div className='flex-col'>
                <h2 className="text-lg font-semibold text-gray-800">{material.name}</h2>
                <p className="text-gray-600 text-sm">{material.materials.length} Material Logs</p>
              </div>
            </div>

            {/* User Logs */}
            <div className='col-span-4 w-full    '> 
              {
                selectedMaterialLogName === material.name && material.materials && material.materials.map((log) => (
                  <div key={log.id} className="p-4 bg-gray-100 hover:bg-violet-100 rounded-lg my-2 shadow-lg  transition-all duration-300 ease-in-out">
                    <div className='flex items-center justify-between w-full'>
                      <h3 className="text-lg font-semibold text-gray-800">#{log.id} - {log.title}</h3>
                      <div className='flex space-x-4 '>
                        <p>Status: <span className={`font-medium ${log.status === 'completed' ? 'text-green-500' : 'text-red-500'}`}>{log.status}</span></p>

                          {
                            ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                            <>
                                <svg onClick={()=>setEditLog(log.id)} xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#000000"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                                <svg onClick={()=>deleteMaterialLog(log.id)} xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>

                              </>
                            )
                          }
                          
                          
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2  ">
                      <p className="text-sm text-gray-500">Date: {log.date}</p>
                      <p className="text-sm text-gray-700 mt-2">{log.description}</p>
                    </div>

                  </div>

                ))
              }
            </div>

          </div>

        ))
      }

    </div>

  )
}
