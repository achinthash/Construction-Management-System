import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../Loading";


export default function BillSummary(props) {

  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]); 

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/bills-project/${projectId}`,
        {
          headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}`  },
        }
      );
      setBills(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  
  useEffect(() => {
      if (!props.bills) {
        fetchData();
      } else {
        setBills(props.bills);
        setLoading(false);
      }
    }, [projectId, props.bills]);

  // Calculate summary
  const totalBills = bills.length;
  const totalAmount = bills.reduce((sum, bill) =>sum + parseFloat(bill.total),0);

  const paidAmount = bills
  .filter(bill => bill.status === 'paid')
  .reduce((sum, bill) => sum + parseFloat(bill.total), 0);

  const pendingBills = bills.filter(item => item.status === 'pending').length;
  const percentagePaid = (paidAmount / totalAmount) * 100;


  if (loading) {
    return <Loading />;
  }

  return (
    <> 

    {
      props.bills ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-gray-200">

            <div className="p-2">
              <p className="text-sm text-gray-500">Total Bills</p>
              <p className="text-sm font-bold">{totalBills}</p>
            </div>
    
            <div className="p-2">
              <p className="text-sm text-gray-500">Pending Bills</p>
              <p className="text-sm font-bold">{pendingBills}</p>
            </div>
    
            <div className="p-2">
              <p className="text-sm text-gray-500">percentage Paid </p>
              <p className="text-sm font-bold">{percentagePaid.toFixed(2)} % </p>
            </div>
    
            <div className="p-2">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-sm font-bold">LKR {totalAmount.toLocaleString()}</p>
            </div>
           
          </div>
        )
        : 

      <div className="mt-4 px-4">
          <strong>Bills</strong>
        <progress id="file" value={paidAmount} max={totalAmount} className="w-full rounded-lg bg-violet-400 "></progress>
        <p className="text-center text-xs text-gray-500 mt-1">
          LKR {paidAmount.toLocaleString()} paid out of LKR {totalAmount.toLocaleString()}
        </p>

      </div>

    }
     
    </>
     
    
  )
}
