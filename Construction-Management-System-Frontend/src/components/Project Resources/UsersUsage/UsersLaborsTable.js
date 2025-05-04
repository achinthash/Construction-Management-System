
import React, { useState, useEffect,useRef } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import Loading from "../../Loading";
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

import UsageLaborSummary from './UsageLaborSummary'
import ResponseMessages from '../../ResponseMessages';
import UserLogSelected from './UserLogSelected';
import UserLogEdit from '../../User Log/UserLogEdit';

const UsersLaborsTable = () => {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); 
  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);
  const [isEditLog, setisEditLog] = useState('');
  const [selectedUserLogs, setSelectedUserLogs] = useState('');


    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/user-logs-projects/${projectId}`, {
          headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}` },
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



  if (loading) {
    return <Loading />;
  }

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

  const deleteUserLogs = async (id) => {
    if (window.confirm(`Are you sure you want to delete this UserLog`)) {
      try {
       const response =  await axios.delete(`http://localhost:8000/api/delete-user-log/${id}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });
      setSuccessMessage.current(response.data.message);

        fetchData();
      } catch (error) {
        setErrorMessage.current(`Error deleting UserLog:`, error);
      }
   }
  };


  return (

    <> 


      {/* selected uses logs */}
      {
        selectedUserLogs && (
          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[80%]'>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  User Log </h1>
                <button  onClick={()=>setSelectedUserLogs('')} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <UserLogSelected selectedUserId={selectedUserLogs} />
                
            </div>
          </div>
        )
      }


       {/* edit uses logs */}
       {
        isEditLog && (
          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[80%]'>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1"> Edit User Log </h1>
                <button  onClick={()=>setisEditLog('')} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <UserLogEdit selectedLogId={isEditLog} />
                
            </div>
          </div>
        )
      }


      <div id="header" className="bg-[#ddd6fee2]   dark:bg-gray-900  rounded flex md:flex-row flex-col p-2  my-1  mr-1 justify-between ">
        <h1 className="text-left sm:text-xl font-bold text p-1 text-[#5c3c8f] dark:text-white ">Project Labors </h1> 
      </div>

 
    <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

    <TableContainer component={Paper}>
      <Table>
        <TableHead>
        <TableRow className="bg-slate-300"  >
            <TableCell />
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Role </TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Progress</TableCell>
            <TableCell>Allocations</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
            <React.Fragment key={row.user_id}>
              <TableRow className="bg-slate-100 hover:bg-slate-200" >

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
                <TableCell onClick={()=>setSelectedUserLogs(row.user_id)} >{row.user_id}</TableCell>
                <TableCell>{row.user_name}</TableCell>
                <TableCell>{row.user_role}</TableCell>
                <TableCell>{row.user_position}</TableCell>
                <TableCell> {row.user_status}</TableCell> 
                <TableCell> {row.progress_percentage}%</TableCell> 
                <TableCell> {row.allocated_dates} </TableCell> 
              </TableRow>

              {/* Estimations collapse */}
              <TableRow>
                <TableCell colSpan={9} style={{ paddingBottom: 0, paddingTop: 0 }}>
                  <Collapse in={row.open} timeout="auto" unmountOnExit>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                <TableCell />
                                <TableCell />
                                <TableCell>ID </TableCell>
                                <TableCell>Task </TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Start Time</TableCell>
                                <TableCell>End Time</TableCell>
                                {
                                  ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                                    <TableCell>Action</TableCell>
                                  )
                                }

                            </TableRow>
                        </TableHead>

                      <TableBody>
                        {row.log.map((cost) => (
                          <TableRow
                            key={cost.id}
                            sx={{
                              backgroundColor: '#eeebf5',
                              '&:hover': { backgroundColor: '#dcd8e3' },
                            }}
                          >
                            <TableCell />
                            <TableCell />
                            <TableCell>{cost.id}</TableCell> 
                            <TableCell>{cost.task_id}</TableCell>
                            <TableCell>{cost.title}</TableCell>
                            <TableCell>{cost.date}</TableCell>
                            <TableCell>{cost.status}</TableCell>
                            <TableCell>{cost.start_time?cost.start_time:'N/A'}</TableCell>
                            <TableCell>{cost.end_time?cost.end_time :'N/A'}</TableCell>
                            {
                              ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                                <TableCell>
                                  <span className='flex space-x-1'> 
                                    <p className='cursor-pointer' onClick={()=>setisEditLog(cost.id)}>Edit</p> 
                                    <p className='cursor-pointer' onClick={()=>deleteUserLogs(cost.id)}>Delete</p> 
                                  </span> 
                                </TableCell>
                              )
                            }

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

    <div> 
      <UsageLaborSummary data={data} />
    </div>

    </>
  );
};

export default UsersLaborsTable;
