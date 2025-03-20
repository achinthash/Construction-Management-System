import React, { useState ,useEffect} from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

const Client_Requirements = () => {

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Error message time out function\

  const navigate = useNavigate();
 
      const setErrorWithTimeout = (errorMessage, timeout = 3000) => {
          setError(errorMessage);
          setTimeout(() => {
            setError('');
          }, timeout);
        };


  // Success message time out function
  const setSuccessWithTimeout = (successMessage, timeout = 3000) => {
      setSuccess(successMessage);
      setTimeout(() => {
          setSuccess('');
      }, timeout);
  };


  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    project_name: '',
    project_type: '',
    start_date: '',
    end_date: '',
    total_budget: '',
    site_location: '',
    site_conditions: '',
    identified_risks: '',
    objectives: '',
    status: 'created',
    quality_standards: '',
    user_name: '',
    user_email: '',
    nic: '',
    phone_number: '',
    address: '',
    profile_picture: null,
  });

  const [permitsDoc, setPermitsDoc] = useState([]);

  
  const nextStep = () => {
    setStep(step + 1);
  };

  
  const prevStep = () => {
    setStep(step - 1);
  };

  
  const onDropPermitFile = (acceptedFiles) => {
    setPermitsDoc([...permitsDoc, ...acceptedFiles]);
  };

  const { getRootProps: getRootPropsPermitFile, getInputProps: getInputPropsPermitFile } = useDropzone({ onDrop: onDropPermitFile });

  const removePermitFile = (index) => {
    const newFiles = [...permitsDoc];
    newFiles.splice(index, 1);
    setPermitsDoc(newFiles);
  };

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profile_picture: e.target.files[0],
    });
  };


  


  const submitForm = async (e) => {
    e.preventDefault();

    const today = new Date().toISOString().split('T')[0]; 

    if (formData.start_date <= today || formData.end_date <= today) {
      setErrorWithTimeout("Start date or end date cannot be today's date.");
      return;
    }
    
    
    if (formData.start_date >= formData.end_date) {
      setErrorWithTimeout("Start date must be before the end date.");
      return;
    }
    

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });

   
    permitsDoc.forEach((file) => {
      data.append('permitsDoc[]', file);
    });

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/client-project-request', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


 if (response.status === 200) { 
  setSuccessWithTimeout('Form submitted successfully!');
     // console.log(response.data);

      // Send the email
      handleSubmit(); 

      setTimeout(() => {
        navigate('/home');
      }, 5000); 
    }
    

    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorWithTimeout('Error submitting form.');
    }
  };



    

  const [emailData, setEmailData] = useState({
    receiverEmail: formData.user_email || '',
    ClientName: formData.user_name || '',
   // status: formData.status || '',
    phone_number: formData.phone_number || '',
    project_name: formData.project_name || '',
    project_type: formData.project_type || '',
    start_date: formData.start_date || '',
    end_date: formData.end_date || '',
    total_budget: formData.total_budget || '',
    site_location: formData.site_location || '',
    objectives: formData.objectives || '',
  });

  useEffect(() => {
    setEmailData({
      receiverEmail: formData.user_email || '',
      ClientName: formData.user_name || '',
   //   status: formData.status || '',
      phone_number: formData.phone_number || '',
      project_name: formData.project_name || '',
      project_type: formData.project_type || '',
      start_date: formData.start_date || '',
      end_date: formData.end_date || '',
      total_budget: formData.total_budget || '',
      site_location: formData.site_location || '',
      objectives: formData.objectives || '',
    });
  }, [formData]);

  const handleSubmit = async () => {
   // e.preventDefault();

    try {
      await axios.post('http://127.0.0.1:8000/api/send-client-request-email', emailData);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      setErrorWithTimeout('Failed to send email');
    }
  };


  return (
    <div className="max-h-screen bg-gray-100">



      <div
        className="w-full h-screen bg-cover bg-center opacity-90"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/images/construction-site.jpg'})` }}
      >
        <div className='flex justify-center items-center overflow-y-auto absolute z-0 inset-0'>
      
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
              {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                      <p>{error}</p>
                  </div>
              )}

              {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
                      <p>{success}</p>
                  </div>
              )}
            <form onSubmit={submitForm} className="space-y-6">
              {step === 1 && (
                <div className='grid grid-cols-2 gap-2'>
                  <h2 className="col-span-2 text-2xl font-semibold mb-6 text-gray-800">Let's set up your construction project</h2>


                  
<div class="flex items-center justify-center w-full">
    <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
        </div>
        <input id="dropzone-file" type="file" class="hidden" multiple />
    </label>
</div> 


{/* <div className="mb-4 col-span-4 items-center justify-center">
                                    <label className="text-start text-sm ">Poject Documents </label><br/>
                                    <div {...getRootProps_Permits_file()} style={{ border: '2px dashed #7728d1', borderRadius: '4px', padding: '30px', textAlign: 'center', cursor: 'pointer' }}>
                                        <input {...getInputProps_permit_file()} />
                                        <p>Drag & drop prject all file here, or click to select file</p>
                                    </div>
                                    <div style={{ marginTop: '20px' }}>
                                        {Permits_doc.map((file, index) => (
                                        <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', padding: '10px', border: '1px solid #7728d1' }}>
                                            <p>{file.name}</p>
                                            <button type="button" className='text-red-500' onClick={() => removePermit_file(index)}>Remove</button>
                                        </div>
                                        ))}
                                    </div>
                                    </div>                */}
                          


                  <div>
                    <label className="block text-gray-700 font-medium">Project Name</label>
                    <input required
                      type="text"
                      name="project_name"
                      value={formData.project_name}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 border-indigo-600"
                      placeholder="Enter the project name"
                    />
                  </div>
              
                  <div>
                    <label className="block text-gray-700 font-medium">Project Type</label>
                    <input required
                      type="text"
                      name="project_type"
                      value={formData.project_type}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 border-indigo-600"
                      placeholder="Enter the project type"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">Start Date</label>
                    <input required
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">End Date</label>
                    <input required
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 border-indigo-600"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium">Total Budget</label>
                    <input required
                      type="number"
                      name="total_budget"
                      value={formData.total_budget}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 border-indigo-600"
                      placeholder="Enter the total budget"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">Site Location</label>
                    <input required
                      type="text"
                      name="site_location"
                      value={formData.site_location}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 border-indigo-600"
                      placeholder="Enter the site location"
                    />
                  </div>
                  <div className='col-span-2'>
                    <label className="block text-gray-700 font-medium">Site Conditions</label>
                    <textarea 
                      name="site_conditions"
                      value={formData.site_conditions}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 border-indigo-600"
                      rows="3"
                      placeholder="Describe the site conditions..."
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 p-2 gap-6 bg-white shadow-md rounded-lg">
                    <div>
                      <label className="block text-gray-700 font-medium">Identified Risks</label>
                      <textarea
                        name="identified_risks"
                        value={formData.identified_risks}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 border-indigo-600"
                        rows="3"
                        placeholder="Identify potential risks..."
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium">Quality Standards</label>
                      <textarea
                        name="quality_standards"
                        value={formData.quality_standards}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 border-indigo-600"
                        rows="3"
                        placeholder="Define the quality standards..."
                      />
                    </div>

                    <div className='col-span-2'>
                      <label className="block text-gray-700 font-medium">Objectives </label>
                      <textarea required
                        name="objectives"
                        value={formData.objectives}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 border-indigo-600"
                        rows="3"
                        placeholder="Define the objectives..."
                      />
                    </div>


                  
                  {
                    /*

                    <div className='col-span-2  grid grid-cols-2   mb-2'>
                    <h2 className='col-span-2 py-2 px-2  text-gray-700 text-lg'>Documents</h2>
                    <div className="mb-4 w-full  items-center justify-center col-span-2">
                      <div {...getRootPropsPermitFile()} style={{ border: '2px dashed #7728d1', borderRadius: '4px', padding: '30px', textAlign: 'center', cursor: 'pointer' }}>
                        <input {...getInputPropsPermitFile()} />
                        <p>Drag & drop project files here, or click to select files</p>
                      </div>
                      <div style={{ marginTop: '20px' }}>
                        {permitsDoc.map((file, index) => (
                          <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', padding: '10px', border: '1px solid #7728d1' }}>
                            <p>{file.name}</p>
                            <button type="button" className='text-red-500' onClick={() => removePermitFile(index)}>Remove</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                    */
                  }

                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium">User Name</label>
                      <input required
                        type="text"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 border-indigo-600"
                        placeholder="Enter the user name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium">User Email</label>
                      <input required
                        type="email"
                        name="user_email"
                        value={formData.user_email}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 border-indigo-600"
                        placeholder="Enter the user email"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium">NIC</label>
                      <input
                        type="text" required
                        name="nic"
                        value={formData.nic}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 border-indigo-600"
                        placeholder="Enter NIC"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium">Phone Number</label>
                      <input
                        type="number" required
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 border-indigo-600"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium">Address</label>
                      <input required
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 border-indigo-600"
                        placeholder="Enter address"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium">Profile Picture</label>
                      <input
                        type="file"
                        name="profile_picture"
                        onChange={handleFileChange}
                        className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 border-indigo-600"
                      />
                    </div>
                  </div>
                </>
              )}

             
              {/* Step navigation buttons */}
              <div className="flex justify-between">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 transition duration-300"
                  >
                    Previous
                  </button>
                )}
                {step < 4 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
                  >
                    Next
                  </button>
                )}
                {step === 4 && (

                  <>
                   <button
                    type="submit"
                    className="bg-violet-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-300">
                    Submit Project Details
                  </button>
                  
                  </>
                 

                  
                )}  
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Client_Requirements;
