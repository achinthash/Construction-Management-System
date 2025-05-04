

import React, { useState, useEffect } from "react";
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';

import axios from 'axios';
import Loading from "../Loading";

const ProjectGrantChart = () => {

  const [loading, setLoading] = useState(true);
  const [rawTasks, setData] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
          try {
            const response = await axios.get(`http://127.0.0.1:8000/api/projects-all`, {
              headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}`, },
            });
    
            setData(response.data);
          } catch (error) {
            console.error(error);
          }
          setLoading(false);
        };


        fetchData();
      
      }, []);


    if (loading) {
      return <Loading />;
    }


  const tasks = rawTasks.map((task, index) => ({
    start: new Date(task.start_date),
    end: new Date(task.end_date),
    name: task.name,
    id: `Task-${task.id}`,
    type: "task",
    progress: task.progress,
    isDisabled: false,
    styles: {
      progressColor: "#10b981",
      progressSelectedColor: "#047857",
    },
  }));

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4 text-center "> Task Timeline (Gantt Chart)</h2>
      <Gantt
        tasks={tasks}
        viewMode={ViewMode.Day}
        listCellWidth="155px"
        columnWidth={65}
        barCornerRadius={4}
      />
    </div>
  );
};

export default ProjectGrantChart;





