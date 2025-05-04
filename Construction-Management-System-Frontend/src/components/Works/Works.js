import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useParams } from "react-router-dom";

import Sidebar from '../Sidebar';
import NavigationBar from '../NavigationBar';
import Loading from '../Loading';
import AvailableTasks from './AvailableTasks';
import StartdWork from './StartedWork'


export default function Works() {

    const { projectId } = useParams();
    const [loading, setLoading] = useState(false);
    const currentDate = new Date().toISOString().split('T')[0];
    const [date] = useState(new Date());
    const [taskStart, setTaskStart] = useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

    // weather details
    useEffect(() => {
      const fetchWeather = async (lat, lon) => {
        try {
          const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
          const response = await axios.get(apiUrl);
          setWeather(response.data);
        } catch (err) {
          setError("Unable to fetch weather data. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
  
      const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => fetchWeather(coords.latitude, coords.longitude),
            (err) => {
              setError(`Location error: ${err.message}`);
             setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        } else {
          setError("Geolocation is not supported by this browser.");
          setLoading(false);
        }
      };
  
      getLocation();
    }, [apiKey]);


   const handleWorkStart = (selectedId) => {
    setTaskStart(selectedId);
  };

    if (loading) {
      return (
          <Loading />
      );
  }
  
  return (
    <div className=' max-h-[100vh] overflow-y-hidden'>
        
      <Sidebar />
      <NavigationBar />

      <div className="bg-[#ddd6fee2] sidebar-ml dark:bg-gray-900 rounded flex  p-2 max-h-[10vh] my-1 mx-1 justify-between relative z-0">
        <h1 className="text-left sm:text-xl font-bold text p-1.5 text-[#5c3c8f] dark:text-white">
          Works
        </h1>

          {
            weather && (
            <div className="flex flex-col text-left space-y-1 relative z-0 items-center justify-center">
              <h2 className="font-bold  md:text-lg text-base text-[#5c3c8f]">
              {currentDate} - {date.toLocaleDateString("en-US", { weekday: "long" })} 
              </h2>
              <h2 className="font-bold md:text-sm text-xs text-[#5c3c8f]">
                {weather.main.temp}°C - {weather.weather[0].description}
              </h2>
            </div>
              
            )
          }
        
          {error && (
            <p className="text-red-600 text-xs font-medium mt-1">
              {error}
            </p>
          )}
        <Link to={`/project/${projectId}/daily-logs`} className="p-1.5  flex items-center  text-sm text-white bg-[#6d28d9] dark:bg-gray-500 hover:dark:bg-gray-400 rounded-lg hover:bg-blue-800 ">
          Daily Logs
        </Link>

        
      </div>

      <div className='p-1.5 '>

        {
          !taskStart ?

          <AvailableTasks setWorkStart={handleWorkStart}  />
          :
          <StartdWork  workId={taskStart}  weather={weather}/> 
        }

      </div>
  
    </div>
  )
}
