
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loading from "../../Loading";

export default function EquipmentLogSelected({ selectedEquipmentId }) {

  const [loading, setLoading] = useState(true);
  const { projectId } = useParams();
  const [data, setData] = useState(null);

  // Fetch data
  const fetchDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/equipment-logs-equipments-project/${projectId}/${selectedEquipmentId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          Accept: 'application/json',
        },
      });
      setData(response.data[0]);


    } catch (error) {
      console.error('Error fetching user logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEquipmentId) {
      fetchDetails();
    }
  }, [selectedEquipmentId]);

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return <div>No data found.</div>;
  }

  return (
    <div className="p-4">
      {/* Equipment Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center mb-8">
        <div className="flex justify-center md:justify-start">
          <img
            src={`http://localhost:8000/storage/${data.equipment_image}`}
            alt="Equipment"
            className="w-28 h-28 rounded-full object-cover shadow-md"
          />
        </div>
        <div className="md:col-span-3 space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-bold">{data.equipment_name}</h2>
          <p className="text-gray-600 capitalize">{data.equipment_category.replace('_', ' ')}</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <span className="text-green-600 font-medium capitalize">{data.equipment_status}</span>
            <span className="text-blue-500">Progress: {data.progress_percentage}%</span>
            <span className="text-purple-500">Allocated Dates: {data.allocated_dates}</span>
          </div>
        </div>
      </div>

      {/* Equipment Logs */}
      <div className='max-h-[50vh] overflow-y-auto'>
        <h3 className="text-xl font-semibold mb-4">Equipment Work Logs</h3>
        {data.log && data.log.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {data.log.map((logItem) => (
              <div key={logItem.id} className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition">
                <h4 className="text-lg font-semibold text-blue-600 mb-2">{logItem.task_name}</h4>
                <div className="space-y-1 text-gray-700 text-sm">
                  <p><strong>Title:</strong> {logItem.title}</p>
                  <p><strong>Description:</strong> {logItem.description}</p>
                  <div className="flex justify-between">
                    <p><strong>Date:</strong> {logItem.date}</p>
                    <p><strong>Status:</strong> {logItem.status}</p>
                  </div>

                  <div className="flex justify-between">
                    <p><strong>Start Time:</strong> {logItem.start_time?logItem.start_time: 'N/A'}</p>
                    <p><strong>End Time:</strong> {logItem.end_time? logItem.end_time : 'N/A'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No logs available.</p>
        )}
      </div>
    </div>
  );
}



