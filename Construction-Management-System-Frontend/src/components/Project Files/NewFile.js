import React, { useState, useRef} from 'react';
import axios from 'axios';
import ResponseMessages from '../ResponseMessages';
import { useParams } from 'react-router-dom'

export default function NewFile(props) {

  const { projectId } = useParams();
  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files] ); 
  };

  const removeFiles = (fileToRemove) => {
    setSelectedFiles((prevFiles) => prevFiles.filter(file => file !== fileToRemove) )
  };
    

    const submit = async(e) =>{
      e.preventDefault();
  
      const formData = new FormData();
      formData.append('project_id', projectId);
      formData.append('doc_referenced_id', props.doc_referenced_id);
      formData.append('doc_type', props.doc_type);

      selectedFiles.forEach((document) => formData.append('doc_path[]', document));
      
      try{
        const response = await axios.post("http://127.0.0.1:8000/api/new-document", formData,{
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            Accept: "application/json",
            "Content-Type": "multipart/json", 
        },
        });
        setSuccessMessage.current(response.data.message);
        
      }
      catch(error){
        console.error(error);
        setErrorMessage.current(error.response.data.message)
      }
    }



  return (
    <div className=' col-span-4 p-4 max-h-[80vh] overflow-y-auto'> 

      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

    <form onSubmit={submit}>

      <div className='flex items-center justify-center w-full'>
        <label  className="flex flex-col items-center justify-center w-full h-auto border-2 border-violet-400 border-dashed rounded-lg cursor-pointer bg-gray-50   hover:bg-gray-100 ">
          <div className="flex flex-col items-center justify-center pt-3 pb-3">
            <svg className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
          <input onChange={handleFilesChange} id="dropzone-file" type="file" className="hidden" multiple />
        </label>
      </div>

      <div style={{ marginTop: '20px' }}>
        {selectedFiles.map((file, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', padding: '10px', border: '1px solid #7728d1' }}>
          <p>{file.name}</p>

          <button onClick={() => removeFiles(file)}  type='reset'  className='ml-auto items-center col-span-1'>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg> 
          </button>  
        </div>
        ))}
      </div> 

      {
        selectedFiles.length > 0 && (
          <div className='  col-span-4   w-full grid grid-cols-4 '>
            <div className=" col-span-2 lg:col-span-1 md:col-span-2  w-full  mb-4 sm:mb-0 px-3 ">
              <button  className="bg-blue-500  hover:bg-blue-700  dark:bg-gray-600 dark:hover:bg-slate-500  text-white font-bold py-2 px-4 rounded w-full" type="submit">Save</button>
            </div>
            <div className="w-full  mb-4 sm:mb-0 px-3 col-span-2 lg:col-span-1 md:col-span-2  ">
              <button   className="bg-blue-500 hover:bg-blue-700 text-white  dark:bg-gray-600 dark:hover:bg-slate-500 font-bold py-2 px-4 rounded w-full"  type="reset">Cancel</button>
            </div>
          </div>
        ) 
      }

    </form>
  </div>
  )
}
