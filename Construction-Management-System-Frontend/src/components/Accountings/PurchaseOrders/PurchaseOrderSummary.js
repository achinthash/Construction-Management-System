import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../../Loading";

export default function PurchaseOrderSummary(props) {

  const { projectId, taskId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);


    const fetchData = async () => {
      try {
        
        if(taskId){
          const response = await axios.get(`http://127.0.0.1:8000/api/purchase-orders-tasks/${taskId}`, {
            headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}` },
          });
          setData(response.data);
        }
        else{
          const response = await axios.get(`http://127.0.0.1:8000/api/purchase-orders/${projectId}`, {
            headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}`  },
          });
          setData(response.data);
        }
    
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

    // Calculate summary
  const totalBills = data.length;
  const totalAmount = data.reduce((sum, po) =>sum + parseFloat(po.total_cost),0);
  const pendingBills = data.filter((item) => item.status === 'Pending').length;
  const completeCount = data.filter((item) => item.status === 'Completed').length;
  const precentageCompleted = (completeCount/totalBills) * 100;

  if (loading) {
  return <Loading />;
  }

  return (
         
    <> {
        props.data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-gray-200">

          <div className="p-2">
            <p className="text-sm text-gray-500">Total Purchase Orders</p>
            <p className="text-sm font-bold">{totalBills}</p>
          </div>
  
          <div className="p-2">
            <p className="text-sm text-gray-500">Pending Purchase Orders</p>
            <p className="text-sm font-bold">{pendingBills}</p>
          </div>
  
          <div className="p-2">
            <p className="text-sm text-gray-500">Completed Purchase Orders</p>
            <p className="text-sm font-bold">{precentageCompleted.toFixed(2)}%</p>
          </div>
  
          <div className="p-2">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-sm font-bold">LKR {totalAmount.toLocaleString()}</p>
          </div>
           
        </div>
        ) : (
          <div className="mt-4 px-4">
            <strong>Purchase Orders</strong>
            <progress id="file" value={completeCount} max={totalBills} className="w-full rounded-lg bg-violet-400 "></progress>
            <p className="text-center text-xs text-gray-500 mt-1">
              LKR {completeCount.toLocaleString()} Completed out of LKR {totalBills.toLocaleString()}
            </p>
          </div>
        )
    }
  
    </>
  )
}
