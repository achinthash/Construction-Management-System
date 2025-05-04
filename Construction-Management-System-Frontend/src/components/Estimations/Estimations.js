import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from "xlsx";
import { useParams } from "react-router-dom";
import axios from 'axios';

import Sidebar from '../Sidebar';
import NavigationBar from '../NavigationBar';
import EstimationSummary from './EstimationSummary';
import NewEstimation from './NewEstimation';
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

import EditEstimation from './EditEstimation';
import ResponseMessages from '../ResponseMessages';
export default function Estimations() {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const [isNewEstimation, setIsNewEstimation] = useState(false);
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [editEstimation, setEditEstimation] = useState('');
  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); 
  
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/estimations/${projectId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`},
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
  

    // export excel function
    const exportToExcel = () => {
      const allEstimations = [];
  
      data.forEach((task) => {
        task.estimations.forEach((item) => {
          allEstimations.push({
            "Task Name": task.task_name,
            Title: item.title,
            "Cost Type": item.cost_type,
            Unit: item.unit,
            Quantity: item.quantity,
            "Unit Price": item.unit_price,
            "Total Cost": item.total_cost,
          });
        });
      });
  
      // Calculate grand total
      const grandTotal = allEstimations.reduce(
        (sum, item) => sum + parseFloat(item["Total Cost"] || 0),
        0
      );
  
      // Add final total row
      allEstimations.push({
        "Task Name": "",
        Title: "",
        "Cost Type": "",
        Unit: "",
        Quantity: "",
        "Unit Price": "Grand Total",
        "Total Cost": grandTotal.toFixed(2),
      });
  
      const worksheet = XLSX.utils.json_to_sheet(allEstimations);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Estimations");
  
      XLSX.writeFile(workbook, `Project_${projectId}_Estimations.xlsx`);
    };
  
  
    // Handle page chang
    const handlePageChange = (event, newPage) => {
      setPage(newPage);
    };
  
    // Handle rows per page change
    const handleRowsPerPageChange = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };


    // delete
    const deleteEstimation = async (id) => {
      if (window.confirm(`Are you sure you want to delete this Estimation`)) {
        try {
         const response =  await axios.delete(`http://localhost:8000/api/delete-estimation/${id}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        });
        setSuccessMessage.current(response.data.message);
  
         fetchData();
        } catch (error) {
          setErrorMessage.current(`Error deleting Estimation:`, error);
        }
     }
    };


  if (loading) {
    return <Loading />;
  }

  return (
    <div className=' max-h-[100vh] overflow-y-hidden'>

    {/* new estimation view */}
    {
      isNewEstimation && (
          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
              <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  New Estimation </h1>
              <button  onClick={()=>setIsNewEstimation(false)} type='reset'  className='ml-auto items-center col-span-1'>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>
              
              <NewEstimation />
              
          </div>
        </div>
      )
    }

    {/* edit Estimation */}
    {
      editEstimation && (
        <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] '>
                  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
              <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  Edit Estimation </h1>
              <button  onClick={()=>setEditEstimation('')} type='reset'  className='ml-auto items-center col-span-1'>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>
              
              <EditEstimation estimationId={editEstimation} />
              
          </div>
        </div>
      )
    }

    <Sidebar />
    <NavigationBar />
    <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

    <div id="header" className="bg-[#ddd6fee2] sidebar-ml  dark:bg-gray-900  rounded flex p-2  my-1 mx-1 justify-between ">
      <h1 className="text-left sm:text-xl font-bold text p-2 text-[#5c3c8f] dark:text-white ">Estimations </h1> 
    
      <button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded sidebar-ml"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg></button>

      {
       ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
          <>
            <button onClick={()=>setIsNewEstimation(true)}  className="py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 hidden md:block"> New Estimation  </button>
            <button  onClick={()=>setIsNewEstimation(true)} className="md:hidden block py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>  </button>
          </>
        )
      }
   
    </div>

    <div className='sidebar-ml max-h-[75vh] overflow-y-auto '>
   
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow className="bg-gray-300 "  >
            <TableCell />
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Cost Type</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Unit Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Total Cost</TableCell>
            
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
              <TableRow key={row.task_id} className="bg-violet-50 hover:bg-violet-200" >
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
                <TableCell colSpan={6} />
              </TableRow>

              {/* Estimations collapse */}
              <TableRow>
                <TableCell colSpan={9} style={{ paddingBottom: 0, paddingTop: 0 }}>
                  <Collapse in={row.open} timeout="auto" unmountOnExit>
                    <Table>
                      <TableBody>
                        {row.estimations.map((estimation) => (
                          <TableRow key={estimation.id} className="bg-gray-50 hover:bg-violet-200">
          
                            <TableCell />
                            <TableCell>{estimation.id}</TableCell>
                            <TableCell>
                              <div style={{ display: 'flex',  flexWrap: 'wrap',  maxWidth: '150px'  }}> 
                                {estimation.title} 
                              </div>
                            </TableCell>
                            <TableCell>{estimation.cost_type}</TableCell>
                            <TableCell>{estimation.unit}</TableCell>
                            <TableCell>{estimation.unit_price}</TableCell>
                            <TableCell>{estimation.quantity}</TableCell>
                            <TableCell>{estimation.total_cost}</TableCell>

                            {
                              ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                                <TableCell>
                                  <span className='flex space-x-1'>
                                    <p className='cursor-pointer' onClick={()=>setEditEstimation(estimation.id)}>Edit</p>
                                    <p className='cursor-pointe'  onClick={()=>deleteEstimation(estimation.id)}>Delete</p>
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


    {/* // estimation summary */}
      
      <EstimationSummary />

    </div>
        
    </div>
  )
}
