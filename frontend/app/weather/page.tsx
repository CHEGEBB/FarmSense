/* eslint-disable @next/next/no-img-element */
// app/weather/page.tsx

'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  fetchWeatherData, 
  getWeatherColorClass, 
  getWeatherAdvice, 
  WeatherData, 
  FarmLocation,
  getDummyWeatherData,
  getWindDirection
} from '../../services/WeatherService';
import Sidebar from '@/components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { 
  Droplets, 
  Thermometer, 
  Wind, 
  Sunrise, 
  Sunset, 
  Umbrella, 
  CalendarDays, 
  RefreshCw, 
  AlertTriangle,
  Eye,
  BarChart,
  Info,
  ChevronDown,
  ChevronUp,
  MapPin
} from 'lucide-react';
import Image from 'next/image';
import Weather from "../../public/assets/weather.png";
import "../../sass/fonts.scss"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Demo farm locations - in a real app, these would come from your farm database
const DEMO_FARM_LOCATIONS: FarmLocation[] = [
  { lat: 40.7128, lon: -74.006, name: "Main Farm" },
  { lat: 34.0522, lon: -118.2437, name: "South Field" },
  { lat: 41.8781, lon: -87.6298, name: "North Orchard" }
];

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<FarmLocation>(DEMO_FARM_LOCATIONS[0]);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [activeAdviceIndex, setActiveAdviceIndex] = useState<number>(0);
  const [showAllAdvice, setShowAllAdvice] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [showRainAnimation, setShowRainAnimation] = useState<boolean>(false);
  const [showSnowAnimation, setShowSnowAnimation] = useState<boolean>(false);
  const adviceInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadWeatherData();
    
    // Rotate through advice every 8 seconds
    adviceInterval.current = setInterval(() => {
      if (weatherData) {
        const advice = getWeatherAdvice(weatherData);
        setActiveAdviceIndex(prevIndex => (prevIndex + 1) % advice.length);
      }
    }, 8000);
    
    return () => {
      if (adviceInterval.current) clearInterval(adviceInterval.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation]);

  useEffect(() => {
    // Set weather animations based on current conditions
    if (weatherData) {
      const currentWeather = weatherData.current.weather[0].main.toLowerCase();
      setShowRainAnimation(currentWeather === 'rain' || currentWeather === 'drizzle' || currentWeather === 'thunderstorm');
      setShowSnowAnimation(currentWeather === 'snow');
    }
  }, [weatherData]);

  const loadWeatherData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchWeatherData(selectedLocation);
      setWeatherData(data);
    } catch (err) {
      console.error("Failed to fetch weather data:", err);
      setError("Couldn't load weather data. Using simulated data instead.");
      // Use dummy data as fallback
      setWeatherData(getDummyWeatherData());
    } finally {
      setIsLoading(false);
    }
  };

  const formatTemperature = (temp: number): string => {
    if (unit === 'F') {
      return `${Math.round((temp * 9/5) + 32)}°F`;
    }
    return `${Math.round(temp)}°C`;
  };

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDay = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString([], { weekday: 'short' });
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Renders rain animation
  const RainAnimation = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {Array.from({ length: 100 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 w-0.5 h-5 rounded-full bg-blue-200 opacity-80"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
          animate={{
            y: ["0vh", "100vh"],
            opacity: [0.8, 0.5, 0.2]
          }}
          transition={{
            duration: 1 + Math.random(),
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );

  // Renders snow animation
  const SnowAnimation = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {Array.from({ length: 100 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 w-2 h-2 rounded-full bg-white opacity-80"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
          animate={{
            y: ["0vh", "100vh"],
            x: [0, Math.random() > 0.5 ? 20 : -20],
            opacity: [0.8, 0.5, 0.2]
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );

  // Daily temperature chart
  const renderTemperatureChart = () => {
    if (!weatherData) return null;
    
    const labels = weatherData.daily.slice(0, 7).map(day => formatDay(day.dt));
    const maxTemps = weatherData.daily.slice(0, 7).map(day => 
      unit === 'F' ? (day.temp.max * 9/5) + 32 : day.temp.max
    );
    const minTemps = weatherData.daily.slice(0, 7).map(day => 
      unit === 'F' ? (day.temp.min * 9/5) + 32 : day.temp.min
    );
    
    const data = {
      labels,
      datasets: [
        {
          label: 'High',
          data: maxTemps,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Low',
          data: minTemps,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        }
      ]
    };
    
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: '7-Day Temperature Forecast',
          color: '#334155',
          font: {
            size: 16,
            weight: 'bold' as const,
          }
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: unit === 'F' ? 'Temperature (°F)' : 'Temperature (°C)',
          }
        }
      }
    };
    
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <Line data={data} options={options} />
      </div>
    );
  };

  // Precipitation chart
  const renderPrecipitationChart = () => {
    if (!weatherData) return null;
    
    const labels = weatherData.daily.slice(0, 7).map(day => formatDay(day.dt));
    const precipProbability = weatherData.daily.slice(0, 7).map(day => Math.round(day.pop * 100));
    
    const data = {
      labels,
      datasets: [
        {
          label: 'Chance of Precipitation (%)',
          data: precipProbability,
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderRadius: 5,
        }
      ]
    };
    
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Precipitation Forecast',
          color: '#334155',
          font: {
            size: 16,
            weight: 'bold' as const,
          }
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Probability (%)',
          }
        }
      }
    };
    
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <Bar data={data} options={options} />
      </div>
    );
  };

  // Humidity and wind chart
  const renderConditionsChart = () => {
    if (!weatherData) return null;
    
    const labels = weatherData.daily.slice(0, 7).map(day => formatDay(day.dt));
    const humidity = weatherData.daily.slice(0, 7).map(day => day.humidity);
    const windSpeed = weatherData.daily.slice(0, 7).map(day => day.wind_speed);
    
    const data = {
      labels,
      datasets: [
        {
          label: 'Humidity (%)',
          data: humidity,
          backgroundColor: 'rgba(147, 51, 234, 0.7)',
          borderRadius: 5,
          yAxisID: 'y',
        },
        {
          label: 'Wind Speed (m/s)',
          data: windSpeed,
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          borderRadius: 5,
          yAxisID: 'y1',
        }
      ]
    };
    
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Humidity & Wind',
          color: '#334155',
          font: {
            size: 16,
            weight: 'bold' as const,
          }
        },
      },
      scales: {
        y: {
          type: 'linear' as const,
          display: true,
          position: 'left' as const,
          title: {
            display: true,
            text: 'Humidity (%)',
          },
          max: 100,
          beginAtZero: true,
        },
        y1: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          grid: {
            drawOnChartArea: false,
          },
          title: {
            display: true,
            text: 'Wind (m/s)',
          },
          beginAtZero: true,
        },
      },
    };
    
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <Bar data={data} options={options} />
      </div>
    );
  };

  // Weather condition distribution chart
  const renderWeatherDistributionChart = () => {
    if (!weatherData) return null;
    
    // Count occurrences of each weather condition
    const weatherTypes = new Map<string, number>();
    weatherData.daily.forEach(day => {
      const condition = day.weather[0].main;
      weatherTypes.set(condition, (weatherTypes.get(condition) || 0) + 1);
    });
    
    const labels = Array.from(weatherTypes.keys());
    const data = Array.from(weatherTypes.values());
    
    // Color mapping
    const backgroundColors = labels.map(label => {
      switch(label) {
        case 'Clear': return 'rgba(59, 130, 246, 0.7)';
        case 'Clouds': return 'rgba(156, 163, 175, 0.7)';
        case 'Rain': return 'rgba(79, 70, 229, 0.7)';
        case 'Snow': return 'rgba(186, 230, 253, 0.7)';
        case 'Thunderstorm': return 'rgba(91, 33, 182, 0.7)';
        default: return 'rgba(107, 114, 128, 0.7)';
      }
    });
    
    const chartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
          borderWidth: 1,
        },
      ],
    };
    
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'right' as const,
        },
        title: {
          display: true,
          text: '7-Day Weather Distribution',
          color: '#334155',
          font: {
            size: 16,
            weight: 'bold' as const,
          }
        },
      },
    };
    
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <Doughnut data={chartData} options={options} />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="flex items-center justify-center h-80 bg-white rounded-lg shadow-md"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <div className="text-center">
                <RefreshCw className="w-16 h-16 mx-auto text-emerald-500 animate-spin" />
                <p className="mt-4 text-xl font-medium text-slate-700">Loading weather information...</p>
                <p className="text-slate-500">Fetching the latest data for your farm</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !weatherData) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <AlertTriangle className="w-16 h-16 mx-auto text-red-500" />
              <h2 className="mt-4 text-xl font-bold text-center text-slate-800">{error}</h2>
              <div className="mt-6 text-center">
                <button 
                  onClick={loadWeatherData} 
                  className="px-4 py-2 text-white bg-emerald-500 rounded-md hover:bg-emerald-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  const currentWeather = weatherData.current.weather[0];
  const advice = getWeatherAdvice(weatherData);
  const weatherColorClass = getWeatherColorClass(currentWeather.main);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      
      <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Weather location selector */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Weather Monitoring</h1>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select 
                  value={selectedLocation.name}
                  onChange={(e) => {
                    const selected = DEMO_FARM_LOCATIONS.find(loc => loc.name === e.target.value);
                    if (selected) setSelectedLocation(selected);
                  }}
                  className="appearance-none pl-10 pr-10 py-2 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
                >
                  {DEMO_FARM_LOCATIONS.map(location => (
                    <option key={location.name} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
              </div>
              
              <button 
                onClick={loadWeatherData}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              
              <button 
                onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Thermometer className="w-4 h-4" />
                <span>°{unit}</span>
              </button>
            </div>
          </div>
          
          {/* Current weather banner */}
          {/* Current weather banner */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className={`relative overflow-hidden rounded-xl shadow-lg mb-8 ${weatherColorClass}`}
>
  {/* Background image with gradient overlay */}
  <div className="absolute inset-0 z-0">
    <div 
      className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-purple-500/70 to-pink-500/60 mix-blend-multiply z-10"
      style={{ backgroundImage: 'linear-gradient(to right, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.7), rgba(236, 72, 153, 0.6))' }}
    ></div>
    <Image
      src="/assets/wheat.jpg"
      alt="Weather background"
      layout="fill"
      objectFit="cover"
      className="z-0"
    />
  </div>

  {showRainAnimation && <RainAnimation />}
  {showSnowAnimation && <SnowAnimation />}
  
  <div className="relative z-20 p-6 md:p-8 text-white">
    <div className="flex flex-col md:flex-row md:items-center justify-between">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold">
          {formatTemperature(weatherData.current.temp)}
        </h2>
        <p className="text-xl mt-1 opacity-90">{currentWeather.description}</p>
        <p className="mt-2 opacity-80">Feels like {formatTemperature(weatherData.current.feels_like)}</p>
        
        {/* Location and timestamp */}
        <div className="mt-4">
          <p className="opacity-80">{selectedLocation.name} • {new Date().toLocaleString()}</p>
        </div>
      </div>
      
      <div className="mt-6 md:mt-0">
        <Image
          src={Weather}
          alt={currentWeather.description}
          className="w-24 h-24 md:w-32 md:h-32 object-contain"
          width={128}
          height={128}
        />
      </div>
    </div>
    
    {/* Weather metrics */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5" />
          <span className="text-sm opacity-80">Wind</span>
        </div>
        <p className="mt-1 font-medium">
          {weatherData.current.wind_speed} m/s {getWindDirection(weatherData.current.wind_deg)}
        </p>
      </div>
      
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5" />
          <span className="text-sm opacity-80">Humidity</span>
        </div>
        <p className="mt-1 font-medium">{weatherData.current.humidity}%</p>
      </div>
      
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Umbrella className="w-5 h-5" />
          <span className="text-sm opacity-80">Precipitation</span>
        </div>
        <p className="mt-1 font-medium">
          {Math.round(weatherData.hourly[0].pop * 100)}% chance
        </p>
      </div>
      
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          <span className="text-sm opacity-80">Visibility</span>
        </div>
        <p className="mt-1 font-medium">
          {(weatherData.current.visibility / 1000).toFixed(1)} km
        </p>
      </div>
    </div>
  </div>
</motion.div>
          
          {/* Farmer advice section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Info className="w-5 h-5" />
                Weather-Based Farming Advice
              </h3>
              <button
                onClick={() => setShowAllAdvice(!showAllAdvice)}
                className="text-white hover:bg-emerald-700 p-1 rounded-full"
              >
                {showAllAdvice ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="p-4">
              {!showAllAdvice ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeAdviceIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="min-h-[80px] flex items-center"
                  >
                    <p className="text-slate-700">{advice[activeAdviceIndex]}</p>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <ul className="space-y-3">
                  {advice.map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-2 text-slate-700"
                    >
                      <span className="mt-1 text-emerald-500">•</span>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
          
          {/* Hourly forecast */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-4 bg-indigo-600 text-white">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                Hourly Forecast
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <div className="inline-flex min-w-full p-4 gap-2">
                {weatherData.hourly.slice(0, 24).map((hour, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="flex flex-col items-center p-3 min-w-[100px] border-r last:border-r-0 border-slate-200"
                  >
                    <p className="text-slate-500 text-sm">{formatTime(hour.dt)}</p>
                    <img
                      src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                      alt={hour.weather[0].description}
                      className="w-10 h-10 my-1"
                    />
                    <p className="font-medium text-slate-800">{formatTemperature(hour.temp)}</p>
                    <div className="flex items-center mt-1 gap-1 text-blue-500">
                      <Umbrella className="w-3 h-3" />
                      <span className="text-xs">{Math.round(hour.pop * 100)}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* 7-day forecast */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-4 bg-indigo-600 text-white">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                7-Day Forecast
              </h3>
            </div>
            
            <div className="divide-y divide-slate-200">
              {weatherData.daily.slice(0, 7).map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setShowDetails(showDetails === `day-${index}` ? null : `day-${index}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-20">
                        <p className="font-medium text-slate-800">{index === 0 ? 'Today' : formatDay(day.dt)}</p>
                        <p className="text-slate-500 text-sm">{formatDate(day.dt)}</p>
                      </div>
                      
                      <img
                        src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                        alt={day.weather[0].description}
                        className="w-12 h-12"
                      />
                      
                      <div className="hidden sm:block">
                        <p className="text-slate-800">{day.weather[0].description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <div className="text-blue-600 mr-1">
                          <Umbrella className="w-4 h-4" />
                        </div>
                        <span className="text-slate-600">{Math.round(day.pop * 100)}%</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">{formatTemperature(day.temp.max)}</span>
                        <span className="text-slate-500">{formatTemperature(day.temp.min)}</span>
                      </div>
                      
                      <div className="text-slate-500">
                        {showDetails === `day-${index}` ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded details */}
                  <AnimatePresence>
                    {showDetails === `day-${index}` && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 overflow-hidden"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-slate-600">
                              <Wind className="w-4 h-4" />
                              <span>Wind</span>
                            </div>
                            <p className="mt-1 font-medium">
                              {day.wind_speed} m/s {getWindDirection(day.wind_deg)}
                            </p>
                          </div>
                          
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-slate-600">
                              <Droplets className="w-4 h-4" />
                              <span>Humidity</span>
                            </div>
                            <p className="mt-1 font-medium">{day.humidity}%</p>
                          </div>
                          
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-slate-600">
                              <Sunrise className="w-4 h-4" />
                              <span>Morning</span>
                            </div>
                            <p className="mt-1 font-medium">{formatTemperature(day.temp.morn)}</p>
                          </div>
                          
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-slate-600">
                              <Sunset className="w-4 h-4" />
                              <span>Evening</span>
                            </div>
                            <p className="mt-1 font-medium">{formatTemperature(day.temp.eve)}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                          <h4 className="font-medium text-indigo-800 mb-2">Farming Recommendations:</h4>
                          <p className="text-slate-700">
                            {day.weather[0].main === 'Rain' ? 
                              "Avoid spraying fertilizers or pesticides. Check drainage systems and prepare for wet field conditions." :
                              day.weather[0].main === 'Clear' && day.temp.max > 30 ?
                                "Water crops early morning or late evening. Provide shade for sensitive plants and ensure adequate hydration for outdoor workers." :
                                day.weather[0].main === 'Snow' || day.temp.min < 2 ?
                                  "Protect sensitive crops from frost. Delay seeding and ensure livestock have proper shelter." :
                                  "Good conditions for field operations. Regular monitoring and maintenance recommended."
                            }
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Weather charts section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Weather Analytics
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderTemperatureChart()}
              {renderPrecipitationChart()}
              {renderConditionsChart()}
              {renderWeatherDistributionChart()}
            </div>
          </motion.div>
          
          {/* Weather alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Weather Alerts & Warnings
            </h3>
            
            {weatherData.hourly.some(h => h.pop > 0.5 || 
                                     h.weather[0].main === 'Thunderstorm' || 
                                     h.weather[0].id >= 700 && h.weather[0].id < 800) ? (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">Weather Warning</h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>
                        {weatherData.hourly.some(h => h.weather[0].main === 'Thunderstorm') 
                          ? "Thunderstorms expected within the next 24 hours. Secure equipment and delay field operations during storm periods."
                          : weatherData.hourly.some(h => h.pop > 0.5)
                            ? "Heavy precipitation expected. Monitor field drainage and delay fertilizer application."
                            : "Visibility may be reduced due to fog or mist conditions. Use caution with machinery."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-emerald-800">No Severe Weather Alerts</h3>
                    <div className="mt-2 text-sm text-emerald-700">
                      <p>Weather conditions are currently favorable for normal farm operations.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Resource Center */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8 bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
              <h3 className="text-lg font-semibold">Weather Resource Center</h3>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium text-indigo-800 mb-2">Seasonal Predictions</h4>
                <p className="text-slate-600 text-sm">Access long-term forecasts and seasonal predictions to plan your farm activities.</p>
                <button className="mt-3 text-sm text-indigo-600 font-medium hover:underline">Learn More</button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium text-indigo-800 mb-2">Climate-Smart Farming</h4>
                <p className="text-slate-600 text-sm">Learn about adaptation strategies for changing climate patterns in your region.</p>
                <button className="mt-3 text-sm text-indigo-600 font-medium hover:underline">Explore Guides</button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium text-indigo-800 mb-2">Weather Alerts Setup</h4>
                <p className="text-slate-600 text-sm">Configure custom weather alerts based on your crop needs and preferences.</p>
                <button className="mt-3 text-sm text-indigo-600 font-medium hover:underline">Configure</button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;