


import React, { useState,useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { Table, TableBody, TableCell,TableContainer, TableHead,TableRow,Paper, TablePagination } from '@mui/material';
import { styled } from '@mui/material/styles';

import Loading from '../Loading';
import EstActCostEdit from './EstActCostEdit'

const StyledTableContainer = styled(TableContainer)({
  backgroundColor: '#c7b8d6',
  overflowY: 'auto',
  maxHeight: '80vh',

});



const StyledTableCell = styled(TableCell)({

  fontWeight: 'bold',
  fontSize: '0.9rem'
});

const ActualVsEstimationWork = ({task_id}) => {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [isEditEst, setIsEditEst] = useState('');
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(4); 

  useEffect(()=>{

      const fetchData = async() =>{
        try{
  
          const response = await axios.get(`http://localhost:8000/api/estimation-with-actual-task/${task_id}`,{
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
  
    },[projectId,task_id]);

    
  // Handle page change
  const handleChangePage = (event, newPage) => {
      setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };



  if (loading) {
    return (
        <Loading />
    );
 }

  return (
    
    <div className='mx-1 bg-white  '>


      {/* user Availability  */}
        {
        isEditEst && (
          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 mb-2">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-1.5 text-[#5c3c8f] col-span-1">  User Availability  </h1>
                <button  onClick={()=>setIsEditEst('')} type='button'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <EstActCostEdit est_id={isEditEst} />
                
            </div>
          </div>
        )
      }

        <Paper sx={{ width: '100%' }}>
            <StyledTableContainer  component={Paper}>
                <Table>
                <TableHead>
                    <TableRow className={'bg-[#c7b8d6] '}>

                        <StyledTableCell >Id</StyledTableCell>
                        <StyledTableCell >Item</StyledTableCell>
                        <StyledTableCell >Cost Type</StyledTableCell>
                        <StyledTableCell >Est. Qty x Unit Price</StyledTableCell>
                        <StyledTableCell >Estimated</StyledTableCell>
                        <StyledTableCell >Actual Qty x Unit Price</StyledTableCell>
                        <StyledTableCell >Actual</StyledTableCell>
                        <StyledTableCell >Difference</StyledTableCell>
                        <StyledTableCell >Reason</StyledTableCell>
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
                            row.actual_cost ? 'bg-yellow-50 text-black' : 'bg-white'
                        }`} >

                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.title}</TableCell>
                        <TableCell>{row.cost_type}</TableCell>
                        <TableCell>  {row.quantity} {row.unit} × Rs.{parseFloat(row.unit_price).toFixed(2)} </TableCell>
                    
                        <TableCell className="text-center"  >Rs.{row.total_cost}</TableCell>

                        <TableCell>   {   row.actual_cost?   `${row.actual_cost?.quantity} ${row.actual_cost?.unit} × Rs.${parseFloat(row.actual_cost?.unit_price ?? 0).toFixed(2)} ` : '—'  }</TableCell>

                        <TableCell>   {row.actual_cost?.total_cost ? `Rs. ${ parseFloat(row.actual_cost.total_cost).toFixed(2)}` : '—'}</TableCell>

                        <TableCell >  <p className={` flex text-center ${ row.actual_cost &&  !isNaN(row.actual_cost.total_cost) ? row.actual_cost.total_cost > row.total_cost ? 'text-red-800 font-bold' : 'text-green-800 font-bold' : '' } `}>  
                        {row.actual_cost?.total_cost ? ` Rs. ${(parseFloat(row.actual_cost.total_cost) - parseFloat(row.total_cost)).toFixed(2)}`   : '—'}  </p> </TableCell>

                        <TableCell className='flex flex-wrap max-w-[170px]'>{row.actual_cost?.reason ?? '—'}</TableCell>

                      
                        {
                          ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                            <TableCell >   <button onClick={()=>setIsEditEst(row.id)}  className="py-1.5 px-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700   rounded-lg "> Commit </button>  </TableCell>

                          ) 
                        }   
                   </TableRow>
                    ))}
                </TableBody>
                </Table>
            </StyledTableContainer>

            <TablePagination
                rowsPerPageOptions={[4, 8, 12]}
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

export default ActualVsEstimationWork;
