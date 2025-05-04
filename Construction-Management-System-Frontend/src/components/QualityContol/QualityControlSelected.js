
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import Loading from "../Loading";

export default function QualityControlSelected({selectedId}) {

  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [images, setImages] = useState([]);

    const fetchData = async () => {
      try {
        
        const response = await axios.get(`http://127.0.0.1:8000/api/quality-controls-selected/${selectedId}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });

        setData(response.data);
        
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
  

    const fetchImages = async () => {
      try {
        
        const response = await axios.get(`http://127.0.0.1:8000/api/images-type-item/${projectId}/Quality Control/${selectedId}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });
        setImages(response.data);

        
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }; 
    
    useEffect(() => {
      fetchData();
      fetchImages();
    }, [selectedId,projectId]);


    if (loading) {
    return <Loading />;
    }
    

  return (
    <div className="p-6 bg-white shadow rounded-lg max-h-[80vh] overflow-y-auto">


    <div className="grid grid-cols-4 gap-3 text-sm">
        <div className="flex col-span-4 md:col-span-2 lg:col-span-2 flex-col p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <strong className="font-medium text-gray-700">Title:</strong>
            <span className="mt-1 text-gray-900">{data.title}</span>
        </div>

        <div className="flex flex-col col-span-4 md:col-span-2 lg:col-span-1 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <strong className="font-medium text-gray-700">Status:</strong>
            <span className="mt-1 text-gray-900">{data.status}</span>
        </div>

        <div className="flex flex-col p-2 col-span-4 md:col-span-2 lg:col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <strong className="font-medium text-gray-700">Expected Check Date:</strong>
            <span className="mt-1 text-gray-900">{data.expected_check_date}</span>
        </div>

        <div className="flex flex-col p-2 col-span-4 md:col-span-2 lg:col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <strong className="font-medium text-gray-700">Checked Date:</strong>
            <span className="mt-1 text-gray-900">{data.checked_date}</span>
        </div>

        <div className="flex flex-col p-2 col-span-4 md:col-span-2 lg:col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <strong className="font-medium text-gray-700">Action Required:</strong>
            <span className="mt-1 text-gray-900">{data.action_required}</span>
        </div>

        <div className="flex flex-col p-2 col-span-4 md:col-span-2 lg:col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <strong className="font-medium text-gray-700">Resolution Date:</strong>
            <span className="mt-1 text-gray-900">{data.resolution_date}</span>
        </div>


        <div className="flex flex-col p-2 col-span-4 md:col-span-2 lg:col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <strong className="font-medium text-gray-700">Checked By:</strong>
            <span className="mt-1 text-gray-900">{data.checked_user}</span>
        </div>

        <div className=" col-span-4 md:col-span-4 lg:col-span-2 flex flex-col p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <strong className="font-medium text-gray-700">Description:</strong>
            <p className="mt-1 text-gray-900">{data.description}</p>
        </div>

        <div className=" col-span-4 md:col-span-4 lg:col-span-2 flex flex-col p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <strong className="font-medium text-gray-700">Comment:</strong>
            <p className="mt-1 text-gray-900">{data.comment}</p>
        </div>
    </div>

    <div className='w-full col-span-4 mt-2'>
        <hr className='border-t-3 border-gray-800 my-2'></hr>
    </div>

  {/* Images Section */}
  {images.length > 0 && (
    <div className="mt-2">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Images</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
          >
            <img
              src={`http://127.0.0.1:8000/storage/${img.image_path}`}
              alt={img.image_name}
              className="w-full h-40 object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black opacity-50 text-white p-2 text-xs text-center">
              {img.image_name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>

  )
}
