import React, { useState,useEffect } from 'react';
import axios from 'axios';

import Loading from '../Loading';
import CustomSimpleTable from '../Tables/CustomSimpleTable';

export default function EquipmentAvailability() {

    const [token, setToken] = useState(sessionStorage.getItem("token") || "");
    const [loading, setLoading] = useState(true);
    const [equipment, setEquipment] = useState([]);
    const [category, setCategory] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState(""); 

    useEffect(()=>{

      const EquipmentsList = async() =>{
  
        try{
          const response = await axios.get(`http://localhost:8000/api/equipment-logs-dates`,{
            headers: { Authorization: `Bearer ${token}` }
          });

          setEquipment(response.data);
  
          const category = [...new Set(response.data.map(equipment => equipment.category))]; 
          setCategory(category);
          setLoading(false);
  
        }catch(error){
          setLoading(false);
          console.error(error);
        }
      }
  
      EquipmentsList();
    },[]);

      
  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'serial_number', label: 'Serial Number' },
    { id: 'name', label: 'Name' },
    { id: 'status', label: 'Status' },
    { id: 'category', label: 'Category' },
    { id: 'log', label: 'Action' }
  ];

  // Handle search term change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
     
  };
 
  // Handle age filter change
  const handleCategoryFilterChange = (event) => {
    setSelectedCategory(event.target.value);
 
  };

  const [date, setDate] = useState("");
 
  const handleLogDate = (event) =>{
    setDate(event.target.value);
  }


  // Filter data based on search and role filter
  const filteredData = equipment
  .filter((equipment) => equipment.name.toLowerCase().includes(searchTerm.toLowerCase()))
   .filter((equipment) => !selectedCategory || equipment.category === selectedCategory)
    .filter((equipment) => {
       
        const hasLogForSelectedDate = equipment.equipment_logs.some(log => log.date === date);
    

        if (!date) return true;
    

        return !hasLogForSelectedDate;
      });

      
    if (loading) {
      return (
          <Loading />
      );
    }

  return (
    <div className='overflow-y-auto h-[80vh]'>
      <div className='flex justify-between flex-col sm:flex-row gap-2 mb-1 p-1'>
      <input type='text'  value={searchTerm} onChange={handleSearchChange}  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 mr-2" placeholder="Search"  />

      <select value={selectedCategory} onChange={handleCategoryFilterChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 mr-2"  >
      <option value="">All Category</option>
        {category.map(category => (
            <option key={category} value={category}>{category}</option>
        ))} 
      </select>
      <input type='date' value={date} onChange={handleLogDate}  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 mr-2" />

      </div>

      <div className='mx-2 bg-white overflow-y-auto h-[80vh]'>
        <CustomSimpleTable columns={columns} data={filteredData} linkField="Equipment Logs"  />
      </div>

    </div>
  )
}
