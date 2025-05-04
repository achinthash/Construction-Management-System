
import React, { useState, useEffect,useRef } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import Loading from "../Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  TablePagination,
} from "@mui/material";

import EditQualityControl from './EditQualityControl';
import QualityControlSelected from './QualityControlSelected';
import ResponseMessages from '../ResponseMessages';


const QualityControlTable = () => {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [editQuality, setEditQuality] = useState(false);
  const [viewQuality, setViewQuality] = useState(false);
 
  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); 

 
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/quality-controls-projects/${projectId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });

      setData(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {

    fetchData();
  }, [projectId]);

 

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };


    // delete 

    const deleteQualityControl = async (id) => {
      if (window.confirm(`Are you sure you want to delete this Quality Control`)) {
        try {
         const response =  await axios.delete(`http://localhost:8000/api/delete-quality-control/${id}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        });
        setSuccessMessage.current(response.data.message);
  
        fetchData();
        } catch (error) {
          setErrorMessage.current(`Error deleting Quality Control:`, error);
        }
     }
    };


  if (loading) {
    return <Loading />;
  }

  return (


    <> 
  {/* view Quality */}
  {
      viewQuality && (
        <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
              <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1"> Quality Control Detail </h1>
              <button  onClick={()=>setViewQuality(false)} type='reset'  className='ml-auto items-center col-span-1'>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>
              
              <QualityControlSelected selectedId={viewQuality} />
              
          </div>
        </div>
      )
    }


     {/* new Quality */}
   {
      editQuality && (
        <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
              <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  Edit Quality Control </h1>
              <button  onClick={()=>setEditQuality(false)} type='reset'  className='ml-auto items-center col-span-1'>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>
              
              <EditQualityControl selectedId={editQuality} />
              
          </div>
        </div>
      )
    }


    <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>


    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
            <TableCell />
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell>Checked Date</TableCell>
            <TableCell>Checked By</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action Required</TableCell>
              {
                ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                  <TableCell>Action</TableCell>
                )
              }
          </TableRow>
        </TableHead>

        <TableBody>
          {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
            <React.Fragment key={row.task_id}>
              <TableRow
                sx={{
                  backgroundColor: '#e4daed',
                  '&:hover': { backgroundColor: '#dcd8e3' },
                }}>

                <TableCell onClick={() => { row.open = !row.open; setData([...data]); }}>
                  {row.open ? (
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                      <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                      <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/>
                    </svg>
                  )}
                </TableCell>
                <TableCell><input type="checkbox" /></TableCell>
                <TableCell>{row.task_name}</TableCell>
                
                <TableCell colSpan={5} />    

              </TableRow>

              {/*  collapse */}
              <TableRow>
                <TableCell colSpan={8} style={{ paddingBottom: 0, paddingTop: 0 }}>
                  <Collapse in={row.open} timeout="auto" unmountOnExit>
                    <Table>

                    <TableHead>
                    <TableRow sx={{ backgroundColor: '#ddd' }}>
                         <TableCell />
                         <TableCell>ID</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Checked Date</TableCell>
                      <TableCell>Checked By</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action Required</TableCell>
                      {
                        ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                          <TableCell>Action</TableCell>
                        )
                      }
                    </TableRow>
                  </TableHead>

                      <TableBody>
                        {row.quality_controls.map((qac) => (
                          <TableRow key={qac.id} sx={{ backgroundColor: '#eeebf5','&:hover': { backgroundColor: '#dcd8e3' },}} className="cursor-pointer" onClick={(e)=>{e.stopPropagation(); setViewQuality(qac.id)}}>
                            <TableCell />
                            <TableCell >{qac.id}</TableCell>
                            <TableCell>{qac.title}</TableCell>
                            <TableCell>{qac.checked_date}</TableCell>
                            <TableCell>{qac.checked_user}</TableCell>
                            <TableCell>{qac.status}</TableCell>
                            <TableCell>{qac.action_required}</TableCell>
                            {
                              ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                              <TableCell>
                                <span className="flex space-x-1">
                                  <p className="cursor-pointer"  onClick={(e)=>{ e.stopPropagation(); setEditQuality(qac.id)}}>Edit</p>
                                  <p className="cursor-pointer" onClick={(e)=>{ e.stopPropagation();deleteQualityControl(qac.id)}}>Delete</p>
                                </span>
                              </TableCell>

                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length} 
        rowsPerPage={rowsPerPage} 
        page={page} 
        onPageChange={handlePageChange} 
        onRowsPerPageChange={handleRowsPerPageChange} 
      />
    </TableContainer>

    </>
  );
};

export default QualityControlTable;
