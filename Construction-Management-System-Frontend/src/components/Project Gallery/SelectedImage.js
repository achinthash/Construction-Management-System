import React, { useState,useEffect,useRef } from 'react';
import axios from 'axios';
import Loading from '../Loading';
import ResponseMessages from '../ResponseMessages';

export default function SelectedImage({selectedImage, setIsCloseImage,onDelete}) {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState([]);

  const Close = (imgId)=>{
    setIsCloseImage(imgId)
  }

    useEffect(() =>{
  
        const ablumImages = async()=>{
          try{
    
            const response = await axios.get(`http://127.0.0.1:8000/api/image/${selectedImage}`,{
              headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`}
            });
            setLoading(false);
            setImage(response.data);
           
          }
          catch(error){
            setLoading(false);
            console.error(error);
          }
        }
    
        ablumImages();
      },[])

    // delete image

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name} image?`)) {
          try {
           const response = await axios.delete(`http://localhost:8000/api/delete-image/${id}`, {
              headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
            });
            setSuccessMessage.current(response.data.message);
            onDelete(id);
            setIsCloseImage(id); // close imgar
            
          } catch (error) {
            setErrorMessage.current(error.response.data.message)
          }
       }
      };

  if (loading) {
    return (
    <Loading />
    );
  }

  return (
    <div className='max-h-[80vh]  p-2'>

    <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

      <div className=' relative group flex flex-col items-center justify-center max-h-[60vh] w-full mt-2'>
        <img className='max-h-[60vh] object-cover rounded-lg shadow-md w-[350px] h-auto ' src={`http://127.0.0.1:8000/storage/${image.image_path}`} alt={image.image_name} />
        <span className='mt-1'>{image.image_name}</span>
      </div>
       
      <div className='mt-2'>

        <p> Album : {image.img_type} </p>
        <p> Date : {image.created_at.substring(0,10)} </p>

        <div className='mt-2'>
          <button onClick={()=>Close(image.id)} type='button' className='bg-blue-600 hover:bg-blue-900 p-2 text-white rounded-lg px-3'>Close</button>
          {( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
            <button onClick={()=>handleDelete(image.id, image.image_name)} type='button' className='bg-blue-600 hover:bg-blue-900 p-2 text-white rounded-lg px-3 mx-2'>Delete</button>
          )}
          
        </div>
      </div>
    </div>
  )
}


