
import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios';
import ResponseMessages from '../ResponseMessages';
import Loading from '../Loading';


const EditProject = (props) => {


  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    status: '',
    location: '',
    progress: '',
    start_date: '',
    end_date: '',
    budget: ''
  });


  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

   const fetchData = async() =>{

        try{
            const response = await axios.get(`http://localhost:8000/api/project/${props.selectedId}`,{
            headers: 
                { Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                 Accept: 'application/json'} 
        })

            setFormData(response.data);
            setLoading(false);
        }
        catch(error){

         //   console.error(error)
            setErrorMessage.current("Failed to load project data");
            
        }    
    }

    fetchData();
    
  }, [props.selectedId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.put(`http://localhost:8000/api/update-project/${props.selectedId}`, formData,{  
          headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              Accept: "application/json",
              
          },
      });
      setSuccessMessage.current(response.data.message);
    }
    
    catch (err) {
      setErrorMessage.current("Failed to update project.");
    }
  };


  if (loading) {
    return (
        <Loading />
    );
}


  return (
    <div className=' p-2 max-h-[80vh] overflow-y-auto  '>

    <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

        <form onSubmit={handleSubmit} className='grid grid-cols-4  gap-2  shadow-[0_3px_10px_rgb(0,0,0,0.4)]  bg-white dark:bg-gray-900 p-2   overflow-y-auto  rounded-lg text-black dark:text-white'>

            <h1 className='col-span-4 p-1 text-lg'> Genaral Information  </h1>

            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> Name </label><br/>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange}  placeholder="Name" className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " />
            </div>

            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> Progress </label><br/>
                <input type="number" name="progress" value={formData.progress || ''} onChange={handleChange}  placeholder="progress" className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " />
            </div>

            <div className="w-full  col-span-4 lg:col-span-1 md:col-span-2  px-3 mb-2">
                <label className="text-start text-sm"> Status </label><br/>
                <select  value={formData.status || ''} onChange={handleChange}  className="border rounded-lg border-violet-950 w-full py-2 px-3  bg-white dark:bg-gray-800 "  name="status"  required >
                    <option  value={formData.status || ''}>{formData.status || ''}</option>
                    <option value="available">Available</option>
                    <option value="in_use">In Use</option>
                    <option value="under_maintenance">Under Maintenance</option>
                    <option value="damaged">Damaged</option>
                </select>
            </div>

            <div className="w-full  col-span-4 lg:col-span-1 md:col-span-2  px-3 mb-2">
                <label className="text-start text-sm"> Type </label><br/>
                <select  value={formData.type || ''} onChange={handleChange}  className="border rounded-lg border-violet-950 w-full py-2 px-3  bg-white dark:bg-gray-800 "  name="type"  required >
                    <option  value={formData.type || ''} >{formData.type || ''}</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="other">Other</option>
                </select>
            </div>
          
            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> Budget </label><br/>
                <input type="number" name="budget" value={formData.budget || ''} onChange={handleChange}  placeholder="budget" className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " />
            </div>

            

            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> location </label><br/>
                <input type="text" name="location" value={formData.location || ''} onChange={handleChange}  placeholder="location" className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " />
            </div>

            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> Start Date</label><br/>
                <input type="date" name="start_date" value={formData.start_date || ''} onChange={handleChange}  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " />
            </div>

            <div className="mb-2 w-full col-span-4 lg:col-span-1 md:col-span-2  px-3">
                <label className="text-start text-sm"> End Date</label><br/>
                <input type="date" name="end_date" value={formData.end_date || ''} onChange={handleChange}  className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " />
            </div>

            <div className="mb-2 w-full col-span-4 lg:col-span-4 md:col-span-4  px-3">
                <label className="text-start text-sm"> Description </label><br/>
                <textarea type="text" name="description" value={formData.description || ''} onChange={handleChange}  placeholder="description" className="border rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-800 " > </textarea>
            </div>

            <div className='w-full col-span-4'>
                <hr className='border-t-3 border-gray-800 my-2'></hr>
            </div>
                                
            <div className='  col-span-4   w-full grid grid-cols-4 '>

                <div className=" col-span-2 lg:col-span-1 md:col-span-2  w-full  mb-4 sm:mb-0 px-3 ">
                    <button className="bg-blue-500  hover:bg-blue-700  dark:bg-gray-600 dark:hover:bg-slate-500  text-white font-bold py-2 px-4 rounded w-full" type="submit">Save</button>
                </div>
                <div className="w-full  mb-4 sm:mb-0 px-3 col-span-2 lg:col-span-1 md:col-span-2  ">
                    <button   className="bg-blue-500 hover:bg-blue-700 text-white  dark:bg-gray-600 dark:hover:bg-slate-500 font-bold py-2 px-4 rounded w-full"  type="reset">Cancel</button>
                </div>
            </div>

        </form>

    </div>
  );
};

export default EditProject;
