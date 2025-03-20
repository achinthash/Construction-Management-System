
import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell,TableContainer, TableHead,TableRow,Paper, TablePagination,Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import axios from "axios";


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

const CustomSimpleTable = ({ columns, data,linkField ,onDelete, onEdit }) => {




  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(7); 
 
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


  


  return (
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
                <StyledRow key={row.id}>
                  {columns.map((column) => (
                     <TableCell key={column.id}>

                      {
                        column.id === 'action' ? (
                        <>
                          <button onClick={() => handleDelete(row.id)} className='hover:text-blue-900'> Delete </button>
                          <button onClick={() => handleEdit(row.id)} className='hover:text-blue-900 ml-2'> Edit </button>
                        
                          </>
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
        rowsPerPageOptions={[7, 12, 15]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage} 
        onRowsPerPageChange={handleChangeRowsPerPage} 
      />
    </Paper>
  );
};

export default CustomSimpleTable;
