import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";

import Loading from '../Loading';
import CustomSimpleTable from '../Tables/CustomSimpleTable';
import EditQualityControl from './EditQualityControl';
import QualityControlSelected from './QualityControlSelected';

export default function QualityControlTableTask() {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const { taskId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]); 

  const [itemEdit , setItemEdit] = useState(""); 
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/quality-controls-tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        });

        setData(response.data);

      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchData();
  }, [taskId]);


  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'title', label: 'Title' },
    { id: 'status', label: 'Status' },
    { id: 'checked_by', label: 'Checked By' },
    { id: 'checked_date', label: 'Checked Date' },
    { id: 'action_required', label: 'Action Required' },
    { id: 'resolution_date', label: 'Resolution Date' },
    
    ...(userInfo?.role === 'admin' ? [{ id: 'action', label: 'Action' }] : [])
  ];



  
  const handleEdit  = (selectedId)=>{
    if(selectedId){
      setItemEdit(selectedId);
    }
  }

  const [itemView, setItemView] = useState('');

  const handleView  = (selectedId)=>{
    if(selectedId){
      setItemView(selectedId);
    }
  }


  

  const handleDelete = (projectId) => {
    setData(data.filter(projects => projects.id !== projectId));
  };
  

  if (loading) {
    return <Loading />;
  }



  return (
    <div>
      
  {/* view Quality */}
  {
      itemView && (
        <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
              <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1"> Quality Control Detail </h1>
              <button  onClick={()=>setItemView('')} type='reset'  className='ml-auto items-center col-span-1'>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>
              
              <QualityControlSelected selectedId={itemView} />
              
          </div>
        </div>
      )
    }


    {/* edit item */}
    {
      itemEdit && (
        <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] '>  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
              <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  Edit Quality Control</h1>
              <button  onClick={()=>setItemEdit('')} type='reset'  className='ml-auto items-center col-span-1'><svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
                          
              <EditQualityControl selectedId={itemEdit}/> 
              
          </div>
        </div>
      )
    }
        
      <div className='mx-1 bg-white overflow-y-auto '>

      <CustomSimpleTable columns={columns} data={data} linkField="quality-control"  onDelete={handleDelete} onEdit={handleEdit} onView={handleView}   />

      </div>


    </div>
  )
}
