'use client'

import { useState, useEffect, useRef} from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  SunMedium, 
  Cloud, 
  CloudRain, 
  Droplets, 
  Wind,
  Tractor,
  Activity,
  CalendarDays,
  TrendingUp,
  AlertOctagon,
  ChevronRight,
  Bell,
  RefreshCw,
  MoreHorizontal,
  PlusCircle,
  Check,
  X,
  Search,
  Thermometer,
  CloudDrizzle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  MessageSquare,
  Settings,
  Wheat,
  Clock,
  TractorIcon
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import "../../sass/fonts.scss";
import { getStoredUser, isAuthenticated } from '../../services/authService';

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
import Sidebar from '../../components/Sidebar';

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

// Types for our data models
interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  humidity: number;
  windSpeed: number;
  precipitation: number;
  forecast: Array<{
    day: string;
    temperature: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  }>;
}

interface CropData {
  id: string;
  name: string;
  type: string;
  field: string;
  plantedDate: string;
  harvestDate: string;
  status: 'healthy' | 'warning' | 'danger';
  progress: number;
  image: string;
  moistureLevel: number;
  issueCount?: number;
}

interface TaskData {
  id: string;
  title: string;
  date: string;
  type: 'planting' | 'irrigation' | 'fertilizing' | 'harvesting' | 'maintenance';
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface NotificationData {
  id: string;
  message: string;
  type: 'alert' | 'info' | 'success';
  time: string;
  read: boolean;
}

interface IrrigationZone {
  id: string;
  name: string;
  status: 'active' | 'scheduled' | 'inactive';
  moistureLevel: number;
  schedule: string;
  lastIrrigated: string;
}

// Sample data - in a real app, this would come from API calls
const weatherData: WeatherData = {
  temperature: 28,
  condition: 'sunny',
  humidity: 45,
  windSpeed: 12,
  precipitation: 0,
  forecast: [
    { day: 'Mon', temperature: 28, condition: 'sunny' },
    { day: 'Tue', temperature: 27, condition: 'cloudy' },
    { day: 'Wed', temperature: 24, condition: 'rainy' },
    { day: 'Thu', temperature: 26, condition: 'cloudy' },
    { day: 'Fri', temperature: 29, condition: 'sunny' },
  ]
};

const crops: CropData[] = [
  {
    id: '1',
    name: 'Winter Wheat',
    type: 'Grain',
    field: 'North Field',
    plantedDate: '2025-01-15',
    harvestDate: '2025-06-20',
    status: 'healthy',
    progress: 68,
    image: '/assets/wheat.jpg',
    moistureLevel: 72
  },
  {
    id: '2',
    name: 'Sweet Corn',
    type: 'Vegetable',
    field: 'East Field',
    plantedDate: '2025-03-10',
    harvestDate: '2025-07-15',
    status: 'warning',
    progress: 42,
    image: '/assets/sweet.jpeg',
    moistureLevel: 58,
    issueCount: 2
  },
  {
    id: '3',
    name: 'Soybeans',
    type: 'Legume',
    field: 'South Field',
    plantedDate: '2025-02-20',
    harvestDate: '2025-09-10',
    status: 'healthy',
    progress: 55,
    image: '/assets/soy.jpeg',
    moistureLevel: 65
  },
  {
    id: '4',
    name: 'Tomatoes',
    type: 'Vegetable',
    field: 'Greenhouse 2',
    plantedDate: '2025-03-01',
    harvestDate: '2025-06-01',
    status: 'danger',
    progress: 60,
    image: '/assets/tomatoes.jpeg',
    moistureLevel: 48,
    issueCount: 4
  }
];

const upcomingTasks: TaskData[] = [
  {
    id: '1',
    title: 'Apply Fertilizer to North Field',
    date: '2025-04-10',
    type: 'fertilizing',
    completed: false,
    priority: 'high'
  },
  {
    id: '2',
    title: 'Inspect Irrigation System',
    date: '2025-04-11',
    type: 'maintenance',
    completed: false,
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Plant Sunflowers in West Field',
    date: '2025-04-15',
    type: 'planting',
    completed: false,
    priority: 'high'
  },
  {
    id: '4',
    title: 'Harvest Early Tomatoes',
    date: '2025-04-20',
    type: 'harvesting',
    completed: false,
    priority: 'medium'
  }
];

const notifications: NotificationData[] = [
  {
    id: '1',
    message: 'Low moisture detected in East Field',
    type: 'alert',
    time: '2 hours ago',
    read: false
  },
  {
    id: '2',
    message: 'Tomato crop health declining',
    type: 'alert',
    time: '4 hours ago',
    read: false
  },
  {
    id: '3',
    message: 'Irrigation completed for North Field',
    type: 'success',
    time: 'Yesterday',
    read: true
  },
  {
    id: '4',
    message: 'Weather alert: Heavy rain expected tomorrow',
    type: 'info',
    time: 'Yesterday',
    read: true
  }
];

const irrigationZones: IrrigationZone[] = [
  {
    id: '1',
    name: 'North Field',
    status: 'active',
    moistureLevel: 72,
    schedule: 'Daily, 6:00 AM',
    lastIrrigated: '2025-04-08 06:00 AM'
  },
  {
    id: '2',
    name: 'East Field',
    status: 'scheduled',
    moistureLevel: 58,
    schedule: 'Every 2 days, 5:30 AM',
    lastIrrigated: '2025-04-07 05:30 AM'
  },
  {
    id: '3',
    name: 'South Field',
    status: 'inactive',
    moistureLevel: 65,
    schedule: 'As needed',
    lastIrrigated: '2025-04-05 06:00 AM'
  },
  {
    id: '4',
    name: 'Greenhouse 2',
    status: 'scheduled',
    moistureLevel: 48,
    schedule: 'Daily, 7:00 AM',
    lastIrrigated: '2025-04-08 07:00 AM'
  }
];

// Helper component for rendering the weather icon
const WeatherIcon = ({ condition }: { condition: WeatherData['condition'] }) => {
  switch (condition) {
    case 'sunny':
      return <SunMedium className="text-amber-500" size={28} />;
    case 'cloudy':
      return <Cloud className="text-gray-500" size={28} />;
    case 'rainy':
      return <CloudRain className="text-blue-500" size={28} />;
    case 'stormy':
      return <CloudDrizzle className="text-blue-700" size={28} />;
    default:
      return <SunMedium className="text-amber-500" size={28} />;
  }
};

// Helper function to get task priority style
const getTaskPriorityStyle = (priority: TaskData['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-amber-100 text-amber-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper function to get task type icon
const getTaskTypeIcon = (type: TaskData['type']) => {
  switch (type) {
    case 'planting':
      return <TractorIcon size={16} className="text-green-500" />;
    case 'irrigation':
      return <Droplets size={16} className="text-blue-500" />;
    case 'fertilizing':
      return <Wheat size={16} className="text-amber-500" />;
    case 'harvesting':
      return <Tractor size={16} className="text-emerald-500" />;
    case 'maintenance':
      return <Settings size={16} className="text-gray-500" />;
    default:
      return <Tractor size={16} className="text-green-500" />;
  }
};

// Helper function to get notification type style
const getNotificationTypeStyle = (type: NotificationData['type']) => {
  switch (type) {
    case 'alert':
      return 'bg-red-100 text-red-800';
    case 'info':
      return 'bg-blue-100 text-blue-800';
    case 'success':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper function to get irrigation status style
const getIrrigationStatusStyle = (status: IrrigationZone['status']) => {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-800';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function Dashboard() {
  // State for handling interactive elements
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'crops' | 'irrigation'>('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [cropViewMode, setCropViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState<NotificationData[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userWeather, setUserWeather] = useState(weatherData);
  const [cropData, setCropData] = useState(crops);
  const [taskList, setTaskList] = useState(upcomingTasks);
  const [irrigationData, setIrrigationData] = useState(irrigationZones);
  const [activeIrrigation, setActiveIrrigation] = useState<string[]>([irrigationZones[0].id]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

//   let displayName = 'Farmer';
  
// if (user && user.username) {
//   displayName = user.username;
// }

  // Calculate the appropriate greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  // Filter unread notifications
  useEffect(() => {
    setUnreadNotifications(notifications.filter(n => !n.read));
  }, []);

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);
    
    // Also add authentication check if needed
    if (!isAuthenticated()) {
      // Handle unauthenticated state
    }
  }, []);

  // Handle outside click for notifications dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle outside click for modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    }
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  // Simulate fetching fresh data
  const refreshData = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      // Randomly update some data to simulate changes
      const updatedCrops = [...cropData];
      updatedCrops.forEach(crop => {
        crop.moistureLevel = Math.max(35, Math.min(90, crop.moistureLevel + Math.floor(Math.random() * 10) - 5));
        crop.progress = Math.min(100, crop.progress + (Math.random() > 0.7 ? 1 : 0));
      });
      
      setCropData(updatedCrops);
      setIsRefreshing(false);
    }, 1500);
  };

  // Toggle irrigation zone status
  const toggleIrrigation = (zoneId: string) => {
    // Clone current state
    const updatedZones = [...irrigationData];
    const zoneIndex = updatedZones.findIndex(zone => zone.id === zoneId);
    
    if (zoneIndex >= 0) {
      // Update status
      if (updatedZones[zoneIndex].status === 'active') {
        updatedZones[zoneIndex].status = 'inactive';
        setActiveIrrigation(activeIrrigation.filter(id => id !== zoneId));
      } else {
        updatedZones[zoneIndex].status = 'active';
        updatedZones[zoneIndex].lastIrrigated = new Date().toLocaleString();
        setActiveIrrigation([...activeIrrigation, zoneId]);
      }
      
      setIrrigationData(updatedZones);
    }
  };

  // Complete a task
  const completeTask = (taskId: string) => {
    setTaskList(taskList.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
  };

  // Add a new task
  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: TaskData = {
        id: `task-${Date.now()}`,
        title: newTaskTitle,
        date: new Date().toISOString().split('T')[0],
        type: 'maintenance',
        completed: false,
        priority: 'medium'
      };
      
      setTaskList([...taskList, newTask]);
      setNewTaskTitle('');
      setShowAddTask(false);
    }
  };

  // Open modal with crop details
  const openCropDetails = (crop: CropData) => {
    setSelectedCrop(crop);
    setIsModalOpen(true);
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setUnreadNotifications([]);
  };

  // Chart configurations
  const moistureChartData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Average Moisture',
        data: [65, 60, 80, 75, 56, 55, 72],
        fill: true,
        backgroundColor: 'rgba(34, 211, 238, 0.2)',
        borderColor: 'rgb(34, 211, 238)',
        tension: 0.4
      },
      {
        label: 'Ideal Range',
        data: [70, 70, 70, 70, 70, 70, 70],
        fill: false,
        borderColor: 'rgba(16, 185, 129, 0.5)',
        borderDashed: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        tension: 0
      }
    ]
  };

  const yieldChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Projected Yield',
        data: [12, 19, 16, 14, 22, 28],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      }
    ]
  };

  const cropDistributionData = {
    labels: ['Wheat', 'Corn', 'Soybeans', 'Tomatoes', 'Others'],
    datasets: [
      {
        data: [35, 25, 20, 10, 10],
        backgroundColor: [
          'rgba(255, 206, 86, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Component (imported) */}
      <Sidebar />
      
      {/* Main Content */}
      <div 
        className="flex-1"
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button className="p-2 rounded-md hover:bg-gray-100 lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">Dashboard</h1>
              
              {/* Search bar */}
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Refresh Button */}
              <button 
                onClick={refreshData}
                className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isRefreshing}
              >
                <RefreshCw size={20} className={`${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
              
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-gray-100 rounded-full relative transition-colors"
                >
                  <Bell size={20} />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-200 p-4">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      <button 
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-emerald-600 hover:text-emerald-800"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No notifications
                        </div>
                      ) : (
                        <div>
                          {notifications.map(notification => (
                            <div 
                              key={notification.id}
                              className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-emerald-50' : ''}`}
                            >
                              <div className="flex gap-3">
                                <div className={`p-2 rounded-full ${getNotificationTypeStyle(notification.type)} bg-opacity-20`}>
                                  {notification.type === 'alert' && <AlertOctagon size={16} />}
                                  {notification.type === 'info' && <MessageSquare size={16} />}
                                  {notification.type === 'success' && <CheckCircle size={16} />}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-800 font-medium">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="p-3 text-center border-t border-gray-200">
                      <button className="text-sm text-emerald-600 hover:text-emerald-800 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User profile */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold">
                  {/* get initials of user from username */}
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'G'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">{user?.username || 'Guest User'}</p>
                  <p className="text-xs text-gray-500">Farmer</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sub-navigation */}
          <div className="px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'overview'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('crops')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'crops'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Crops
              </button>
              <button
                onClick={() => setActiveTab('irrigation')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'irrigation'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Irrigation
              </button>
            </nav>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Welcome Banner with Farm Image Background */}
          <div className="relative rounded-xl overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-800 to-transparent z-10"></div>
            <div className="absolute inset-0 overflow-hidden">
              {/* Farm image with subtle zoom animation */}
              <motion.div
                animate={{ scale: 1.05 }}
                transition={{ 
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 20
                }}
                className="w-full h-full"
              >
                <Image
                  src="/assets/farm6.jpg"
                  alt="Farm landscape"
                  layout="fill"
                  objectFit="cover"
                  quality={90}
                />
              </motion.div>
            </div>
            <div className="relative z-20 p-6 md:p-8 text-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
          {greeting},{user?.username}
        </h2>
                  <p className="text-emerald-100 text-sm md:text-base max-w-lg">
                    Your crops are doing well today. There are 2 tasks that require your attention.
                  </p>
                </div>
                
                {/* Quick weather overview */}
                <div className="bg-emerald-300/20 bg-opacity-10 backdrop-blur-sm rounded-lg p-4 shadow">
                  <div className="flex items-center gap-4">
                    <WeatherIcon condition={userWeather.condition} />
                    <div>
                      <div className="flex items-end">
                        <span className="text-3xl font-bold">{userWeather.temperature}°</span>
                        <span className="text-emerald-100 ml-1">C</span>
                      </div>
                      <p className="text-emerald-100 text-sm capitalize">{userWeather.condition}</p>
                    </div>
                    <div className="border-l border-white border-opacity-20 pl-4">
                      <div className="flex items-center gap-1 mb-1">
                        <Droplets size={14} className="text-blue-300" />
                        <span className="text-sm">{userWeather.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wind size={14} className="text-blue-300" />
                        <span className="text-sm">{userWeather.windSpeed} km/h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dashboard Content based on active tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Farm Health Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Farm Health</p>
                      <h3 className="text-2xl font-bold text-gray-800 mt-1">92%</h3>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Activity size={20} className="text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center mt-3">
                    <ArrowUpRight size={16} className="text-green-600 mr-1" />
                    <p className="text-xs font-medium text-green-600">+2.5% from last week</p>
                  </div>
                </div>
                
                {/* Irrigation Status Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Irrigation</p>
                      <h3 className="text-2xl font-bold text-gray-800 mt-1">60%</h3>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Droplets size={20} className="text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center mt-3">
                    <ArrowDownRight size={16} className="text-amber-600 mr-1" />
                    <p className="text-xs font-medium text-amber-600">-5% from optimal level</p>
                  </div>
                </div>
                
                {/* Upcoming Tasks Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Tasks</p>
                      <h3 className="text-2xl font-bold text-gray-800 mt-1">{taskList.filter(t => !t.completed).length}</h3>
                    </div>
                    <div className="p-3 bg-amber-100 rounded-lg">
                      <CalendarDays size={20} className="text-amber-600" />
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="text-xs text-gray-600">Today&apos;s Tasks</p>
                        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                      <p className="text-xs font-medium ml-2">25%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end mt-3">
                    <button className="text-xs font-medium text-emerald-600 flex items-center">
                      View all <ChevronRight size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
                
                {/* Yield Forecast Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Yield Forecast</p>
                      <h3 className="text-2xl font-bold text-gray-800 mt-1">76 t</h3>
                    </div>
                    <div className="p-3 bg-emerald-100 rounded-lg">
                      <TrendingUp size={20} className="text-emerald-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center">
                      <span className="text-xs text-gray-600 mr-2">Winter Wheat</span>
                      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <span className="text-xs font-medium ml-2">32 t</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="text-xs text-gray-600 mr-2">Corn</span>
                      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      <span className="text-xs font-medium ml-2">28 t</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-3">
                    <ArrowUpRight size={16} className="text-green-600 mr-1" />
                    <p className="text-xs font-medium text-green-600">+10% from last season</p>
                  </div>
                </div>
              </div>
              
              {/* Multi-column layout for dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column - Tasks & Weather */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Upcoming Tasks */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 pb-3 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">Upcoming Tasks</h3>
                        <button 
                          onClick={() => setShowAddTask(!showAddTask)}
                          className="text-xs font-medium text-emerald-600 flex items-center"
                        >
                          <PlusCircle size={16} className="mr-1" />
                          Add Task
                        </button>
                      </div>
                    </div>
                    
                    {/* Add Task Form */}
                    {showAddTask && (
                      <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="Enter task description..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                          <button
                            onClick={addTask}
                            className="px-3 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="divide-y divide-gray-100">
                      {taskList.filter(task => !task.completed).slice(0, 4).map((task) => (
                        <div key={task.id} className="px-6 py-4 hover:bg-gray-50">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => completeTask(task.id)}
                              className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border border-gray-300 hover:border-emerald-500 flex items-center justify-center"
                            >
                              <Check size={12} className="text-transparent hover:text-emerald-500" />
                            </button>
                            <div className="flex-1">
                              <p className="text-sm text-gray-800 font-medium">{task.title}</p>
                              <div className="flex items-center mt-1 gap-2">
                                <span className="flex items-center text-xs text-gray-500">
                                  <Clock size={12} className="mr-1" />
                                  {new Date(task.date).toLocaleDateString()}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${getTaskPriorityStyle(task.priority)}`}>
                                  {task.priority}
                                </span>
                                <span className="flex items-center text-xs text-gray-500">
                                  {getTaskTypeIcon(task.type)}
                                  <span className="ml-1 capitalize">{task.type}</span>
                                </span>
                              </div>
                            </div>
                            <MoreHorizontal size={16} className="text-gray-400 cursor-pointer" />
                          </div>
                        </div>
                      ))}
                      
                      {/* View all tasks link */}
                      <div className="p-4 text-center">
                        <button className="text-sm text-emerald-600 font-medium hover:text-emerald-800">
                          View all tasks
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Weather Forecast */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 pb-3 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800">Weather Forecast</h3>
                    </div>
                    
                    {/* Current weather */}
                    <div className="p-6 flex items-center justify-between border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <WeatherIcon condition={userWeather.condition} />
                        <div>
                          <div className="flex items-end">
                            <span className="text-3xl font-bold text-gray-800">{userWeather.temperature}°</span>
                            <span className="text-gray-600 ml-1">C</span>
                          </div>
                          <p className="text-gray-500 text-sm capitalize">{userWeather.condition}</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <Droplets size={14} className="text-blue-500" />
                          <span className="text-sm text-gray-600">{userWeather.humidity}% humidity</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Wind size={14} className="text-blue-500" />
                          <span className="text-sm text-gray-600">{userWeather.windSpeed} km/h wind</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 5-day forecast */}
                    <div className="grid grid-cols-5 divide-x divide-gray-100">
                      {userWeather.forecast.map((day, index) => (
                        <div key={index} className="p-3 text-center">
                          <p className="text-xs font-medium text-gray-500">{day.day}</p>
                          <div className="my-2 flex justify-center">
                            <WeatherIcon condition={day.condition} />
                          </div>
                          <p className="text-sm font-medium text-gray-800">{day.temperature}°</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Middle column - Moisture Chart & Crop Distribution */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Soil Moisture Chart */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-800">Soil Moisture Levels</h3>
                      <div className="flex items-center">
                        <select className="text-sm border-gray-300 rounded-md">
                          <option>Last 7 days</option>
                          <option>Last 30 days</option>
                          <option>Last 90 days</option>
                        </select>
                      </div>
                    </div>
                    <div className="h-80">
                      <Line 
                        data={moistureChartData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: false,
                              min: 40,
                              max: 100,
                              title: {
                                display: true,
                                text: 'Moisture (%)'
                              }
                            }
                          },
                          plugins: {
                            legend: {
                              position: 'top',
                            },
                            tooltip: {
                              mode: 'index',
                              intersect: false,
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Farm Insights - Two cards side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Crop Distribution */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Crop Distribution</h3>
                      <div className="h-64">
                        <Doughnut
                          data={cropDistributionData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'bottom',
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Projected Yield */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Projected Yield</h3>
                      <div className="h-64">
                        <Bar
                          data={yieldChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true
                              }
                            },
                            plugins: {
                              legend: {
                                display: false,
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Crop Status Cards */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Crop Status</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCropViewMode('grid')}
                      className={`p-2 rounded-md ${
                        cropViewMode === 'grid' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-400 hover:text-gray-700'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCropViewMode('list')}
                      className={`p-2 rounded-md ${
                        cropViewMode === 'list' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-400 hover:text-gray-700'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {cropViewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cropData.map((crop) => (
                      <motion.div
                        key={crop.id}
                        onClick={() => openCropDetails(crop)}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer"
                      >
                        <div className="h-40 relative">
                          <Image
                            src={crop.image}
                            alt={crop.name}
                            layout="fill"
                            objectFit="cover"
                          />
                          <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium ${
                            crop.status === 'healthy' ? 'bg-green-100 text-green-800' :
                            crop.status === 'warning' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {crop.status === 'healthy' ? 'Healthy' :
                             crop.status === 'warning' ? 'Warning' : 'Attention Required'}
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="text-lg font-semibold text-gray-800">{crop.name}</h4>
                          <p className="text-sm text-gray-500">{crop.field}</p>
                          
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Growth Progress</span>
                              <span className="font-medium">{crop.progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  crop.status === 'healthy' ? 'bg-green-500' :
                                  crop.status === 'warning' ? 'bg-amber-500' :
                                  'bg-red-500'
                                }`} 
                                style={{ width: `${crop.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <Droplets size={16} className="text-blue-500 mr-1" />
                              <span className="text-sm text-gray-600">{crop.moistureLevel}% moisture</span>
                            </div>
                            {crop.issueCount && (
                              <div className="flex items-center text-amber-600">
                                <AlertOctagon size={16} className="mr-1" />
                                <span className="text-sm font-medium">{crop.issueCount} issues</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moisture</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harvest Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {cropData.map((crop) => (
                            <tr key={crop.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openCropDetails(crop)}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0 mr-3">
                                    <Image
                                      className="h-10 w-10 rounded-md"
                                      src={crop.image}
                                      alt={crop.name}
                                      width={40}
                                      height={40}
                                      objectFit="cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{crop.name}</div>
                                    <div className="text-sm text-gray-500">{crop.type}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{crop.field}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  crop.status === 'healthy' ? 'bg-green-100 text-green-800' :
                                  crop.status === 'warning' ? 'bg-amber-100 text-amber-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {crop.status === 'healthy' ? 'Healthy' :
                                   crop.status === 'warning' ? 'Warning' : 'Attention Required'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Droplets size={16} className="text-blue-500 mr-2" />
                                  {crop.moistureLevel}%
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="w-32">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-500">Progress</span>
                                    <span className="font-medium text-gray-700">{crop.progress}%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${
                                        crop.status === 'healthy' ? 'bg-green-500' :
                                        crop.status === 'warning' ? 'bg-amber-500' :
                                        'bg-red-500'
                                      }`} 
                                      style={{ width: `${crop.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(crop.harvestDate).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-emerald-600 hover:text-emerald-900 mr-3">Edit</button>
                                <button className="text-gray-600 hover:text-gray-900">Details</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'crops' && (
            <div className="space-y-6">
              {/* Crop Management Header */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Crop Management</h2>
                    <p className="text-gray-500 mt-1">Monitor and manage all your crops in one place</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search crops..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-64"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                    
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center justify-center">
                      <PlusCircle size={16} className="mr-2" />
                      Add New Crop
                    </button>
                  </div>
                </div>
                
                {/* Filter options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                      <option>All Statuses</option>
                      <option>Healthy</option>
                      <option>Warning</option>
                      <option>Attention Required</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Field</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                      <option>All Fields</option>
                      <option>North Field</option>
                      <option>East Field</option>
                      <option>South Field</option>
                      <option>Greenhouse 2</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                      <option>Plant Date (Newest)</option>
                      <option>Plant Date (Oldest)</option>
                      <option>Harvest Date (Soonest)</option>
                      <option>Health Status</option>
                      <option>Moisture Level</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Crop Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {cropData.map((crop) => (
                  <motion.div
                    key={crop.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer"
                    onClick={() => openCropDetails(crop)}
                  >
                    <div className="h-48 relative">
                      <Image
                        src={crop.image}
                        alt={crop.name}
                        layout="fill"
                        objectFit="cover"
                      />
                      <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium ${
                        crop.status === 'healthy' ? 'bg-green-100 text-green-800' :
                        crop.status === 'warning' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {crop.status === 'healthy' ? 'Healthy' :
                         crop.status === 'warning' ? 'Warning' : 'Attention Required'}
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">{crop.name}</h4>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                          {crop.type}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-4">
                        Located in {crop.field}
                      </p>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Growth Progress</span>
                            <span className="font-medium">{crop.progress}%</span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                crop.status === 'healthy' ? 'bg-green-500' :
                                crop.status === 'warning' ? 'bg-amber-500' :
                                'bg-red-500'
                              }`} 
                              style={{ width: `${crop.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Soil Moisture</span>
                            <span className="font-medium">{crop.moistureLevel}%</span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-blue-500`} 
                              style={{ width: `${crop.moistureLevel}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-5 flex items-center justify-between text-sm">
                        <div>
                          <p className="text-gray-500">Planted</p>
                          <p className="font-medium">{new Date(crop.plantedDate).toLocaleDateString()}</p>
                        </div>
                        <div className="border-l border-gray-200 h-10"></div>
                        <div>
                          <p className="text-gray-500">Harvest</p>
                          <p className="font-medium">{new Date(crop.harvestDate).toLocaleDateString()}</p>
                        </div>
                        <div className="border-l border-gray-200 h-10"></div>
                        <button className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center">
                          Details <ChevronRight size={16} className="ml-1" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Add New Crop Card */}
                <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center p-6 h-full">
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                      <PlusCircle size={24} className="text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Add New Crop</h3>
                    <p className="text-sm text-gray-500 mb-4">Monitor a new crop from your farm</p>
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
                      Add Crop
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Recent Activities Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Crop Activities</h3>
                </div>
                
                <div className="divide-y divide-gray-100">
                  <div className="p-5 hover:bg-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Droplets size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 font-medium">Irrigation activated for East Field Corn</p>
                        <p className="text-xs text-gray-500 mt-1">Today at 10:30 AM</p>
                      </div>
                      <span className="text-xs text-gray-500">2h ago</span>
                    </div>
                  </div>
                  
                  <div className="p-5 hover:bg-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-red-100 rounded-full">
                        <AlertOctagon size={16} className="text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 font-medium">Disease detected in Greenhouse 2 Tomatoes</p>
                        <p className="text-xs text-gray-500 mt-1">Possible fungal infection identified</p>
                      </div>
                      <span className="text-xs text-gray-500">5h ago</span>
                    </div>
                  </div>
                  
                  <div className="p-5 hover:bg-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-amber-100 rounded-full">
                        <Wheat size={16} className="text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 font-medium">Fertilizer applied to North Field Wheat</p>
                        <p className="text-xs text-gray-500 mt-1">2.5 acres treated with nitrogen supplement</p>
                      </div>
                      <span className="text-xs text-gray-500">Yesterday</span>
                    </div>
                  </div>
                  
                  <div className="p-5 hover:bg-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle size={16} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 font-medium">Health check completed for all Soybeans</p>
                        <p className="text-xs text-gray-500 mt-1">All plants in excellent condition</p>
                      </div>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 text-center border-t border-gray-100">
                  <button className="text-sm text-emerald-600 font-medium hover:text-emerald-800">
                    View all activities
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'irrigation' && (
            <div className="space-y-6">
              {/* Irrigation Management Header */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Irrigation Management</h2>
                    <p className="text-gray-500 mt-1">Monitor and control your irrigation systems</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center"
                      onClick={() => {
                        // Simulate updating all irrigation zones
                        const updated = irrigationData.map(zone => ({
                          ...zone,
                          // eslint-disable-next-line @typescript-eslint/prefer-as-const
                          status: 'active' as 'active', // Explicitly type the status
                          lastIrrigated: new Date().toLocaleString()
                        }));
                        setIrrigationData(updated.map(zone => ({
                          ...zone,
                          status: zone.status as 'active' | 'scheduled' | 'inactive',
                        })));
                        setActiveIrrigation(updated.map(zone => zone.id));
                      }}
                    >
                      <Droplets size={16} className="mr-2" />
                      Activate All Zones
                    </button>
                    
                    <button 
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 flex items-center justify-center"
                      onClick={() => {
                        // Simulate stopping all irrigation zones
                        const updated = irrigationData.map(zone => ({
                          ...zone,
                          status: 'inactive'
                        }));
                        setIrrigationData(updated.map(zone => ({
                          ...zone,
                          status: zone.status as 'active' | 'scheduled' | 'inactive',
                        })));
                        setActiveIrrigation([]);
                      }}
                    >
                      <X size={16} className="mr-2" />
                      Stop All Irrigation
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Irrigation Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm text-gray-500 font-medium">Active Zones</h3>
                      <p className="text-2xl font-bold text-gray-800 mt-1">{activeIrrigation.length} / {irrigationData.length}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Droplets size={20} className="text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${(activeIrrigation.length / irrigationData.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm text-gray-500 font-medium">Water Usage Today</h3>
                      <p className="text-2xl font-bold text-gray-800 mt-1">2,450 <span className="text-sm font-normal">Liters</span></p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Droplets size={20} className="text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <ArrowUpRight size={16} className="text-green-600 mr-1" />
                    <p className="text-xs font-medium text-green-600">Optimized by 15% from schedule</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm text-gray-500 font-medium">Average Soil Moisture</h3>
                      <p className="text-2xl font-bold text-gray-800 mt-1">61%</p>
                    </div>
                    <div className="p-3 bg-amber-100 rounded-lg">
                      <Thermometer size={20} className="text-amber-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-1">Low</span>
                      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden mx-1">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: '61%' }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-1">High</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm text-gray-500 font-medium">Next Scheduled</h3>
                      <p className="text-2xl font-bold text-gray-800 mt-1">6:00 <span className="text-sm font-normal">AM</span></p>
                    </div>
                    <div className="p-3 bg-emerald-100 rounded-lg">
                      <Clock size={20} className="text-emerald-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-xs font-medium text-gray-600 mr-1">Tomorrow</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs font-medium text-gray-600 ml-1">East & South Fields</span>
                  </div>
                </div>
              </div>
              
              {/* Irrigation Zones Control */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">Irrigation Zones</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moisture Level</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Irrigated</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Controls</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {irrigationData.map((zone) => (
                        <tr key={zone.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{zone.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getIrrigationStatusStyle(zone.status)}`}>
                              {zone.status.charAt(0).toUpperCase() + zone.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-24">
                                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      zone.moistureLevel > 70 ? 'bg-green-500' :
                                      zone.moistureLevel > 50 ? 'bg-amber-500' :
                                      'bg-red-500'
                                    }`} 
                                    style={{ width: `${zone.moistureLevel}%` }}
                                  ></div>
                                </div>
                              </div>
                              <span className="text-sm text-gray-600">{zone.moistureLevel}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {zone.schedule}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {zone.lastIrrigated}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => toggleIrrigation(zone.id)}
                              className={`px-3 py-1 rounded-md text-xs font-medium ${
                                zone.status === 'active'
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              }`}
                            >
                              {zone.status === 'active' ? 'Stop' : 'Start'} Irrigation
                            </button>
                            <button className="px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 ml-2">
                              Edit Schedule
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Irrigation History Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Water Usage History</h3>
                  <div className="flex items-center">
                    <select className="text-sm border-gray-300 rounded-md">
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                    </select>
                  </div>
                </div>
                <div className="h-80">
                  <Bar
                    data={{
                      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                      datasets: [
                        {
                          label: 'Water Usage (Liters)',
                          data: [2100, 1800, 2400, 1950, 2300, 1700, 2450],
                          backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Water (Liters)'
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          display: true,
                          position: 'top',
                        }
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Irrigation Recommendations */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">Smart Recommendations</h3>
                </div>
                
                <div className="divide-y divide-gray-100">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Droplets size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 font-medium">Reduce irrigation frequency for North Field</p>
                        <p className="text-xs text-gray-500 mt-1">Soil moisture is above optimal level. Consider reducing to every other day.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                          Apply
                        </button>
                        <button className="px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
                          Ignore
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-amber-100 rounded-full">
                        <AlertOctagon size={16} className="text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 font-medium">Increase irrigation for Greenhouse 2</p>
                        <p className="text-xs text-gray-500 mt-1">Tomato plants show signs of underwatering. Consider increasing daily water allocation.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                          Apply
                        </button>
                        <button className="px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
                          Ignore
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-emerald-100 rounded-full">
                        <CheckCircle size={16} className="text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 font-medium">Optimal irrigation schedule for East Field</p>
                        <p className="text-xs text-gray-500 mt-1">Current schedule is maintaining ideal moisture levels for corn growth.</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-emerald-600">No action needed</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <CloudRain size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 font-medium">Rain forecast for tomorrow</p>
                        <p className="text-xs text-gray-500 mt-1">Consider pausing irrigation schedule for all outdoor fields tomorrow.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                          Apply
                        </button>
                        <button className="px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
                          Ignore
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Crop Details Modal */}
          {isModalOpen && selectedCrop && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
                ref={modalRef}
              >
                <div className="relative h-56">
                  <Image
                    src={selectedCrop.image}
                    alt={selectedCrop.name}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{selectedCrop.name}</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-white opacity-90">{selectedCrop.type}</span>
                          <span className="w-1 h-1 bg-white rounded-full opacity-50"></span>
                          <span className="text-sm text-white opacity-90">{selectedCrop.field}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        selectedCrop.status === 'healthy' ? 'bg-green-500 text-white' :
                        selectedCrop.status === 'warning' ? 'bg-amber-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {selectedCrop.status === 'healthy' ? 'Healthy' :
                         selectedCrop.status === 'warning' ? 'Warning' : 'Attention Required'}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Crop Details</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Growth Progress</p>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-lg font-semibold text-gray-800">{selectedCrop.progress}%</span>
                            <span className="text-sm text-gray-500">Days to harvest: {
                              Math.round((new Date(selectedCrop.harvestDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                            }</span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                selectedCrop.status === 'healthy' ? 'bg-green-500' :
                                selectedCrop.status === 'warning' ? 'bg-amber-500' :
                                'bg-red-500'
                              }`} 
                              style={{ width: `${selectedCrop.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500 mb-1">Planted On</p>
                            <p className="text-base font-semibold text-gray-800">{new Date(selectedCrop.plantedDate).toLocaleDateString()}</p>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500 mb-1">Harvest Date</p>
                            <p className="text-base font-semibold text-gray-800">{new Date(selectedCrop.harvestDate).toLocaleDateString()}</p>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500 mb-1">Soil Moisture</p>
                            <div className="flex items-center justify-between">
                              <p className="text-base font-semibold text-gray-800">{selectedCrop.moistureLevel}%</p>
                              <Droplets size={16} className="text-blue-500" />
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500 mb-1">Field Area</p>
                            <p className="text-base font-semibold text-gray-800">2.5 acres</p>
                          </div>
                        </div>
                        
                        {selectedCrop.status !== 'healthy' && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <h5 className="text-sm font-semibold text-amber-800 mb-2">Issues Detected</h5>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                <AlertOctagon size={16} className="text-amber-600 mt-0.5" />
                                <div>
                                  <p className="text-sm text-amber-800 font-medium">Low moisture levels</p>
                                  <p className="text-xs text-amber-600">Consider increasing irrigation frequency</p>
                                </div>
                              </li>
                              {selectedCrop.status === 'danger' && (
                                <li className="flex items-start gap-2">
                                  <AlertOctagon size={16} className="text-red-600 mt-0.5" />
                                  <div>
                                    <p className="text-sm text-red-800 font-medium">Possible disease detected</p>
                                    <p className="text-xs text-red-600">Early signs of fungal infection on leaves</p>
                                  </div>
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                        
                        <div>
                          <h5 className="text-sm font-semibold text-gray-800 mb-2">Crop Notes</h5>
                          <textarea 
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            rows={3}
                            placeholder="Add notes about this crop..."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right column */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Growth History</h4>
                      
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
                        <Line 
                          data={{
                            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                            datasets: [
                              {
                                label: 'Growth Rate',
                                data: [10, 25, 32, 48, 68, selectedCrop.progress],
                                fill: true,
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                borderColor: 'rgb(16, 185, 129)',
                                tension: 0.4
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            scales: {
                              y: {
                                beginAtZero: true,
                                max: 100,
                                title: {
                                  display: true,
                                  text: 'Progress (%)'
                                }
                              }
                            },
                            plugins: {
                              legend: {
                                display: false
                              }
                            }
                          }}
                          height={200}
                        />
                      </div>
                      
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h4>
                      
                      <div className="space-y-3">
                        <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                              <Droplets size={14} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-800 font-medium">Irrigation completed</p>
                              <p className="text-xs text-gray-500">Today at 8:30 AM</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-amber-100 rounded-full">
                              <Wheat size={14} className="text-amber-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-800 font-medium">Fertilizer applied</p>
                              <p className="text-xs text-gray-500">Yesterday at 10:15 AM</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-100 rounded-full">
                              <CheckCircle size={14} className="text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-800 font-medium">Health check completed</p>
                              <p className="text-xs text-gray-500">April 5, 2025 at 2:45 PM</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Recommended Actions</h4>
                      
                      {selectedCrop.status === 'healthy' ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle size={18} className="text-green-600 mt-0.5" />
                            <div>
                              <p className="text-sm text-green-800 font-medium">Crop is healthy</p>
                              <p className="text-xs text-green-600 mb-2">Continue with current maintenance schedule</p>
                              <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200">
                                View Schedule
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <Droplets size={18} className="text-blue-600 mt-0.5" />
                              <div>
                                <p className="text-sm text-amber-800 font-medium">Increase irrigation frequency</p>
                                <p className="text-xs text-amber-600 mb-2">Soil moisture levels are below optimal range</p>
                                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200">
                                  Adjust Irrigation
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {selectedCrop.status === 'danger' && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <AlertOctagon size={18} className="text-red-600 mt-0.5" />
                                <div>
                                  <p className="text-sm text-red-800 font-medium">Apply fungicide treatment</p>
                                  <p className="text-xs text-red-600 mb-2">To prevent disease spread and protect crop</p>
                                  <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">
                                    View Treatment Options
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    Close
                  </button>
                  
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200">
                      Edit Crop
                    </button>
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
                      Take Action
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}