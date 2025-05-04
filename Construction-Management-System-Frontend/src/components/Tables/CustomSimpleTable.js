
import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell,TableContainer, TableHead,TableRow,Paper, TablePagination,Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import axios from "axios";

import NewUserLog from '../User Log/NewUserLog';
import NewEquipmentLog from '../Equipment Log/NewEquipmentLog';


const StyledTableContainer = styled(TableContainer)({
  backgroundColor: '#c7b8d6',
  overflowY: 'auto',
  maxHeight: '80vh',

  
});

const StyledRow = styled(TableRow)({
  backgroundColor: '#FFFEF9',
  '&:hover': { backgroundColor: '#dcd8e3' },
  fontWeight: 'bold'
});

const StyledTableCell = styled(TableCell)({

  fontWeight: 'bold',
  fontSize: '0.9rem'
});

const CustomSimpleTable = ({ columns, data,linkField ,onDelete, onEdit, onView }) => {




  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5); 
 
    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };


  // Delete function
  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this ${linkField}?`)) {
      try {
        await axios.delete(`http://localhost:8000/api/delete-${linkField}/${id}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        });
        onDelete(id);
      } catch (error) {
        console.error(`Error deleting ${linkField}:`, error);
      }
   }
  };

  const handleEdit = (id) => {
    onEdit(id);
  };

  const handleView = (id) => {
    onView(id);
  };



  const handleDownload = (doc_path) => {
    const fullPath = `http://localhost:8000/storage/${doc_path}`;
    window.open(fullPath, "_blank", "noopener,noreferrer");
  }


  const [isHandleWindow, setHandleIsWindow] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const handleIsWindow = (id) =>{
    setSelectedId(id)
    setHandleIsWindow(!isHandleWindow);
  }
  


  return (
    <>


       {/* new user log */}
       {
        isHandleWindow && (
          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] '>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  {linkField} </h1>
                <button  onClick={handleIsWindow} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
              
              {
              linkField === 'User Logs' ? (
                <NewUserLog selectedId={selectedId} />
              ) : linkField === 'Equipment Logs' ? (
                <NewEquipmentLog selectedId={selectedId} />
              )  : null
            }


                
            </div>
          </div>
        )
      }




    
    <Paper sx={{ width: '100%' }}>
      <StyledTableContainer  component={Paper}>
        <Table>
          <TableHead>
            <TableRow className={'bg-[#c7b8d6] '}>
              {columns.map((column) => (
                <StyledTableCell  key={column.id}>{column.label}</StyledTableCell>
              ))}


            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <StyledRow key={row.id}   onClick={linkField === 'quality-control' || linkField ===  'task-date' ? () => handleView(row.id) : undefined} > 
                  {columns.map((column) => (
                     <TableCell key={column.id}>

                      {
                        column.id === 'action' ? (
                        <>
                          <button onClick={(e) =>{e.stopPropagation(); handleDelete(row.id)}} className='hover:text-blue-900'> Delete </button>
                          <button onClick={(e) =>{e.stopPropagation();  handleEdit(row.id)}}       disabled={ linkField === 'task-date' && row.status === 'Finished'} className='hover:text-blue-900 ml-2 disabled:cursor-not-allowed'> Edit </button>
                        
                        </>
                        ) : column.id === 'action_delete' ? (
                          <button onClick={() => handleDelete(row.id)} className='hover:text-blue-900'> Delete </button>
                        ) : column.id === 'doc_path' ? (  
                              <button onClick={() => handleDownload(row.doc_path)} className='hover:text-blue-900'> Download </button>
                        ) : column.id === 'log' ? (
                              <button onClick={() => handleIsWindow(row.id)} className='hover:bg-blue-900  bg-green-800 p-1 text-white px-3 rounded-md'> <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg> </button>
                        ) : (
                          <Link to={`/${linkField}/${row[column.id]}`}>{row[column.id]}</Link>
                        )

                      }
                   </TableCell>
                  ))}
                </StyledRow>
              ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage} 
        onRowsPerPageChange={handleChangeRowsPerPage} 
      />
    </Paper>

    </>
  );
};

export default CustomSimpleTable;
