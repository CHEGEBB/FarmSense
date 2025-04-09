"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, BarChart3, TrendingUp,
  Droplets, SunDim, FileSpreadsheet, Crop, DollarSign, Calendar,
  ArrowRight, Loader2, Filter, ChevronDown, ChevronUp, ArrowRightCircle
} from 'lucide-react';
import { 
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend, 
    CategoryScale, 
    LinearScale,
    PointElement,
    LineElement,
    BarElement
  } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import Sidebar from '../../components/Sidebar';
import "../../sass/fonts.scss"

ChartJS.register(
    ArcElement, 
    Tooltip, 
    Legend, 
    CategoryScale, 
    LinearScale, 
    PointElement,
    LineElement, 
    BarElement    
  );

export default function ReportsPage() {
  // State for animation triggers
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedReport, setSelectedReport] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Simulate periodically changing data for dynamic effect
  const [dynamicData, setDynamicData] = useState({
    yields: Array(12).fill(0).map(() => Math.floor(Math.random() * 50) + 50),
    moisture: Array(7).fill(0).map(() => Math.floor(Math.random() * 30) + 60),
    expenses: Array(6).fill(0).map(() => Math.floor(Math.random() * 1500) + 500),
    cropHealth: [65, 35] // Healthy vs Unhealthy
  });

  // Update data periodically to create dynamic effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicData(prev => ({
        yields: prev.yields.map(val => 
          Math.max(40, Math.min(100, val + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5)))
        ),
        moisture: prev.moisture.map(val => 
          Math.max(40, Math.min(90, val + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3)))
        ),
        expenses: prev.expenses.map(val => 
          Math.max(200, Math.min(2000, val + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 100)))
        ),
        cropHealth: [
          Math.max(50, Math.min(85, prev.cropHealth[0] + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2))),
          Math.max(15, Math.min(50, prev.cropHealth[1] + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2)))
        ]
      }));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Simulate export functionality
  // interface ExportOptions {
  //   format: 'pdf' | 'csv' | 'excel';
  // }

  const handleExport = (format)=> {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setShowDropdown(false);
      alert(`Report exported as ${format.toUpperCase()} successfully!`);
    }, 1500);
  };

  // Toggle card expansion
  // interface ToggleCardExpansionProps {
  //   cardId: string;
  // }

  const toggleCardExpansion = ({ cardId })=> {
    if (expandedCard === cardId) {
      setExpandedCard(null);
    } else {
      setExpandedCard(cardId);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-emerald-800">Farm Analytics & Reports</h1>
              
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 bg-white text-emerald-700 border border-emerald-200 font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-emerald-50 transition-all"
                  >
                    <Download size={18} />
                    {isExporting ? 'Exporting...' : 'Export Report'}
                    {showDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10 overflow-hidden border border-gray-100"
                      >
                        <button 
                          onClick={() => handleExport('pdf')}
                          disabled={isExporting}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 flex items-center gap-2"
                        >
                          {isExporting ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
                          PDF Report
                        </button>
                        <button 
                          onClick={() => handleExport('csv')}
                          disabled={isExporting}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 flex items-center gap-2"
                        >
                          {isExporting ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
                          CSV Export
                        </button>
                        <button 
                          onClick={() => handleExport('excel')}
                          disabled={isExporting}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 flex items-center gap-2"
                        >
                          {isExporting ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
                          Excel Export
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-white text-gray-700 border border-gray-200 font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-all"
                >
                  <option value="weekly">Last 7 Days</option>
                  <option value="monthly">Last 30 Days</option>
                  <option value="quarterly">Last Quarter</option>
                  <option value="yearly">Annual Report</option>
                </select>
              </div>
            </div>
            
            {/* Report Tabs */}
            <div className="flex flex-wrap gap-2 md:gap-4 mb-2">
              <button 
                onClick={() => setSelectedReport('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedReport === 'all' 
                    ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Reports
              </button>
              <button 
                onClick={() => setSelectedReport('harvests')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedReport === 'harvests' 
                    ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Harvests
              </button>
              <button 
                onClick={() => setSelectedReport('irrigation')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedReport === 'irrigation' 
                    ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Irrigation
              </button>
              <button 
                onClick={() => setSelectedReport('expenses')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedReport === 'expenses' 
                    ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Expenses
              </button>
              <button 
                onClick={() => setSelectedReport('health')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedReport === 'health' 
                    ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Crop Health
              </button>
            </div>
          </motion.div>
          
          {/* Stats Overview Cards */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {/* Card 1 */}
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-xl shadow-sm border border-emerald-100 backdrop-blur-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-emerald-500 font-medium text-sm">Total Harvest</p>
                  <h3 className="text-gray-800 text-2xl font-bold mt-1">3,685 kg</h3>
                </div>
                <span className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <Crop size={20} />
                </span>
              </div>
              <div className="mt-4 flex items-center text-emerald-700">
                <TrendingUp size={16} className="mr-1" />
                <span className="text-sm font-medium">↑ 8.2% from last period</span>
              </div>
            </motion.div>
            
            {/* Card 2 */}
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-xl shadow-sm border border-indigo-100 backdrop-blur-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-indigo-500 font-medium text-sm">Water Usage</p>
                  <h3 className="text-gray-800 text-2xl font-bold mt-1">12,450 L</h3>
                </div>
                <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Droplets size={20} />
                </span>
              </div>
              <div className="mt-4 flex items-center text-indigo-700">
                <TrendingUp size={16} className="mr-1 rotate-180" />
                <span className="text-sm font-medium">↓ 3.5% from last period</span>
              </div>
            </motion.div>
            
            {/* Card 3 */}
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl shadow-sm border border-amber-100 backdrop-blur-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-amber-500 font-medium text-sm">Crop Health</p>
                  <h3 className="text-gray-800 text-2xl font-bold mt-1">85% Healthy</h3>
                </div>
                <span className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                  <SunDim size={20} />
                </span>
              </div>
              <div className="mt-4 flex items-center text-amber-700">
                <TrendingUp size={16} className="mr-1" />
                <span className="text-sm font-medium">↑ 2.1% from last period</span>
              </div>
            </motion.div>
            
            {/* Card 4 */}
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-gradient-to-br from-rose-50 to-white p-5 rounded-xl shadow-sm border border-rose-100 backdrop-blur-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-rose-500 font-medium text-sm">Total Expenses</p>
                  <h3 className="text-gray-800 text-2xl font-bold mt-1">$8,925</h3>
                </div>
                <span className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                  <DollarSign size={20} />
                </span>
              </div>
              <div className="mt-4 flex items-center text-rose-700">
                <TrendingUp size={16} className="mr-1 rotate-180" />
                <span className="text-sm font-medium">↓ 5.3% from last period</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Main Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Harvest Yield Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`bg-white p-5 rounded-xl shadow-md border border-gray-100 ${
                (selectedReport === 'all' || selectedReport === 'harvests') ? 'lg:col-span-2' : 'hidden'
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Monthly Harvest Yield</h3>
                  <p className="text-gray-500 text-sm">Tracking crop performance over time</p>
                </div>
                <button 
                  onClick={() => toggleCardExpansion({ cardId: 'harvest' })}
                  className="text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  {expandedCard === 'harvest' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              
              <div className={`transition-all duration-300 overflow-hidden ${
                expandedCard === 'harvest' ? 'h-96' : 'h-64'
              }`}>
                <Line
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                      {
                        label: 'Corn (kg)',
                        data: dynamicData.yields,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                      },
                      {
                        label: 'Wheat (kg)',
                        data: dynamicData.yields.map(y => y * 0.7 + Math.random() * 10),
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          usePointStyle: true,
                          boxWidth: 6,
                          font: {
                            size: 12
                          }
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#111827',
                        bodyColor: '#4b5563',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        padding: 12,
                        boxPadding: 6,
                        usePointStyle: true,
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y} kg`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false
                        }
                      },
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                          callback: function(value) {
                            return value + ' kg';
                          }
                        }
                      }
                    },
                    animation: {
                      duration: 2000
                    },
                    interaction: {
                      mode: 'index',
                      intersect: false
                    }
                  }}
                />
              </div>
              
              {expandedCard === 'harvest' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 bg-emerald-50 p-4 rounded-lg"
                >
                  <h4 className="font-medium text-emerald-700 mb-2">Harvest Insights</h4>
                  <p className="text-sm text-gray-700">
                    Your corn yields are showing a 8.2% increase compared to last season, potentially due to improved irrigation scheduling.
                    Wheat yields are stable but could benefit from additional soil amendments in the next planting season.
                  </p>
                  <button className="mt-2 text-sm font-medium text-emerald-600 flex items-center">
                    View detailed analysis <ArrowRightCircle size={16} className="ml-1" />
                  </button>
                </motion.div>
              )}
            </motion.div>
            
            {/* Crop Health Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`bg-white p-5 rounded-xl shadow-md border border-gray-100 ${
                (selectedReport === 'all' || selectedReport === 'health') ? '' : 'hidden'
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Crop Health Status</h3>
                  <p className="text-gray-500 text-sm">Current crop condition</p>
                </div>
                <button 
                  onClick={() => toggleCardExpansion({ cardId: 'health' })}
                  className="text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  {expandedCard === 'health' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-56 h-56">
                  <Doughnut 
                    data={{
                      labels: ['Healthy', 'At Risk'],
                      datasets: [
                        {
                          data: dynamicData.cropHealth,
                          backgroundColor: [
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(251, 113, 133, 0.8)'
                          ],
                          borderColor: [
                            'rgba(16, 185, 129, 1)',
                            'rgba(251, 113, 133, 1)'
                          ],
                          borderWidth: 1
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      cutout: '75%',
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                              size: 12
                            }
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          titleColor: '#111827',
                          bodyColor: '#4b5563',
                          borderColor: '#e5e7eb',
                          borderWidth: 1,
                          padding: 12,
                          boxPadding: 6,
                          usePointStyle: true,
                          callbacks: {
                            label: function(context) {
                              return `${context.label}: ${context.raw}%`;
                            }
                          }
                        }
                      },
                      animation: {
                        animateRotate: true,
                        animateScale: true
                      }
                    }}
                  />
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xl font-bold text-emerald-700">
                    {dynamicData.cropHealth[0]}% Healthy Crops
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {dynamicData.cropHealth[0] > 80 ? 'Excellent crop condition' : 
                    dynamicData.cropHealth[0] > 70 ? 'Good crop condition' : 
                    'Moderate crop condition - attention needed'}
                  </p>
                </div>
              </div>
              
              {expandedCard === 'health' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 bg-amber-50 p-4 rounded-lg"
                >
                  <h4 className="font-medium text-amber-700 mb-2">Health Recommendations</h4>
                  <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                    <li>Inspect eastern corn field for early signs of fungal infection</li>
                    <li>Apply preventative treatments to wheat in field #3</li>
                    <li>Schedule soil testing for nitrogen levels in southern fields</li>
                  </ul>
                </motion.div>
              )}
            </motion.div>
            
            {/* Irrigation Monitoring Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className={`bg-white p-5 rounded-xl shadow-md border border-gray-100 ${
                (selectedReport === 'all' || selectedReport === 'irrigation') ? 'lg:col-span-2' : 'hidden'
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Soil Moisture Levels</h3>
                  <p className="text-gray-500 text-sm">7-day moisture monitoring</p>
                </div>
                <button 
                  onClick={() => toggleCardExpansion({ cardId: 'irrigation' })}
                  className="text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  {expandedCard === 'irrigation' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              
              <div className={`transition-all duration-300 overflow-hidden ${
                expandedCard === 'irrigation' ? 'h-80' : 'h-64'
              }`}>
                <Bar 
                  data={{
                    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                    datasets: [
                      {
                        label: 'Field A Moisture (%)',
                        data: dynamicData.moisture,
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1,
                        borderRadius: 5
                      },
                      {
                        label: 'Field B Moisture (%)',
                        data: dynamicData.moisture.map(m => m * 0.85 + Math.random() * 8),
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 1,
                        borderRadius: 5
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          usePointStyle: true,
                          boxWidth: 6,
                          font: {
                            size: 12
                          }
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#111827',
                        bodyColor: '#4b5563',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        padding: 12,
                        boxPadding: 6,
                        usePointStyle: true,
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false
                        }
                      },
                      y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                          callback: function(value) {
                            return value + '%';
                          }
                        }
                      }
                    },
                    animation: {
                      duration: 2000
                    },
                    datasets: [
                      {
                        label: 'Field A Moisture (%)',
                        data: dynamicData.moisture,
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1,
                        borderRadius: 5
                      },
                      {
                        label: 'Field B Moisture (%)',
                        data: dynamicData.moisture.map(m => m * 0.85 + Math.random() * 8),
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 1,
                        borderRadius: 5
                      }
                    ]
                  }}
                />
              </div>
              
              {expandedCard === 'irrigation' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 bg-blue-50 p-4 rounded-lg"
                >
                  <h4 className="font-medium text-blue-700 mb-2">Irrigation Schedule</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-gray-700">Field A: Next irrigation <span className="font-medium">Tomorrow, 6:00 AM</span></span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                      <span className="text-gray-700">Field B: Next irrigation <span className="font-medium">Thursday, 6:00 AM</span></span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
            
            {/* Expense Breakdown Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className={`bg-white p-5 rounded-xl shadow-md border border-gray-100 ${
                (selectedReport === 'all' || selectedReport === 'expenses') ? '' : 'hidden'
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Expense Breakdown</h3>
                  <p className="text-gray-500 text-sm">Quarterly expense analysis</p>
                </div>
                <button 
                  onClick={() => toggleCardExpansion({ cardId: 'expenses' })}
                  className="text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  {expandedCard === 'expenses' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              
              <div className="w-full h-64">
                <Doughnut 
                  data={{
                    labels: ['Seeds', 'Fertilizer', 'Equipment', 'Labor', 'Irrigation', 'Other'],
                    datasets: [
                      {
                        data: dynamicData.expenses,
                        backgroundColor: [
                          'rgba(16, 185, 129, 0.8)', // emerald
                          'rgba(59, 130, 246, 0.8)', // blue
                          'rgba(245, 158, 11, 0.8)', // amber
                          'rgba(99, 102, 241, 0.8)', // indigo
                          'rgba(14, 165, 233, 0.8)', // sky
                          'rgba(168, 85, 247, 0.8)'  // purple
                        ],
                        borderColor: '#ffffff',
                        borderWidth: 2
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          usePointStyle: true,
                          padding: 15,
                          font: {
                            size: 12
                          }
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#111827',
                        bodyColor: '#4b5563',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        padding: 12,
                        boxPadding: 6,
                        usePointStyle: true,
                        callbacks: {
                          label: function(context) {
                            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                            const percentage = Math.round(((context.raw) / total) * 100);
                            const value = (context.raw).toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 0
                            });
                            return `${context.label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    },
                    cutout: '60%',
                    animation: {
                      animateRotate: true,
                      animateScale: true
                    }
                  }}
                />
              </div>
              
              {expandedCard === 'expenses' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 bg-indigo-50 p-4 rounded-lg"
                >
                  <h4 className="font-medium text-indigo-700 mb-2">Expense Insights</h4>
                  <div className="text-sm text-gray-700">
                    <p className="mb-2">Your highest expense category is fertilizer at 27% of total costs. Consider bulk purchasing options to reduce costs next season.</p>
                    <div className="flex justify-between text-xs font-medium mt-3">
                      <span>Total Expenses: $8,925</span>
                      <span className="text-green-600">Under budget by $1,075</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
          
          {/* Row for Season Comparison Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className={`mb-8 ${
              (selectedReport === 'all' || selectedReport === 'harvests') ? '' : 'hidden'
            }`}
          >
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Season-to-Season Comparison</h3>
                  <p className="text-gray-500 text-sm">Performance analysis across growing seasons</p>
                </div>
                <button 
                  onClick={() => toggleCardExpansion({ cardId: 'seasons' })}
                  className="text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  {expandedCard === 'seasons' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              
              <div className={`transition-all duration-300 overflow-hidden ${
                expandedCard === 'seasons' ? 'h-96' : 'h-64'
              }`}>
                <Bar 
                  data={{
                    labels: ['Spring 2024', 'Summer 2024', 'Fall 2024', 'Winter 2024', 'Spring 2025'],
                    datasets: [
                      {
                        label: 'Crop Yield (kg)',
                        data: [2850, 3560, 2950, 1200, 3685],
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 1,
                        borderRadius: 5,
                        yAxisID: 'y'
                      },
                      {
                        label: 'Water Usage (L)',
                        data: [15400, 18200, 14600, 8500, 12450],
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1,
                        borderRadius: 5,
                        yAxisID: 'y1'
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          usePointStyle: true,
                          boxWidth: 6,
                          font: {
                            size: 12
                          }
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#111827',
                        bodyColor: '#4b5563',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        padding: 12,
                        boxPadding: 6,
                        usePointStyle: true
                      }
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false
                        }
                      },
                      y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                          display: true,
                          text: 'Crop Yield (kg)',
                          color: 'rgba(16, 185, 129, 1)',
                          font: { size: 12 }
                        },
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)'
                        }
                      },
                      y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                          display: true,
                          text: 'Water Usage (L)',
                          color: 'rgba(59, 130, 246, 1)',
                          font: { size: 12 }
                        },
                        grid: {
                          display: false
                        }
                      }
                    },
                    animation: {
                      duration: 2000
                    },
                    datasets: [
                      {
                        label: 'Crop Yield (kg)',
                        data: [2850, 3560, 2950, 1200, 3685],
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 1,
                        borderRadius: 5,
                        yAxisID: 'y',
                        maxBarThickness: 30
                      },
                      {
                        label: 'Water Usage (L)',
                        data: [15400, 18200, 14600, 8500, 12450],
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1,
                        borderRadius: 5,
                        yAxisID: 'y1',
                        maxBarThickness: 30
                      }
                    ]
                  }}
                />
              </div>
              
              {expandedCard === 'seasons' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 bg-emerald-50 p-4 rounded-lg"
                >
                  <h4 className="font-medium text-emerald-700 mb-2">Performance Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <h5 className="font-medium">Yield Efficiency</h5>
                      <p>Spring 2025 shows a 29.3% improvement over Spring 2024, with significantly less water usage. Your drip irrigation system implementation has shown excellent results.</p>
                    </div>
                    <div>
                      <h5 className="font-medium">Seasonal Trends</h5>
                      <p>Your farm performs best during summer months, but the recent improvements have helped boost spring production considerably. Consider extending growing season with cold frame systems.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
          
          {/* Upcoming Activities and Weather Impacts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Upcoming Activities */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white p-5 rounded-xl shadow-md border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Activities</h3>
              
              <div className="space-y-4">
                {[
                  { date: 'Apr 10', title: 'Corn Planting - North Field', icon: <Crop size={16} className="text-emerald-600" /> },
                  { date: 'Apr 12', title: 'Irrigation System Maintenance', icon: <Droplets size={16} className="text-blue-600" /> },
                  { date: 'Apr 15', title: 'Apply Fertilizer - East Fields', icon: <TrendingUp size={16} className="text-amber-600" /> },
                  { date: 'Apr 18', title: 'Order Seeds for Summer Season', icon: <DollarSign size={16} className="text-purple-600" /> }
                ].map((activity, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ x: 4 }}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-all"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-700 font-medium">{activity.title}</h4>
                      <p className="text-gray-500 text-sm">{activity.date}</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-400" />
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-sm font-medium text-emerald-600 flex items-center mx-auto">
                  View full calendar <ArrowRightCircle size={16} className="ml-1" />
                </button>
              </div>
            </motion.div>
            
            {/* Weather Impact Analysis */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-white p-5 rounded-xl shadow-md border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Weather Impact Analysis</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-sm text-blue-700 font-medium">Rainfall Impact</p>
                  <h4 className="text-xl font-bold text-gray-800 mt-1">+12.3%</h4>
                  <p className="text-xs text-gray-500">Above average precipitation</p>
                </div>
                
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <p className="text-sm text-amber-700 font-medium">Temperature</p>
                  <h4 className="text-xl font-bold text-gray-800 mt-1">+2.5°C</h4>
                  <p className="text-xs text-gray-500">Above average temperature</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">5-Day Weather Forecast</h4>
                <div className="flex overflow-x-auto pb-2 space-x-3">
                  {[
                    { day: 'Today', temp: '25°C', icon: <SunDim size={24} className="text-amber-500" />, desc: 'Sunny' },
                    { day: 'Wed', temp: '23°C', icon: <SunDim size={24} className="text-amber-500" />, desc: 'Sunny' },
                    { day: 'Thu', temp: '22°C', icon: <Droplets size={24} className="text-blue-500" />, desc: 'Light Rain' },
                    { day: 'Fri', temp: '19°C', icon: <Droplets size={24} className="text-blue-500" />, desc: 'Showers' },
                    { day: 'Sat', temp: '21°C', icon: <SunDim size={24} className="text-amber-500" />, desc: 'Partly Cloudy' }
                  ].map((weather, index) => (
                    <div key={index} className="flex-shrink-0 w-16 p-2 text-center rounded-lg bg-gray-50">
                      <p className="text-xs font-medium text-gray-600">{weather.day}</p>
                      <div className="my-1">{weather.icon}</div>
                      <p className="text-sm font-bold">{weather.temp}</p>
                      <p className="text-xs text-gray-500">{weather.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <p className="text-sm font-medium text-emerald-700">Recommendation</p>
                <p className="text-sm text-gray-700 mt-1">Prepare for potential water logging in low-lying fields due to upcoming rain. Consider adjusting the irrigation schedule and check drainage systems.</p>
              </div>
            </motion.div>
          </div>
          
          {/* Custom Reports Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="bg-white p-5 rounded-xl shadow-md border border-gray-100 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Custom Reports</h3>
                <p className="text-gray-500 text-sm">Generate specialized reports for your farm</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all cursor-pointer">
                <div className="p-2 bg-emerald-100 rounded-lg w-fit mb-3">
                  <BarChart3 size={18} className="text-emerald-600" />
                </div>
                <h4 className="font-medium text-gray-800">Crop Performance</h4>
                <p className="text-sm text-gray-600 mt-1">Detailed analysis of crop yields and growth metrics</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                <div className="p-2 bg-blue-100 rounded-lg w-fit mb-3">
                  <Droplets size={18} className="text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-800">Water Efficiency</h4>
                <p className="text-sm text-gray-600 mt-1">Water usage optimization and irrigation effectiveness</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer">
                <div className="p-2 bg-indigo-100 rounded-lg w-fit mb-3">
                  <DollarSign size={18} className="text-indigo-600" />
                </div>
                <h4 className="font-medium text-gray-800">Financial Summary</h4>
                <p className="text-sm text-gray-600 mt-1">Revenue, expenses and ROI calculation by crop type</p>
              </div>
            </div>
            
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-sm font-medium text-gray-700">Advanced Filters:</span>
                <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center">
                  <Filter size={12} className="mr-1" /> By Crop Type
                </button>
                <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center">
                  <Filter size={12} className="mr-1" /> By Field
                </button>
                <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center">
                  <Calendar size={12} className="mr-1" /> Date Range
                </button>
                <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center">
                  <Filter size={12} className="mr-1" /> More Filters
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* AI-Powered Insights Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="bg-gradient-to-br from-indigo-500 to-emerald-500 p-0.5 rounded-xl shadow-md mb-8"
          >
            <div className="bg-white p-5 rounded-lg">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-indigo-100 rounded-full mr-3">
                  <TrendingUp size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Farm Performance Insights</h3>
                  <p className="text-gray-500 text-sm">Data-driven recommendations to optimize your farm</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <h4 className="font-medium text-emerald-800 mb-2">Yield Optimization</h4>
                  <p className="text-sm text-gray-700">Your corn yields are 15% below regional averages for similar soil types. Consider soil testing for nitrogen deficiency and possibly adjusting planting density in north fields.</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-2">Irrigation Efficiency</h4>
                  <p className="text-sm text-gray-700">Your water usage efficiency has improved by 18% since implementing drip irrigation. Consider expanding this system to your eastern fields to achieve similar results there.</p>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <h4 className="font-medium text-amber-800 mb-2">Disease Prevention</h4>
                  <p className="text-sm text-gray-700">Based on current humidity levels and soil conditions, there&apos;s a 65% probability of fungal development in wheat crops. Consider preventative treatment within the next 7 days.</p>
                </div>
                
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <h4 className="font-medium text-indigo-800 mb-2">Financial Projection</h4>
                  <p className="text-sm text-gray-700">Current crop prices and yield projections suggest a 12% increase in revenue this season. Consider forward contracts to lock in current market prices for maximum profit.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}