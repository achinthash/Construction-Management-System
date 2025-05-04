import React, { useState,useRef } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Collapse,
    IconButton,
    TablePagination,
  } from "@mui/material";

  import BillSelected from './BillSelected';
  import EditBill from './EditBill';
  import EditBillItem from './EditBillItem';

  import ResponseMessages from '../ResponseMessages';

export default function BillsTable({bills}) {

const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
 const [expandedId, setExpandedId] = useState(null);
 const [selectedBill, setSelectedBill] = useState('');
 const [isEditBill, setIsEditBill] = useState('');
 const [isEditBillItem, setIsEditBillItem] = useState('');

 const setErrorMessage = useRef(null);
 const setSuccessMessage = useRef(null);

 const [page, setPage] = useState(0);
 const [rowsPerPage, setRowsPerPage] = useState(4); 
  
  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };


  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

    // delete bill order cost items
    const deleteBill = async (id) => {
        if (window.confirm(`Are you sure you want to delete this Bill `)) {
            try {
            const response =  await axios.delete(`http://localhost:8000/api/delete-bill/${id}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
            });
            setSuccessMessage.current(response.data.message);

            // fetchData();
            } catch (error) {
            setErrorMessage.current(`Error deleting Bill:`, error);
            }
        }
    };


    // delete bill cost items
    const deleteBillItems = async (id) => {
        if (window.confirm(`Are you sure you want to delete this Bill Item`)) {
            try {
            const response =  await axios.delete(`http://localhost:8000/api/delete-bill-item/${id}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
            });
            setSuccessMessage.current(response.data.message);

            // fetchData();
            } catch (error) {
            setErrorMessage.current(`Error deleting Bill Item:`, error);
            }
        }
    };


  return (
    <div>

    {/* selectedBill */}
    {
        selectedBill &&  (


          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[80%]  '>
                  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
            <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1"> Bill </h1>
                  <button onClick={() => setSelectedBill('')} type='reset'  className='ml-auto items-center col-span-1'>
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                  </button>
            </div>
              
              <BillSelected selectedBill={selectedBill} />
              
          </div>
        </div>

        )
    }


    
    {/* edit bill */}
    {
        isEditBill &&  (


          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[80%]  '>
                  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
            <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1"> Edit Bill </h1>
                  <button onClick={() => setIsEditBill('')} type='reset'  className='ml-auto items-center col-span-1'>
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                  </button>
            </div>
              
              <EditBill selectedBill={isEditBill} />
              
          </div>
        </div>

        )
    }


     {/* edit bill item */}
     {
        isEditBillItem &&  (

          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[80%]  '>
                  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
            <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1"> Bill </h1>
                <button onClick={() => setIsEditBillItem('')} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
              
              <EditBillItem selectedBill={isEditBillItem} />
              
          </div>
        </div>

        )
    }
  <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

    <TableContainer component={Paper}>
        <Table>
            <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <TableCell />
                <TableCell>Bill ID</TableCell>
                <TableCell>Bill Name</TableCell>
                <TableCell>Bill Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Total Cost</TableCell>
                {
                    ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                    <TableCell>Action</TableCell>
                    )
                }


            </TableRow>
            </TableHead>
            <TableBody>
            {bills.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((bill) => (  
                <React.Fragment key={bill.id}>
                <TableRow sx={{ backgroundColor: "#e8e5f1" }} >
                    <TableCell  >
                        <IconButton onClick={(e) =>{  e.stopPropagation(); toggleExpand(bill.id)}}>
                            {expandedId === bill.id ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                            <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/>
                            </svg> :  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                            <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/>
                            </svg>}
                        </IconButton>   
        
                    </TableCell>
                
                    <TableCell onClick={() => setSelectedBill(bill.id)} >{bill.id}</TableCell>
                    <TableCell>{bill.title}</TableCell>
                    <TableCell>{bill.bill_type}</TableCell>
                    <TableCell>{bill.status}</TableCell>
                    <TableCell>{bill.created_at?.substring(0, 10)}</TableCell>
                    <TableCell>LKR {parseFloat(bill.total).toFixed(2)}</TableCell>
                    
                    {
                        ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                            <TableCell>
                                <span className="flex space-x-1 ">
                                    <p onClick={()=>setIsEditBill(bill.id)}  className="cursor-pointer"> Edit</p>
                                    <p onClick={()=>deleteBill(bill.id)} className="cursor-pointer"> Delete</p>
                                </span>
                            </TableCell>

                        )
                    }
                </TableRow>

                {/* Expanded content: Bill Items */}
                <TableRow>
                    <TableCell colSpan={8} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={expandedId === bill.id} timeout="auto" unmountOnExit>
                        <Table  sx={{ margin: 0 }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f6f6f6" }}>
                            <TableCell> </TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Item Name</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Unit Price </TableCell>
                            <TableCell>Total </TableCell>
                            {
                              ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                                <TableCell>Action</TableCell>
                              )
                            }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bill.items?.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell> </TableCell>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>LKR {parseFloat(item.unit_price).toFixed(2)}</TableCell>
                                <TableCell>LKR {parseFloat(item.total).toFixed(2)}</TableCell>

                                {
                                    ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                                        <TableCell>
                                            <span className="flex space-x-1 ">
                                                <p onClick={()=>setIsEditBillItem(bill.id)}  className="cursor-pointer"> Edit</p>
                                                <p onClick={()=>deleteBillItems(bill.id)} className="cursor-pointer"> Delete</p>
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
            count={bills.length} 
            rowsPerPage={rowsPerPage} 
            page={page} 
            onPageChange={handlePageChange} 
            onRowsPerPageChange={handleRowsPerPageChange} 
        />


        </TableContainer>



    </div>
  )
}
