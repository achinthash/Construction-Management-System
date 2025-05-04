
import React, { useState, useEffect } from "react";
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


const PayrollUserTable = (props) => {

  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");



  useEffect(() => {
    const fetchData = async () => {
      try {
       
       
        const response = await axios.get(`http://127.0.0.1:8000/api/payroll-users/${userInfo.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
   
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchData();
  }, [userInfo.id]);


  // summary
  const totalProjects = data.length;
  const totalEarned = data.reduce((acc, item) => acc + parseFloat(item.total_earned),0);
  const totalPaid = data.reduce((acc, item) => acc + parseFloat(item.total_paid),0);
  const totalRemaining = data.reduce((acc, item) => acc + parseFloat(item.remaining),0);

  
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



  if (loading) {
    return <Loading />;
  }
  return (

    <> 

      <div id="header" className="bg-[#ddd6fee2]   dark:bg-gray-900  rounded flex md:flex-row flex-col p-2  my-1  mr-1 justify-between ">
        <h1 className="text-left sm:text-xl font-bold text p-1 text-[#5c3c8f] dark:text-white ">PayRoll  </h1> 
      </div>

    <TableContainer component={Paper}>
      <Table className="bg-gray-400">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
            <TableCell />
            
            <TableCell>Project ID</TableCell>
            <TableCell>Project Name</TableCell>
     
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
              <React.Fragment key={user.project_id}>
                <TableRow
                  sx={{
                    backgroundColor: "#ebeef2",
                    "&:hover": { backgroundColor: "#dcd8e3" },
                  }}
                >
                  <TableCell>
                    <IconButton onClick={() => handleExpand(user.project_id)}>
                      {expanded[user.project_id] ? (
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
              
                  <TableCell>{user.project_id}</TableCell>
               
                  <TableCell>{user.project_name}</TableCell>
             
                  <TableCell>{user.payroll_entries.length}</TableCell>

                        
                    <TableCell>Rs.{parseFloat(user.total_earned).toFixed(2)} </TableCell>
                    <TableCell>Rs. {parseFloat(user.total_paid).toFixed(2)}    </TableCell>
                    <TableCell>Rs. {parseFloat(user.remaining).toFixed(2)}   </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={7} style={{ padding: 0 }}>
                    <Collapse in={expanded[user.project_id]} timeout="auto" unmountOnExit>
                      <Table >
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "#d1ddf0" }}>
                          <TableCell></TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Worked Date</TableCell>
                            <TableCell>Wage Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Wage Rate</TableCell>
                            <TableCell>Worked Hours</TableCell>
                            <TableCell>Total Earned</TableCell>
                           
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {user.payroll_entries.map((entry) => (
                            <TableRow
                              key={entry.id}
                              className={`${entry.status === 'Paid' ? 'bg-yellow-50' : 'bg-green-50'} hover:bg-gray-100`}
                            >
                                    <TableCell></TableCell>
                              <TableCell>{entry.id}</TableCell>
                              <TableCell>{entry.worked_date}</TableCell>
                              <TableCell>{entry.wagetype}</TableCell>
                              <TableCell>{entry.status}</TableCell>
                              <TableCell>Rs.{entry.wage_rate}</TableCell>
                              <TableCell>{entry.worked_hours} <span className="font-semibold">hrs</span></TableCell>

                              <TableCell>Rs.{entry.total_earned}</TableCell>
               
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


        {/* summary */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-gray-200">

        <div className="p-2">
          <p className="text-sm text-gray-500">Total Projects</p>
          <p className="text-sm font-bold">{totalProjects}</p>
        </div>

        <div className="p-2">
          <p className="text-sm text-gray-500">Total Earned</p>
          <p className="text-sm font-bold">LKR: {totalEarned}</p>
        </div>

        <div className="p-2">
          <p className="text-sm text-gray-500">Total Paid</p>
          <p className="text-sm font-bold">LKR: {totalPaid}</p>
        </div>

        <div className="p-2">
          <p className="text-sm text-gray-500">Total Remaining</p>
          <p className="text-sm font-bold">LKR: {totalRemaining}</p>
        </div>
        
      </div>

    




    </>
  );
};

export default PayrollUserTable;
