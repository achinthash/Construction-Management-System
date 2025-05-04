import React, { useState, useEffect } from 'react'
import axios from "axios";
import NavigationBar from '../NavigationBar';

import CustomSimpleTable from '../Tables/CustomSimpleTable';
import Loading from '../Loading';
import NewEquipment from './NewEquipment';
import EditEquipment from './EditEquipment';

export default function Equipments() {


  const [equipments , setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 
  

   useEffect(()=>{

    const allEquipments = async() =>{
      try{
        const response = await axios.get("http://localhost:8000/api/equipment-all",{
            headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}`, }
        });
        setLoading(false);
        setEquipments(response.data)

        const equipmentCategory = [...new Set(response.data.map(equipment => equipment.category))]; 
        setCategory(equipmentCategory);
  
      }
      catch(error){
        setLoading(false);
      }
    }
  
      allEquipments();
    },[]);



  const categoryTypes = equipments.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});


 const columns = [
    { id: 'id', label: 'ID' },
    { id: 'serial_number', label: 'Serial Number' },
    { id: 'name', label: 'Name' },
    { id: 'category', label: 'Category' },
    { id: 'condition_level', label: 'Condition Level' },
    { id: 'status', label: 'Status' },
    { id: 'action', label: 'Action' },

  ];
  
  
  const handleDelete = (equipmentId) => {
    setEquipments(equipments.filter(equipments => equipments.id !== equipmentId));
  };

   // Handle search term change
 const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
     
  };
 
  // Handle category filter change
  const handleCategoryFilterChange = (event) => {
    setSelectedCategory(event.target.value);
 
  };
 
  // Filter data based on search and role filter
  const filteredData = equipments
  .filter((equipment) => equipment.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((equipment) => !selectedCategory || equipment.category === selectedCategory);


    const [isNewEquipment , setIsNewEquipment] = useState(false);
   // const [selectedEquipment , setSelectedEquipment] = useState("");
    
    const newEquipments =() =>{
        setIsNewEquipment(!isNewEquipment);
    }

    const [isEditEquippment , setIsEditEquipment] = useState(false);
    const [selectedEquipmentId , setSelectedEquipmentId] = useState(""); 

    const handleEditEquipment  = (selectedId)=>{
      if(selectedId){
        setSelectedEquipmentId(selectedId);
      }
    
      setIsEditEquipment(!isEditEquippment);
    }
 
    if (loading) {
        return (
            <Loading />
        );
    }


  return (
    <div className='overflow-y-hidden  h-screen'>

         {/* new Equipment */}
      {
        isNewEquipment && (
          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] '>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  New Equipment </h1>
                <button  onClick={newEquipments} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <NewEquipment />
                
            </div>
          </div>
        )
      }

        {/* edit Equipment */}
           {
        isEditEquippment && (
          <div className="flex absolute inset-0 items-center justify-center z-10 bg-black bg-opacity-75 " > 
            <div className='bg-white border border-violet-950 rounded-lg max-w-[80%] '>
                    
              <div  className="bg-[#ddd6fe] rounded p-2 mr-2 ml-2 mt-2 grid grid-cols-2 ">
                <h1 className="text-left sm:text-xl font-bold ml-2 p-2 text-[#5c3c8f] col-span-1">  Edit Equipment </h1>
                <button  onClick={handleEditEquipment} type='reset'  className='ml-auto items-center col-span-1'>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                <EditEquipment selectedEquipmentId={selectedEquipmentId}/>
                
            </div>
          </div>
        )
      }

       
        <NavigationBar />
        

        <div  className="bg-[#ddd6fee2]   dark:bg-gray-900  rounded flex md:flex-row flex-col p-2  my-1 mx-1 justify-between ">
          <h1 className="text-left sm:text-xl font-bold text p-2 text-[#5c3c8f] dark:text-white ">Equipments</h1>
              
          <div className='flex justify-end'>
            <input type='text'  value={searchTerm} onChange={handleSearchChange}  className="bg-gray-50 border w-32 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-2" placeholder="Search"  />

            <select value={selectedCategory} onChange={handleCategoryFilterChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 mr-2"  >
            <option value="">All Category</option>
                {category.map(category => (
                    <option key={category} value={category}>{category}</option>
                ))} 
            </select>

            <button onClick={newEquipments} className="py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 hidden md:block"> New Equipment  </button>

            <button onClick={newEquipments} className="md:hidden block py-2 px-3 ms-2 text-sm font-medium text-white bg-[#6d28d9] dark:bg-gray-500  hover:dark:bg-gray-400 rounded-lg   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>  </button>

          </div>
        
        </div>

      <div className='overflow-y-auto  h-[80vh]'>


        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-4 mx-4 ml-2">
          {Object.entries(categoryTypes).map(([category, count]) => (
            <div key={category} className="bg-[#f7f4f9] overflow-hidden shadow-lg border border-violet-300  rounded-lg text-center">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800">{category}</h2>
                <h2 className="text-lg font-semibold text-gray-800">{count}</h2>
              </div>
            </div>
          ))}
        </div>

        <div className='mx-1 bg-white '>

          <CustomSimpleTable columns={columns} data={filteredData} linkField="equipment"  onDelete={handleDelete}  onEdit={handleEditEquipment}/>

        </div>


      </div>
      


       

       
    </div>
  )
}
