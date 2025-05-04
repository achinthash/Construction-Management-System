import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Loading';

import SelectedImage from '../Project Gallery/SelectedImage';
import NewImage from '../Project Gallery/NewImage';

export default function TaskImages() {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
    const { projectId, taskId } = useParams();
    const [loading, setLoading] = useState(true);

    const [isNewImage, setIsNewImage] = useState(false);
    const [images, setImages] = useState([]);
    const [isselectImage, setIsSelectImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState("")
  

    const handleClickImage = (imageId) =>{
      setSelectedImage(imageId);
      setIsSelectImage(!isselectImage);
    }
    

  useEffect(()=>{
      const tasks = async() =>{
  
      try{
          const response = await axios.get(`http://127.0.0.1:8000/api/images-task/${projectId}/${taskId}`,{
            headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}`  }
          });
  
        setLoading(false);
        setImages(response.data);
          
      }catch(error){
        setLoading(false);
        console.error(error);
      }}
  
      tasks();
  
  },[projectId,taskId]);


  const handleDelete = (imageId) => {
    setImages(images.filter(images => images.id !== imageId));
  };




  if (loading) {
    return (
        <Loading />
    );
}

  return (
    <div>
        
      <div className="bg-[#ddd6fee2]  dark:bg-gray-900 rounded flex  p-2 max-h-[10vh] my-1 mx-1 justify-between  ">
        <h1 className="text-left sm:text-xl font-bold text p-1.5 text-[#5c3c8f] dark:text-white"> Task Images </h1>

        {
          ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
            <button onClick={()=>setIsNewImage(true)} className="py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z"/></svg>  </button>
          )
        }
       
      </div>


    {/* newImage  */}
    {
      isNewImage && (
        <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <NewImage  setCloseCamera={()=>setIsNewImage(false)} imageType={'Task Image'} img_referenced_id={taskId}/>
        </div>
      )
    }
    

        {
        isselectImage && (
          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg p-4  '>

            <SelectedImage selectedImage={selectedImage} setIsCloseImage={handleClickImage} onDelete={handleDelete}/>
                    
            </div>
          </div>
        )
      }

    <div className="bg-white dark:bg-gray-800 p-1 max-h-[70vh] overflow-y-auto ">
      <div className="mx-auto max-w-screen-2xl ">
        
        <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5 md:gap-2 xl:gap-2  bg-gray-50 ">
          {
            images.map((album, index)=>(
              <div key={index} className='items-center shadow-md' onClick={()=>handleClickImage(album.id)}> 
                <div className="group  flex h-32 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-48">
                  <img src={`http://127.0.0.1:8000/storage/${album.image_path}`} loading="lazy" alt="Photo by Minh Pham" className=" inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
                </div>

            </div>
            ))
          }
        </div>
      </div>
    </div>


    </div>
  )
}
