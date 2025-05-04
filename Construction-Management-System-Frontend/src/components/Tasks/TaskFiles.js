import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Loading';

import CustomSimpleTable from '../Tables/CustomSimpleTable';
import NewFile from '../Project Files/NewFile';


export default function TaskFiles() {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
    const { projectId, taskId } = useParams();
    const [loading, setLoading] = useState(true);

    const [isNewFile, setIsNewFile] = useState(false);
    const [files, setFiles] = useState([]);

 
    
  const handleDelete = (projectId) => {
    setFiles(files.filter(files => files.id !== projectId));
  };

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'doc_name', label: 'Name' },
    { id: 'created_at', label: 'Date Modified' },
    { id: 'doc_path', label: 'Download'},
    { id: 'type', label: 'Type' },
  
    ...(userInfo?.role === 'admin' ? [{ id: 'action_delete', label: 'Action' }] : [])
  
  ];

  useEffect(()=>{
      const tasks = async() =>{
  
      try{
          const response = await axios.get(`http://127.0.0.1:8000/api/files-task/${projectId}/${taskId}`,{
            headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}`  }
          });

          const formatedFiles = response.data.map(file =>({
            ...file,
            created_at : file.created_at.substring(0, 19).replace("T", " "),
            type : file.doc_name.split('.').pop()
        }))
  
        setLoading(false);
        setFiles(formatedFiles);
          
      }catch(error){
        setLoading(false);
        console.error(error);
      }}
  
      tasks();
  
  },[projectId,taskId]);


  if (loading) {
    return (
        <Loading />
    );
}
  return (
    <div>


    <div className="bg-[#ddd6fee2]  dark:bg-gray-900 rounded flex  p-2 max-h-[10vh] my-1 mx-1 justify-between  ">
        <h1 className="text-left sm:text-xl font-bold text p-1.5 text-[#5c3c8f] dark:text-white"> Task Documents </h1>

        {
          ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
            <button onClick={()=>setIsNewFile(true)} className="py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M280-280h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>  </button>
          )
        }
       
    </div>

       

        
    {/* new file  */}
    {
      isNewFile && (
   
        <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                    
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  New Documents </h1>
                <button  onClick={()=>setIsNewFile(false)} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
                
            <NewFile doc_referenced_id={taskId}  doc_type={'Task Documents'}/>
                
            </div>
        </div>
      )
    }

    <CustomSimpleTable columns={columns} data={files} linkField="document"  onDelete={handleDelete} />

    </div>
  )
}
