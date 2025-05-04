import React, { useState,useEffect,useRef } from 'react';

import axios from 'axios';

import Loading from '../Loading';
import ResponseMessages from '../ResponseMessages';
import CustomSimpleTable from '../Tables/CustomSimpleTable';


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





export default function WorkHistory() {


    const [token, setToken] = useState(sessionStorage.getItem("token") || "");
    const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  
    
    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);
    const [loading, setLoading] = useState(true);
    
    const [data, setData] = useState([]);

  


    
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page


    // Handle page change
    const handlePageChange = (event, newPage) => {
        setPage(newPage);
      };
    
      // Handle rows per page change
      const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when changing rows per page
      };


  useEffect(()=>{

    const projectsList = async() =>{ 

      try{

        const response = await axios.get(`http://localhost:8000/api/my-logs-projects/${userInfo.id}`,{
          headers: { Authorization: `Bearer ${token}` }
        });

        setData(response.data);

        setLoading(false);

      }catch(error){
        setLoading(false);
        console.error(error);
      }
    }

    projectsList();

  },[userInfo.id]);



  const totalProjects = data.length;
  const totalTasks = data.reduce((acc, project) => {
    const projectTaskCount = project.tasks.reduce((sum, taskGroup) => sum + taskGroup.tasks.length, 0);
    return acc + projectTaskCount;
  }, 0);
  

  const pendingLogs = data.reduce((acc, project) => {
    const count = project.tasks.reduce((groupAcc, taskGroup) => {
      const pendingInGroup = taskGroup.tasks.filter(
        task => task.status?.toLowerCase() === 'pending'
      ).length;
      return groupAcc + pendingInGroup;
    }, 0);
    return acc + count;
  }, 0);



  const finishedLogs = data.reduce((acc, project) => {
    const count = project.tasks.reduce((groupAcc, taskGroup) => {
      const finishedInGroup = taskGroup.tasks.filter(
        task => task.status?.toLowerCase() === 'finished'
      ).length;
      return groupAcc + finishedInGroup;
    }, 0);
    return acc + count;
  }, 0);
  







  if (loading) {
    return (
        <Loading />
    );
}
  return (
    <div>
  

  <> 
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
            <TableCell />

            <TableCell>Project ID</TableCell>
            <TableCell>Project Number</TableCell>
            <TableCell  colSpan={5}/>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((project) => (
            <React.Fragment key={project.project_id}>
              <TableRow
                sx={{
                  backgroundColor: '#e4daed',
                  '&:hover': { backgroundColor: '#dcd8e3' },
                }}>

                <TableCell onClick={() => { project.open = !project.open; setData([...data]); }}>
                  {project.open ? (
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                      <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                      <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/>
                    </svg>
                  )}
                </TableCell>
            
                <TableCell>{project.project_id}</TableCell>
                <TableCell>{project.project_name}</TableCell>
                <TableCell  colSpan={5}/>
             
              </TableRow>

              {/* Estimations collapse */}
              <TableRow>
                <TableCell colSpan={8} style={{ paddingBottom: 0, paddingTop: 0 }}>
                  <Collapse in={project.open} timeout="auto" unmountOnExit>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                <TableCell />
                       
                                <TableCell>Task ID </TableCell>
                                <TableCell>Task Name </TableCell>
                                <TableCell  colSpan={5}/>
                            </TableRow>
                        </TableHead>

                      <TableBody>
                        {project.tasks.map((task) => (
                        <React.Fragment key={task.task_name}>

                          <TableRow
                            key={task.id}
                            sx={{
                              backgroundColor: '#eeebf5',
                              '&:hover': { backgroundColor: '#dcd8e3' },
                            }}
                          >
                            <TableCell onClick={() => { task.open = !task.open; setData([...data]); }}>
                                {task.open ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                                    <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                                    <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/>
                                    </svg>
                                )}
                                </TableCell>
          
                            <TableCell>{task.project_id}</TableCell>
                            <TableCell>{task.task_name}</TableCell>
                            <TableCell  colSpan={5}/>
                          </TableRow>

                            <TableRow>
                            <TableCell colSpan={8} style={{ paddingBottom: 0, paddingTop: 0 }}>
                            <Collapse in={task.open} timeout="auto" unmountOnExit>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#9794a6' }}>
                                            <TableCell />
                                
                                            <TableCell> ID </TableCell>
                                            <TableCell>Title  </TableCell>
                                            <TableCell>Date  </TableCell>
                                            <TableCell>Status  </TableCell>
                                            <TableCell>Start Time  </TableCell>
                                            <TableCell>End Time  </TableCell>
                                            <TableCell>Work Quality  </TableCell>

                                        </TableRow>
                                    </TableHead>

                                <TableBody>
                                    {task.tasks.map((log) => (
                                    <TableRow
                                        key={log.id}
                                        sx={{
                                        backgroundColor: '#eeebf5',
                                        '&:hover': { backgroundColor: '#dcd8e3' },
                                        }}
                                    >
                                        
                                        <TableCell />
                                       
                                            <TableCell> {log.id}  </TableCell>
                                            <TableCell>{log.title}  </TableCell>
                                            <TableCell> {log.date}   </TableCell>
                                            <TableCell>{log.status}   </TableCell>
                                            <TableCell> {log.start_time? log.start_time : 'N/A'}  </TableCell>
                                            <TableCell>  {log.end_time ? log.end_time : 'N/A'} </TableCell>
                                            <TableCell> {log.work_quality?log.work_quality : 'N/A'}  </TableCell>
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
        count={data.length} // Total number of rows
        rowsPerPage={rowsPerPage} // Rows per page state
        page={page} // Current page state
        onPageChange={handlePageChange} // Function to handle page change
        onRowsPerPageChange={handleRowsPerPageChange} 
      />
    </TableContainer>
    

    </>


    
        {/* summary */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-gray-200">

            <div className="p-2">
            <p className="text-sm text-gray-500">Total Projects</p>
            <p className="text-sm font-bold">{totalProjects}</p>
            </div>

            <div className="p-2">
            <p className="text-sm text-gray-500">Total Tasks</p>
            <p className="text-sm font-bold"> {totalTasks}</p>
            </div>

            <div className="p-2">
            <p className="text-sm text-gray-500">Pending Tasks</p>
            <p className="text-sm font-bold"> {pendingLogs}</p>
            </div>

            <div className="p-2">
            <p className="text-sm text-gray-500">Finished Tasks</p>
            <p className="text-sm font-bold"> {finishedLogs}</p>
            </div>

        </div>


    </div>
  )
}
