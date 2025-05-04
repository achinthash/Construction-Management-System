import React, { useState, useEffect } from "react";
import axios from "axios";

const WeatherView = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY; 

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      try {
   
        const response = await axios.get(apiUrl);
        setWeather(response.data);
      } catch (err) {
        console.error("Error fetching weather:", err);
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
            console.error("Geolocation error:", err.message);
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
  }, []);

  if (loading)
    return <div className="text-center text-gray-600">🔄 Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (!weather) return null;

  return (
    <div className=" mx-auto p-4 rounded-lg text-gray-800 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <h2 className="text-2xl font-semibold text-center mb-4 text-blue-600">
        Weather in {weather.name}
      </h2>

      <div className="flex items-center justify-center mb-4">
        <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}alt={weather.weather[0].description}className="w-20 h-20"/>
      </div>

      <div className="text-center">
        <p className="text-4xl font-extrabold text-blue-500">
          {weather.main.temp}°C
        </p>
        <p className="text-xl font-medium mt-2 text-gray-600">
          {weather.weather[0].description}
        </p>
        <p className="text-lg mt-2 text-gray-700">
          <span className="font-semibold">Humidity:</span> {weather.main.humidity}%
        </p>
        <p className="text-lg text-gray-700">
          <span className="font-semibold">Wind Speed:</span> {weather.wind.speed} m/s
        </p>
      </div>

      <div className="text-center mt-4">
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white py-2 px-6 rounded-full shadow-lg font-semibold hover:bg-blue-600 transition"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default WeatherView;
