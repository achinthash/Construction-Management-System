
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Loading';

import SelectedImage from '../Project Gallery/SelectedImage';


export default function DailyLogImages({work_id}) {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
    const { projectId } = useParams();
    const [loading, setLoading] = useState(true);

 
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
          const response = await axios.get(`http://127.0.0.1:8000/api/images-type-item/${projectId}/Daily Log/${work_id}`,{
            headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}`  }
          });
  
        setLoading(false);
        setImages(response.data);
          
      }catch(error){
        setLoading(false);
        console.error(error);
      }}
  
      tasks();
  
  },[projectId,work_id]);


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
