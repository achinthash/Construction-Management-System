
import React, { useState, useEffect, useRef } from "react";
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

import PurchaseOrderSelected from './PurchaseOrderSelected';
import PurchaseOrderSummary from './PurchaseOrderSummary';
import ResponseMessages from '../../ResponseMessages';

import EditPurchaseOrder from './EditPurchaseOrder';
import EditPOCostItem from './EditPOCostItem';

const PurchaseOrderTable = () => {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const { projectId, taskId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);
  const [selectedPO, setSelectedPO] = useState('');
  const [isEditPurchaseOrder, setIsEditPurchaseOrder] = useState('');
  const [isEditPOCostItem, setIsEditPOCostItem] = useState('');

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page


  const fetchData = async () => {
    try {
      
      if(taskId){
        const response = await axios.get(`http://127.0.0.1:8000/api/purchase-orders-tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`  },
        });
        setData(response.data);
      }
      else{
        const response = await axios.get(`http://127.0.0.1:8000/api/purchase-orders/${projectId}`, {
          headers: {Authorization: `Bearer ${sessionStorage.getItem('token')}`   },
        });
        setData(response.data);
      }

  
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [projectId,taskId]);

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
    setPage(0); // Reset to first page when changing rows per page
  };

  // delete purchase orders
  const deletePurchaseOrder = async (id) => {
    if (window.confirm(`Are you sure you want to delete this Purchase order`)) {
      try {
       const response =  await axios.delete(`http://localhost:8000/api/delete-purchase-order/${id}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });
      setSuccessMessage.current(response.data.message);

        fetchData();
      } catch (error) {
        setErrorMessage.current(`Error deleting Purchase order:`, error);
      }
   }
  };


  // delete purchase order cost items
  const deletePOCostItem = async (id) => {
    if (window.confirm(`Are you sure you want to delete this Purchase order cost item`)) {
      try {
       const response =  await axios.delete(`http://localhost:8000/api/delete-purchase-order-cost/${id}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });
      setSuccessMessage.current(response.data.message);

        fetchData();
      } catch (error) {
        setErrorMessage.current(`Error deleting Purchase order cost item:`, error);
      }
   }
  };


  return (

    <> 
      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

    {/* po view  */}
      {
        selectedPO && (
            <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  Purchase Order </h1>
                <button  onClick={()=>setSelectedPO('')} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <PurchaseOrderSelected selectedPO={selectedPO} />
                
            </div>
          </div>
        )
      }


       {/* po edit  */}
       {
        isEditPurchaseOrder && (
            <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1"> Edit Purchase Order </h1>
                <button  onClick={()=>setIsEditPurchaseOrder('')} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <EditPurchaseOrder selectedPO={isEditPurchaseOrder} />
                
            </div>
          </div>
        )
      }

      
       {/* po cost item edit  */}
       {
        isEditPOCostItem && (
            <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] min-w-[70%] '>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1"> Edit Purchase Order </h1>
                <button  onClick={()=>setIsEditPOCostItem('')} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <EditPOCostItem selectedPO={isEditPOCostItem} />
                
            </div>
          </div>
        )
      }



    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
            <TableCell />
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created at</TableCell>
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
            <React.Fragment key={row.id}>
              <TableRow 
                sx={{
                  backgroundColor: '#e4daed',
                  '&:hover': { backgroundColor: '#dcd8e3' },
                }}>

                <TableCell onClick={(e) => { e.stopPropagation(); row.open = !row.open; setData([...data]); }}>
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
                <TableCell onClick={(e)=> { e.stopPropagation(); setSelectedPO(row.id) }} >{row.id}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.created_at.substring(0,10)}</TableCell>
                <TableCell>LKR: {row.total_cost}</TableCell> 
                {
                ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                  <TableCell> 
                    <span className="flex space-x-1 ">
                    <p className="cursor-pointer" onClick={()=>setIsEditPurchaseOrder(row.id)}  >Edit</p> 
                      <p className="cursor-pointer" onClick={()=>deletePurchaseOrder(row.id)}  >Delete</p>
                    </span>  
                  </TableCell> 
                )
              }
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
                                <TableCell>ID</TableCell>
                                <TableCell>Item</TableCell>
                                <TableCell>Unit </TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Unit Price </TableCell>
                                <TableCell>Total Amount</TableCell>
                                {
                                  ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                                    <TableCell>Action</TableCell>
                                  )
                                }
                            </TableRow>
                        </TableHead>

                      <TableBody>
                        {row.purchase_order_cost_item.map((cost) => (
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
                            <TableCell>{cost.item_name}</TableCell>
                            <TableCell>{cost.unit}</TableCell>
                            <TableCell>{cost.quantity}</TableCell>
                            <TableCell>{cost.unit_price}</TableCell>
                            <TableCell>{cost.total_amount}</TableCell>

                            {
                              ( userInfo?.role === 'admin' ||  userInfo?.role === 'contractor' ) && (
                                  <TableCell>
                                    <span className="flex space-x-1 ">
                                      <p className="cursor-pointer" onClick={()=>setIsEditPOCostItem(cost.id)} >Edit</p>
                                      <p className="cursor-pointer" onClick={()=>deletePOCostItem(cost.id)} >Delete</p>
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
      <PurchaseOrderSummary data={data} />
    </div>


    </>
  );
};

export default PurchaseOrderTable;
