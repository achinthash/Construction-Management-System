

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";

import Loading from "../Loading";

const PayrollSummary = (props) => {

  const { projectId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      
      const response = await axios.get(`http://127.0.0.1:8000/api/payroll-project/${projectId}`, {
      headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}`  },
      });
      setData(response.data);
      
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

    useEffect(() => {

    if(!props.data){

      fetchData();
    }else{
      setData(props.data);
      setLoading(false);
    }

  }, [projectId,props.data]);


  if (loading) {
    return <Loading />;
  }

  // summary

  const totalAmount = data.reduce((sum,item)=> sum + parseFloat(item.total_earned),0);
  const paidAmount = data.reduce((sum,item) => sum + parseFloat(item.total_paid),0);
  const remainingAmount = totalAmount - paidAmount;
  const precentagePaid = (paidAmount/totalAmount) * 100;


  return (
  <>

  {
    props.data ? (

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-gray-200">

        <div className="p-2">
          <p className="text-sm text-gray-500">Total Payroll Liability</p>
          <p className="text-sm font-bold">{totalAmount}</p>
        </div>

        <div className="p-2">
          <p className="text-sm text-gray-500">Total Paid</p>
          <p className="text-sm font-bold">{paidAmount}</p>
        </div>

        <div className="p-2">
          <p className="text-sm text-gray-500">Completed Purchase Orders</p>
          <p className="text-sm font-bold">{precentagePaid.toFixed(2)}%</p>
        </div>

        <div className="p-2">
          <p className="text-sm text-gray-500">Remaining</p>
          <p className="text-sm font-bold">LKR {remainingAmount.toLocaleString()}</p>
        </div>
        
      </div>
      
    ) :

    (
      <div className="mt-4 px-4">
        <strong>PayRoll </strong>
            
        <progress id="file" value={paidAmount} max={totalAmount} className="w-full rounded-lg bg-violet-400 "></progress>
        <p className="text-center text-xs text-gray-500 mt-1">
          LKR {paidAmount.toLocaleString()} Completed out of LKR {totalAmount.toLocaleString()}
        </p>
      </div>
    )
  }


  </>
  );
};

export default PayrollSummary;
