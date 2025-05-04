import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useParams } from 'react-router-dom';

import Loading from '../Loading';
import DailyLogAssignees from '../Works/DailyLogExtra/DailyLogAssignees'
import DailyLogEquipments from '../Works/DailyLogExtra/DailyLogEquipments'
import DailyLogMaterials from '../Works/DailyLogExtra/DailyLogMaterials';
import DailyLogPurchaseOders from '../Works/DailyLogExtra/DailyLogPurchaseOders';
import DailyLogQualityControl from '../Works/DailyLogExtra/DailyLogQualityControl'
import ActualVsEstimationTaskTable from '../Actual Cost/ActualVsEstimationTaskTable'

import DailyLogImages from './DailyLogImages';
import DailyLogDocument from  './DailyLogDocument';

export default function DailyLogSelected(props) {


    const { projectId } = useParams();
    const [token] = useState(sessionStorage.getItem("token") || "");
    const [loading, setLoading] = useState(true);
    const [work, setWork] = useState([]);
    const [issues, setIssues] = useState([]);
    const [activeSection, setActiveSection] = useState('');

    

  // props.workId

    const fetchWork = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/work-selected/${props.selectedId}`, {
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
  }, [props.selectedId]);


    // daily log issus 
  useEffect(() => {

    const fetchIssues = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/daily-log-date/${props.selectedId}`, {
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
  }, [props.selectedId]);



  const downloadPDF = () => {
    const bill = document.getElementById('bill');
    const originalStyle = bill.getAttribute("style");
  
    bill.style.maxHeight = 'none';
    bill.style.overflow = 'visible';
  
    html2canvas(bill, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
  
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
  
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
  
      let heightLeft = imgHeight;
      let position = 0;
  
      // First page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
  
      // Add more pages if needed
      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
  
      const pdfBlob = pdf.output('blob');
      const formData = new FormData();
      const fileName = `Bill-${props.selectedId || 'details'}.pdf`;
      const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });
  
      formData.append('project_id', projectId);
      formData.append('doc_type', 'Daily Log');
      formData.append('doc_path[]', pdfFile);
      formData.append('doc_referenced_id', props.selectedId); 
  
      axios.post('http://127.0.0.1:8000/api/new-document', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        alert('PDF uploaded and saved successfully.');
        pdf.save(fileName); 
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to upload PDF.');
      })
      .finally(() => {
        if (originalStyle) {
          bill.setAttribute("style", originalStyle);
        } else {
          bill.removeAttribute("style");
        }
      });
    });
  };
  


   if (loading) {
    return (
        <Loading />
    );
  }


  return (


    <div className='max-h-[80vh] overflow-y-auto'>
  
      <div className="flex p-1 items-end">
        <button onClick={downloadPDF} className=" bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" > <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg></button>
      </div> 

      <div > 


      <div id="bill" className="rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-4   bg-white hover:bg-violet-50  dark:bg-gray-800 ">
      
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

        <h2 className=" col-span-3 text-left text-xl font-bold text-gray-800 dark:text-white"> 2025/04/01 - Summary  </h2>

        <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-3 px-3">
            <label className="text-start text-sm">  Wheater Condition</label><br/>
            <label className="text-start text-sm">  {work.weather_condition} </label><br/>
        </div>
    
        <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-3 px-3">
            <label className="text-start text-sm"> Start Time</label><br/>
            <label className="text-start text-sm">  {work.start_time} </label><br/>
        </div>

        <div className="mb-2 w-full col-span-3 lg:col-span-1 md:col-span-2 px-3">
            <label className="text-start text-sm"> End Time</label><br/>
            <label className="text-start text-sm">  {work.end_time} </label><br/>
        </div>

        <div className="mb-2 w-full col-span-3 lg:col-span-3 md:col-span-3 px-3">
            <label className="text-start text-sm"> Genaral note</label><br/>
            <label className="text-start text-sm">  {work.general_note} </label><br/>
        </div>

            
        <div className='w-full col-span-3 '>
          <hr className='border-t-3 border-gray-800 my-2'></hr>
        </div>


        <h2 className=" col-span-3 text-left text-xl font-bold text-gray-800 dark:text-white"> Problems and Issues </h2>
      
        {
          issues.length > 0 ? (
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
          ) : <p className='text-gray-00 text-xs text-center'>Problems and Issues are not added...</p>
        }


      </div>


    </div>


    <div className='p-4'>

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

            <button onClick={() => setActiveSection('images')}  className={`py-2 px-3 ms-2 text-sm font-bold rounded-md text-black hover:bg-slate-400  disabled:cursor-not-allowed  disabled:opacity-50 
            ${activeSection === 'images' ? 'bg-slate-400' : 'bg-slate-300'}`}  disabled={work.status === 'Finished'}> 📸 Images  </button>    


            <button onClick={() => setActiveSection('documents')}  className={`py-2 px-3 ms-2 text-sm font-bold rounded-md text-black hover:bg-slate-400 disabled:cursor-not-allowed  disabled:opacity-50   ${activeSection === 'documents' ? 'bg-slate-400' : 'bg-slate-300'}`}  disabled={work.status === 'Finished'}> 📄  Documents  </button>    

            <button onClick={() => setActiveSection('budget')}  className={`py-2 px-3 ms-2 text-sm font-bold rounded-md text-black hover:bg-slate-400 disabled:cursor-not-allowed  disabled:opacity-50   ${activeSection === 'budget' ? 'bg-slate-400' : 'bg-slate-300'}`}  disabled={work.status === 'Finished'}>💡 Budget  </button>    
          </div>

        </div>  
    </div>
      
      {/* Display Selected Section */}

      {
        activeSection &&  (
          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className={`bg-white border border-violet-950 rounded-lg w-full h-screen   `}>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  {activeSection} </h1>
                <button onClick={() => setActiveSection('')} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
              {activeSection === 'assignee' && <DailyLogAssignees  task_id={work.task_id} date={work.date} /> }
              {activeSection === 'equipments' && <DailyLogEquipments  task_id={work.task_id} date={work.date} /> }
              {activeSection === 'materials' && <DailyLogMaterials  task_id={work.task_id} date={work.date} /> }
              {activeSection === 'purchase-order' && <DailyLogPurchaseOders  task_id={work.task_id} date={work.date} /> }
              {activeSection === 'quality-control' && <DailyLogQualityControl  task_id={work.task_id} date={work.date} /> }
              {activeSection === 'images' &&  <DailyLogImages work_id={work.id} /> }  
              {activeSection === 'documents' &&  <DailyLogDocument work_id={work.id} /> }
              {activeSection === 'budget' &&  <ActualVsEstimationTaskTable task_id={work.task_id}   /> }
              
            </div>
          </div>
        )
      }
   

      </div>


    </div>
  )
}
