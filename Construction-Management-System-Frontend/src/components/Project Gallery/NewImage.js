import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useParams } from "react-router-dom";


export default function NewImage({setCloseCamera, imageType, img_referenced_id}) { 

  const { projectId } = useParams();
  const webcamRef = useRef(false);
  const [capturedImgSrc, setCapturedImgSrc] = useState(null);  
  const [capturedImgage, setCapturedImgage] = useState(null); 
  const [filesImages, setFilesImages] = useState(null);
  const [selectedFileImages, setSelectedFileImages] = useState([]);
  const [currentSliderImage, setCurrentSliderImage] = useState(0);

  // close camera
  const closeCamera = () =>{
    setCloseCamera(false);
  }

  // capture image 

  const imageCapture = () =>{

    const imageSrc = webcamRef.current.getScreenshot();
    
    setCapturedImgSrc(imageSrc); 


    // Convert base64 to Blob
    const byteString = atob(imageSrc.split(",")[1]);
    const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
  
    const blob = new Blob([uint8Array], { type: mimeString });

    setCapturedImgage(blob);

  }


  // image from system 


  const handleFileImages = (event) =>{
   
    setCapturedImgage(null)
    const files = event.target.files; // Get selected files
    const imageUrls = [];

    for (let i = 0; i < files.length; i++) {
      imageUrls.push(URL.createObjectURL(files[i])); // Generate preview URLs
    }
    setFilesImages(imageUrls); 

    const images = Array.from(event.target.files);
    setSelectedFileImages((prevImages) => [...prevImages, ...images]);

  }

  
  // saveimage

  const saveImage = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("project_id", projectId ); 
    formData.append("img_type", imageType);
    formData.append("img_referenced_id", img_referenced_id);

  if(capturedImgage){
    formData.append("image_path[]", capturedImgage, ".jpg"); 
  }

  if(selectedFileImages){
    selectedFileImages.forEach((image) => formData.append('image_path[]', image));
  }
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/new-image", formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message);
   
    } catch (error) {
      console.error(error);
      alert(error.response.data.message);
    }
  };
  

  // file images Slider


  

  const nextImage = (index) => {
    setCurrentSliderImage((prevIndex) => (prevIndex + 1) % filesImages.length);
  }

  const prevImage = (index) => {
    setCurrentSliderImage((prevIndex) => (prevIndex - 1) % filesImages.length);
  }



  return (
  <>

    {
      !capturedImgage && !filesImages ? 
      <div className="relative h-full w-full rounded-lg bg-white shadow-lg">

        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="h-full w-full object-cover rounded-lg" />

        <button className="absolute top-3 right-3 bg-gray-800   text-gray-800 px-2 py-2 text-sm md:text-lg rounded-full shadow-md" onClick={closeCamera}> 
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" strokeWidth="2px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
        </button>

        <button className="absolute bottom-5 left-1/2 transform -translate-x-1/2  text-white px-4 py-2 text-sm md:text-lg rounded-full shadow-md " onClick={imageCapture} >
        <svg xmlns="http://www.w3.org/2000/svg" height="45px" viewBox="0 -960 960 960" width="45px" fill="#ffffff"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 280q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></button>

        <label className="absolute bottom-5 left-5 text-white  font-semibold bg-gray-800 px-3 py-3 text-sm md:text-lg rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M360-400h400L622-580l-92 120-62-80-108 140Zm-40 160q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"/></svg> 
          <input type="file" onChange={handleFileImages} multiple className="hidden" />
        </label>


    </div>  :  capturedImgage &&  !filesImages?

      <div  className="relative h-full w-full rounded-lg bg-white shadow-lg">

      <button className="absolute top-3 right-3 bg-gray-800   text-gray-800 px-2 py-2 text-sm md:text-lg rounded-full shadow-md" onClick={ closeCamera}> 
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" strokeWidth="2px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
      </button>

      <img src={capturedImgSrc} alt="Captured 2"  className=" border h-full w-full object-cover rounded-lg" />

      <button className="absolute bottom-5 left-1/2 transform -translate-x-1/2  text-white px-4 py-2 text-sm md:text-lg rounded-full shadow-md " onClick={saveImage} >
       <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#ffffff"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm80-80h480v-320H240v320Zm-80 80v-480 480Z"/></svg>
      </button>
    
    </div>   : filesImages ?

    <div  className="relative  rounded-lg bg-white shadow-lg">

    {
      filesImages && filesImages.length > 0 ? 

      <div className="bg-gray-800 ">

        <button className="absolute top-3 right-3 bg-gray-800   text-gray-800 px-2 py-2 text-sm md:text-lg rounded-full shadow-md" onClick={closeCamera}> 
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" strokeWidth="2px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
        </button>

        <img src={filesImages[currentSliderImage]} className=" border h-auto max-h-[80vh] w-full object-cover rounded-lg" alt="..."/> 

        <div className="flex justify-between items-center  absolute bottom-[50%] w-full bg-transparent"> 

          {
            filesImages.length > 1 ?

            <button className=" ml-2 bg-gray-800   text-white  px-2 py-2 text-sm md:text-lg rounded-full shadow-md " onClick={()=>prevImage()} > <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg> </button>
            : null
          }
          
          {
            filesImages.length > 1 ?

            <button className="  mr-2  bg-gray-800  text-white px-2 py-2 text-sm md:text-lg rounded-full shadow-md " onClick={()=>nextImage()} > <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/></svg> </button> : null
          }
          
        </div>

        <button className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-2 text-sm md:text-lg rounded-full shadow-md " onClick={saveImage} > <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#ffffff"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm80-80h480v-320H240v320Zm-80 80v-480 480Z"/></svg> </button>
      
      </div>

      : null

    } 

  </div> : null

  
}
  
  </>
  )
}
