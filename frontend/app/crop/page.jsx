'use client';

import React, { useState, useContext, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Search, RefreshCw, Bell, AlertOctagon, MessageSquare, 
  CheckCircle, Upload, Calendar, ChevronDown, Camera, 
  X, Filter, Map, Book, Share, Thermometer, ArrowRight,
  Droplet, Sun, PieChart, Leaf, AlertTriangle, Check, ZoomIn
} from 'lucide-react';
import Sidebar,{ SidebarContext } from '../../components/Sidebar';
import "../../sass/fonts.scss"
import { getStoredUser, isAuthenticated } from '../../services/authService';


// // Types
// type Notification = {
//   id: string;
//   type: 'alert' | 'info' | 'success';
//   message: string;
//   time: string;
//   read: boolean;
// };

// type Crop = {
//   id: string;
//   name: string;
//   type: string;
//   plantedDate: string;
//   field: string;
//   healthStatus: 'healthy' | 'warning' | 'danger';
//   lastChecked: string;
// };

// type Disease = {
//   id: string;
//   name: string;
//   cropTypes: string[];
//   symptoms: string[];
//   images: string[];
//   description: string;
//   treatment: string;
//   prevention: string;
// };

// type Symptom = {
//   id: string;
//   name: string;
//   category: 'leaf' | 'stem' | 'root' | 'fruit' | 'general';
// };

// type Field = {
//   id: string;
//   name: string;
//   crop: string;
//   size: string;
//   healthStatus: 'healthy' | 'warning' | 'danger';
//   location: { x: number; y: number };
// };

// type Treatment = {
//   id: string;
//   name: string;
//   date: string;
//   field: string;
//   crop: string;
//   type: string;
//   dosage: string;
//   notes: string;
//   effectivenessRating?: number;
// };

// Mock data
const cropsMock= [
  { id: '1', name: 'North Field Maize', type: 'Corn', plantedDate: '2025-02-10', field: 'North Field', healthStatus: 'healthy', lastChecked: '2025-04-02' },
  { id: '2', name: 'East Field Wheat', type: 'Wheat', plantedDate: '2025-01-15', field: 'East Field', healthStatus: 'warning', lastChecked: '2025-04-05' },
  { id: '3', name: 'South Field Soybeans', type: 'Soybean', plantedDate: '2025-03-01', field: 'South Field', healthStatus: 'healthy', lastChecked: '2025-04-07' },
  { id: '4', name: 'West Field Rice', type: 'Rice', plantedDate: '2025-02-20', field: 'West Field', healthStatus: 'danger', lastChecked: '2025-04-01' },
];

const diseasesMock = [
  {
    id: '1',
    name: 'Powdery Mildew',
    cropTypes: ['Wheat', 'Barley', 'Corn'],
    symptoms: ['White powdery spots on leaves', 'Yellowing of leaves', 'Stunted growth'],
    images: ['/assets/mildew.jpg'],
    description: 'A fungal disease that appears as white powdery spots on the leaves and stems of infected plants.',
    treatment: 'Apply fungicides specifically labeled for powdery mildew. Sulfur-based fungicides work well as a preventative measure.',
    prevention: 'Plant resistant varieties. Ensure good air circulation. Avoid overhead watering.'
  },
  {
    id: '2',
    name: 'Corn Rust',
    cropTypes: ['Corn'],
    symptoms: ['Rusty, orange pustules on leaves', 'Yellow spots around pustules', 'Early leaf death'],
    images: ['/assets/rust.jpg'],
    description: 'A fungal disease characterized by rusty, orange pustules on corn leaves, caused by Puccinia species.',
    treatment: 'Apply approved fungicides at the first sign of infection. Follow a preventative spray schedule in high-risk areas.',
    prevention: 'Plant resistant hybrids. Rotate crops. Remove infected debris after harvest.'
  },
  {
    id: '3',
    name: 'Bacterial Blight',
    cropTypes: ['Rice', 'Soybean', 'Cotton'],
    symptoms: ['Water-soaked lesions', 'Yellow margins around lesions', 'Wilting', 'Leaf curling'],
    images: ['/assets/blight.jpg'],
    description: 'A bacterial disease that causes water-soaked lesions which later turn yellow to brown.',
    treatment: 'Apply copper-based bactericides. No curative treatment exists; focus on prevention and limiting spread.',
    prevention: 'Use certified disease-free seeds. Practice crop rotation. Sanitize equipment.'
  },
  {
    id: '4',
    name: 'Soybean Cyst Nematode',
    cropTypes: ['Soybean'],
    symptoms: ['Stunted growth', 'Yellowing foliage', 'Reduced yield', 'Small, white females on roots'],
    images: ['/assets/nematode.jpg'],
    description: 'A microscopic roundworm that attacks soybean roots, causing significant yield loss.',
    treatment: 'No effective in-season treatment. Management focuses on prevention and long-term control.',
    prevention: 'Plant resistant varieties. Practice crop rotation with non-host crops. Consider nematicide seed treatments.'
  },
  {
    id: '5',
    name: 'Late Blight',
    cropTypes: ['Potato', 'Tomato'],
    symptoms: ['Dark water-soaked spots on leaves', 'White fuzzy growth on undersides', 'Blackened stems', 'Rotting tubers'],
    images: ['/assets/late-blight.jpg'],
    description: 'A devastating fungal-like disease caused by Phytophthora infestans that can destroy entire fields within days under favorable conditions.',
    treatment: 'Apply protective fungicides before infection. Switch to systemic fungicides if disease appears. Remove infected plants immediately.',
    prevention: 'Use certified disease-free seed potatoes/transplants. Space plants for good airflow. Avoid overhead irrigation.'
  },
  {
    id: '6',
    name: 'Fusarium Wilt',
    cropTypes: ['Tomato', 'Banana', 'Cotton', 'Watermelon'],
    symptoms: ['Yellowing of lower leaves', 'Wilting despite adequate moisture', 'Brown discoloration of vascular tissue', 'Stunted growth'],
    images: ['/assets/fusarium-wilt.jpg'],
    description: 'A soil-borne fungal disease that blocks water-conducting vessels in plants, causing them to wilt and eventually die.',
    treatment: 'No effective chemical control once infected. Remove and destroy affected plants immediately.',
    prevention: 'Plant resistant varieties. Rotate crops with non-hosts. Maintain soil pH above 6.5. Use disease-free transplants.'
  },
  {
    id: '7',
    name: 'Wheat Leaf Rust',
    cropTypes: ['Wheat'],
    symptoms: ['Orange-brown pustules on leaves', 'Premature leaf drying', 'Reduced grain fill', 'Shriveled kernels'],
    images: ['/assets/wheat-rust.jpg'],
    description: 'A common fungal disease of wheat caused by Puccinia triticina that reduces photosynthetic area and decreases yield.',
    treatment: 'Apply triazole or strobilurin fungicides at the first sign of disease. Time application to protect the flag leaf.',
    prevention: 'Plant resistant varieties. Monitor fields regularly. Eliminate volunteer wheat that serves as a disease bridge.'
  },
  {
    id: '8',
    name: 'Rice Blast',
    cropTypes: ['Rice'],
    symptoms: ['Diamond-shaped lesions on leaves', 'Gray centers with brown margins', 'Neck rot', 'Panicle breakage'],
    images: ['/assets/rice-blast.jpg'],
    description: 'A devastating fungal disease caused by Magnaporthe oryzae that affects all aboveground parts of the rice plant.',
    treatment: 'Apply preventative fungicides during vulnerable growth stages. Use both protective and systemic products.',
    prevention: 'Plant resistant varieties. Avoid excessive nitrogen fertilization. Maintain consistent flooding in paddy fields.'
  },
  {
    id: '9',
    name: 'Citrus Greening (HLB)',
    cropTypes: ['Citrus'],
    symptoms: ['Yellow mottling of leaves', 'Asymmetrical blotchy mottle', 'Stunted growth', 'Small, misshapen fruit', 'Bitter fruit'],
    images: ['/assets/citrus-greening.jpg'],
    description: 'A bacterial disease spread by the Asian citrus psyllid that eventually kills infected trees and renders fruit inedible.',
    treatment: 'No cure currently exists. Nutritional treatments may temporarily mask symptoms but don\'t eliminate the disease.',
    prevention: 'Control psyllid populations with insecticides. Remove infected trees. Plant certified disease-free nursery stock.'
  },
  {
    id: '10',
    name: 'Anthracnose',
    cropTypes: ['Mango', 'Avocado', 'Beans', 'Pepper', 'Strawberry'],
    symptoms: ['Dark, sunken lesions on fruits', 'Circular black spots on leaves', 'Twig dieback', 'Blossom blight'],
    images: ['/assets/antracrose.jpg'],
    description: 'A group of fungal diseases that affect a wide range of crops, especially in warm, humid conditions.',
    treatment: 'Apply copper-based or other approved fungicides. Post-harvest hot water treatment for fruits.',
    prevention: 'Prune for better air circulation. Use wider plant spacing. Apply protective fungicides during wet periods.'
  }
];
const symptomsMock= [
  { id: '1', name: 'Yellow leaves', category: 'leaf' },
  { id: '2', name: 'Brown spots on leaves', category: 'leaf' },
  { id: '3', name: 'White powdery coating', category: 'leaf' },
  { id: '4', name: 'Wilting', category: 'general' },
  { id: '5', name: 'Stunted growth', category: 'general' },
  { id: '6', name: 'Stem lesions', category: 'stem' },
  { id: '7', name: 'Root rot', category: 'root' },
  { id: '8', name: 'Fruit discoloration', category: 'fruit' },
  { id: '9', name: 'Leaf curling', category: 'leaf' },
  { id: '10', name: 'Black or dark spots', category: 'leaf' },
  { id: '11', name: 'Abnormal leaf fall', category: 'leaf' },
  { id: '12', name: 'Pest presence', category: 'general' },
];

const fieldsMock= [
  { id: '1', name: 'North Field', crop: 'Corn', size: '45 acres', healthStatus: 'healthy', location: { x: 30, y: 20 } },
  { id: '2', name: 'East Field', crop: 'Wheat', size: '32 acres', healthStatus: 'warning', location: { x: 70, y: 45 } },
  { id: '3', name: 'South Field', crop: 'Soybean', size: '28 acres', healthStatus: 'healthy', location: { x: 35, y: 75 } },
  { id: '4', name: 'West Field', crop: 'Rice', size: '38 acres', healthStatus: 'danger', location: { x: 15, y: 50 } },
];

const treatmentsMock = [
  { id: '1', name: 'Fungicide Application', date: '2025-03-15', field: 'East Field', crop: 'Wheat', type: 'Chemical', dosage: '250ml/acre', notes: 'Applied after first signs of powdery mildew', effectivenessRating: 4 },
  { id: '2', name: 'Organic Neem Spray', date: '2025-03-22', field: 'North Field', crop: 'Corn', type: 'Organic', dosage: '350ml/acre', notes: 'Preventative application' },
  { id: '3', name: 'Copper Bactericide', date: '2025-03-28', field: 'West Field', crop: 'Rice', type: 'Chemical', dosage: '200ml/acre', notes: 'Applied to control bacterial blight', effectivenessRating: 3 },
];

const notificationsMock = [
  { id: '1', type: 'alert', message: 'Possible disease detected in West Field Rice', time: '2 hours ago', read: false },
  { id: '2', type: 'info', message: 'Scheduled treatment reminder for East Field', time: '12 hours ago', read: false },
  { id: '3', type: 'success', message: 'North Field crops showing improved health', time: '1 day ago', read: true },
  { id: '4', type: 'info', message: 'Weather alert: Heavy rain expected tomorrow', time: '1 day ago', read: true },
];

// Main Component
const CropMonitoringPage = () => {
  // Context and state
  const [user, setUser] = useState(null);
  const { sidebarWidth } = useContext(SidebarContext);
  const [activeTab, setActiveTab] = useState('health');
  const [crops, setCrops] = useState(cropsMock);
  const [fields, setFields] = useState(fieldsMock);
  const [diseases, setDiseases] = useState(diseasesMock);
  
  const [treatments, setTreatments] = useState(treatmentsMock);
  const [notifications, setNotifications] = useState(notificationsMock);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedCropType, setSelectedCropType] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [matchedDiseases, setMatchedDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [imageCompareMode, setImageCompareMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const notificationRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Derived states
  const unreadNotifications = notifications.filter(notification => !notification.read);
  
  // Effects
  useEffect(() => {
    // Click outside notifications handler
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);
    
    // Also add authentication check if needed
    if (!isAuthenticated()) {
      // Handle unauthenticated state
    }
  }, []);
  
  useEffect(() => {
    // Match diseases based on selected symptoms and crop type
    if (selectedSymptoms.length > 0 || selectedCropType) {
      const filtered = diseases.filter(disease => {
        // Filter by crop type if selected
        const cropTypeMatch = !selectedCropType || disease.cropTypes.includes(selectedCropType);
        
        // Filter by symptoms if any selected
        let symptomMatch = true;
        if (selectedSymptoms.length > 0) {
          // Calculate what percentage of selected symptoms match this disease
          const matchingSymptoms = selectedSymptoms.filter(symptomId => {
            const symptom = symptomsMock.find(s => s.id === symptomId);
            return symptom && disease.symptoms.some(s => s.toLowerCase().includes(symptom.name.toLowerCase()));
          });
          
          symptomMatch = matchingSymptoms.length > 0;
        }
        
        return cropTypeMatch && symptomMatch;
      });
      
      setMatchedDiseases(filtered);
    } else {
      setMatchedDiseases([]);
    }
  }, [selectedSymptoms, selectedCropType, diseases]);
  
  // Handlers
  const refreshData = () => {
    setIsRefreshing(true);
    // Simulate API fetch
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const getNotificationTypeStyle = () => {
    switch (type) {
      case 'alert': return 'text-red-600 bg-red-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'success': return 'text-emerald-600 bg-emerald-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-emerald-500';
      case 'warning': return 'text-amber-500';
      case 'danger': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };
  
  const handleSymptomToggle = (symptomId) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(id => id !== symptomId) 
        : [...prev, symptomId]
    );
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const clearUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const toggleImageCompareMode = () => {
    setImageCompareMode(!imageCompareMode);
  };
  
  const increaseZoom = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };
  
  const decreaseZoom = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };
  
  // Render helpers
  const renderHealthCard = (healthStatus) => {
    const count = crops.filter(crop => crop.healthStatus === healthStatus).length;
    let title, icon, color;
    
    switch(healthStatus) {
      case 'healthy':
        title = 'Healthy';
        icon = <Check className="h-8 w-8 text-emerald-500" />;
        color = 'bg-emerald-50 border-emerald-200';
        break;
      case 'warning':
        title = 'Needs Attention';
        icon = <AlertTriangle className="h-8 w-8 text-amber-500" />;
        color = 'bg-amber-50 border-amber-200';
        break;
      case 'danger':
        title = 'Critical';
        icon = <AlertOctagon className="h-8 w-8 text-red-500" />;
        color = 'bg-red-50 border-red-200';
        break;
      default:
        title = 'Unknown';
        icon = <Leaf className="h-8 w-8 text-gray-500" />;
        color = 'bg-gray-50 border-gray-200';
    }
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`rounded-lg border ${color} p-4 shadow-sm`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="mt-1 text-2xl font-semibold">{count} {count === 1 ? 'Crop' : 'Crops'}</h3>
          </div>
          <div className="rounded-full p-2 bg-white shadow-sm">{icon}</div>
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
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
              <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">Crop Monitoring</h1>
              
              {/* Search bar */}
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search crops, diseases..."
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
                {user?.username ? user.username.charAt(0).toUpperCase() : 'GU'}
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
            <nav className="flex space-x-4 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveTab('health')}
                className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                  activeTab === 'health'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Health Dashboard
              </button>
              <button
                onClick={() => setActiveTab('field-map')}
                className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                  activeTab === 'field-map'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Field Map
              </button>
              <button
                onClick={() => setActiveTab('disease-library')}
                className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                  activeTab === 'disease-library'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Disease Library
              </button>
              <button
                onClick={() => setActiveTab('symptom-matcher')}
                className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                  activeTab === 'symptom-matcher'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Symptom Matcher
              </button>
              <button
                onClick={() => setActiveTab('image-analyzer')}
                className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                  activeTab === 'image-analyzer'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Image Analyzer
              </button>
              <button
                onClick={() => setActiveTab('treatments')}
                className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                  activeTab === 'treatments'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Treatment Tracker
              </button>
            </nav>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'health' && (
              <motion.div
                key="health-dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Crop Health Dashboard</h2>
                  <p className="text-gray-600">Monitor the health status of all your crops and fields at a glance.</p>
                </div>
                
                {/* Health Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-black">
                  {renderHealthCard('healthy')}
                  {renderHealthCard('warning')}
                  {renderHealthCard('danger')}
                </div>
                
                {/* Filters and Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <select 
                        className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white text-black"
                      >
                        <option value="" className='text-black'>All Crop Types</option>
                        <option value="corn" className='text-black'>Corn</option>
                        <option value="wheat" className='text-black'>Wheat</option>
                        <option value="soybean" className='text-black'>Soybean</option>
                        <option value="rice" className='text-black'>Rice</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                    
                    <div className="relative">
                      <select 
                        className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white text-black"
                      >
                        <option value="">All Fields</option>
                        <option value="north">North Field</option>
                        <option value="east">East Field</option>
                        <option value="south">South Field</option>
                        <option value="west">West Field</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                    
                    <div className="relative">
                      <select 
                        className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white text-black"
                      >
                        <option value="">All Health Statuses</option>
                        <option value="healthy">Healthy</option>
                        <option value="warning">Needs Attention</option>
                        <option value="danger">Critical</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                    
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <Filter size={16} className="mr-2" />
                      More Filters
                    </button>
                  </div>
                  
                  <div>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                      Add Observation
                    </button>
                  </div>
                </div>
                
                {/* Crop List */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planted Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Checked</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {crops.map((crop) => (
                          <tr key={crop.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{crop.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{crop.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{crop.field}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{crop.plantedDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                crop.healthStatus === 'healthy' ? 'bg-emerald-100 text-emerald-800' :
                                crop.healthStatus === 'warning' ? 'bg-amber-100 text-amber-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {crop.healthStatus === 'healthy' ? 'Healthy' :
                                 crop.healthStatus === 'warning' ? 'Needs Attention' :
                                 'Critical'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{crop.lastChecked}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                              <button className="text-emerald-600 hover:text-emerald-900">Update</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">{crops.length}</span> of <span className="font-medium">{crops.length}</span> crops
                    </div>
                    <div className="flex space-x-2">
                      <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 opacity-50 cursor-not-allowed">
                        Previous
                      </button>
                      <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 opacity-50 cursor-not-allowed">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'field-map' && (
              <motion.div
                key="field-map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Interactive Field Map</h2>
                  <p className="text-gray-600">Visualize your fields and monitor crop health with a color-coded map.</p>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Field Map */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 lg:w-2/3 h-[500px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-50 z-0"></div>
                    
                    {/* Simplified Field Map Visualization */}
                    {fields.map((field) => (
                      <motion.div
                        key={field.id}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`absolute p-4 rounded-lg shadow-md cursor-pointer ${
                          field.healthStatus === 'healthy' ? 'bg-emerald-100 border-2 border-emerald-300' :
                          field.healthStatus === 'warning' ? 'bg-amber-100 border-2 border-amber-300' :
                          'bg-red-100 border-2 border-red-300'
                        }`}
                        style={{
                          left: `${field.location.x}%`,
                          top: `${field.location.y}%`,
                          transform: 'translate(-50%, -50%)',
                          width: '120px',
                          height: '120px',
                          zIndex: selectedField?.id === field.id ? 10 : 1
                        }}
                        onClick={() => setSelectedField(field)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="h-full flex flex-col justify-between">
                          <h3 className="font-medium text-gray-900 text-sm">{field.name}</h3>
                          <div>
                            <p className="text-xs text-gray-600">{field.crop}</p>
                            <p className="text-xs text-gray-600">{field.size}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Map Controls */}
                    <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-2 z-20">
                      <div className="flex flex-col space-y-2">
                        <button className="p-2 hover:bg-gray-100 rounded-md">
                          <Map size={18} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-md">
                          <Plus size={18} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-md">
                          <Minus size={18} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Map Legend */}
                    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 z-20">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Legend</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-emerald-500 mr-2"></div>
                          <span className="text-xs text-gray-600">Healthy</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-amber-500 mr-2"></div>
                          <span className="text-xs text-gray-600">Needs Attention</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                          <span className="text-xs text-gray-600">Critical</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Field Details */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 lg:w-1/3">
                    {selectedField ? (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900">{selectedField.name} Details</h3>
                          <button 
                            className="text-gray-400 hover:text-gray-500"
                            onClick={() => setSelectedField(null)}
                          >
                            <X size={20} />
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Crop Type</h4>
                            <p className="mt-1 text-base font-medium text-gray-900">{selectedField.crop}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Field Size</h4>
                            <p className="mt-1 text-base font-medium text-gray-900">{selectedField.size}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Health Status</h4>
                            <div className="mt-1 flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                selectedField.healthStatus === 'healthy' ? 'bg-emerald-100 text-emerald-800' :
                                selectedField.healthStatus === 'warning' ? 'bg-amber-100 text-amber-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {selectedField.healthStatus === 'healthy' ? 'Healthy' :
                                 selectedField.healthStatus === 'warning' ? 'Needs Attention' :
                                 'Critical'}
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Environmental Conditions</h4>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              <div className="flex items-center p-2 bg-gray-50 rounded-md">
                                <Thermometer size={16} className="text-gray-500 mr-2" />
                                <span className="text-sm text-gray-700">24°C</span>
                              </div>
                              <div className="flex items-center p-2 bg-gray-50 rounded-md">
                                <Droplet size={16} className="text-gray-500 mr-2" />
                                <span className="text-sm text-gray-700">65% humidity</span>
                              </div>
                              <div className="flex items-center p-2 bg-gray-50 rounded-md">
                                <Sun size={16} className="text-gray-500 mr-2" />
                                <span className="text-sm text-gray-700">High sunlight</span>
                              </div>
                              <div className="flex items-center p-2 bg-gray-50 rounded-md">
                                <PieChart size={16} className="text-gray-500 mr-2" />
                                <span className="text-sm text-gray-700">68% soil moisture</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Recent Activities</h4>
                            <div className="mt-2 space-y-2">
                              <div className="p-2 bg-gray-50 rounded-md">
                                <p className="text-sm text-gray-900">Irrigation completed</p>
                                <p className="text-xs text-gray-500">April 5, 2025</p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded-md">
                                <p className="text-sm text-gray-900">Fertilizer application</p>
                                <p className="text-xs text-gray-500">April 2, 2025</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                              View Detailed Report
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6">
                        <Map size={48} className="text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No Field Selected</h3>
                        <p className="text-gray-500 mb-4">Click on a field in the map to view its details and health status.</p>
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          Add New Field
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'disease-library' && (
              <motion.div
                key="disease-library"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Disease Library</h2>
                  <p className="text-gray-600">Browse common crop diseases, their symptoms, and treatment methods.</p>
                </div>
                
                {/* Search & Filter */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Search diseases by name or symptom..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <div className="relative">
                        <select 
                          value={selectedCropType}
                          onChange={(e) => setSelectedCropType(e.target.value)}
                          className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
                        >
                          <option value="">All Crop Types</option>
                          <option value="Corn">Corn</option>
                          <option value="Wheat">Wheat</option>
                          <option value="Soybean">Soybean</option>
                          <option value="Rice">Rice</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      </div>
                      
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <Filter size={16} className="mr-2" />
                        More Filters
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Disease Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {diseases.map((disease) => (
                    <motion.div
                      key={disease.id}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                    >
                      <div className="relative h-48 bg-gray-100">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                          <Leaf size={36} />
                        </div>
                        {disease.images && disease.images.length > 0 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Image
                              src={disease.images[0] || '/placeholder-disease.jpg'}
                              alt={disease.name}
                              className="object-cover"
                              fill
                            />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {disease.cropTypes.join(', ')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{disease.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{disease.description}</p>
                        
                        <div className="mb-3">
                          <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Key Symptoms</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {disease.symptoms.slice(0, 3).map((symptom, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {symptom}
                              </span>
                            ))}
                            {disease.symptoms.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                +{disease.symptoms.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => setSelectedDisease(disease)}
                          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded text-sm font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Disease Detail Modal */}
                <AnimatePresence>
                  {selectedDisease && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 overflow-y-auto"
                    >
                      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        
                        <motion.div
                          initial={{ scale: 0.9, y: 20 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0.9, y: 20 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"
                        >
                          <div className="flex justify-end pt-4 pr-4">
                            <button
                              onClick={() => setSelectedDisease(null)}
                              className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                              <X size={24} />
                            </button>
                          </div>
                          
                          <div className="px-4 pt-0 pb-6 sm:p-6 sm:pb-8">
                            <div className="sm:flex sm:items-start">
                              <div className="mt-3 sm:mt-0 sm:text-left w-full">
                                <div className="flex flex-col md:flex-row gap-6">
                                  <div className="md:w-1/2">
                                    <div className="relative h-56 bg-gray-100 rounded-lg overflow-hidden mb-4">
                                      <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                        <Leaf size={48} />
                                      </div>
                                      {selectedDisease.images && selectedDisease.images.length > 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <Image
                                            src={selectedDisease.images[0] || '/placeholder-disease.jpg'}
                                            alt={selectedDisease.name}
                                            className="object-cover"
                                            fill
                                          />
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="mb-4">
                                      <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedDisease.name}</h3>
                                      <div className="flex flex-wrap gap-1.5 mb-2">
                                        {selectedDisease.cropTypes.map((type, index) => (
                                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                            {type}
                                          </span>
                                        ))}
                                      </div>
                                      <p className="text-sm text-gray-600">{selectedDisease.description}</p>
                                    </div>
                                    
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-900 mb-2">Symptoms</h4>
                                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mb-4">
                                        {selectedDisease.symptoms.map((symptom, index) => (
                                          <li key={index}>{symptom}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                  
                                  <div className="md:w-1/2">
                                    <div className="mb-6">
                                      <h4 className="text-sm font-medium text-gray-900 mb-2">Treatment</h4>
                                      <p className="text-sm text-gray-600 mb-4">
                                        {selectedDisease.treatment}
                                      </p>
                                    </div>
                                    
                                    <div className="mb-6">
                                      <h4 className="text-sm font-medium text-gray-900 mb-2">Prevention</h4>
                                      <p className="text-sm text-gray-600 mb-4">
                                        {selectedDisease.prevention}
                                      </p>
                                    </div>
                                    
                                    <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                                      <h4 className="text-sm font-medium text-indigo-900 mb-2">Agricultural Expert Tip</h4>
                                      <p className="text-sm text-indigo-700">
                                        Early detection is crucial. Regular monitoring of your {selectedDisease.cropTypes.join(', ')} crops, 
                                        especially during humid conditions, can help catch {selectedDisease.name} before it spreads widely.
                                      </p>
                                    </div>
                                    
                                    <div className="flex space-x-3">
                                      <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                                        Add to Treatment Plan
                                      </button>
                                      <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                        <Share size={16} className="mr-2" />
                                        Share
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
            
            {activeTab === 'symptom-matcher' && (
              <motion.div
                key="symptom-matcher"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Symptom Matcher</h2>
                  <p className="text-gray-600">Identify potential crop diseases by selecting observed symptoms.</p>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Symptom Selection */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 lg:w-1/2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Select Symptoms & Crop Type</h3>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
                      <div className="relative">
                        <select 
                          value={selectedCropType}
                          onChange={(e) => setSelectedCropType(e.target.value)}
                          className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
                        >
                          <option value="">Select a crop type</option>
                          <option value="Corn">Corn</option>
                          <option value="Wheat">Wheat</option>
                          <option value="Soybean">Soybean</option>
                          <option value="Rice">Rice</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Observed Symptoms <span className="text-gray-400 text-xs">(Select all that apply)</span>
                      </label>
                      
                      <div className="mb-3">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search symptoms..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                        <div className="grid grid-cols-1 divide-y divide-gray-200 max-h-80 overflow-y-auto">
                          <div className="p-3 bg-gray-50 font-medium flex items-center justify-between text-sm text-gray-700">
                            <span>Leaf Symptoms</span>
                            <ChevronDown size={16} className="text-gray-400" />
                          </div>
                          {symptomsMock.filter(s => s.category === 'leaf').map((symptom) => (
                            <div 
                              key={symptom.id}
                              className={`p-3 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer ${
                                selectedSymptoms.includes(symptom.id) ? 'bg-emerald-50' : ''
                              }`}
                              onClick={() => handleSymptomToggle(symptom.id)}
                            >
                              <div className={`w-5 h-5 flex-shrink-0 rounded border ${
                                selectedSymptoms.includes(symptom.id) 
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-gray-300'
                              } flex items-center justify-center`}>
                                {selectedSymptoms.includes(symptom.id) && (
                                  <Check size={12} />
                                )}
                              </div>
                              <span className="text-sm text-gray-700">{symptom.name}</span>
                            </div>
                          ))}
                          
                          <div className="p-3 bg-gray-50 font-medium flex items-center justify-between text-sm text-gray-700">
                            <span>Stem Symptoms</span>
                            <ChevronDown size={16} className="text-gray-400" />
                          </div>
                          {symptomsMock.filter(s => s.category === 'stem').map((symptom) => (
                            <div 
                              key={symptom.id}
                              className={`p-3 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer ${
                                selectedSymptoms.includes(symptom.id) ? 'bg-emerald-50' : ''
                              }`}
                              onClick={() => handleSymptomToggle(symptom.id)}
                            >
                              <div className={`w-5 h-5 flex-shrink-0 rounded border ${
                                selectedSymptoms.includes(symptom.id) 
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-gray-300'
                              } flex items-center justify-center`}>
                                {selectedSymptoms.includes(symptom.id) && (
                                  <Check size={12} />
                                )}
                              </div>
                              <span className="text-sm text-gray-700">{symptom.name}</span>
                            </div>
                          ))}
                          
                          <div className="p-3 bg-gray-50 font-medium flex items-center justify-between text-sm text-gray-700">
                            <span>General Symptoms</span>
                            <ChevronDown size={16} className="text-gray-400" />
                          </div>
                          {symptomsMock.filter(s => s.category === 'general').map((symptom) => (
                            <div 
                              key={symptom.id}
                              className={`p-3 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer ${
                                selectedSymptoms.includes(symptom.id) ? 'bg-emerald-50' : ''
                              }`}
                              onClick={() => handleSymptomToggle(symptom.id)}
                            >
                              <div className={`w-5 h-5 flex-shrink-0 rounded border ${
                                selectedSymptoms.includes(symptom.id) 
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-gray-300'
                              } flex items-center justify-center`}>
                                {selectedSymptoms.includes(symptom.id) && (
                                  <Check size={12} />
                                )}
                              </div>
                              <span className="text-sm text-gray-700">{symptom.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <button 
                          onClick={() => setSelectedSymptoms([])}
                          className="text-sm text-gray-600 hover:text-gray-800"
                        >
                          Clear All
                        </button>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{selectedSymptoms.length}</span> symptom{selectedSymptoms.length !== 1 ? 's' : ''} selected
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Matched Diseases */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 lg:w-1/2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Potential Matches</h3>
                    
                    {matchedDiseases.length > 0 ? (
                      <div>
                        <div className="mb-4 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-md">
                          <p className="text-sm">
                            Found {matchedDiseases.length} potential match{matchedDiseases.length !== 1 ? 'es' : ''} based on your selections.
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          {matchedDiseases.map((disease) => (
                            <motion.div
                              key={disease.id}
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                              <div className="flex flex-col sm:flex-row">
                                <div className="sm:w-24 sm:h-24 h-32 relative bg-gray-100">
                                  <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                    <Leaf size={24} />
                                  </div>
                                  {disease.images && disease.images.length > 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <Image
                                        src={disease.images[0] || '/placeholder-disease.jpg'}
                                        alt={disease.name}
                                        className="object-cover"
                                        fill
                                      />
                                    </div>
                                  )}
                                </div>
                                
                                <div className="p-3 flex-1">
                                  <div className="mb-2">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-base font-medium text-gray-900">{disease.name}</h4>
                                      <span className="text-xs text-gray-500">
                                        {disease.cropTypes.join(', ')}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">{disease.description}</p>
                                  </div>
                                  
                                  <div>
                                    <h5 className="text-xs font-medium uppercase text-gray-500 mb-1">Matching Symptoms</h5>
                                    <div className="flex flex-wrap gap-1.5">
                                      {disease.symptoms.slice(0, 3).map((symptom, index) => {
                                        const matchesSelected = selectedSymptoms.some(s => {
                                          const selectedSymptom = symptomsMock.find(sm => sm.id === s);
                                          return selectedSymptom && symptom.toLowerCase().includes(selectedSymptom.name.toLowerCase());
                                        });
                                        
                                        return (
                                          <span 
                                            key={index}
                                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                              matchesSelected ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                                            }`}
                                          >
                                            {symptom}
                                            {matchesSelected && <Check size={12} className="ml-1" />}
                                          </span>
                                        );
                                      })}
                                      {disease.symptoms.length > 3 && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                          +{disease.symptoms.length - 3} more
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-gray-50 p-2 border-t border-gray-200 flex justify-between items-center">
                                <button 
                                  onClick={() => setSelectedDisease(disease)}
                                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                  View Details
                                </button>
                                <button className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                                  Add to Record
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-64 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-lg p-6">
                        <Book size={40} className="text-gray-300 mb-3" />
                        <h4 className="text-lg font-medium text-gray-900 mb-1">No Matches Found</h4>
                        <p className="text-gray-500 mb-4 max-w-xs">
                          {selectedSymptoms.length > 0 || selectedCropType
                            ? "We couldn't find any diseases matching your current selections. Try adjusting your symptoms or crop type."
                            : "Select crop type and symptoms to see potential disease matches."
                          }
                        </p>
                        {(selectedSymptoms.length > 0 || selectedCropType) && (
                          <button 
                            onClick={() => {
                              setSelectedSymptoms([]);
                              setSelectedCropType('');
                            }}
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            Reset Selections
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'image-analyzer' && (
              <motion.div
                key="image-analyzer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Image Analyzer</h2>
                  <p className="text-gray-600">Upload and compare images of your crops with reference disease images.</p>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Image Upload */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 lg:w-1/2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Crop Image</h3>
                    
                    {!uploadedImage ? (
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <Upload size={40} className="text-gray-400 mb-3" />
                        <h4 className="text-lg font-medium text-gray-900 mb-1">Upload Image</h4>
                        <p className="text-gray-500 text-center mb-4">
                          Drag and drop an image here, or click to browse.
                          <br/>
                          <span className="text-sm">JPG, PNG or GIF, max 10MB</span>
                        </p>
                        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                          Browse Files
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
                          <Image
                            src={uploadedImage}
                            alt="Uploaded crop image"
                            className="object-contain"
                            fill
                          />
                          <button 
                            onClick={clearUploadedImage}
                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                          >
                            <X size={16} className="text-gray-500" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                          >
                            <Camera size={16} className="mr-1" />
                            Upload Different Image
                          </button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          
                          <div className="flex space-x-2">
                            <button 
                              onClick={decreaseZoom}
                              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                              disabled={zoomLevel <= 0.5}
                            >
                              <Minus size={16} />
                            </button>
                            <button 
                              onClick={increaseZoom}
                              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                              disabled={zoomLevel >= 3}
                            >
                              <Plus size={16} />
                            </button>
                            <button 
                              onClick={toggleImageCompareMode}
                              className={`p-1 hover:bg-gray-100 rounded ${imageCompareMode ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                              <ZoomIn size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex flex-col md:flex-row mb-3">
                            <div className="relative md:w-1/2">
                              <select 
                                value={selectedCropType}
                                onChange={(e) => setSelectedCropType(e.target.value)}
                                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
                              >
                                <option value="">Select Crop Type</option>
                                <option value="Corn">Corn</option>
                                <option value="Wheat">Wheat</option>
                                <option value="Soybean">Soybean</option>
                                <option value="Rice">Rice</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            </div>
                            <button 
                              className="mt-3 md:mt-0 md:ml-3 py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 md:flex-1"
                            >
                              Find Similar References
                            </button>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {symptomsMock.slice(0, 8).map((symptom) => (
                              <button
                                key={symptom.id}
                                onClick={() => handleSymptomToggle(symptom.id)}
                                className={`px-2 py-1 rounded-md text-xs ${
                                  selectedSymptoms.includes(symptom.id)
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                                }`}
                              >
                                {symptom.name}
                              </button>
                            ))}
                          </div>
                          
                          <button 
                            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Add to Crop Records
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Reference Images */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 lg:w-1/2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Reference Images</h3>
                    
                    {matchedDiseases.length > 0 ? (
                      <div>
                        <div className="mb-4 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-md">
                          <p className="text-sm">
                            {matchedDiseases.length} possible disease match{matchedDiseases.length !== 1 ? 'es' : ''} found. Compare with your uploaded image.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          {matchedDiseases.slice(0, 4).map((disease) => (
                            <div 
                              key={disease.id}
                              className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => setSelectedDisease(disease)}
                            >
                              <div className="h-32 relative bg-gray-100">
                                {disease.images && disease.images.length > 0 && (
                                  <Image
                                    src={disease.images[0] || '/placeholder-disease.jpg'}
                                    alt={disease.name}
                                    className="object-cover"
                                    fill
                                  />
                                )}
                              </div>
                              <div className="p-3">
                                <h4 className="text-sm font-medium text-gray-900 mb-1">{disease.name}</h4>
                                <p className="text-xs text-gray-500">{disease.cropTypes.join(', ')}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {imageCompareMode && uploadedImage && matchedDiseases.length > 0 && (
                          <div className="mt-6 border-t border-gray-200 pt-4">
                            <h4 className="text-base font-medium text-gray-900 mb-3">Side-by-Side Comparison</h4>
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="md:w-1/2">
                                <p className="text-sm font-medium text-gray-900 mb-2">Your Image</p>
                                <div className="relative h-60 bg-gray-100 rounded-lg overflow-hidden">
                                  <Image
                                    src={uploadedImage}
                                    alt="Uploaded crop image"
                                    className="object-contain"
                                    style={{ transform: `scale(${zoomLevel})` }}
                                    fill
                                  />
                                </div>
                              </div>
                              <div className="md:w-1/2">
                                <p className="text-sm font-medium text-gray-900 mb-2">
                                  {matchedDiseases[0]?.name || 'Reference Image'}
                                </p>
                                <div className="relative h-60 bg-gray-100 rounded-lg overflow-hidden">
                                  {matchedDiseases[0]?.images && matchedDiseases[0]?.images.length > 0 && (
                                    <Image
                                      src={matchedDiseases[0]?.images[0] || '/placeholder-disease.jpg'}
                                      alt={matchedDiseases[0]?.name || 'Reference disease image'}
                                      className="object-contain"
                                      style={{ transform: `scale(${zoomLevel})` }}
                                      fill
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 flex justify-center">
                              <p className="text-sm text-gray-600">
                                Zoom: {Math.round(zoomLevel * 100)}%
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-64 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-lg p-6">
                        <Book size={40} className="text-gray-300 mb-3" />
                        <h4 className="text-lg font-medium text-gray-900 mb-1">No References Available</h4>
                        <p className="text-gray-500 mb-4 max-w-xs">
                          {uploadedImage
                            ? "Upload an image and select symptoms or crop type to see potential disease matches."
                            : "Upload an image to compare with our disease reference library."
                          }
                        </p>
                        {!uploadedImage && (
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-md text-sm"
                          >
                            Upload Image
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'treatments' && (
              <motion.div
                key="treatments"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Treatment Tracker</h2>
                  <p className="text-gray-600">Record and monitor treatments applied to your crops.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Treatment Stats */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-emerald-100 rounded-full">
                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Treatments Applied</h3>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">This Month</span>
                        <span className="font-medium text-emerald-600">5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Last Month</span>
                        <span className="font-medium text-gray-900">3</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total</span>
                        <span className="font-medium text-gray-900">12</span>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-indigo-100 rounded-full">
                        <Calendar className="h-6 w-6 text-indigo-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Upcoming Treatments</h3>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Today</span>
                        <span className="font-medium text-indigo-600">1</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">This Week</span>
                        <span className="font-medium text-gray-900">2</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Next Week</span>
                        <span className="font-medium text-gray-900">3</span>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-amber-100 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-amber-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Treatment Effectiveness</h3>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">High Effectiveness</span>
                        <span className="font-medium text-emerald-600">4</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Medium Effectiveness</span>
                        <span className="font-medium text-amber-600">2</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Low Effectiveness</span>
                        <span className="font-medium text-red-600">1</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Treatment History</h3>
                  <div className="flex space-x-3 mt-3 md:mt-0">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                      Add Treatment
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <Filter size={16} className="mr-2" />
                      Filter
                    </button>
                  </div>
                </div>
                
                {/* Treatment History Table */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effectiveness</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {treatments.map((treatment) => (
                          <tr key={treatment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{treatment.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{treatment.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{treatment.field}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{treatment.crop}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                treatment.type === 'Chemical' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {treatment.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{treatment.dosage}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {treatment.effectivenessRating ? (
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i}
                                      size={16}
                                      className={`${i  ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500">Not rated yet</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                              <button className="text-emerald-600 hover:text-emerald-900">Edit</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">{treatments.length}</span> of <span className="font-medium">{treatments.length}</span> treatments
                    </div>
                    <div className="flex space-x-2">
                      <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 opacity-50 cursor-not-allowed">
                        Previous
                      </button>
                      <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 opacity-50 cursor-not-allowed">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Upcoming Treatments */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Treatments</h3>
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                    <div className="border-l-4 border-indigo-500 pl-4 py-2 mb-4">
                      <h4 className="text-base font-medium text-gray-900">Today - April 8, 2025</h4>
                    </div>
                    
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100 mb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="text-base font-medium text-gray-900">Fungicide Application</h5>
                          <p className="text-sm text-gray-600 mb-2">East Field - Wheat</p>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">Type:</span> Chemical</p>
                            <p><span className="font-medium">Dosage:</span> 250ml/acre</p>
                            <p><span className="font-medium">Notes:</span> Follow up treatment for powdery mildew</p>
                          </div>
                        </div>
                        <div className="flex">
                          <button className="text-emerald-600 hover:text-emerald-800 mr-3">
                            <CheckCircle size={20} />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-l-4 border-indigo-500 pl-4 py-2 mb-4 mt-8">
                      <h4 className="text-base font-medium text-gray-900">Tomorrow - April 9, 2025</h4>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="text-base font-medium text-gray-900">Foliar Spray</h5>
                          <p className="text-sm text-gray-600 mb-2">South Field - Soybean</p>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">Type:</span> Organic</p>
                            <p><span className="font-medium">Dosage:</span> 300ml/acre</p>
                            <p><span className="font-medium">Notes:</span> Preventative treatment</p>
                          </div>
                        </div>
                        <div className="flex">
                          <button className="text-emerald-600 hover:text-emerald-800 mr-3">
                            <CheckCircle size={20} />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="text-base font-medium text-gray-900">Copper Treatment</h5>
                          <p className="text-sm text-gray-600 mb-2">West Field - Rice</p>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">Type:</span> Chemical</p>
                            <p><span className="font-medium">Dosage:</span> 200ml/acre</p>
                            <p><span className="font-medium">Notes:</span> Bacterial blight treatment</p>
                          </div>
                        </div>
                        <div className="flex">
                          <button className="text-emerald-600 hover:text-emerald-800 mr-3">
                            <CheckCircle size={20} />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-center">
                      <button className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                        View All Scheduled Treatments
                        <ArrowRight size={16} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default CropMonitoringPage;

// Missing icons declared to avoid TypeScript errors
const Star = ({ size, className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );
};

const Plus = ({ size, className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
};

const Minus = ({ size, className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
};