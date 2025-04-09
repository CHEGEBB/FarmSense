// app/irrigation/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, 
  Calendar, 
  Clock, 
  CloudRain, 
  Sun, 
  AlertTriangle, 
  Activity,
  ChevronRight,
  Check,
  X,
  Settings,
  RefreshCw,
  ArrowUpRight,
  Cloud,
  Zap,
  CloudSnowIcon,
  ZapIcon
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import Sidebar from '../../components/Sidebar';
import "../../sass/fonts.scss"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Define field types
interface Field {
  id: string;
  name: string;
  crop: string;
  area: string;
  moistureLevel: number;
  lastIrrigated: string;
  status: 'optimal' | 'low' | 'critical' | 'irrigating';
  image: string;
}

// Define weather type
interface Weather {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  forecast: Array<{
    day: string;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
    temperature: [number, number]; // [min, max]
    precipitation: number;
  }>;
}

// Define irrigation schedule type
interface IrrigationSchedule {
  fieldId: string;
  time: string;
  duration: number;
  status: 'pending' | 'completed' | 'skipped';
}

const IrrigationPage = () => {
  // State for fields data
  const [fields, setFields] = useState<Field[]>([
    { 
      id: 'field1', 
      name: 'North Field', 
      crop: 'Coffee', 
      area: '2.5 acres', 
      moistureLevel: 38, 
      lastIrrigated: '2 days ago', 
      status: 'low',
      image: 'url("/assets/coffee.jpeg")'
    },
    { 
      id: 'field2', 
      name: 'East Field', 
      crop: 'Corn', 
      area: '3.8 acres', 
      moistureLevel: 65, 
      lastIrrigated: '1 day ago', 
      status: 'optimal',
      image: 'url("/assets/sweet.jpeg")'
    },
    { 
      id: 'field3', 
      name: 'South Field', 
      crop: 'Wheat', 
      area: '5.2 acres', 
      moistureLevel: 28, 
      lastIrrigated: '4 days ago', 
      status: 'critical',
      image: 'url("/assets/wheat.jpg")'
    },
    { 
      id: 'field4', 
      name: 'West Field', 
      crop: 'Vegetables', 
      area: '1.7 acres', 
      moistureLevel: 58, 
      lastIrrigated: '2 days ago', 
      status: 'optimal',
      image: 'url("/assets/kale.jpeg")'
    }
  ]);

  // State for weather data
  const [weather, setWeather] = useState<Weather>({
    condition: 'sunny',
    temperature: 28,
    humidity: 45,
    windSpeed: 8,
    precipitation: 0,
    forecast: [
      { day: 'Today', condition: 'sunny', temperature: [22, 30], precipitation: 0 },
      { day: 'Tomorrow', condition: 'cloudy', temperature: [20, 27], precipitation: 10 },
      { day: 'Wed', condition: 'rainy', temperature: [18, 24], precipitation: 70 },
      { day: 'Thu', condition: 'cloudy', temperature: [19, 26], precipitation: 30 },
      { day: 'Fri', condition: 'sunny', temperature: [21, 29], precipitation: 0 }
    ]
  });

  // State for irrigation schedules
  const [schedules, setSchedules] = useState<IrrigationSchedule[]>([
    { fieldId: 'field2', time: '06:00 AM', duration: 45, status: 'completed' },
    { fieldId: 'field1', time: '02:30 PM', duration: 30, status: 'pending' },
    { fieldId: 'field4', time: '05:15 PM', duration: 20, status: 'pending' },
    { fieldId: 'field3', time: '09:00 PM', duration: 60, status: 'pending' }
  ]);

  // State for alerts
  const [alerts, setAlerts] = useState<Array<{id: string, fieldId: string, message: string, type: 'warning' | 'critical' | 'info'}>>([]);

  // State for active irrigation
  const [activeIrrigation, setActiveIrrigation] = useState<{fieldId: string, timeRemaining: number} | null>(null);

  // State for modal
  const [modal, setModal] = useState<{show: boolean, fieldId: string, message: string} | null>(null);

  // State for crop suggestions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cropSuggestions, setCropSuggestions] = useState<{[key: string]: {interval: number, amount: number, time: string}}>(
    {
      'Coffee': { interval: 2, amount: 25, time: 'Morning' },
      'Corn': { interval: 3, amount: 30, time: 'Evening' },
      'Wheat': { interval: 4, amount: 40, time: 'Morning' },
      'Vegetables': { interval: 1, amount: 20, time: 'Evening' }
    }
  );

  // State for water usage data
  const [waterUsageData, setWaterUsageData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Water Usage (gallons)',
        data: [2800, 3200, 2900, 4100, 3600, 2700, 3100],
        borderColor: 'rgba(52, 211, 153, 1)',
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  });

  // State for efficiency data
  const [efficiencyData, setEfficiencyData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Irrigation Efficiency (%)',
        data: [78, 82, 76, 89, 85, 91, 87],
        borderColor: 'rgba(79, 70, 229, 1)',
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  });

  // State for active tab
  const [activeTab, setActiveTab] = useState('fields');

  // State for selected field (for detailed view)
  const [selectedField, setSelectedField] = useState<string | null>(null);

  // Reference for the irrigation sound
  const irrigationSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize irrigation sound
  useEffect(() => {
    irrigationSoundRef.current = new Audio('/sounds/irrigation.mp3');
    irrigationSoundRef.current.loop = true;
  }, []);

  // Simulate changing moisture levels
  useEffect(() => {
    const interval = setInterval(() => {
      setFields(prev => prev.map(field => {
        if (field.status === 'irrigating') {
          // Increase moisture level during irrigation
          const newMoistureLevel = Math.min(field.moistureLevel + Math.random() * 3, 100);
          return {
            ...field,
            moistureLevel: Number(newMoistureLevel.toFixed(1))
          };
        } else {
          // Randomly decrease moisture level for non-irrigating fields
          const decrease = Math.random() * 0.5;
          const newMoistureLevel = Math.max(field.moistureLevel - decrease, 10);
          
          // Update status based on moisture level
          let newStatus = field.status;
          if (newMoistureLevel < 30) {
            newStatus = 'critical';
          } else if (newMoistureLevel < 45) {
            newStatus = 'low';
          } else {
            newStatus = 'optimal';
          }
          
          return {
            ...field,
            moistureLevel: Number(newMoistureLevel.toFixed(1)),
            status: newStatus as 'optimal' | 'low' | 'critical' | 'irrigating'
          };
        }
      }));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Check fields for critical moisture levels and create alerts
  useEffect(() => {
    fields.forEach(field => {
      if (field.status === 'critical' && !alerts.some(alert => alert.fieldId === field.id && alert.type === 'critical')) {
        // Add a critical alert if not already present
        setAlerts(prev => [
          ...prev,
          {
            id: `alert-${Date.now()}-${field.id}`,
            fieldId: field.id,
            message: `Critical moisture level in ${field.name} (${field.crop})`,
            type: 'critical'
          }
        ]);
        
        // Show modal for critical alerts
        setModal({
          show: true,
          fieldId: field.id,
          message: `Critical moisture level detected in ${field.name}. Start irrigation now?`
        });
      } else if (field.status === 'low' && !alerts.some(alert => alert.fieldId === field.id)) {
        // Add a warning alert if not already present
        setAlerts(prev => [
          ...prev,
          {
            id: `alert-${Date.now()}-${field.id}`,
            fieldId: field.id,
            message: `Low moisture level in ${field.name} (${field.crop})`,
            type: 'warning'
          }
        ]);
      }
    });
  }, [fields, alerts]);

  // Update weather simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate small changes in temperature and humidity
      setWeather(prev => {
        const tempChange = (Math.random() - 0.5) * 1.5;
        const humidityChange = (Math.random() - 0.5) * 3;
        const windChange = (Math.random() - 0.5) * 2;
        
        return {
          ...prev,
          temperature: Number((prev.temperature + tempChange).toFixed(1)),
          humidity: Math.min(100, Math.max(0, Math.round(prev.humidity + humidityChange))),
          windSpeed: Math.max(0, Number((prev.windSpeed + windChange).toFixed(1)))
        };
      });
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Update charts simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Update water usage data
      setWaterUsageData(prev => {
        const newData = [...prev.datasets[0].data];
        newData.shift();
        newData.push(Math.floor(Math.random() * 1500) + 2500);
        
        return {
          ...prev,
          datasets: [
            {
              ...prev.datasets[0],
              data: newData
            }
          ]
        };
      });
      
      // Update efficiency data
      setEfficiencyData(prev => {
        const newData = [...prev.datasets[0].data];
        newData.shift();
        newData.push(Math.floor(Math.random() * 15) + 75);
        
        return {
          ...prev,
          datasets: [
            {
              ...prev.datasets[0],
              data: newData
            }
          ]
        };
      });
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle irrigation process and timer
  useEffect(() => {
    if (activeIrrigation) {
      // Play irrigation sound
      if (irrigationSoundRef.current) {
        irrigationSoundRef.current.play();
      }
      
      // Start countdown timer
      const timer = setInterval(() => {
        setActiveIrrigation(prev => {
          if (prev && prev.timeRemaining > 1) {
            return { ...prev, timeRemaining: prev.timeRemaining - 1 };
          } else {
            // Stop irrigation when timer ends
            stopIrrigation();
            return null;
          }
        });
      }, 1000);
      
      return () => {
        clearInterval(timer);
        // Stop sound when component unmounts or irrigation stops
        if (irrigationSoundRef.current) {
          irrigationSoundRef.current.pause();
          irrigationSoundRef.current.currentTime = 0;
        }
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIrrigation]);

  // Function to start irrigation
  const startIrrigation = (fieldId: string, duration: number = 30) => {
    // Update field status
    setFields(prev => prev.map(field => 
      field.id === fieldId 
        ? { ...field, status: 'irrigating', lastIrrigated: 'Just now' } 
        : field
    ));
    
    // Set active irrigation
    setActiveIrrigation({
      fieldId,
      timeRemaining: duration
    });
    
    // Close modal if open
    setModal(null);
    
    // Remove critical alerts for this field
    setAlerts(prev => prev.filter(alert => !(alert.fieldId === fieldId && alert.type === 'critical')));
  };

  // Function to stop irrigation
  const stopIrrigation = () => {
    if (activeIrrigation) {
      // Update field status
      setFields(prev => prev.map(field => 
        field.id === activeIrrigation.fieldId 
          ? { ...field, status: 'optimal', lastIrrigated: 'Just now' } 
          : field
      ));
      
      // Clear active irrigation
      setActiveIrrigation(null);
      
      // Stop sound
      if (irrigationSoundRef.current) {
        irrigationSoundRef.current.pause();
        irrigationSoundRef.current.currentTime = 0;
      }
    }
  };

  // Function to handle scheduled irrigation
  const handleScheduledIrrigation = (scheduleId: number) => {
    const schedule = schedules[scheduleId];
    
    // Update schedule status
    setSchedules(prev => prev.map((item, idx) => 
      idx === scheduleId ? { ...item, status: 'completed' } : item
    ));
    
    // Start irrigation
    startIrrigation(schedule.fieldId, schedule.duration);
  };

  // Function to dismiss an alert
  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  // Function to get status color
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'emerald';
      case 'low': return 'amber';
      case 'critical': return 'red';
      case 'irrigating': return 'blue';
      default: return 'gray';
    }
  };

  // Function to get weather icon
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-8 w-8 text-amber-500" />;
      case 'cloudy': return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'stormy': return <Zap className="h-8 w-8 text-purple-500" />;
      default: return <Sun className="h-8 w-8 text-amber-500" />;
    }
  };

  // Calculate total system metrics
  const totalFields = fields.length;
  const fieldsNeedingIrrigation = fields.filter(f => f.status === 'low' || f.status === 'critical').length;
  const activeIrrigations = fields.filter(f => f.status === 'irrigating').length;
  const averageMoisture = fields.reduce((sum, field) => sum + field.moistureLevel, 0) / fields.length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Page Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Droplets className="h-6 w-6 text-emerald-500 mr-2" />
                  Smart Irrigation Management
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Monitor and control irrigation across all fields
                </p>
              </motion.div>
              
              <div className="flex space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700"
                >
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700"
                >
                  {getWeatherIcon(weather.condition)}
                  <span className="ml-1">{weather.temperature}°C</span>
                </motion.div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* System Overview */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 gap-6 mb-6 lg:mb-8 md:grid-cols-4"
          >
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-emerald-100"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="rounded-md bg-emerald-50 p-3">
                    <Droplets className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Average Moisture</h3>
                    <div className="mt-1 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">
                        {averageMoisture.toFixed(1)}%
                      </p>
                      <div className="ml-2 flex items-baseline text-sm font-semibold">
                        <ArrowUpRight className={`h-4 w-4 ${averageMoisture > 50 ? 'text-emerald-500' : 'text-amber-500'}`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-indigo-100"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="rounded-md bg-indigo-50 p-3">
                    <Activity className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Active Irrigations</h3>
                    <div className="mt-1 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">
                        {activeIrrigations} / {totalFields}
                      </p>
                      <div className="ml-2 flex items-baseline text-sm font-semibold">
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={activeIrrigations > 0 ? "text-blue-500" : "text-gray-400"}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-100"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="rounded-md bg-amber-50 p-3">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Needs Irrigation</h3>
                    <div className="mt-1 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">
                        {fieldsNeedingIrrigation} Field{fieldsNeedingIrrigation !== 1 ? 's' : ''}
                      </p>
                      <div className="ml-2 flex items-baseline text-sm font-semibold">
                        <motion.div
                          animate={{ scale: fieldsNeedingIrrigation > 0 ? [1, 1.2, 1] : 1 }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={fieldsNeedingIrrigation > 0 ? "text-amber-500" : "text-gray-400"}
                        >
                          <AlertTriangle className="h-4 w-4" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-blue-100"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="rounded-md bg-blue-50 p-3">
                    <CloudRain className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Weather Condition</h3>
                    <div className="mt-1 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900 capitalize">
                        {weather.condition}
                      </p>
                      <div className="ml-2 flex items-baseline text-sm font-semibold">
                        <span className="text-gray-500">{weather.precipitation}% rain</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              {['fields', 'analytics', 'schedules', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    py-3 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab 
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Main Content Tabs */}
          <AnimatePresence mode="wait">
            {activeTab === 'fields' && (
              <motion.div
                key="fields"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Alerts Section */}
                {/* Alerts Section */}
{alerts.length > 0 && (
  <div className="mb-6">
    <h2 className="text-lg font-medium text-gray-900 mb-3">Active Alerts</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {alerts.map((alert, index) => (
        <motion.div
          key={`${alert.id}-${index}`} // Adding index as additional uniqueness
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-lg shadow-sm border-l-4 ${
            alert.type === 'critical' ? 'bg-red-50 border-red-500' :
            alert.type === 'warning' ? 'bg-amber-50 border-amber-500' :
            'bg-blue-50 border-blue-500'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <AlertTriangle className={`h-5 w-5 mr-2 ${
                alert.type === 'critical' ? 'text-red-500' :
                alert.type === 'warning' ? 'text-amber-500' :
                'text-blue-500'
              }`} />
              <div>
                <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {fields.find(f => f.id === alert.fieldId)?.moistureLevel.toFixed(1)}% moisture
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {alert.type === 'critical' || alert.type === 'warning' ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => startIrrigation(alert.fieldId)}
                  className="text-xs font-medium px-2 py-1 rounded bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  Irrigate
                </motion.button>
              ) : null}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dismissAlert(alert.id)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
)}
                
                {/* Fields Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Irrigation Fields</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center"
                    >
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </motion.button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    {fields.map((field) => (
                      <motion.div
                        key={field.id}
                        whileHover={{ y: -5 }}
                        onClick={() => setSelectedField(field.id === selectedField ? null : field.id)}
                        className="overflow-hidden rounded-xl shadow-md bg-white border border-gray-100 cursor-pointer"
                        style={{ 
                          backgroundImage: field.image,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 p-5 h-full">
                          <div className="flex flex-col h-full">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-bold text-white">{field.name}</h3>
                                <p className="text-sm text-gray-200">{field.crop} - {field.area}</p>
                              </div>
                              <div className={`px-2 py-1 rounded text-xs font-medium text-white 
                                ${field.status === 'optimal' ? 'bg-emerald-500' : 
                                  field.status === 'low' ? 'bg-amber-500' : 
                                  field.status === 'critical' ? 'bg-red-500' : 
                                  'bg-blue-500'}`}
                              >
                                {field.status === 'irrigating' ? (
                                  <motion.span
                                    animate={{ opacity: [1, 0.6, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                  >
                                    Irrigating...
                                  </motion.span>
                                ) : (
                                  field.status.charAt(0).toUpperCase() + field.status.slice(1)
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-4 flex-1">
                              <div className="mb-2">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm text-gray-200">Moisture Level</span>
                                  <span className="text-sm font-medium text-white">{field.moistureLevel}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <motion.div 
                                    className={`h-2 rounded-full ${
                                      field.status === 'optimal' ? 'bg-emerald-500' : 
                                      field.status === 'low' ? 'bg-amber-500' : 
                                      field.status === 'critical' ? 'bg-red-500' : 
                                      'bg-blue-500'
                                    }`}
                                    style={{ width: `${field.moistureLevel}%` }}
                                    animate={field.status === 'irrigating' ? { opacity: [0.7, 1, 0.7] } : {}}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                  />
                                </div>
                              </div>
                              
                              <div className="text-xs text-gray-300 mt-4">
                                Last irrigated: {field.lastIrrigated}
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              {field.status === 'irrigating' ? (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    stopIrrigation();
                                  }}
                                  className="w-full py-2 px-4 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600"
                                >
                                  Stop Irrigation ({activeIrrigation?.timeRemaining}s)
                                </motion.button>
                              ) : (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startIrrigation(field.id);
                                  }}
                                  disabled={['irrigating', 'critical', 'low', 'optimal'].includes(field.status)}
                                  className={`w-full py-2 px-4 ${
                                    field.status === 'optimal' ? 'bg-emerald-500 hover:bg-emerald-600' : 
                                    field.status === 'low' ? 'bg-amber-500 hover:bg-amber-600' : 
                                    'bg-red-500 hover:bg-red-600 animate-pulse'
                                  } text-white text-sm font-medium rounded-md`}
                                >
                                  {field.status === 'critical' ? 'Irrigate Now!' : 'Start Irrigation'}
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Field Details */}
                <AnimatePresence>
                  {selectedField && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mb-8 overflow-hidden"
                    >
                      {(() => {
                        const field = fields.find(f => f.id === selectedField);
                        if (!field) return null;
                        
                        return (
                          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-xl font-bold text-gray-900">
                                {field.name} Details
                              </h3>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedField(null)}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                <X className="h-5 w-5" />
                              </motion.button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="md:col-span-2 space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-1">Crop Information</h4>
                                  <p className="text-base text-gray-900">{field.crop} grown on {field.area}</p>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-1">Irrigation Schedule</h4>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                    <p className="text-sm text-gray-900">
                                      Next scheduled: {
                                        schedules.find(s => s.fieldId === field.id && s.status === 'pending')
                                          ? schedules.find(s => s.fieldId === field.id && s.status === 'pending')?.time
                                          : 'No scheduled irrigation'
                                      }
                                    </p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-2">Irrigation History</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                      <div className="w-12 text-gray-500">Today</div>
                                      <div className="ml-2 flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '25%' }}></div>
                                      </div>
                                      <div className="ml-2 text-gray-500">25 min</div>
                                    </div>
                                    <div className="flex items-center text-sm">
                                      <div className="w-12 text-gray-500">Week</div>
                                      <div className="ml-2 flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '65%' }}></div>
                                      </div>
                                      <div className="ml-2 text-gray-500">3.2 hrs</div>
                                    </div>
                                    <div className="flex items-center text-sm">
                                      <div className="w-12 text-gray-500">Month</div>
                                      <div className="ml-2 flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }}></div>
                                      </div>
                                      <div className="ml-2 text-gray-500">12.5 hrs</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-2">Suggested Irrigation</h4>
                                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                    <p className="text-sm text-gray-900 mb-2">
                                      Based on {field.crop} requirements:
                                    </p>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                      <li className="flex items-center">
                                        <Check className="h-4 w-4 text-emerald-500 mr-1" />
                                        Every {cropSuggestions[field.crop]?.interval} days
                                      </li>
                                      <li className="flex items-center">
                                        <Check className="h-4 w-4 text-emerald-500 mr-1" />
                                        {cropSuggestions[field.crop]?.amount} minutes per session
                                      </li>
                                      <li className="flex items-center">
                                        <Check className="h-4 w-4 text-emerald-500 mr-1" />
                                        Preferably in the {cropSuggestions[field.crop]?.time}
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-2">Actions</h4>
                                  <div className="space-y-2">
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      className="w-full py-2 px-4 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                                    >
                                      Schedule Irrigation
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      className="w-full py-2 px-4 bg-white text-indigo-600 text-sm font-medium rounded-md hover:bg-indigo-50 border border-indigo-200"
                                    >
                                      View Complete History
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Weather Section */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Weather Forecast</h2>
                    <p className="text-sm text-gray-500">
                      Current condition: <span className="font-medium capitalize">{weather.condition}</span>
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {weather.forecast.map((day, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className={`bg-white p-4 rounded-lg shadow-sm border ${
                          index === 0 ? 'border-blue-200' : 'border-gray-100'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <p className="text-sm font-medium text-gray-900 mb-2">{day.day}</p>
                          {day.condition === 'sunny' && <Sun className="h-8 w-8 text-amber-500 mb-2" />}
                          {day.condition === 'cloudy' && <CloudSnowIcon className="h-8 w-8 text-gray-500 mb-2" />}
                          {day.condition === 'rainy' && <CloudRain className="h-8 w-8 text-blue-500 mb-2" />}
                          {day.condition === 'stormy' && <ZapIcon className="h-8 w-8 text-purple-500 mb-2" />}
                          <div className="flex justify-between w-full text-sm text-gray-700 mb-1">
                            <span>{day.temperature[0]}°</span>
                            <span className="font-medium">{day.temperature[1]}°</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1 mb-2">
                            <div
                              className={`h-1 rounded-full ${
                                day.condition === 'sunny' ? 'bg-amber-500' :
                                day.condition === 'cloudy' ? 'bg-gray-500' :
                                day.condition === 'rainy' ? 'bg-blue-500' :
                                'bg-purple-500'
                              }`}
                              style={{ width: `${(day.temperature[1] - 15) * 5}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <CloudRain className="h-3 w-3 mr-1" />
                            {day.precipitation}%
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Smart Recommendations */}
                <div className="bg-gradient-to-br from-emerald-50 to-indigo-50 rounded-xl p-6 border border-emerald-100 mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Smart Recommendations</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start">
                        <div className="rounded-full bg-emerald-100 p-2 mr-3">
                          <Droplets className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Water Conservation</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Rain is forecasted for Wednesday. Consider postponing scheduled irrigation for South Field to save water.
                          </p>
                          <div className="mt-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                            >
                              Adjust Schedule
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start">
                        <div className="rounded-full bg-amber-100 p-2 mr-3">
                          <Sun className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Heat Wave Alert</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Temperature will reach 30°C in the next three days. Consider increasing irrigation frequency for North Field (Coffee).
                          </p>
                          <div className="mt-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-xs font-medium text-amber-600 hover:text-amber-700"
                            >
                              Create Heat Protocol
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-5 rounded-xl shadow-md">
                    <h3 className="font-medium text-gray-900 mb-4">Water Usage This Week</h3>
                    <div className="h-64">
                      <Line data={waterUsageData} options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: false,
                            min: 2000,
                            grid: {
                              color: 'rgba(0, 0, 0, 0.05)'
                            }
                          },
                          x: {
                            grid: {
                              display: false
                            }
                          }
                        }
                      }} />
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Total: <span className="font-medium">22,400 gallons</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center"
                      >
                        View Details <ChevronRight className="h-4 w-4 ml-1" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-xl shadow-md">
                    <h3 className="font-medium text-gray-900 mb-4">Irrigation Efficiency</h3>
                    <div className="h-64">
                      <Line data={efficiencyData} options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: false,
                            min: 50,
                            max: 100,
                            grid: {
                              color: 'rgba(0, 0, 0, 0.05)'
                            }
                          },
                          x: {
                            grid: {
                              display: false
                            }
                          }
                        }
                      }} />
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Avg. Efficiency: <span className="font-medium">84%</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center"
                      >
                        Optimize <Settings className="h-4 w-4 ml-1" />
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 mb-8">
                  <div className="bg-white p-5 rounded-xl shadow-md">
                    <h3 className="font-medium text-gray-900 mb-4">Field Comparison</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Water Used</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moisture Trend</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {fields.map((field) => (
                            <tr key={field.id}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="text-sm font-medium text-gray-900">{field.name}</div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {Math.floor(Math.random() * 1000) + 1000} gallons
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="text-sm text-gray-900 mr-2">
                                    {Math.floor(Math.random() * 15) + 75}%
                                  </div>
                                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ 
                                      width: `${Math.floor(Math.random() * 15) + 75}%` 
                                    }}></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center space-x-1">
                                  {Array.from({ length: 7 }).map((_, i) => (
                                    <div 
                                      key={i} 
                                      className={`w-1 rounded-sm ${
                                        Math.random() > 0.5 ? 'bg-emerald-500' : 'bg-amber-500'
                                      }`} 
                                      style={{ height: `${Math.floor(Math.random() * 12) + 4}px` }}
                                    ></div>
                                  ))}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${field.status === 'optimal' ? 'bg-emerald-100 text-emerald-800' : 
                                    field.status === 'low' ? 'bg-amber-100 text-amber-800' : 
                                    field.status === 'critical' ? 'bg-red-100 text-red-800' : 
                                    'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {field.status.charAt(0).toUpperCase() + field.status.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-5 rounded-xl shadow-md">
                    <h3 className="font-medium text-gray-900 mb-4">Water Conservation</h3>
                    <div className="flex justify-center mb-4">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="3"
                            strokeDasharray="75, 100"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                          <div className="text-2xl font-bold text-gray-900">25%</div>
                          <div className="text-xs text-gray-500">Saved</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Saved 3,450 gallons this month compared to previous month
                    </p>
                  </div>
                  
                  <div className="bg-white p-5 rounded-xl shadow-md">
                    <h3 className="font-medium text-gray-900 mb-4">System Status</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Sprinklers</span>
                          <span className="text-emerald-600 font-medium">Online</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Sensors</span>
                          <span className="text-emerald-600 font-medium">Online</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Water Pressure</span>
                          <span className="text-amber-600 font-medium">Medium</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-xl shadow-md">
                    <h3 className="font-medium text-gray-900 mb-4">Next Maintenance</h3>
                    <div className="flex items-center justify-center h-24 mb-2">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-indigo-600">12</div>
                        <div className="text-sm text-gray-500">Days Left</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 text-center">
                      Scheduled for: <span className="font-medium">April 21, 2025</span>
                    </div>
                    <div className="mt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-2 px-4 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'schedules' && (
              <motion.div
                key="schedules"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Irrigation Schedule</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Plan and automate your irrigation routines
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
                  >
                    + New Schedule
                  </motion.button>
                </div>
                
                <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex flex-col">
                      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                          <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Field
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Duration
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {schedules.map((schedule, index) => (
                                  <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8 rounded-md bg-cover bg-center" 
                                          style={{ 
                                            backgroundImage: fields.find(f => f.id === schedule.fieldId)?.image 
                                          }}
                                        ></div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">
                                            {fields.find(f => f.id === schedule.fieldId)?.name}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            {fields.find(f => f.id === schedule.fieldId)?.crop}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">{schedule.time}</div>
                                      <div className="text-sm text-gray-500">Daily</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">{schedule.duration} min</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${schedule.status === 'pending' ? 'bg-blue-100 text-blue-800' : 
                                          schedule.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 
                                          'bg-gray-100 text-gray-800'
                                        }`}
                                      >
                                        {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                      <div className="flex space-x-2">
                                        {schedule.status === 'pending' && (
                                          <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleScheduledIrrigation(index)}
                                            className="text-emerald-600 hover:text-emerald-900"
                                          >
                                            Start Now
                                          </motion.button>
                                        )}
                                        <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                          className="text-indigo-600 hover:text-indigo-900"
                                        >
                                          Edit
                                        </motion.button>
                                        <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                          className="text-red-600 hover:text-red-900"
                                        >
                                          Delete
                                        </motion.button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Create Smart Schedule
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="field" className="block text-sm font-medium text-gray-700 mb-1">
                            Select Field
                          </label>
                          <select
                            id="field"
                            name="field"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                          >
                            {fields.map(field => (
                              <option key={field.id} value={field.id}>
                                {field.name} ({field.crop})
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                              Time
                            </label>
                            <input
                              type="time"
                              id="time"
                              name="time"
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                              defaultValue="06:00"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                              Duration (minutes)
                            </label>
                            <input
                              type="number"
                              id="duration"
                              name="duration"
                              min="5"
                              max="120"
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                              defaultValue="30"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="repeat" className="block text-sm font-medium text-gray-700 mb-1">
                            Repeat
                          </label>
                          <select
                            id="repeat"
                            name="repeat"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                          >
                            <option>Daily</option>
                            <option>Every 2 days</option>
                            <option>Every 3 days</option>
                            <option>Weekly</option>
                            <option>Custom</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            id="weather-adaptive"
                            name="weather-adaptive"
                            type="checkbox"
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label htmlFor="weather-adaptive" className="ml-2 block text-sm text-gray-700">
                            Weather-adaptive (skip when rain is forecasted)
                          </label>
                        </div>
                        
                        <div className="flex justify-end">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
                          >
                            Create Schedule
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Crop-Based Recommendations
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="crop-type" className="block text-sm font-medium text-gray-700 mb-1">
                            Select Crop Type
                          </label>
                          <select
                            id="crop-type"
                            name="crop-type"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="Coffee">Coffee</option>
                            <option value="Corn">Corn</option>
                            <option value="Wheat">Wheat</option>
                            <option value="Vegetables">Vegetables</option>
                            <option value="Soybeans">Soybeans</option>
                            <option value="Cotton">Cotton</option>
                          </select>
                        </div>
                        
                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <h4 className="font-medium text-indigo-900 mb-2">Recommended Irrigation Plan</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-indigo-700">Frequency:</span>
                              <span className="text-sm font-medium text-indigo-900">Every 2 days</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-indigo-700">Duration:</span>
                              <span className="text-sm font-medium text-indigo-900">30 minutes</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-indigo-700">Best time:</span>
                              <span className="text-sm font-medium text-indigo-900">Early morning</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-indigo-700">Water amount:</span>
                              <span className="text-sm font-medium text-indigo-900">1.2 inches/week</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-emerald-50 p-4 rounded-lg">
                          <h4 className="font-medium text-emerald-900 mb-2">Growth Stage Adjustments</h4>
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Droplets className="h-4 w-4 text-emerald-600 mr-1" />
                              <span className="text-sm text-emerald-800">Initial Stage: +20% water</span>
                            </div>
                            <div className="flex items-center">
                              <Droplets className="h-4 w-4 text-emerald-600 mr-1" />
                              <span className="text-sm text-emerald-800">Mid Season: Standard amount</span>
                            </div>
                            <div className="flex items-center">
                              <Droplets className="h-4 w-4 text-emerald-600 mr-1" />
                              <span className="text-sm text-emerald-800">Late Season: -15% water</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            Apply to Fields
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      System Configuration
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="system-mode" className="block text-sm font-medium text-gray-700 mb-1">
                            Operation Mode
                          </label>
                          <select
                            id="system-mode"
                            name="system-mode"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                          >
                            <option>Automatic</option>
                            <option>Manual Only</option>
                            <option>Scheduled Only</option>
                            <option>Weather Adaptive</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="threshold-critical" className="block text-sm font-medium text-gray-700 mb-1">
                            Critical Moisture Threshold (%)
                          </label>
                          <input
                            type="number"
                            id="threshold-critical"
                            name="threshold-critical"
                            min="10"
                            max="40"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            defaultValue="30"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="threshold-low" className="block text-sm font-medium text-gray-700 mb-1">
                            Low Moisture Threshold (%)
                          </label>
                          <input
                            type="number"
                            id="threshold-low"
                            name="threshold-low"
                            min="30"
                            max="60"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            defaultValue="45"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              id="auto-irrigation"
                              name="auto-irrigation"
                              type="checkbox"
                              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                              defaultChecked
                            />
                            <label htmlFor="auto-irrigation" className="ml-2 block text-sm text-gray-700">
                              Automatic Irrigation
                            </label>
                          </div>
                          <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800">
                            Enabled
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              id="weather-integration"
                              name="weather-integration"
                              type="checkbox"
                              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                              defaultChecked
                            />
                            <label htmlFor="weather-integration" className="ml-2 block text-sm text-gray-700">
                              Weather Integration
                            </label>
                          </div>
                          <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800">
                            Enabled
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              id="alert-notifications"
                              name="alert-notifications"
                              type="checkbox"
                              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                              defaultChecked
                            />
                            <label htmlFor="alert-notifications" className="ml-2 block text-sm text-gray-700">
                              Alert Notifications
                            </label>
                          </div>
                          <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800">
                            Enabled
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              id="water-conservation"
                              name="water-conservation"
                              type="checkbox"
                              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                              defaultChecked
                            />
                            <label htmlFor="water-conservation" className="ml-2 block text-sm text-gray-700">
                              Water Conservation Mode
                            </label>
                          </div>
                          <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800">
                            Enabled
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-5 border-t border-gray-200">
                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3"
                        >
                          Reset to Defaults
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                        >
                          Save Settings
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Data Backup & Export
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Backup
                          </label>
                          <div className="text-sm text-gray-500">
                            April 7, 2025 at 10:23 AM
                          </div>
                        </div>
                        
                        <div className="flex space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Backup Now
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Export Data (CSV)
                          </motion.button>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Export History</h4>
                          <ul className="space-y-2">
                            <li className="text-xs text-gray-500">
                              Irrigation Data - Apr 5, 2025
                            </li>
                            <li className="text-xs text-gray-500">
                              System Settings - Mar 28, 2025
                            </li>
                            <li className="text-xs text-gray-500">
                              Field Reports - Mar 15, 2025
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Notification Settings
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">Critical Moisture Alerts</h4>
                            <p className="text-xs text-gray-500">
                              Receive alerts when moisture drops below critical level
                            </p>
                          </div>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input 
                              type="checkbox" 
                              id="toggle-critical" 
                              className="sr-only" 
                              defaultChecked 
                            />
                            <label 
                              htmlFor="toggle-critical" 
                              className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            >
                              <span className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in transform translate-x-0"></span>
                              <span className="dot-checked absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in transform translate-x-4"></span>
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">System Status Notifications</h4>
                            <p className="text-xs text-gray-500">
                              Updates on system status changes
                            </p>
                          </div>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input 
                              type="checkbox" 
                              id="toggle-system" 
                              className="sr-only" 
                              defaultChecked 
                            />
                            <label 
                              htmlFor="toggle-system" 
                              className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            >
                              <span className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in transform translate-x-0"></span>
                              <span className="dot-checked absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in transform translate-x-4"></span>
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">Weather Alerts</h4>
                            <p className="text-xs text-gray-500">
                              Notifications about significant weather changes
                            </p>
                          </div>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input 
                              type="checkbox" 
                              id="toggle-weather" 
                              className="sr-only" 
                              defaultChecked 
                            />
                            <label 
                              htmlFor="toggle-weather" 
                              className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            >
                              <span className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in transform translate-x-0"></span>
                              <span className="dot-checked absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in transform translate-x-4"></span>
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">Schedule Reminders</h4>
                            <p className="text-xs text-gray-500">
                              Reminders about upcoming irrigation events
                            </p>
                          </div>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input 
                              type="checkbox" 
                              id="toggle-schedule" 
                              className="sr-only" 
                              defaultChecked 
                            />
                            <label 
                              htmlFor="toggle-schedule" 
                              className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            >
                              <span className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in transform translate-x-0"></span>
                              <span className="dot-checked absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in transform translate-x-4"></span>
                            </label>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Notification Method</h4>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input
                                id="email-notify"
                                name="notification-method"
                                type="radio"
                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                defaultChecked
                              />
                              <label htmlFor="email-notify" className="ml-2 block text-sm text-gray-700">
                                Email
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="push-notify"
                                name="notification-method"
                                type="radio"
                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                              />
                              <label htmlFor="push-notify" className="ml-2 block text-sm text-gray-700">
                                Push Notification
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="both-notify"
                                name="notification-method"
                                type="radio"
                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                              />
                              <label htmlFor="both-notify" className="ml-2 block text-sm text-gray-700">
                                Both
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      
      {/* Active Irrigation Overlay */}
      <AnimatePresence>
        {activeIrrigation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg shadow-xl p-4 max-w-sm"
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <h3 className="font-medium">Irrigating {fields.find(f => f.id === activeIrrigation.fieldId)?.name}</h3>
                  <div className="mt-1 text-sm text-white/90">
                    Water flowing at optimal pressure
                  </div>
                  <div className="mt-2 w-full bg-white/30 h-1.5 rounded-full">
                    <motion.div
                      className="bg-white h-full rounded-full"
                      style={{ 
                        width: `${((30 - activeIrrigation.timeRemaining) / 30) * 100}%` 
                      }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-sm">
                    <span>
                      <Clock className="h-3.5 w-3.5 inline mr-1" />
                      {activeIrrigation.timeRemaining}s remaining
                    </span>
                    <span>
                      <Droplets className="h-3.5 w-3.5 inline mr-1" />
                      {Math.floor(((30 - activeIrrigation.timeRemaining) / 30) * 100)}% complete
                    </span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={stopIrrigation}
                  className="ml-4 text-white/80 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Alert Modal */}
      <AnimatePresence>
        {modal && modal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-xl"
            >
              <div className="bg-red-50 p-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Critical Moisture Alert
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {modal.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => startIrrigation(modal.fieldId, 30)}
                >
                  Start Irrigation
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setModal(null)}
                >
                  Dismiss
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Audio for irrigation sound */}
      <audio ref={irrigationSoundRef} src="/sounds/irrigation.mp3" loop preload="auto" />
    </div>
  );
};

export default IrrigationPage;