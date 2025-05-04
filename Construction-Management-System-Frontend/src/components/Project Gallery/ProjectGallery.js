
import React, { useState,useEffect } from 'react';
import NavigationBar from '../NavigationBar';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AlbumImages from './AlbumImages';
import Loading from '../Loading';
import NewImage from './NewImage';

export default function ProjectGallery() {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState([]);
  const [isAlbum, setIsAlbum] = useState(true); 
  const [isAlbumImages, setIsAlbumImages] = useState(false);
  const [selectedAlbumName, setSelectedAlbumName] = useState("");
  

  const handleAblumImages = (albumName) =>{

    setSelectedAlbumName(albumName);
    setIsAlbumImages(true);
    setIsAlbum(false)

  }

  const BackAlbum = () =>{

    if(!isAlbum){
      setIsAlbum(true);
      setSelectedAlbumName("")
      setIsAlbumImages(false);
    }

  }

  useEffect(() =>{

    const ablums = async()=>{
      try{

        const response = await axios.get(`http://127.0.0.1:8000/api/image-albums/${projectId}`,{
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });
        setLoading(false);
        setAlbums(response.data);
      }
      catch(error){
        setLoading(false);
        console.error(error);
      }
    }

    ablums();
  },[]);


  // new image
  const [isNewImage, setIsNewImage] = useState(false);

  const handleNewImage = () =>{
    setIsNewImage(!isNewImage);
  }


    if (loading) {
    return (
    <Loading />
    );
  }

  return (
    <div className='  overflow-y-hidden'>
    
    <Sidebar />
    <NavigationBar />
    
    <div  className="bg-[#ddd6fee2] sidebar-ml  dark:bg-gray-900  rounded flex p-2  my-1 mx-1 justify-between ">
      <h1 className="text-left sm:text-xl font-bold text p-2 text-[#5c3c8f] dark:text-white ">Project Gallery </h1> 

        {
          ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
          <>
            <button onClick={handleNewImage} className="py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 hidden md:block"> New Image  </button>
            <button  onClick={handleNewImage}  className="md:hidden block py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>  </button>
          </>
        )}
        </div>

  
      <div className='bg-[#ddd6fee2] sidebar-ml  dark:bg-gray-900  rounded flex p-2  my-1 mx-1 items-center ' >
        <span  onClick={BackAlbum} className='text-black font-bold  cursor-pointer hover:text-violet-900'> Project Gallery </span>
        {
          selectedAlbumName ? 
          <>
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#000000"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
          <span className='text-black font-bold  cursor-pointer hover:text-violet-900'> {selectedAlbumName} </span>
          </> : null
        }

    </div>


        {/* newImage  */}
    {
      isNewImage && (
        <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <NewImage setCloseCamera={handleNewImage} imageType={'camera'} img_referenced_id={projectId}/> 
        </div>
      )
    }

    {/* Gallery */}

    {
      isAlbum && (

        <div className="bg-white dark:bg-gray-800 p-1 sidebar-ml  max-h-[70vh] overflow-y-auto ">
          <div className="mx-auto max-w-screen-2xl ">
            <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5 md:gap-2 xl:gap-2 ">
              {
                albums.map((album, index)=>(
                  <div key={album.type} className='items-center' onClick={()=>handleAblumImages(album.type)}> 
                 
                  <div className="group  flex  items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg h-32 md:h-48 ">
                    <img src={`http://127.0.0.1:8000/storage/${album.last_image}`} loading="lazy" alt="Photo by Minh Pham" className=" inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110 " />
                  </div>

                  <div className=" mb-3 text-center inline-block text-sm text-black md:text-lg mt-1 w-full">
                    <span className="flex justify-center items-center">
                      {album.type} <p className="ml-2">({album.image_count})</p>
                    </span>
                  </div>
                 
                </div>
                ))
              }
            </div>
          </div>
        </div>

      )
    }

    {
      isAlbumImages && (

        <div className="bg-white dark:bg-gray-800 py-2 sm:py-2 lg:py-3 sidebar-ml  max-h-[70vh] overflow-y-auto ">
          <div className="mx-auto max-w-screen-2xl px-2 md:px-2">
            <AlbumImages selectedAlbumName={selectedAlbumName} project_id={projectId}/>
          </div>
        </div>
      )
    }
    </div>
  )
}
