import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import NavigationBar from '../NavigationBar';
import Sidebar from '../Sidebar';
import FolderFiles from './FolderFiles';
import NewFile from './NewFile';
import Loading from '../Loading';

export default function ProjectFiles() {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [isFolders, setIsFolders] = useState(true);
  const [selectedFolder , setSelectedFolder] = useState("");
  const [folders, setFolders] = useState([]);

  const handleOpenFolder = (folderName) =>{
    setSelectedFolder(folderName);
    setIsFolders(!isFolders);
  }

  //back to the main folders
  const backFolder = () =>{
    if(selectedFolder){
      setIsFolders(!isFolders);
      setSelectedFolder("");
    }
  }

  const [isNewFile, setIsNewFile] = useState(false);

  const newFile = ()=>{
    setIsNewFile(!isNewFile);
  }


  // fecth folders 
  useEffect(()=>{

    const ProjectFolders = async() =>{
      try{
        const response = await axios.get(`http://127.0.0.1:8000/api/folders/${projectId}`,{
          headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}`  }
        });
        setLoading(false);
        setFolders(response.data);
      }catch(error){
        console.error(error);
        setLoading(false);
      }
    } 

    ProjectFolders();

  },[projectId]);


  if (loading) {
  return (
      <Loading />
  );
}

  return (
    <div>

      {/* new file */}

      {
        isNewFile && (

          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  New File </h1>
                <button  onClick={newFile} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
              <NewFile doc_referenced_id={projectId}  doc_type={'project'}/>
                
            </div>
          </div>
          
        )
      }
      
      <Sidebar />
      <NavigationBar />


      <div className="bg-[#ddd6fee2] sidebar-ml  dark:bg-gray-900  rounded flex p-2  my-1 mx-1 justify-between ">
        <h1 className="text-left sm:text-xl font-bold text p-2 text-[#5c3c8f] dark:text-white ">Project Documents </h1> 

        {
          ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
            <>
              <button onClick={newFile}  className="py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 hidden md:block"> New Files  </button>
              <button  onClick={newFile}  className="md:hidden block py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>  </button>
            </>
          )}
        </div>

      <div className='bg-[#ddd6fee2] sidebar-ml  dark:bg-gray-900  rounded flex p-2  my-1 mx-1 items-center ' >
        <span onClick={backFolder}  className='text-black font-bold  cursor-pointer hover:text-violet-900'> Project Documents </span>
        {
          selectedFolder && (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#000000"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
              <span className='text-black font-bold  cursor-pointer hover:text-violet-900'> {selectedFolder}  </span>
          </> 
          )
        }
      </div>

      <div className="bg-white dark:bg-gray-800 p-1 sidebar-ml  max-h-[70vh] overflow-y-auto ">
    {
      isFolders ?

      <div className="mx-auto max-w-screen-2xl ">
  
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 -z-10 ">
          {
            folders.map((folder,index)=>(

            <div key={index} onClick={()=>handleOpenFolder(folder.type)} className=" -z-0 relative w-36 h-36 flex flex-col items-center justify-center bg-white hover:bg-violet-100 rounded-lg ">
              <div className="w-20 h-16 bg-blue-400 rounded-md relative">
                <div className="absolute -top-2 left-1 w-10 h-3 bg-blue-300 rounded-t-md"></div>
              </div>
              <p className="text-sm font-medium text-black mt-1 absolute bottom-2">{folder.type.length > 10 ? folder.type.substring(0, 17) : folder.type}
                ({folder.file_count})</p>
    
            </div>
    
            ))
          }

        </div>
      </div>

    :  <FolderFiles selectedFolder={selectedFolder} project_id={projectId}/>
    }

  
  </div>

</div>
  )
}
