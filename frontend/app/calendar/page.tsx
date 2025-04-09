/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  List,
  Grid,
  AlertTriangle,
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Droplet,
  Thermometer,
  Layers,
  Crop,
  Truck,
  Map,
  Bell,
  BarChart2,
  Activity,
  PieChart,
  Flag,
  CheckCircle,
  X,
  CheckSquare,
} from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  isSameDay,
  parseISO,
  addDays,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import Sidebar from "../../components/Sidebar";
import Image from "next/image";
import "../../sass/fonts.scss";

// Types for our events and crops
interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  type:
    | "planting"
    | "harvesting"
    | "fertilizing"
    | "irrigation"
    | "pest_control"
    | "maintenance"
    | "other";
  completed: boolean;
  cropId?: string;
  priority: "low" | "medium" | "high";
}

interface Crop {
  id: string;
  name: string;
  image: string;
  plantedDate: string;
  estimatedHarvestDate: string;
  progress: number;
  healthStatus: "excellent" | "good" | "fair" | "poor";
  fieldLocation: string;
  area: number;
  yieldEstimate: number;
}

interface WeatherForecast {
  date: string;
  condition: "sunny" | "cloudy" | "rainy" | "stormy" | "windy";
  temperature: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  deadline: string;
  priority: "low" | "medium" | "high";
}

interface Alert {
  id: string;
  title: string;
  message: string;
  type: "warning" | "danger" | "info" | "success";
  date: string;
  read: boolean;
}

// Mock data - will be replaced with API calls
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Plant Corn",
    date: "2025-04-15",
    description: "Plant corn in north field",
    type: "planting",
    completed: false,
    cropId: "1",
    priority: "high",
  },
  {
    id: "2",
    title: "Harvest Wheat",
    date: "2025-04-20",
    description: "Harvest wheat from east field",
    type: "harvesting",
    completed: false,
    cropId: "2",
    priority: "high",
  },
  {
    id: "3",
    title: "Fertilize Soybeans",
    date: "2025-04-12",
    description: "Apply nitrogen-rich fertilizer to soybean field",
    type: "fertilizing",
    completed: true,
    cropId: "3",
    priority: "medium",
  },
  {
    id: "4",
    title: "Irrigation Check",
    date: "2025-04-22",
    description: "Check irrigation system in all fields",
    type: "irrigation",
    completed: false,
    priority: "medium",
  },
  {
    id: "5",
    title: "Pest Control",
    date: "2025-04-14",
    description: "Apply organic pesticide to control aphids in orchard",
    type: "pest_control",
    completed: false,
    cropId: "4",
    priority: "high",
  },
  {
    id: "6",
    title: "Tractor Maintenance",
    date: "2025-04-18",
    description: "Schedule routine maintenance for John Deere tractor",
    type: "maintenance",
    completed: false,
    priority: "low",
  },
];

const mockCrops: Crop[] = [
  {
    id: "1",
    name: "Corn",
    image: "/assets/sweet.jpeg",
    plantedDate: "2025-03-15",
    estimatedHarvestDate: "2025-07-20",
    progress: 25,
    healthStatus: "excellent",
    fieldLocation: "North Field",
    area: 15.5,
    yieldEstimate: 180,
  },
  {
    id: "2",
    name: "Wheat",
    image: "/assets/wheat.jpg",
    plantedDate: "2024-11-10",
    estimatedHarvestDate: "2025-06-15",
    progress: 70,
    healthStatus: "good",
    fieldLocation: "East Field",
    area: 22.3,
    yieldEstimate: 156,
  },
  {
    id: "3",
    name: "Soybeans",
    image: "/assets/soy.jpeg",
    plantedDate: "2025-04-05",
    estimatedHarvestDate: "2025-09-30",
    progress: 10,
    healthStatus: "fair",
    fieldLocation: "South Field",
    area: 18.7,
    yieldEstimate: 132,
  },
  {
    id: "4",
    name: "Apple Orchard",
    image: "/assets/apple.jpeg",
    plantedDate: "2022-04-15",
    estimatedHarvestDate: "2025-09-10",
    progress: 85,
    healthStatus: "excellent",
    fieldLocation: "West Orchard",
    area: 5.8,
    yieldEstimate: 220,
  },
  {
    id: "5",
    name: "Potatoes",
    image: "/assets/potatoes.jpeg",
    plantedDate: "2025-03-25",
    estimatedHarvestDate: "2025-08-15",
    progress: 30,
    healthStatus: "good",
    fieldLocation: "Central Field",
    area: 8.2,
    yieldEstimate: 168,
  },
  {
    id: "6",
    name: "Coffee",
    image: "/assets/coffee.jpeg",
    plantedDate: "2024-10-12",
    estimatedHarvestDate: "2025-05-30",
    progress: 65,
    healthStatus: "excellent",
    fieldLocation: "Hillside Plot",
    area: 7.6,
    yieldEstimate: 145,
  },
  {
    id: "7",
    name: "Bananas",
    image: "/assets/bananas.jpg",
    plantedDate: "2024-09-20",
    estimatedHarvestDate: "2025-06-25",
    progress: 55,
    healthStatus: "good",
    fieldLocation: "Lower Valley",
    area: 6.4,
    yieldEstimate: 210,
  },
  {
    id: "8",
    name: "Cassava",
    image: "/assets/cassava.jpeg",
    plantedDate: "2025-02-18",
    estimatedHarvestDate: "2025-11-15",
    progress: 20,
    healthStatus: "good",
    fieldLocation: "Northeast Patch",
    area: 12.8,
    yieldEstimate: 195,
  },
  {
    id: "9",
    name: "Kale",
    image: "/assets/kale.jpeg",
    plantedDate: "2025-03-30",
    estimatedHarvestDate: "2025-06-05",
    progress: 15,
    healthStatus: "excellent",
    fieldLocation: "Garden Plot",
    area: 3.2,
    yieldEstimate: 90,
  },
  {
    id: "10",
    name: "Millet",
    image: "/assets/millet.jpeg",
    plantedDate: "2025-03-05",
    estimatedHarvestDate: "2025-07-30",
    progress: 35,
    healthStatus: "fair",
    fieldLocation: "Southeast Field",
    area: 9.5,
    yieldEstimate: 125,
  },
];

const mockWeatherForecast: WeatherForecast[] = [
  {
    date: format(new Date(), "yyyy-MM-dd"),
    condition: "sunny",
    temperature: 68,
    precipitation: 0,
    humidity: 45,
    windSpeed: 8,
  },
  {
    date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    condition: "cloudy",
    temperature: 65,
    precipitation: 20,
    humidity: 62,
    windSpeed: 12,
  },
  {
    date: format(addDays(new Date(), 2), "yyyy-MM-dd"),
    condition: "rainy",
    temperature: 59,
    precipitation: 80,
    humidity: 78,
    windSpeed: 14,
  },
  {
    date: format(addDays(new Date(), 3), "yyyy-MM-dd"),
    condition: "sunny",
    temperature: 71,
    precipitation: 0,
    humidity: 40,
    windSpeed: 6,
  },
  {
    date: format(addDays(new Date(), 4), "yyyy-MM-dd"),
    condition: "cloudy",
    temperature: 67,
    precipitation: 30,
    humidity: 55,
    windSpeed: 10,
  },
];

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Order new seeds for winter crop",
    completed: false,
    deadline: format(addDays(new Date(), 5), "yyyy-MM-dd"),
    priority: "high",
  },
  {
    id: "2",
    title: "Schedule equipment inspection",
    completed: true,
    deadline: format(addDays(new Date(), 2), "yyyy-MM-dd"),
    priority: "medium",
  },
  {
    id: "3",
    title: "Review soil analysis reports",
    completed: false,
    deadline: format(addDays(new Date(), 3), "yyyy-MM-dd"),
    priority: "high",
  },
  {
    id: "4",
    title: "Update farm insurance policy",
    completed: false,
    deadline: format(addDays(new Date(), 10), "yyyy-MM-dd"),
    priority: "low",
  },
];

const mockAlerts: Alert[] = [
  {
    id: "1",
    title: "Potential Frost Warning",
    message:
      "Temperatures expected to drop below freezing tonight. Consider protecting sensitive crops.",
    type: "warning",
    date: format(new Date(), "yyyy-MM-dd"),
    read: false,
  },
  {
    id: "2",
    title: "Pest Detection Alert",
    message:
      "Aphids detected in the apple orchard. Immediate treatment recommended.",
    type: "danger",
    date: format(subMonths(new Date(), 1), "yyyy-MM-dd"),
    read: true,
  },
  {
    id: "3",
    title: "Optimal Planting Conditions",
    message:
      "Ideal soil temperature and moisture levels for corn planting this week.",
    type: "info",
    date: format(addDays(new Date(), -2), "yyyy-MM-dd"),
    read: false,
  },
];

// Event type colors and icons
const eventTypeConfig = {
  planting: {
    colors: "bg-emerald-100 border-emerald-500 text-emerald-700",
    icon: <Crop size={16} className="mr-1" />,
  },
  harvesting: {
    colors: "bg-amber-100 border-amber-500 text-amber-700",
    icon: <Truck size={16} className="mr-1" />,
  },
  fertilizing: {
    colors: "bg-blue-100 border-blue-500 text-blue-700",
    icon: <Layers size={16} className="mr-1" />,
  },
  irrigation: {
    colors: "bg-cyan-100 border-cyan-500 text-cyan-700",
    icon: <Droplet size={16} className="mr-1" />,
  },
  pest_control: {
    colors: "bg-red-100 border-red-500 text-red-700",
    icon: <AlertTriangle size={16} className="mr-1" />,
  },
  maintenance: {
    colors: "bg-purple-100 border-purple-500 text-purple-700",
    icon: <Activity size={16} className="mr-1" />,
  },
  other: {
    colors: "bg-gray-100 border-gray-500 text-gray-700",
    icon: <CalendarIcon size={16} className="mr-1" />,
  },
};

// Priority colors
const priorityColors = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

// Weather condition icons
const weatherIcons = {
  sunny: <Sun size={24} className="text-yellow-500" />,
  cloudy: <Cloud size={24} className="text-gray-500" />,
  rainy: <CloudRain size={24} className="text-blue-500" />,
  stormy: <AlertTriangle size={24} className="text-purple-500" />,
  windy: <Wind size={24} className="text-teal-500" />,
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>(mockEvents);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [crops, setCrops] = useState<Crop[]>(mockCrops);
  const [weather, setWeather] =
    useState<WeatherForecast[]>(mockWeatherForecast);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"month" | "week" | "list">("list");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [visibleSection, setVisibleSection] = useState<
    "calendar" | "crops" | "analytics"
  >("calendar");

  // Tab visibility states
  const [showWeather, setShowWeather] = useState(true);
  const [showTasks, setShowTasks] = useState(true);
  const [showAlerts, setShowAlerts] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    description: "",
    type: "other",
    cropId: "",
    priority: "medium",
  });

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1)
    );
  };

  // Get days in week
  const getDaysInWeek = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    const end = endOfWeek(date, { weekStartsOn: 0 });

    return eachDayOfInterval({ start, end });
  };

  // Handle next/previous month
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Handle next/previous week
  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(parseISO(event.date), day));
  };

  // Get upcoming events (next 7 days)
  const getUpcomingEvents = () => {
    const today = new Date();
    const nextWeek = addDays(today, 7);

    return events
      .filter((event) => {
        const eventDate = parseISO(event.date);
        return eventDate >= today && eventDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Open modal to add new event
  const openAddEventModal = (day?: Date) => {
    setIsEditMode(false);
    setSelectedEvent(null);
    setFormData({
      title: "",
      date: day ? format(day, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      description: "",
      type: "other",
      cropId: "",
      priority: "medium",
    });
    setIsModalOpen(true);
  };

  // Open modal to edit event
  const openEditEventModal = (event: Event) => {
    setIsEditMode(true);
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      description: event.description,
      type: event.type,
      cropId: event.cropId || "",
      priority: event.priority,
    });
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && selectedEvent) {
      // Update existing event
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id
          ? { ...event, ...formData, completed: event.completed }
          : event
      );
      setEvents(updatedEvents as Event[]);
    } else {
      // Add new event
      const newEvent: Event = {
        id: Date.now().toString(),
        ...formData,
        completed: false,
        cropId: formData.cropId || undefined,
        type: formData.type as Event["type"],
        priority: formData.priority as "low" | "medium" | "high",
      };

      setEvents([...events, newEvent]);
    }

    setIsModalOpen(false);
  };

  // Delete event
  const deleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  // Toggle event completion
  const toggleEventCompletion = (id: string) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, completed: !event.completed } : event
      )
    );
  };

  // Toggle task completion
  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Mark alert as read
  const markAlertAsRead = (id: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  };

  // Filter events based on selected filter
  const filteredEvents = filter
    ? events.filter((event) => event.type === filter)
    : events;

  // Get unread alerts count
  const unreadAlertsCount = alerts.filter((alert) => !alert.read).length;

  // Calculate overall farm health (percentage)
  const calculateFarmHealth = () => {
    if (crops.length === 0) return 0;

    const healthScores = {
      excellent: 1,
      good: 0.75,
      fair: 0.5,
      poor: 0.25,
    };

    const totalScore = crops.reduce(
      (acc, crop) => acc + healthScores[crop.healthStatus],
      0
    );
    return Math.round((totalScore / crops.length) * 100);
  };

  // Calculate task completion percentage
  const calculateTaskCompletion = () => {
    if (tasks.length === 0) return 0;

    const completedTasks = tasks.filter((task) => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  // Get health status color
  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "fair":
        return "text-yellow-600";
      case "poor":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Top Header with Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 rounded-xl shadow-lg overflow-hidden relative"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{ backgroundImage: 'url("/assets/kale.jpeg")' }}
            >
              {/* Gradient Overlay with reduced opacity */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-green-800/80"></div>
            </div>

            {/* Content */}
            <div className="p-6 text-white relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h1 className="text-3xl font-bold flex items-center">
                    <CalendarIcon className="mr-2" />
                    Farm Management Hub
                  </h1>
                  <p className="mt-1 text-green-100">
                    Your central command for all farm operations
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center">
                  <div className="text-right mr-6">
                    <div className="text-sm text-green-200">Today</div>
                    <div className="text-xl font-semibold">
                      {format(new Date(), "EEEE, MMMM d")}
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    {weather[0] && weatherIcons[weather[0].condition]}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-green-100">Farm Health</h3>
                    <PieChart size={18} className="text-green-200" />
                  </div>
                  <div className="mt-2 text-2xl font-bold">
                    {calculateFarmHealth()}%
                  </div>
                  <div className="mt-1 text-sm text-green-200">
                    Based on crop conditions
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-green-100">Upcoming Events</h3>
                    <CalendarIcon size={18} className="text-green-200" />
                  </div>
                  <div className="mt-2 text-2xl font-bold">
                    {getUpcomingEvents().length}
                  </div>
                  <div className="mt-1 text-sm text-green-200">Next 7 days</div>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-green-100">Tasks Completed</h3>
                    <CheckCircle size={18} className="text-green-200" />
                  </div>
                  <div className="mt-2 text-2xl font-bold">
                    {calculateTaskCompletion()}%
                  </div>
                  <div className="mt-1 text-sm text-green-200">
                    {tasks.filter((t) => t.completed).length} of {tasks.length}{" "}
                    tasks
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4 ">
                  <div className="flex justify-between items-center">
                    <h3 className="text-green-100">Active Crops</h3>
                    <Crop size={18} className="text-green-200" />
                  </div>
                  <div className="mt-2 text-2xl font-bold">{crops.length}</div>
                  <div className="mt-1 text-sm text-green-200">
                    Across{" "}
                    {crops.reduce((acc, crop) => acc + crop.area, 0).toFixed(1)}{" "}
                    acres
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="mb-6 flex border-b border-gray-200">
            <button
              onClick={() => setVisibleSection("calendar")}
              className={`px-4 py-3 flex items-center ${
                visibleSection === "calendar"
                  ? "border-b-2 border-green-600 text-green-600 font-medium"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              <CalendarIcon size={18} className="mr-2" />
              Calendar & Planning
            </button>
            <button
              onClick={() => setVisibleSection("crops")}
              className={`px-4 py-3 flex items-center ${
                visibleSection === "crops"
                  ? "border-b-2 border-green-600 text-green-600 font-medium"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              <Crop size={18} className="mr-2" />
              Crops & Fields
            </button>
            <button
              onClick={() => setVisibleSection("analytics")}
              className={`px-4 py-3 flex items-center ${
                visibleSection === "analytics"
                  ? "border-b-2 border-green-600 text-green-600 font-medium"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              <BarChart2 size={18} className="mr-2" />
              Analytics
            </button>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Weather, Tasks, Alerts */}
            <div className="space-y-6">
              {/* Weather Forecast Card */}
              {showWeather && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white flex justify-between items-center">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Cloud className="mr-2" /> Weather Forecast
                    </h3>
                    <button
                      onClick={() => setShowWeather(false)}
                      className="p-1 hover:bg-blue-700 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="flex overflow-x-auto pb-2 space-x-4">
                      {weather.map((day, index) => (
                        <motion.div
                          key={day.date}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex-shrink-0 w-24 bg-gray-50 rounded-lg p-3 text-center"
                        >
                          <div className="text-sm text-gray-600">
                            {index === 0
                              ? "Today"
                              : format(parseISO(day.date), "E")}
                          </div>
                          <div className="my-2">
                            {weatherIcons[day.condition]}
                          </div>
                          <div className="font-medium">{day.temperature}°F</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {day.precipitation > 0
                              ? `${day.precipitation}% rain`
                              : "No rain"}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-4 bg-blue-50 rounded-lg p-3">
                      <div className="text-sm font-medium text-blue-700">
                        Today&apos;s Details
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Thermometer
                            size={14}
                            className="mr-1 text-blue-500"
                          />
                          <span>Temperature: {weather[0]?.temperature}°F</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Wind size={14} className="mr-1 text-blue-500" />
                          <span>Wind: {weather[0]?.windSpeed} mph</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Droplet size={14} className="mr-1 text-blue-500" />
                          <span>Humidity: {weather[0]?.humidity}%</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <CloudRain size={14} className="mr-1 text-blue-500" />
                          <span>
                            Precipitation: {weather[0]?.precipitation}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tasks Card */}
              {showTasks && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white flex justify-between items-center">
                    <h3 className="text-lg font-semibold flex items-center">
                      <CheckSquare className="mr-2" /> Tasks
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm bg-white text-purple-600 px-2 py-1 rounded">
                        {tasks.filter((t) => t.completed).length}/{tasks.length}
                      </span>
                      <button
                        onClick={() => setShowTasks(false)}
                        className="p-1 hover:bg-purple-700 rounded-full"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="space-y-3">
                      {tasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={`flex items-center p-3 rounded-lg border-l-4 ${
                            task.completed
                              ? "bg-gray-50 border-gray-300"
                              : `bg-white border-${
                                  task.priority === "high"
                                    ? "red"
                                    : task.priority === "medium"
                                    ? "yellow"
                                    : "green"
                                }-500`
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(task.id)}
                            className="mr-3 h-5 w-5 text-green-600 rounded focus:ring-green-500"
                          />
                          <div className="flex-1">
                            <div
                              className={`font-medium ${
                                task.completed
                                  ? "text-gray-500 line-through"
                                  : "text-gray-800"
                              }`}
                            >
                              {task.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Due:{" "}
                              {format(parseISO(task.deadline), "MMM d, yyyy")}
                            </div>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              priorityColors[task.priority]
                            }`}
                          >
                            {task.priority}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <button className="w-full mt-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center">
                      <Plus size={14} className="mr-1" /> Add New Task
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Alerts Card */}
              {showAlerts && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-r from-red-500 to-red-600 text-white flex justify-between items-center">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Bell className="mr-2" /> Alerts
                    </h3>
                    <div className="flex items-center space-x-2">
                      {unreadAlertsCount > 0 && (
                        <span className="text-sm bg-white text-red-600 px-2 py-1 rounded">
                          {unreadAlertsCount} new
                        </span>
                      )}
                      <button
                        onClick={() => setShowAlerts(false)}
                        className="p-1 hover:bg-red-700 rounded-full"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="space-y-3">
                      {alerts.map((alert, index) => (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={`p-3 rounded-lg ${
                            alert.type === "warning"
                              ? "bg-yellow-50 border-l-4 border-yellow-500"
                              : alert.type === "danger"
                              ? "bg-red-50 border-l-4 border-red-500"
                              : alert.type === "info"
                              ? "bg-blue-50 border-l-4 border-blue-500"
                              : "bg-green-50 border-l-4 border-green-500"
                          } ${
                            !alert.read
                              ? "ring-2 ring-offset-2 ring-inset ring-indigo-100"
                              : ""
                          }`}
                          onClick={() => markAlertAsRead(alert.id)}
                        >
                          <div className="flex justify-between">
                            <h4 className="font-medium text-gray-800">
                              {alert.title}
                              {!alert.read && (
                                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                                  New
                                </span>
                              )}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {format(parseISO(alert.date), "MMM d")}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            {alert.message}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Middle and Right Columns - Content based on visible section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Calendar Section */}
              {visibleSection === "calendar" && (
                <>
                  {/* Calendar Controls */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center">
                        <button
                          onClick={viewMode === "month" ? prevMonth : prevWeek}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <h2 className="text-xl font-semibold mx-4 min-w-32 text-center text-indigo-400">
                          {viewMode === "month"
                            ? format(currentDate, "MMMM yyyy")
                            : `${format(
                                startOfWeek(currentDate),
                                "MMM d"
                              )} - ${format(
                                endOfWeek(currentDate),
                                "MMM d, yyyy"
                              )}`}
                        </h2>
                        <button
                          onClick={viewMode === "month" ? nextMonth : nextWeek}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>

                      <div className="flex space-x-2">
                        <div className="bg-gray-100 p-1 rounded-lg flex">
                          <button
                            onClick={() => setViewMode("month")}
                            className={`px-3 py-1 rounded-md text-sm flex items-center ${
                              viewMode === "month"
                                ? "bg-white shadow-sm text-emerald-700"
                                : "text-gray-700"
                            }`}
                          >
                            <Grid size={14} className="mr-1" />
                            Month
                          </button>
                          <button
                            onClick={() => setViewMode("week")}
                            className={`px-3 py-1 rounded-md text-sm flex items-center ${
                              viewMode === "week"
                                ? "bg-white shadow-sm text-green-700"
                                : "text-gray-700"
                            }`}
                          >
                            <CalendarIcon size={14} className="mr-1" />
                            Week
                          </button>
                          <button
                            onClick={() => setViewMode("list")}
                            className={`px-3 py-1 rounded-md text-sm flex items-center ${
                              viewMode === "list"
                                ? "bg-white shadow-sm text-emerald-500"
                                : "text-gray-700"
                            }`}
                          >
                            <List size={14} className="mr-1" />
                            List
                          </button>
                        </div>

                        <div className="relative">
                          <button
                            onClick={() =>
                              setFilter(filter ? null : "harvesting")
                            }
                            className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-sm flex items-center text-slate-600 hover:bg-gray-50"
                          >
                            <Filter size={14} className="mr-1" />
                            {filter ? `Filtered: ${filter}` : "Filter Events"}
                          </button>
                          {filter && (
                            <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                              1
                            </span>
                          )}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openAddEventModal()}
                          className="px-4 py-2 bg-emerald-400 text-white rounded-lg flex items-center shadow-sm hover:bg-green-700 transition-colors"
                        >
                          <Plus size={18} className="mr-1" />
                          Add Event
                        </motion.button>
                      </div>
                    </div>

                    {/* Calendar Content */}
                    <div className="bg-white">
                      {/* Month View */}
                      {viewMode === "month" && (
                        <div>
                          {/* Day headers */}
                          <div className="grid grid-cols-7 bg-gray-50">
                            {[
                              "Sun",
                              "Mon",
                              "Tue",
                              "Wed",
                              "Thu",
                              "Fri",
                              "Sat",
                            ].map((day) => (
                              <div
                                key={day}
                                className="py-2 text-center text-sm font-medium text-gray-700"
                              >
                                {day}
                              </div>
                            ))}
                          </div>

                          {/* Calendar grid */}
                          <div className="grid grid-cols-7 border-t border-l">
                            {getDaysInMonth(currentDate).map((day, index) => {
                              const dayEvents = getEventsForDay(day);
                              const hasEvents = dayEvents.length > 0;
                              const isToday = isSameDay(day, new Date());

                              return (
                                <motion.div
                                  key={index}
                                  whileHover={{
                                    backgroundColor: "rgba(0,0,0,0.02)",
                                  }}
                                  onClick={() => openAddEventModal(day)}
                                  className={`min-h-24 p-2 border-r border-b relative cursor-pointer ${
                                    isToday ? "bg-green-50" : ""
                                  }`}
                                >
                                  <div
                                    className={`text-sm ${
                                      isToday
                                        ? "font-bold text-green-700 bg-green-100 rounded-full w-6 h-6 flex items-center justify-center"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {format(day, "d")}
                                  </div>

                                  {/* Event indicators */}
                                  <div className="mt-1 max-h-20 overflow-y-auto">
                                    {dayEvents.map((event) => (
                                      <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ scale: 1.03 }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openEditEventModal(event);
                                        }}
                                        className={`p-1 mb-1 text-xs rounded truncate border-l-4 ${
                                          eventTypeConfig[event.type].colors
                                        } ${
                                          event.completed
                                            ? "opacity-50 line-through"
                                            : ""
                                        }`}
                                      >
                                        <div className="flex items-center">
                                          {eventTypeConfig[event.type].icon}
                                          <span className="truncate">
                                            {event.title}
                                          </span>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>

                                  {hasEvents && (
                                    <div className="absolute bottom-1 right-1">
                                      <span className="flex h-5 w-5 items-center justify-center bg-green-600 text-white text-xs rounded-full">
                                        {dayEvents.length}
                                      </span>
                                    </div>
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Week View */}
                      {viewMode === "week" && (
                        <div>
                          {/* Day headers */}
                          <div className="grid grid-cols-7 bg-gray-50">
                            {getDaysInWeek(currentDate).map((day, idx) => (
                              <div
                                key={idx}
                                className={`py-2 text-center ${
                                  isSameDay(day, new Date())
                                    ? "bg-green-100 text-green-800 font-medium"
                                    : "text-gray-700"
                                }`}
                              >
                                <div className="text-sm font-medium">
                                  {format(day, "EEE")}
                                </div>
                                <div className="text-lg font-bold mt-1">
                                  {format(day, "d")}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Calendar grid */}
                          <div className="grid grid-cols-7 border-t">
                            {getDaysInWeek(currentDate).map((day, idx) => {
                              const dayEvents = getEventsForDay(day);

                              return (
                                <motion.div
                                  key={idx}
                                  whileHover={{
                                    backgroundColor: "rgba(0,0,0,0.02)",
                                  }}
                                  onClick={() => openAddEventModal(day)}
                                  className="min-h-64 p-2 border-r border-b relative cursor-pointer"
                                >
                                  {/* Event blocks */}
                                  <div className="space-y-2">
                                    {dayEvents.map((event) => (
                                      <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openEditEventModal(event);
                                        }}
                                        className={`p-2 rounded-lg border-l-4 ${
                                          eventTypeConfig[event.type].colors
                                        } ${
                                          event.completed ? "opacity-60" : ""
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <span
                                            className={`text-xs px-1.5 py-0.5 rounded-full ${
                                              priorityColors[event.priority]
                                            }`}
                                          >
                                            {event.priority}
                                          </span>
                                          {event.completed && (
                                            <span className="text-xs bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-full">
                                              Done
                                            </span>
                                          )}
                                        </div>
                                        <div
                                          className={`font-medium mt-1 ${
                                            event.completed
                                              ? "line-through text-gray-500"
                                              : ""
                                          }`}
                                        >
                                          {event.title}
                                        </div>
                                        <div className="flex items-center mt-1 text-xs text-gray-600">
                                          {eventTypeConfig[event.type].icon}
                                          {event.type}
                                        </div>
                                      </motion.div>
                                    ))}

                                    {dayEvents.length === 0 && (
                                      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                        <div className="text-center">
                                          <Plus
                                            size={20}
                                            className="mx-auto mb-1"
                                          />
                                          Add Event
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* List View */}
                      {viewMode === "list" && (
                        <div className="p-4">
                          <h3 className="text-lg font-medium mb-4 text-blue-500">
                            Upcoming Events
                          </h3>

                          {filteredEvents.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                              <CalendarIcon
                                size={48}
                                className="mx-auto mb-3 text-gray-400"
                              />
                              <p>No events found</p>
                              {filter && (
                                <p className="mt-2 text-sm">
                                  Try clearing your filter
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {filteredEvents
                                .sort(
                                  (a, b) =>
                                    new Date(a.date).getTime() -
                                    new Date(b.date).getTime()
                                )
                                .map((event) => {
                                  const eventCrop = crops.find(
                                    (crop) => crop.id === event.cropId
                                  );

                                  return (
                                    <motion.div
                                      key={event.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      whileHover={{
                                        y: -2,
                                        boxShadow:
                                          "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                      }}
                                      transition={{ duration: 0.2 }}
                                      className={`border rounded-lg p-4 ${
                                        event.completed
                                          ? "bg-gray-50"
                                          : "bg-white"
                                      }`}
                                    >
                                      <div className="flex items-start">
                                        <div className="flex-shrink-0 mr-4">
                                          <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                                              eventTypeConfig[event.type].colors
                                            }`}
                                          >
                                            {event.type === "planting" && (
                                              <Crop size={20} />
                                            )}
                                            {event.type === "harvesting" && (
                                              <Truck size={20} />
                                            )}
                                            {event.type === "fertilizing" && (
                                              <Layers size={20} />
                                            )}
                                            {event.type === "irrigation" && (
                                              <Droplet size={20} />
                                            )}
                                            {event.type === "pest_control" && (
                                              <AlertTriangle size={20} />
                                            )}
                                            {event.type === "maintenance" && (
                                              <Activity size={20} />
                                            )}
                                            {event.type === "other" && (
                                              <CalendarIcon size={20} />
                                            )}
                                          </div>
                                        </div>

                                        <div className="flex-1">
                                          <div className="flex justify-between">
                                            <h4
                                              className={`font-medium text-lg ${
                                                event.completed
                                                  ? "line-through text-gray-500"
                                                  : "text-gray-800"
                                              }`}
                                            >
                                              {event.title}
                                            </h4>
                                            <div className="flex space-x-2">
                                              <button
                                                onClick={() =>
                                                  toggleEventCompletion(
                                                    event.id
                                                  )
                                                }
                                                className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                                  event.completed
                                                    ? "bg-gray-200 text-gray-700"
                                                    : "bg-green-100 text-green-700"
                                                }`}
                                              >
                                                {event.completed
                                                  ? "Completed"
                                                  : "Mark Complete"}
                                              </button>
                                              <button
                                                onClick={() =>
                                                  openEditEventModal(event)
                                                }
                                                className="p-1  rounded-full hover:bg-emerald-200 "
                                              >
                                                <Edit2 size={16} color="#333" />
                                              </button>
                                              <button
                                                onClick={() =>
                                                  deleteEvent(event.id)
                                                }
                                                className="p-1 rounded-full hover:bg-red-100 text-red-500"
                                              >
                                                <Trash2 size={16} />
                                              </button>
                                            </div>
                                          </div>

                                          <div className="mt-2 flex items-center">
                                            <span className="font-medium text-gray-600">
                                              {format(
                                                parseISO(event.date),
                                                "MMMM d, yyyy"
                                              )}
                                            </span>
                                            <span
                                              className={`ml-3 text-xs px-2 py-1 rounded-full ${
                                                priorityColors[event.priority]
                                              }`}
                                            >
                                              {event.priority} priority
                                            </span>
                                            {eventCrop && (
                                              <span className="ml-2 text-xs bg-emerald-200 px-2 text-black py-1 rounded-lg">
                                                Crop: {eventCrop.name}
                                              </span>
                                            )}
                                          </div>

                                          <p className="mt-2 text-gray-600 text-sm">
                                            {event.description}
                                          </p>

                                          {eventCrop && (
                                            <div className="mt-3 flex items-center bg-gray-50 p-2 rounded-lg">
                                              <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-100">
                                                <Image
                                                  src={eventCrop.image}
                                                  alt={eventCrop.name}
                                                  width={40}
                                                  height={40}
                                                  className="object-cover"
                                                />
                                              </div>
                                              <div className="ml-2">
                                                <div className="text-sm font-medium text-gray-700">
                                                  {eventCrop.name} -{" "}
                                                  {eventCrop.fieldLocation}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                  Health:{" "}
                                                  <span
                                                    className={getHealthStatusColor(
                                                      eventCrop.healthStatus
                                                    )}
                                                  >
                                                    {eventCrop.healthStatus}
                                                  </span>{" "}
                                                  • Progress:{" "}
                                                  {eventCrop.progress}%
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </motion.div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Key Upcoming Events Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="bg-white rounded-xl shadow-md p-4 md:-ml-5"
                  >
                    <h3 className="text-lg font-medium mb-4 flex text-black items-center">
                      <Flag size={18} className="mr-2 text-green-600" />
                      Key Upcoming Events
                    </h3>

                    <div className="overflow-x-auto">
                      <div className="flex space-x-4">
                        {getUpcomingEvents()
                          .slice(0, 5)
                          .map((event, index) => {
                            const daysUntil = Math.ceil(
                              (new Date(event.date).getTime() -
                                new Date().getTime()) /
                                (1000 * 60 * 60 * 24)
                            );

                            return (
                              <motion.div
                                key={event.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  duration: 0.3,
                                  delay: index * 0.1,
                                }}
                                className="w-52 flex-shrink-0 border rounded-lg overflow-hidden"
                              >
                                <div
                                  className={`p-3 ${
                                    event.type === "planting"
                                      ? "bg-emerald-500"
                                      : event.type === "harvesting"
                                      ? "bg-amber-500"
                                      : event.type === "fertilizing"
                                      ? "bg-blue-500"
                                      : event.type === "irrigation"
                                      ? "bg-cyan-500"
                                      : event.type === "pest_control"
                                      ? "bg-red-500"
                                      : event.type === "maintenance"
                                      ? "bg-purple-500"
                                      : "bg-gray-500"
                                  } text-white`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs uppercase font-medium">
                                      {event.type}
                                    </span>
                                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                      {daysUntil === 0
                                        ? "Today"
                                        : daysUntil === 1
                                        ? "Tomorrow"
                                        : `In ${daysUntil} days`}
                                    </span>
                                  </div>
                                  <div className="font-medium mt-1 truncate">
                                    {event.title}
                                  </div>
                                </div>

                                <div className="p-3">
                                  <div className="text-sm text-gray-600 mb-2">
                                    {format(
                                      parseISO(event.date),
                                      "MMMM d, yyyy"
                                    )}
                                  </div>

                                  {event.cropId && (
                                    <div className="flex items-center mt-2">
                                      <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                                        <Image
                                          src={
                                            crops.find(
                                              (c) => c.id === event.cropId
                                            )?.image ||
                                            "/api/placeholder/400/320"
                                          }
                                          alt={
                                            crops.find(
                                              (c) => c.id === event.cropId
                                            )?.name || "Crop"
                                          }
                                          width={24}
                                          height={24}
                                          className="object-cover"
                                        />
                                      </div>
                                      <span className="text-xs text-gray-700">
                                        {
                                          crops.find(
                                            (c) => c.id === event.cropId
                                          )?.name
                                        }
                                      </span>
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between mt-2">
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-full ${
                                        priorityColors[event.priority]
                                      }`}
                                    >
                                      {event.priority}
                                    </span>
                                    <button
                                      onClick={() => openEditEventModal(event)}
                                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                                    >
                                      Details
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}

                        {getUpcomingEvents().length === 0 && (
                          <div className="w-full text-center py-8 text-gray-500">
                            <CalendarIcon
                              size={32}
                              className="mx-auto mb-2 text-gray-400"
                            />
                            <p>No upcoming events in the next 7 days</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </>
              )}

              {/* Crops Section */}
              {visibleSection === "crops" && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-md p-6"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold flex items-center text-black">
                        <Crop size={20} className="mr-2 text-green-600" />
                        Active Crops
                      </h3>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700">
                        <Plus size={18} className="mr-1" />
                        Add Crop
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {crops.map((crop, index) => (
                        <motion.div
                          key={crop.id}
                          className="border-none rounded-xl overflow-hidden shadow-sm text-black"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{
                            y: -5,
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div className="relative">
                            <div className="h-40 bg-gray-100">
                              <Image
                                src={crop.image}
                                alt={crop.name}
                                width={400}
                                height={160}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="text-lg font-semibold">
                                  {crop.name}
                                </h4>
                                <span
                                  className={`text-sm ${getHealthStatusColor(
                                    crop.healthStatus
                                  )}`}
                                >
                                  {crop.healthStatus}
                                </span>
                              </div>
                              <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Progress</span>
                                  <span>{crop.progress}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full">
                                  <div
                                    className="h-full bg-green-600 rounded-full transition-all duration-300"
                                    style={{ width: `${crop.progress}%` }}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center">
                                  <Map
                                    size={16}
                                    className="mr-2 text-gray-500"
                                  />
                                  {crop.fieldLocation}
                                </div>
                                <div className="flex items-center">
                                  <Layers
                                    size={16}
                                    className="mr-2 text-gray-500"
                                  />
                                  {crop.area} acres
                                </div>
                                <div className="flex items-center">
                                  <BarChart2
                                    size={16}
                                    className="mr-2 text-gray-500"
                                  />
                                  Yield: {crop.yieldEstimate} bu
                                </div>
                              </div>
                              <div className="flex justify-end space-x-2 mt-4">
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                  <Edit2 size={18} className="text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-red-100 rounded-lg text-red-600">
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}

              {/* Analytics Section */}
              {visibleSection === "analytics" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <BarChart2 size={20} className="mr-2 text-green-600" />
                    Farm Analytics
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-medium mb-4">
                        Crop Health Distribution
                      </h4>
                      <div className="h-64 flex items-center justify-center text-gray-400">
                        Pie Chart Placeholder
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-medium mb-4">Yield Projections</h4>
                      <div className="h-64 flex items-center justify-center text-gray-400">
                        Bar Chart Placeholder
                      </div>
                    </div>

                    <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-medium mb-4">Field Utilization</h4>
                      <div className="h-96 flex items-center justify-center text-gray-400">
                        Map Visualization Placeholder
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl text-[#666] w-full max-w-md p-6"
            >
              <h3 className="text-xl font-semibold mb-4">
                {isEditMode ? "Edit Event" : "New Event"}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Type
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg"
                      >
                        {Object.keys(eventTypeConfig).map((type) => (
                          <option key={type} value={type}>
                            {type.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Associated Crop
                    </label>
                    <select
                      name="cropId"
                      value={formData.cropId}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="">None</option>
                      {crops.map((crop) => (
                        <option key={crop.id} value={crop.id}>
                          {crop.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {isEditMode ? "Save Changes" : "Create Event"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
