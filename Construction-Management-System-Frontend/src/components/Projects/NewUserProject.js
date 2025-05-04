


import React, { useState ,useEffect,useRef} from 'react';
import axios from 'axios';
import { useParams} from 'react-router-dom';
import { MultiSelect } from "react-multi-select-component";

import Loading from '../Loading';
import ResponseMessages from '../ResponseMessages';

export default function NewUserProject() {

  const { projectId } = useParams();
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");


  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);
  const [loading, setLoading] = useState(true);


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


  // submit new user

  const submit = async(e) =>{
    e.preventDefault();

    const formData = new FormData();
    
    formData.append('project_id',projectId);
    selectedClients.forEach((client) => formData.append('client_id[]', client.value));
    selectedConsultants.forEach((contractors) => formData.append('consultant_id[]', contractors.value));
    selectedContractors.forEach((consultants) => formData.append('contractor_id[]', consultants.value));

    try{

      const response = await axios.post("http://127.0.0.1:8000/api/new-user-project", formData,{
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

  
  if (loading) {
    return (
        <Loading />
    );
  }

  
  return (
    <div className=' p-2 max-h-[80vh] overflow-y-auto w-full '>

    <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

      <form  onSubmit={submit} className=' min-w-[3/4]  gap-2  shadow-[0_3px_10px_rgb(0,0,0,0.4)]  bg-white dark:bg-gray-900 p-2   overflow-y-auto  rounded-lg text-black dark:text-white'>

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

        <button type='submit' className="bg-violet-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-300"> Submit </button>
    

      </form>
    </div>
  )
}
