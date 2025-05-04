import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import Loading from '../Loading';
import ResponseMessages from '../ResponseMessages';
import DailyLogAssignees from './DailyLogExtra/DailyLogAssignees'
import DailyLogEquipments from './DailyLogExtra/DailyLogEquipments'
import DailyLogMaterials from './DailyLogExtra/DailyLogMaterials';
import DailyLogPurchaseOders from './DailyLogExtra/DailyLogPurchaseOders';
import DailyLogQualityControl from './DailyLogExtra/DailyLogQualityControl'
import NewFile from '../Project Files/NewFile';
import NewImage from '../Project Gallery/NewImage'
import ActualVsEstimationWork from '../Actual Cost/ActualVsEstimationWork';

export default function StartedWork(props) {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
    const { projectId } = useParams();
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('');
    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);


    const [work, setWork] = useState([]);
    const [general_note, setGenetalNote] = useState('');
    const [issues, setIssues] = useState([]);
    const [issue, setIssue] = useState('');
    const [impact, setImpact] = useState('');
    const [action_taken, setActionTaken] = useState('');
    

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const currentDate = new Date().toISOString().split('T')[0];

    const fetchWork = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/work-selected/${props.workId}`, {
          headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        });
  
        setWork(response.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false); 
      }
    };
    useEffect(() => {
    fetchWork();
  }, [props.workId]);



  // insert daily log issues
  const logIssuesSubmit = async (e) => {
    e.preventDefault();

    if(work.status === 'In progress'){

      const formData = new FormData();
    
      formData.append('task_date_id',props.workId);
      formData.append('task_id', work.task_id );
      formData.append('project_id',projectId);
      formData.append('issue',issue);
      formData.append('impact',impact);
      formData.append('action_taken',action_taken);
  
        try {
          const response = await axios.post("http://localhost:8000/api/new-daily-log-issues", formData,{
              headers: {
                  Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                  Accept: "application/json",
                  "Content-Type": "multipart/json", 
              },
          });
    
          setSuccessMessage.current(response.data.message);   
            
        } catch (error) {
            setErrorMessage.current(error.response.data.message)
            console.error(error);
        }
    }
    setErrorMessage.current('You cannot Finished task..')
    
  };
    
  // daily log issus 
  useEffect(() => {

    const fetchIssues = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/daily-log-date/${props.workId}`, {
          headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        });
  
        setIssues(response.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false); 
      }
    };
  
    fetchIssues();
  }, [props.workId]);

  

  // end task 
  const finishWork = async() => {
    // e.preventDefault();

    if(work.status === 'In progress'){
      try {
        const response = await axios.put(`http://127.0.0.1:8000/api/update-task-date/${props.workId}`,
        {
           status: 'Finished',
           weather_condition : `${props.weather.main.temp}°C   -  ${props.weather.weather[0].description}`,
           end_time : currentTime ,
           general_note  : general_note,
        },
        {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        }
        );
        setSuccessMessage.current(response.data.message);
        fetchWork();
      } catch (error) {
        setLoading(false);
        setErrorMessage.current(error.response.data.message)
      }
    }
    setErrorMessage.current('You cannot add issues now..')
   };
 

   if (loading) {
    return (
        <Loading />
    );
  }


  return (


    <div className=''>

      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

      <div className="rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-4   bg-white   dark:bg-gray-800 sidebar-ml max-h-[75vh] overflow-y-auto">
      
        <div className="flex justify-between items-center p-1 text-sm">
          <p className="text-gray-600 dark:text-gray-300">{work.date}</p>
          <p className="text-green-500 font-medium">{work.status}</p>
        </div>

        <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white"> {work.project_name} </h2>
        <h2 className="text-center text-xl font-bold text-gray-800 dark:text-white"> {work.task_name} </h2>

        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-2"> {work.description}</p>

        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mt-3 ">
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-md dark:bg-red-700 dark:text-white"> Priority: {work.task_proprity} </span>
          <span className="font-medium">Progress: {work.task_progress}%</span>
        </div>

        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-800 dark:text-white">Date:</span> {work.date_position}  →
          <span className="font-semibold text-gray-800 dark:text-white"> Total Dates:</span> {work.total_dates}
        </div>

        <div className="flex justify-between items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
          <div>
            <span className="font-semibold text-gray-800 dark:text-white">Start:</span> {work.task_start_date} →
            <span className="font-semibold text-gray-800 dark:text-white"> End:</span>{work.task_end_date}
          </div>
        </div>


        <div className='grid grid-cols-3 gap-3'>

          <div className='w-full col-span-3'>
              <hr className='border-t-3 border-gray-800 my-2'></hr>
          </div>

          <h2 className=" col-span-3 text-left text-xl font-bold text-gray-900 dark:text-white"> {work.date} - Summary  </h2>

          <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-3 px-3">
              <label className="text-start text-sm text-black dark:text-white">  Wheater Condition</label><br/>
              <input className=" rounded-lg w-full py-2 px-3 bg-white dark:bg-gray-500 text-black dark:text-white " type="text"  name="weather_condition" value={`${props.weather.main.temp}°C   -  ${props.weather.weather[0].description}`}   readOnly  />
          </div>
      
          <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-3 px-3">
              <label className="text-start text-sm text-black dark:text-white"> Start Time</label><br/>
              <input className=" rounded-lg w-full py-2 px-3 bg-white dark:bg-gray-500 text-black dark:text-white" type="time"  name="start_time"  value={work.start_time}   readOnly />
          </div>

          <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-2 px-3">
              <label className="text-start text-sm text-black dark:text-white"> End Time</label><br/>
              <input className=" rounded-lg  w-full py-2 px-3 bg-white dark:bg-gray-500 text-black dark:text-white border-violet-950" type="time"  name="end_time" value={work.end_time? work.end_time: null}   readOnly       />
          </div>

          <div className="mb-2 w-full col-span-3 lg:col-span-3 md:col-span-3 px-3">
              <label className="text-start text-sm text-black dark:text-white"> Genaral note</label><br/>
              <textarea  value={general_note} onChange={(e)=>setGenetalNote(e.target.value)} className="border  rounded-lg border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-500 " type="text" placeholder="General Note" name="general_note"      />
          </div>

              
          <div className='w-full col-span-3 '>
              <hr className='border-t-3 border-gray-800 my-2'></hr>
          </div>


          {/* Additional Work Details */}
          <h2 className=" col-span-3 text-left text-xl font-bold text-gray-800 dark:text-white">Additional Work Details </h2>

          <div className='col-span-3 space-y-4'>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">

              <button  onClick={() => setActiveSection('assignee')}  className={`py-2 px-3 ms-2 text-sm font-bold rounded-md text-black hover:bg-slate-400  disabled:cursor-not-allowed  disabled:opacity-50  ${activeSection === 'assignee' ? 'bg-slate-400' : 'bg-slate-300'}`} disabled={work.status === 'Finished'}> 👷‍♂️ Assignee  </button>

              <button  onClick={() => setActiveSection('equipments')}  className={`py-2 px-3 ms-2 text-sm font-bold rounded-md text-black hover:bg-slate-400  disabled:cursor-not-allowed  disabled:opacity-50  ${activeSection === 'equipments' ? 'bg-slate-400' : 'bg-slate-300'}`}  disabled={work.status === 'Finished'}> 🏗️ Equipments  </button>

              <button onClick={() => setActiveSection('materials')}  className={`py-2 px-3 ms-2 text-sm font-bold rounded-md text-black hover:bg-slate-400   disabled:cursor-not-allowed  disabled:opacity-50   ${activeSection === 'materials' ? 'bg-slate-400' : 'bg-slate-300'}`} disabled={work.status === 'Finished'} >📦 Materials  </button>

              <button onClick={() => setActiveSection('quality-control')}  className={`py-2 px-3 ms-2 text-sm font-bold rounded-md text-black hover:bg-slate-400 disabled:cursor-not-allowed  disabled:opacity-50   ${activeSection === 'quality-control' ? 'bg-slate-400' : 'bg-slate-300'}`}  disabled={work.status === 'Finished'}> ✅ Quality Control  </button>

              <button onClick={() => setActiveSection('purchase-order')}   className={`py-2 px-3 ms-2 text-sm font-bold rounded-md text-black hover:bg-slate-400 disabled:cursor-not-allowed  disabled:opacity-50   ${activeSection === 'purchase-order' ? 'bg-slate-400' : 'bg-slate-300'}`}  disabled={work.status === 'Finished'}> 🛒 Purchase Order  </button>

              {
                ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                <>
                  <button onClick={() => setActiveSection('images')}  className={`py-2 px-3 ms-2 text-sm font-bold rounded-md text-black hover:bg-slate-400  disabled:cursor-not-allowed  disabled:opacity-50  ${activeSection === 'images' ? 'bg-slate-400' : 'bg-slate-300'}`}  disabled={work.status === 'Finished'}> 📸 Images  </button>    

                  <button onClick={() => setActiveSection('documents')}  className={`py-2 px-3 ms-2 text-sm font-bold rounded-md text-black hover:bg-slate-400 disabled:cursor-not-allowed  disabled:opacity-50   ${activeSection === 'documents' ? 'bg-slate-400' : 'bg-slate-300'}`}  disabled={work.status === 'Finished'}> 📄  Documents  </button> 
                </>

                ) 
              } 

              <button onClick={() => setActiveSection('budget')}  className={`py-2 px-3 ms-2 text-sm font-bold rounded-md text-black hover:bg-slate-400 disabled:cursor-not-allowed  disabled:opacity-50   ${activeSection === 'budget' ? 'bg-slate-400' : 'bg-slate-300'}`}  disabled={work.status === 'Finished'}>💡 Budget  </button>    

            </div>

          </div>  


          <div className='w-full col-span-3 '>
            <hr className='border-t-3 border-gray-800 my-2'></hr>
          </div>


          <h2 className=" col-span-3 text-left text-xl font-bold text-gray-800 dark:text-white"> Have any issues on Site... </h2>
      
         {
         (( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (work.status === 'In progress'  )) &&  (

            <form onSubmit={logIssuesSubmit} className='col-span-3 grid grid-cols-7 gap-2'>

            <div className="mb-2 w-full col-span-7 lg:col-span-2 md:col-span-2 px-3">
                <label className="text-start text-sm text-black dark:text-white">  Issue</label><br/>
                <textarea value={issue} onChange={(e)=>setIssue(e.target.value)} className="border rounded-lg  h-12 border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-500 text-black dark:text-white " type="text"  name="issue"     />
            </div> 

            <div className="mb-2 w-full col-span-7 lg:col-span-2 md:col-span-2 px-3">
                <label className="text-start text-sm text-black dark:text-white">  Impact </label><br/>
                <textarea value={impact} onChange={(e)=>setImpact(e.target.value)} className="border rounded-lg h-12 border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-500 text-black dark:text-white " type="text"  name="impact"     />
            </div>

            <div className="mb-2 w-full col-span-7 lg:col-span-2 md:col-span-2 px-3">
                <label className="text-start text-sm text-black dark:text-white"> Action Taken </label><br/>
                <textarea value={action_taken} onChange={(e)=>setActionTaken(e.target.value)} className="border rounded-lg h-12 border-violet-950 w-full py-2 px-3 bg-white dark:bg-gray-500 text-black dark:text-white " type="text"  name="action_taken"      />
            </div>

            <div className="mb-2 w-full col-span-7 lg:col-span-1 md:col-span-1 px-3  bg-white dark:bg-gray-800  flex items-center justify-center">
                <button type='submit' className="w-full py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg  disabled:cursor-not-allowed  disabled:opacity-50 "  disabled={(userInfo?.role === 'client' || userInfo?.role === 'consultant' || userInfo?.role === 'labor' ) || work.status === 'Finished'  }> Add Issue</button>
            </div>

          </form> 
          )
         }


          {
          issues.map((data, index) => (
            <div key={index} className="col-span-3 p-2">
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border-l-4 border-purple-600">
                <h3 className="text-lg font-bold text-purple-700 dark:text-purple-400 mb-2">  Issue {index + 1}</h3>
                  
                  <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-900 dark:text-white">Impact:</span> {data.impact}
                  </p>

                  <p className="text-gray-700 dark:text-gray-300 mt-1">
                  <span className="font-semibold text-gray-900 dark:text-white">Action Taken:</span> {data.action_taken}
                  </p>

                  <p className="text-gray-700 dark:text-gray-300 mt-1">
                  <span className="font-semibold text-gray-900 dark:text-white">Issue:</span> {data.issue}
                  </p>
              </div>
            </div>
          ))
        }

      </div>

   
      {/* Display Selected Section */}

        {
          activeSection &&  (
            <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
              <div className={`bg-white border border-violet-950 rounded-lg  ${activeSection !== 'images' ? 'min-w-[90%] max-w-[90%] max-h-[90vh] overflow-y-auto' : 'w-full h-screen' } `}>
                      
              {
                activeSection !== 'images' && (
                  <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                    <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  {activeSection} </h1>
                    <button onClick={() => setActiveSection('')} type='reset'  className='ml-auto items-center col-span-1'>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                  </div>
                )
              } 
                  
                {activeSection === 'assignee' && <DailyLogAssignees  task_id={work.task_id} date={currentDate}  /> }
                {activeSection === 'equipments' && <DailyLogEquipments  task_id={work.task_id} date={currentDate}   /> }
                {activeSection === 'materials' && <DailyLogMaterials  task_id={work.task_id}  date={currentDate}  /> }
                {activeSection === 'purchase-order' && <DailyLogPurchaseOders  task_id={work.task_id}   date={currentDate}  /> }
                {activeSection === 'quality-control' && <DailyLogQualityControl  task_id={work.task_id}   date={currentDate}  /> }

                {activeSection === 'images' &&  <NewImage  setCloseCamera={() => setActiveSection('')}  imageType={'Daily Log'} img_referenced_id={work.id}/> }
                {activeSection === 'documents' &&  <NewFile doc_referenced_id={work.id}  doc_type={'Daily Log'}/> }
                
                {activeSection === 'budget' &&  <ActualVsEstimationWork task_id={work.task_id}   /> }
                
               
               
              </div>
            </div>
          )
        }

        {
          ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
            <button onClick={finishWork} disabled={work.status === 'Finished'  } className=" py-2 px-4 text-sm font-medium text-white bg-red-600 hover:bg-green-700 rounded-lg mt-4 disabled:cursor-not-allowed  disabled:opacity-50 " > Finish Task </button>   
          )
        }

 
       

      </div>


    </div>
  )
}
