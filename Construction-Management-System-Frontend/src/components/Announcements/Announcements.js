import React, { useState, useRef, useEffect } from 'react'
import NavigationBar from '../NavigationBar';

import NewAnnouncement from './NewAnnouncement';
import ResponseMessages from '../ResponseMessages';
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

import EditAnnouncement from './EditAnnouncement';


export default function Announcements() {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const [loading, setLoading] = useState(true);
  const [isNewAnnouncements, setIsNewAnnouncements] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [editAnnouncement, seteditAnnouncement]  = useState('');

  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);

  const [expanded, setExpanded] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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



  const fetchData = async () => {
    try {
      
      const response = await axios.get(`http://127.0.0.1:8000/api/announcement-all`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setAnnouncements(response.data);
  
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };


  useEffect(() => {
    fetchData();
  }, []);

  // Announcementsc summary

  const totalAnnouncements= announcements.length;
  const activeAnnouncements = announcements.filter(item => item.status === 'active').length;
  const inactiveAnnouncements = announcements.filter(item => item.status === 'inactive').length;
  const highPriorityAnnouncements =  announcements.filter(item => item.priority === 'high').length;

  // delete 

  const deleteAnnouncement = async (id) => {
    if (window.confirm(`Are you sure you want to delete this Announcement`)) {
      try {
       const response =  await axios.delete(`http://localhost:8000/api/delete-announcement/${id}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });
      setSuccessMessage.current(response.data.message);

        fetchData();
      } catch (error) {
        setErrorMessage.current(`Error deleting Announcement:`, error);
      }
   }
  };


  if (loading) {
    return <Loading />;
  }

  return (
    <div>
 
      <NavigationBar />


           {/* new NewAnnouncement */}
      {
        isNewAnnouncements && (
          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] '>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  New Announcement </h1>
                <button  onClick={()=>setIsNewAnnouncements(false)} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <NewAnnouncement />
                
            </div>
          </div>
        )
      }


    {/* edit Announcement */}
    {
      editAnnouncement && (
        <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
          <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] '>
                  
            <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
              <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  Edit Announcement </h1>
              <button  onClick={()=>seteditAnnouncement('')} type='reset'  className='ml-auto items-center col-span-1'>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>
              
              <EditAnnouncement announcementId={editAnnouncement} />
              
          </div>
        </div>
      )
    }



    <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

      <div id="header" className="bg-[#ddd6fee2]   dark:bg-gray-900  rounded flex md:flex-row flex-col p-2  my-1  mr-1 justify-between ">
        <h1 className="text-left sm:text-xl font-bold text p-1 text-[#5c3c8f] dark:text-white ">Announcements  </h1>  
        <button onClick={()=>setIsNewAnnouncements(true)}className="py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 hidden md:block"> New Announcements  </button>
      </div>


      {/* summary  */}

      <div className="w-full bg-white rounded-2xl shadow-md p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-lg font-semibold text-green-600">{totalAnnouncements}</p>
            <p className="text-sm text-gray-700"> Total Announcements</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-lg font-semibold text-red-500">{inactiveAnnouncements}</p>
            <p className="text-sm text-gray-700">Expired</p>
          </div>
        
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-lg font-semibold text-orange-500">{activeAnnouncements}</p>
            <p className="text-sm text-gray-700">Active</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-lg font-semibold text-yellow-500">{highPriorityAnnouncements}</p>
            <p className="text-sm text-gray-700">High Priority</p>
          </div>
        </div>
      </div>


    <div className='mx-1 bg-white max-h-[80vh] overflow-y-auto'>

      <TableContainer component={Paper}>
        <Table className="bg-gray-400">
          <TableHead>
            <TableRow className="bg-gray-400 font-bold">
            <TableCell >ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell> Status </TableCell>
              <TableCell> Expires At</TableCell>
              <TableCell> Message </TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {announcements
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((announcement) => (
                <React.Fragment key={announcement.id}>
                  <TableRow className="bg-gray-50 hover:bg-gray-100" >
                    <TableCell > <p className="text-xs" >{announcement.id} </p>  </TableCell>
                    <TableCell> <p className="text-xs" > {announcement.title}</p> </TableCell>
                    <TableCell> <p className="text-xs" > {announcement.project_name} </p>  </TableCell>
                    <TableCell> <p className="text-xs" > {announcement.priority} </p> </TableCell>
                    <TableCell> <p className="text-xs" >{announcement.status}</p>  </TableCell>
                    <TableCell> <p className="text-xs" >{announcement.expires_at.substring(0,10)}</p>  </TableCell>
                    <TableCell > <p className="text-xs max-w-[400px] flex flex-wrap"> {announcement.message}</p> </TableCell>
                    <TableCell> 
                      <span className='flex space-x-1'> 
                        <p className='cursor-pointer' onClick={()=>seteditAnnouncement(announcement.id)}>Edit</p> 
                         
                        <p className='cursor-pointer' onClick={()=>deleteAnnouncement(announcement.id)}>Delete</p> 
                      </span> 
                    
                    </TableCell>
                  </TableRow>

                </React.Fragment>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={announcements.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </TableContainer>

    </div>




    </div>
  )
}
