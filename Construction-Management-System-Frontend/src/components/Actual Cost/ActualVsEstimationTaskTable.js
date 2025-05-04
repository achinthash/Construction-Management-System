
import React, { useState,useEffect,useRef } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { Table, TableBody, TableCell,TableContainer, TableHead,TableRow,Paper, TablePagination,Button } from '@mui/material';
import { styled } from '@mui/material/styles';

import Loading from '../Loading';
import ResponseMessages from '../ResponseMessages';
import EstVsActSelected from './EstVsActSelected';
import EditActualCost from './EditActualCost';
import NewActualCost from './NewActualCost';

const StyledTableContainer = styled(TableContainer)({
  backgroundColor: '#c7b8d6',
  overflowY: 'auto',
  maxHeight: '80vh',
});

const StyledRow = styled(TableRow)({
  backgroundColor: '#FFFEF9',
  textAlign: 'center' ,
  '&:hover': { backgroundColor: '#dcd8e3' },
  fontWeight: 'bold'
});

const StyledTableCell = styled(TableCell)({

  fontWeight: 'bold',
  fontSize: '0.9rem'
});

const ActualVsEstimationTaskTable = () => {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const { projectId } = useParams();
  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);
  const [loading, setLoading] = useState(true);
  const [selectedEstVact, setSelectedEstVact] = useState('');
  const [isEditActualCost, setIsEditActualCost] = useState('');
  const [data, setData] = useState([]);
  const [isNewAcost, setIsNewACost] = useState(false);
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5); 

    
  useEffect(()=>{

    const fetchData = async() =>{
      try{

        const response = await axios.get(`http://localhost:8000/api/estimation-with-actual-task/${projectId}`,{
          headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });

        setData(response.data);
        setLoading(false);

      }catch(error){
        setLoading(false);
        console.error(error);
      }
    }
    fetchData();

  },[projectId]);

    
    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };


 // delete actual cost
 const deleteActualCost = async (id) => {
  if (window.confirm(`Are you sure you want to delete this Actual Cost`)) {
    try {
     const response =  await axios.delete(`http://localhost:8000/api/delete-actual-cost/${id}`, { 
      headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
    });
    setSuccessMessage.current(response.data.message);

      // fetchData();
    } catch (error) {
      setErrorMessage.current(`Error deleting Actual Cost:`, error);
    }
 }
};
  
  if (loading) {
    return (
        <Loading />
    );
}

  return (
    
    <div className=' bg-white mt-1 max-h-[75vh] overflow-y-auto'>

  <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>
   
    {
      selectedEstVact && (
          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
              <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  Cost Estimation vs Actual </h1>
              <button  onClick={()=>setSelectedEstVact('')} type='reset'  className='ml-auto items-center col-span-1'>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>
              
              <EstVsActSelected selectedEstVact={selectedEstVact} />
              
          </div>
        </div>
      )
    }


  {
      isNewAcost && (
          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
              <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  Cost Estimation vs Actual </h1>
              <button  onClick={()=>setIsNewACost(false)} type='reset'  className='ml-auto items-center col-span-1'>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>
              
              <NewActualCost />
              
          </div>
        </div>
      )
    }


    {/* edit actual cost */}
    {
      isEditActualCost && (
          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
              <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  Edit Actual Cost </h1>
              <button  onClick={()=>setIsEditActualCost('')} type='reset'  className='ml-auto items-center col-span-1'>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>
              
              <EditActualCost selectedActCost={isEditActualCost} />
          </div>
        </div>
      )
    }
      <div id="header" className="bg-[#ddd6fee2]   dark:bg-gray-900  rounded flex p-2  my-1  mr-1 justify-between ">
        <h1 className="text-left sm:text-xl font-bold text p-1 text-[#5c3c8f] dark:text-white "> Estimations VS Actual Cost  </h1>  

        {
          ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
            <>
              <button onClick={()=>setIsNewACost(true)}className="py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 hidden md:block"> New Cost  </button>
              <button  onClick={()=>setIsNewACost(true)} className="md:hidden block py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>  </button>
  
            </>
          )
        }
      </div>


      <Paper sx={{ width: '100%' }}>
          <StyledTableContainer  component={Paper}>
              <Table>
              <TableHead>
                  <TableRow className={'bg-[#e9e5ee] '}>

                    <StyledTableCell >Id</StyledTableCell>
                    <StyledTableCell >Item</StyledTableCell>
                    <StyledTableCell >Cost Type</StyledTableCell>
                    <StyledTableCell >Estimated</StyledTableCell>
                    <StyledTableCell >Actual</StyledTableCell>
                    <StyledTableCell >Difference</StyledTableCell>
                    {
                      ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                        <StyledTableCell >Action</StyledTableCell>
                      )
                    }

                  </TableRow>
              </TableHead>
              <TableBody>
                  {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}  className={` hover:bg-gray-100 border px-3 py-2 font-medium ${
                        row.actual_cost ? 'bg-yellow-100 text-black' : 'bg-white'
                      }`} >

                      <TableCell onClick={()=>setSelectedEstVact(row.id)}  >{row.id}</TableCell>
                      <TableCell>{row.title}</TableCell>
                      <TableCell>{row.cost_type}</TableCell>
                      <TableCell className="text-center"  >Rs.{row.total_cost}</TableCell>
                      <TableCell>   {row.actual_cost?.total_cost ? `Rs. ${ parseFloat(row.actual_cost.total_cost).toFixed(2)}` : '—'}</TableCell>
                      <TableCell >  <p className={` flex text-center ${ row.actual_cost &&  !isNaN(row.actual_cost.total_cost) ? row.actual_cost.total_cost > row.total_cost ? 'text-red-800 font-bold' : 'text-green-800 font-bold' : '' } `}>  
                      {row.actual_cost?.total_cost ? ` Rs. ${(parseFloat(row.actual_cost.total_cost) - parseFloat(row.total_cost)).toFixed(2)}`   : '—'}  </p> </TableCell>

                      {
                        ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                          <TableCell>
                            <span className="flex space-x-1 ">
                              <button  disabled={!row.actual_cost} className="cursor-pointer disabled:cursor-not-allowed  disabled:opacity-50" onClick={()=>setIsEditActualCost(row.actual_cost.id)} >Edit</button>
                              <button disabled={!row.actual_cost} className="cursor-pointer disabled:cursor-not-allowed  disabled:opacity-50" onClick={()=>deleteActualCost(row.actual_cost.id)} >Delete</button>
                            </span>   

                          </TableCell>
                        )
                      }

                      
                    

                    </TableRow>
                  ))}
              </TableBody>
              </Table>
          </StyledTableContainer>

          <TablePagination
              rowsPerPageOptions={[5, 10, 18]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage} 
              onRowsPerPageChange={handleChangeRowsPerPage} 
          />
      </Paper>


    </div>


  );
};

export default ActualVsEstimationTaskTable;
