import React, { useState, useEffect } from "react";
import axios from 'axios';
import Loading from "../Loading";
import { Link } from 'react-router-dom';

export default function EquipmentSummary() {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:8000/api/equipment-all`, {
             headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });
            setData(response.data);

          } catch (error) {
            console.error(error);
          }
          setLoading(false);
        };
    
        fetchData();
      }, []);

    // equipment summary

    const totalEquipments = data.length;
    const availableEquipments = data.filter(item => item.status === 'available').length;
    const MaintenanceEquipment = data.filter(item => item.status === 'maintanance').length;

    if (loading) {
    return <Loading />;
    }


  return (
    <div className="bg-white shadow-lg rounded-xl p-4 space-y-2">
        <div className="flex flex-col  gap-2 ">
            <h2 className='text-center text-lg font-semibold'> 🧰 Equipment & Inventory </h2>
            <p className='text-sm'>Toatal Equipments: {totalEquipments}</p>
            <p className='text-sm'>Available Equipments: {availableEquipments}</p>
            <p className='text-sm'>Maintenance Alerts: {MaintenanceEquipment}</p>
        </div>
        <Link to={'/equipments'}  className="w-full mt-2 px-4 py-2 border rounded hover:bg-gray-100 bg-violet-100 block text-center"> Manage Equipment </Link>
    </div>

  )
}


