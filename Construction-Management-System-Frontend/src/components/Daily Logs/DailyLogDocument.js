

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Loading';

import CustomSimpleTable from '../Tables/CustomSimpleTable';



export default function DailyLogDocument({work_id}) {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
    const { projectId, taskId } = useParams();
    const [loading, setLoading] = useState(true);


    const [files, setFiles] = useState([]);

 
    
  const handleDelete = (projectId) => {
    setFiles(files.filter(files => files.id !== projectId));
  };

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'doc_name', label: 'Name' },
    { id: 'created_at', label: 'Date Modified' },
    { id: 'doc_path', label: 'Download'},
    { id: 'type', label: 'Type' },
  
    ...(userInfo?.role === 'admin' ? [{ id: 'action_delete', label: 'Action' }] : [])
  
  ];

  useEffect(()=>{
      const tasks = async() =>{
  
      try{
          const response = await axios.get(`http://127.0.0.1:8000/api/files-type-item/${projectId}/Daily Log/${work_id}`,{
            headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}`  }
          });

          const formatedFiles = response.data.map(file =>({
            ...file,
            created_at : file.created_at.substring(0, 19).replace("T", " "),
            type : file.doc_name.split('.').pop()
        }))
  
        setLoading(false);
        setFiles(formatedFiles);
          
      }catch(error){
        setLoading(false);
        console.error(error);
      }}
  
      tasks();
  
  },[projectId,taskId]);


  if (loading) {
    return (
        <Loading />
    );
}
  return (
    <div>


    <CustomSimpleTable columns={columns} data={files} linkField="document"  onDelete={handleDelete} />

    </div>
  )
}
