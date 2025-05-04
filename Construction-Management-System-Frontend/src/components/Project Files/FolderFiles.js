import React, { useState ,useEffect } from 'react';
import axios from 'axios';
import CustomSimpleTable from '../Tables/CustomSimpleTable';
import Loading from '../Loading';

export default function FolderFiles(props) {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const [files,setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'doc_name', label: 'Name' },
    { id: 'created_at', label: 'Date Modified' },
    { id: 'doc_path', label: 'Download'},
    { id: 'type', label: 'Type' },
    
    ...(userInfo?.role === 'admin' ? [{ id: 'action_delete', label: 'Action' }] : [])
  
  ];

  useEffect(()=>{

    const folderFiles = async() =>{
      try{ 
        const response = await axios.get(`http://127.0.0.1:8000/api/files/${props.project_id}/${props.selectedFolder}`,{
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`  }
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
      }
    } 

    folderFiles();

  },[props.selectedFolder]);

  const handleDelete = (projectId) => {
    setFiles(files.filter(files => files.id !== projectId));
  };
  
  if (loading) {
    return (
        <Loading />
    );
  }
    
  return (

    <div className='mx-1 bg-white overflow-y-auto h-[80vh]'>

      <CustomSimpleTable columns={columns} data={files} linkField="document"  onDelete={handleDelete} />

    </div>

  )
}
