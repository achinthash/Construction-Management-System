import React, { useState ,useEffect,useRef} from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MultiSelect } from "react-multi-select-component";
import Loading from '../Loading';
import ResponseMessages from '../ResponseMessages';

export default function NewProject() {

  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const [steps, setSteps] = useState(1);

  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);
  const [loading, setLoading] = useState(true);

  const nextPage =() =>{
    setSteps(steps +1);
  }

  const prevPage =() =>{
    setSteps(steps - 1);
  }


  // objectives 

  const [objective, setObjectives] = useState("")
  const [selectedObjectives, setSelectedObjectives] = useState([]);

  const addObjectives = () =>{
    if(objective === ''){
      alert("Please enter an objective before adding.");
      return;
    }
    setSelectedObjectives([...selectedObjectives,objective]);
    setObjectives("");

  }

  const removeObjective = (index) =>{
    setSelectedObjectives(selectedObjectives.filter((_,i) =>i !== index))
  }



  // project files


  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files] ); 
  };

  const removeFiles = (fileToRemove) => {
    setSelectedFiles((prevFiles) => prevFiles.filter(file => file !== fileToRemove) )
  };
  


  // project images

  const [selectedImages, setSelectedImages] = useState([]);

  const handleImagesChanges = (e) =>{
    const images = Array.from(e.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...images]);

  }

  const removeImages = (imageToRemove) =>{ 
    setSelectedImages((prevImages) => prevImages.filter(image => image !== imageToRemove));

  } 


  //   users 

  const [clients, setClients] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [consultants, setConsultants] = useState([]);

  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedContractors, setSelectedContractors] = useState([]);
  const [selectedConsultants, setSelectedConsultants] = useState([]);



  // fetch users for multiselect

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get("http://localhost:8000/api/users-all", {
                headers: { Authorization: `Bearer ${token}` }
            });

            // set users base on role for multiselect

            // clients
          const clients = response.data.filter(users => users.role === 'client');

          const clientOptions = clients.map(user =>({
            label: user.name,
            value: user.id
          }));

          setClients(clientOptions);

          // consultants

          const consultants = response.data.filter(users =>users.role === 'consultant');

          const consultantOptions = consultants.map(user =>({
            label: user.name,
            value: user.id
          }));

          setConsultants(consultantOptions);

          // contractors

          const contractors = response.data.filter(users => users.role === 'contractor');

          const contractorOptions = contractors.map(user =>({
            label: user.name,
            value: user.id
          }));

          setContractors(contractorOptions);
          setLoading(false);
           
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
    };
    fetchUserData();
}, []);


  // submit project


  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [progress, setProgress] = useState("");
  const [start_date, setStart_date] = useState("");
  const [end_date, setEnd_date] = useState("");
  const [budget, setBudget] = useState("");


  const submit = async(e) =>{
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('description', description);
    formData.append('status', status);
    formData.append('location', location);
    formData.append('progress', 0);
    formData.append('start_date', start_date);
    formData.append('end_date', end_date);
    formData.append('budget', budget);

    //
    selectedClients.forEach((client) => formData.append('client_id[]', client.value));

    selectedConsultants.forEach((contractors) => formData.append('consultant_id[]', contractors.value));

    selectedContractors.forEach((consultants) => formData.append('contractor_id[]', consultants.value));

    selectedObjectives.forEach((objective) => formData.append('objective[]', objective));

    //

    formData.append('img_type', 'project');
    selectedImages.forEach((image) => formData.append('image_path[]', image));
    
    formData.append('doc_type', 'project');
    selectedFiles.forEach((document) => formData.append('doc_path[]', document));
    
    try{

      const response = await axios.post("http://127.0.0.1:8000/api/new-project", formData,{
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

  // loading fucntion
  if (loading) {
    return (
        <Loading />
    );
  }

  
  return (
    <div className=' p-2 max-h-[80vh] overflow-y-auto w-full '>

    <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

      <form  onSubmit={submit} className=' min-w-[3/4]  gap-2  shadow-[0_3px_10px_rgb(0,0,0,0.4)]  bg-white dark:bg-gray-900 p-2   overflow-y-auto  rounded-lg text-black dark:text-white'>

        {
          steps === 1 && (
            <div className='grid grid-cols-4'> 
              <h1 className='col-span-4 p-1 text-lg'> Genaral Information  </h1>

              <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-2  px-3">
                  <label className="text-start text-sm"> Name</label><br/>
                  <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="Name" name="name"  value={name} onChange={(e)=>setName(e.target.value)}   />
              </div>

              <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-2  px-3">
                  <label className="text-start text-sm"> Type</label><br/>
                  <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="Typer" name="type"   value={type} onChange={(e)=>setType(e.target.value)}   />
              </div>

              <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-2  px-3">
                  <label className="text-start text-sm"> Start date</label><br/>
                  <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="date" placeholder="Start date" name="start_date"    value={start_date} onChange={(e)=>setStart_date(e.target.value)}  />
              </div>

              <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-2  px-3">
                  <label className="text-start text-sm"> End date</label><br/>
                  <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="date" placeholder="End date" name="end_date"    value={end_date} onChange={(e)=>setEnd_date(e.target.value)}  />
              </div>

              <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-2  px-3">
                  <label className="text-start text-sm"> Status</label><br/>
                  <select  className="  border rounded-lg border-violet-950 w-full py-3 px-3 bg-white dark:bg-gray-800" name="statusr"  value={status} onChange={(e)=>setStatus(e.target.value)}  >
                    <option >Select Status</option>
                    <option value="planning">Planing</option>
                    <option value="rejected">Reject</option>
                    <option value="scheduling">Scheduling</option>
                    <option value="estimating">Estimating </option>
                    <option value="constructing">Constructing</option>
                    <option value="complete">Complete</option>
                    </select>
              </div>

              <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-2  px-3">
                  <label className="text-start text-sm"> Budget</label><br/>
                  <input  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="number" placeholder="Budget" name="budget"     value={budget} onChange={(e)=>setBudget(e.target.value)}  />
              </div>


            </div>
          ) 
        }


        {
          steps === 2 && (
            <div className='grid grid-cols-4'> 
              <h1 className='col-span-4 p-1 text-lg'> Other  Information  </h1>

              

              <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-2  px-3">
                  <label className="text-start text-sm"> Desciption </label><br/>
                  <textarea  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="Desciption" name="description"   value={description} onChange={(e)=>setDescription(e.target.value)}   />
              </div>

              <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-2  px-3">
                  <label className="text-start text-sm"> Location </label><br/>
                  <textarea  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="Location" name="location"   value={location} onChange={(e)=>setLocation(e.target.value)}   />
              </div>

                {/* up to now */}
              <div className="mb-2 w-full col-span-4 lg:col-span-4 md:col-span-4  px-3">
                <label className="text-start text-sm"> Objectives </label><br/>
                
                <div className='flex '> 
                  <textarea value={objective} onChange={(e)=>setObjectives(e.target.value)} className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " type="text" placeholder="Objectives" name="model"    />   
                  
                  <button onClick={addObjectives} type="button" className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-lg" >Add</button>
                </div>
              </div> 

              <ul className="mb-2 w-full col-span-4 lg:col-span-4 md:col-span-4  px-3 ">
                {
                  selectedObjectives.map((obj, index)=>( 
                    <span key={index} className='flex justify-between items-center bg-gray-200 p-2 rounded-md mb-1 border border-violet-700'> 

                      <li className=""> {index+1}. {obj} </li>
                      <button onClick={(e)=>removeObjective(index)}  type='reset'  className='ml-auto items-center col-span-1'>
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg> </button>  

                    </span>
                   
                  ))
                }
              </ul>


            </div>
          ) 
        }


  	    {
          steps === 3 && (
            <div className='grid grid-cols-4'> 
              <h1 className='col-span-4 p-1 text-lg'> Project Users  </h1>

              <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-2  px-3">
                  <label className="text-start text-sm"> Stakeholders</label><br/>
                  <MultiSelect options={clients} value={selectedClients} onChange={setSelectedClients} labelledBy="Select"  className="border rounded-lg border-violet-950 w-full  bg-white dark:bg-gray-800 "/>
               
              </div>

              <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-2  px-3">
                  <label className="text-start text-sm"> Consultants</label><br/>
                  <MultiSelect options={consultants} value={selectedConsultants} onChange={setSelectedConsultants} labelledBy="Select"  className="border rounded-lg border-violet-950 w-full  bg-white dark:bg-gray-800 "/>
              </div>

              <div className="mb-2 w-full col-span-4 lg:col-span-2 md:col-span-2  px-3">
                  <label className="text-start text-sm"> Contractors</label><br/>
                  <MultiSelect options={contractors} value={selectedContractors} onChange={setSelectedContractors} labelledBy="Select"  className="border rounded-lg border-violet-950 w-full  bg-white dark:bg-gray-800 "/>
              </div>
              
            </div>
          ) 
        }

        {
          steps === 4 && (
            <div className=' col-span-4'> 
              <h1 className='col-span-4 p-1 text-lg'> Project Documents   </h1>
              <div className='flex items-center justify-center w-full'>
                <label for="dropzone-file" className="flex flex-col items-center justify-center w-full h-auto border-2 border-violet-400 border-dashed rounded-lg cursor-pointer bg-gray-50   hover:bg-gray-100 ">
                  <div className="flex flex-col items-center justify-center pt-3 pb-3">
                          <svg className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
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

            </div>
          )
        }



        {
          steps === 5 && (
            <div className=' col-span-4'> 
              <h1 className='col-span-4 p-1 text-lg'> Project Images   </h1>
              <div className='flex items-center justify-center w-full'>
                <label for="dropzone-file" className="flex flex-col items-center justify-center w-full h-auto border-2 border-violet-400 border-dashed rounded-lg cursor-pointer bg-gray-50   hover:bg-gray-100 ">
                  <div className="flex flex-col items-center justify-center pt-3 pb-3">
                          <svg className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                      </div>
                    <input onChange={handleImagesChanges} id="dropzone-file" type="file" className="hidden" multiple />
                  </label>
              </div>

              <div style={{ marginTop: '20px' }}>
                {selectedImages.map((file, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', padding: '10px', border: '1px solid #7728d1' }}>
                  <p>{file.name}</p>

                  <button onClick={() => removeImages(file)}  type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg> 
                  </button>  
                  
                </div>
                ))}
              </div> 

            </div>
          )
        }

        <div className='flex justify-between p-2'>
          {
            steps !== 1 && (
              <button onClick={prevPage} type='button' className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 transition duration-300">Previous</button>
            )
          }

          {
            steps < 5 && (
              <button onClick={nextPage} type='button' className="bg-violet-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-violet-600 transition duration-300">Next</button>
            ) 
          }

          {
            steps === 5 && (
              <button type='submit' className="bg-violet-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-300"> Submit </button>
            ) 
          }

        </div>
      
      </form>
    </div>
  )
}
