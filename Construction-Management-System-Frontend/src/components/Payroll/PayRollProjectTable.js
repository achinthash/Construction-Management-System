

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
  TablePagination,
  TableRow,
  Paper,
  Collapse,
  IconButton
} from "@mui/material";
import PayrollSummary from './PayrollSummary';
import NewPayroll from './NewPayroll';
import PayRollSelected from './PayRollSelected';

import EditPayroll from './EditPayroll';
import ResponseMessages from '../ResponseMessages';


const PayRollProjectTable = ( ) => {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const { projectId, taskId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPayRoll, setSelectedPayRoll] = useState('');
  const [isNewPayroll, setIsNewPayRoll] = useState(false);
  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/payroll-project/${projectId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        });

        setData(response.data);

      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchData();
  }, [projectId]);


  const handleExpand = (userId) => {
    setExpanded((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  
  const [isEditPayRoll, setIsEditPayRoll] = useState('');
  


  // delete pay roll 
  const deletePayRoll = async (id) => {
    if (window.confirm(`Are you sure you want to delete this Payroll`)) {
      try {
       const response =  await axios.delete(`http://localhost:8000/api/delete-payroll/${id}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });
      setSuccessMessage.current(response.data.message);

        // fetchData();
      } catch (error) {
        setErrorMessage.current(`Error deleting Payroll:`, error);
      }
   }
  };


  if (loading) {
    return <Loading />;
  }
  return (

    <div className="max-h-[75vh] overflow-y-auto "> 


      {
        selectedPayRoll && (
            <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] '>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  Payroll </h1>
                <button  onClick={()=>setSelectedPayRoll('')} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <PayRollSelected selectedPayRoll={selectedPayRoll} />
                
            </div>
          </div>
        )
      }


      {
        isNewPayroll && (
            <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  New Payroll </h1>
                <button  onClick={()=>setIsNewPayRoll(false)} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <NewPayroll />
                
            </div>
          </div>
        )
      }


      {
        isEditPayRoll && (
            <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  Edit Payroll </h1>
                <button  onClick={()=>setIsEditPayRoll('')} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <EditPayroll selectedPayroll={isEditPayRoll}/>
                
            </div>
          </div>
        )
      }
   <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

      <div id="header" className="bg-[#ddd6fee2]   dark:bg-gray-900  rounded flex  p-2  my-1  mr-1 justify-between ">
        <h1 className="text-left sm:text-xl font-bold text p-1 text-[#5c3c8f] dark:text-white ">PayRoll  </h1> 

            {
              ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                <>
                  <button onClick={()=>setIsNewPayRoll(true)}  className="py-2 px-3 ms-2 text-smfont-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 hidden md:block"> New PayRoll  </button>
                  <button  onClick={()=>setIsNewPayRoll(true)} className="md:hidden block py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>  </button>
                </>
              )
            }

        </div>
    
        <TableContainer component={Paper}>
      <Table className="bg-gray-400">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
            <TableCell />
            
            <TableCell>User ID</TableCell>
            <TableCell>User Name</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Entries</TableCell>

            <TableCell> Total Earned</TableCell>
            <TableCell> Total Paid</TableCell>
            <TableCell>Remaining</TableCell>
   
          </TableRow>
        </TableHead>
        <TableBody>
          {data
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((user) => (
              <React.Fragment key={user.user_id}>
                <TableRow 
                  sx={{
                    backgroundColor: "#ebeef2",
                    "&:hover": { backgroundColor: "#dcd8e3" },
                  }}
                >
                  <TableCell>
                    <IconButton onClick={() => handleExpand(user.user_id)}>
                      {expanded[user.user_id] ? (
                       <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                       <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/>
                     </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                        <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/>
                      </svg>
                      )}
                    </IconButton>
                  </TableCell>
              
                  <TableCell>{user.user_id}</TableCell>
               
                  <TableCell>{user.user_name}</TableCell>
                  <TableCell>{user.user_role}</TableCell>
                  <TableCell>{user.payroll_entries.length}</TableCell>

                        
                    <TableCell>Rs.{parseFloat(user.total_earned).toFixed(2)} </TableCell>
                    <TableCell>Rs. {parseFloat(user.total_paid).toFixed(2)}    </TableCell>
                    <TableCell>Rs. {parseFloat(user.remaining).toFixed(2)}   </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={8} style={{ padding: 0 }}>
                    <Collapse in={expanded[user.user_id]} timeout="auto" unmountOnExit>
                      <Table >
                        <TableHead>
                          <TableRow  sx={{ backgroundColor: "#d1ddf0" }}>
                          <TableCell></TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Worked Date</TableCell>
                            <TableCell>Wage Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Wage Rate</TableCell>
                            <TableCell>Worked Hours</TableCell>
                            <TableCell>Total Earned</TableCell>
                            {
                              ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                                <TableCell>Action</TableCell>
                              )
                            }
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {user.payroll_entries.map((entry) => (
                            <TableRow  key={entry.id} className={`${entry.status === 'Paid' ? 'bg-yellow-50' : 'bg-green-50'} hover:bg-gray-100`} >
                              <TableCell></TableCell>
                              <TableCell onClick={()=>setSelectedPayRoll(entry.id)} >{entry.id}</TableCell>
                              <TableCell>{entry.worked_date}</TableCell>
                              <TableCell>{entry.wagetype}</TableCell>
                              <TableCell>{entry.status}</TableCell>
                              <TableCell>Rs.{entry.wage_rate}</TableCell>
                              <TableCell>{entry.worked_hours} <span className="font-semibold">hrs</span></TableCell>

                              <TableCell>Rs.{entry.total_earned}</TableCell>

                              {
                                ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                                  <TableCell>
                                    <span className="flex space-x-1 ">
                                      <p className="cursor-pointer" onClick={()=>setIsEditPayRoll(entry.id)} >Edit</p>
                                      <p className="cursor-pointer" onClick={()=>deletePayRoll(entry.id)} >Delete</p>
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
      <PayrollSummary  data={data}/>
    </div>



    </div>
  );
};

export default PayRollProjectTable;
