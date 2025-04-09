/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/library/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Leaf, 
  AlertTriangle, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  Droplets,
  Sun,
  ThermometerSun,
  Filter,
  MapPin,
  BookOpen,
  CloudRain,
  ChevronRightIcon,
  ChevronsDownUp
} from 'lucide-react';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import "../../sass/fonts.scss"

// Dummy data for crops and diseases
const cropsData = [
  {
    id: 1,
    name: 'Corn (Maize)',
    scientificName: 'Zea mays',
    imageUrl: '/assets/sweet.jpeg',
    description: 'A cereal grain first domesticated by indigenous peoples in southern Mexico. The leafy stalk of the plant produces pollen inflorescences and separate ovuliferous inflorescences called ears that yield kernels or seeds, which are fruits.',
    growingConditions: {
      soil: 'Well-drained, loamy soil with pH 5.8-6.8',
      temperature: '18-25°C (65-77°F)',
      water: 'Moderate, 500-800mm during growing season',
      sunlight: 'Full sun, minimum 6-8 hours daily'
    },
    plantingGuide: {
      season: 'Spring to early summer',
      spacing: 'Rows: 75-90cm apart, Plants: 20-25cm apart',
      depth: '2.5-5cm deep',
      germination: '7-10 days'
    },
    diseases: [1, 3, 5]
  },
  {
    id: 2,
    name: 'Rice',
    scientificName: 'Oryza sativa',
    imageUrl: '/assets/rice.jpeg',
    description: 'A staple food crop for more than half of the world\'s population. It is grown in flooded fields in warm, humid climates and requires significant water for cultivation.',
    growingConditions: {
      soil: 'Clay or clay loam with pH 5.5-6.5',
      temperature: '20-35°C (68-95°F)',
      water: 'Abundant, flooded conditions preferred',
      sunlight: 'Full sun, minimum 6 hours daily'
    },
    plantingGuide: {
      season: 'Spring to early summer',
      spacing: 'Rows: 20-30cm apart, Plants: 10-15cm apart',
      depth: '1-2cm deep',
      germination: '5-10 days'
    },
    diseases: [2, 6]
  },
  {
    id: 3,
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    imageUrl: '/assets/tomatoes.jpeg',
    description: 'An edible berry of the plant Solanum lycopersicum, commonly known as the tomato plant. The species originated in western South America and Central America.',
    growingConditions: {
      soil: 'Well-drained, loamy soil with pH 6.0-6.8',
      temperature: '20-27°C (68-80°F)',
      water: 'Regular, consistent moisture',
      sunlight: 'Full sun, minimum 6-8 hours daily'
    },
    plantingGuide: {
      season: 'Spring after last frost',
      spacing: 'Rows: 90-120cm apart, Plants: 45-60cm apart',
      depth: '0.5-1cm deep',
      germination: '5-10 days'
    },
    diseases: [4, 7, 8]
  },
  {
    id: 4,
    name: 'Wheat',
    scientificName: 'Triticum aestivum',
    imageUrl: '/assets/wheat.jpg',
    description: 'One of the world\'s most important cereal crops, wheat is a grass widely cultivated for its seed, a cereal grain which is a global staple food used to make flour for bread, pasta, noodles, and many other foods.',
    growingConditions: {
      soil: 'Well-drained, loamy soil with pH 6.0-7.0',
      temperature: '15-24°C (59-75°F)',
      water: 'Moderate, 450-650mm during growing season',
      sunlight: 'Full sun, minimum 6 hours daily'
    },
    plantingGuide: {
      season: 'Fall for winter wheat, spring for spring wheat',
      spacing: 'Rows: 15-20cm apart, broadcast seeding common',
      depth: '2.5-5cm deep',
      germination: '7-10 days'
    },
    diseases: [9, 10]
  },
];

const diseasesData = [
  {
    id: 1,
    name: 'Corn Rust',
    pathogen: 'Puccinia sorghi (fungus)',
    imageUrl: '/api/placeholder/600/400',
    symptoms: [
      'Orange to reddish-brown pustules on leaves',
      'Yellow halos around pustules',
      'Premature leaf death in severe cases',
      'Reduced photosynthesis and yield loss'
    ],
    conditions: 'Favored by humid conditions (>95% RH) and moderate temperatures (16-25°C)',
    management: [
      'Plant resistant varieties',
      'Apply fungicides preventatively',
      'Crop rotation with non-host plants',
      'Destroy infected plant debris'
    ],
    cropId: 1
  },
  {
    id: 2,
    name: 'Rice Blast',
    pathogen: 'Magnaporthe oryzae (fungus)',
    imageUrl: '/api/placeholder/600/400',
    symptoms: [
      'Diamond-shaped lesions on leaves',
      'Gray centers with brown borders',
      'Neck blast causing panicle breakage',
      'Empty or partially filled grains'
    ],
    conditions: 'High humidity, temperatures between 17-28°C, nitrogen-rich conditions',
    management: [
      'Plant resistant varieties',
      'Balanced fertilization',
      'Fungicide application',
      'Proper water management'
    ],
    cropId: 2
  },
  {
    id: 3,
    name: 'Corn Smut',
    pathogen: 'Ustilago maydis (fungus)',
    imageUrl: '/api/placeholder/600/400',
    symptoms: [
      'Silver-gray galls on ears, tassels, and leaves',
      'Galls rupture to release black spores',
      'Distorted plant growth',
      'Reduced yield'
    ],
    conditions: 'Moderate temperatures (26-34°C) and dry conditions followed by moisture',
    management: [
      'Plant resistant hybrids',
      'Crop rotation',
      'Remove and destroy galls before they rupture',
      'Balanced fertilization'
    ],
    cropId: 1
  },
  {
    id: 4,
    name: 'Tomato Blight (Late)',
    pathogen: 'Phytophthora infestans (oomycete)',
    imageUrl: '/api/placeholder/600/400',
    symptoms: [
      'Dark, water-soaked spots on leaves',
      'White fuzzy growth on leaf undersides',
      'Brown lesions on stems and fruit',
      'Rapid plant collapse in wet weather'
    ],
    conditions: 'Cool, wet weather with temperatures 10-24°C and high humidity',
    management: [
      'Use disease-free seeds and transplants',
      'Apply fungicides preventatively',
      'Space plants for good air circulation',
      'Avoid overhead irrigation'
    ],
    cropId: 3
  },
  {
    id: 5,
    name: 'Northern Corn Leaf Blight',
    pathogen: 'Exserohilum turcicum (fungus)',
    imageUrl: '/api/placeholder/600/400',
    symptoms: [
      'Long, elliptical gray-green to tan lesions',
      'Lesions become tan to brown as they mature',
      'Lesions run parallel to leaf veins',
      'Can cause significant leaf damage'
    ],
    conditions: 'Moderate temperatures (18-27°C) with extended leaf wetness periods',
    management: [
      'Plant resistant hybrids',
      'Crop rotation with non-host crops',
      'Timely fungicide application',
      'Tillage to reduce inoculum'
    ],
    cropId: 1
  },
  {
    id: 6,
    name: 'Bacterial Leaf Blight in Rice',
    pathogen: 'Xanthomonas oryzae pv. oryzae (bacterium)',
    imageUrl: '/api/placeholder/600/400',
    symptoms: [
      'Water-soaked lesions at leaf margins',
      'Lesions turn yellow to white and expand',
      'Milky bacterial ooze in humid conditions',
      'Wilting and drying of affected leaves'
    ],
    conditions: 'High temperatures (25-34°C) with high humidity and rainfall',
    management: [
      'Plant resistant varieties',
      'Balanced fertilization (avoid excess nitrogen)',
      'Chemical control with copper-based bactericides',
      'Clean field practices and crop rotation'
    ],
    cropId: 2
  },
  {
    id: 7,
    name: 'Tomato Spotted Wilt Virus',
    pathogen: 'Tomato spotted wilt virus (TSWV)',
    imageUrl: '/api/placeholder/600/400',
    symptoms: [
      'Bronze or dark spots on young leaves',
      'Stunted plant growth and wilting',
      'Necrotic rings on fruit',
      'One-sided growth or plant collapse'
    ],
    conditions: 'Transmitted by thrips insects, favored by warm weather',
    management: [
      'Use resistant varieties when available',
      'Control thrips populations with insecticides',
      'Remove infected plants immediately',
      'Maintain weed-free areas around crops'
    ],
    cropId: 3
  },
  {
    id: 8,
    name: 'Tomato Bacterial Spot',
    pathogen: 'Xanthomonas spp. (bacterium)',
    imageUrl: '/api/placeholder/600/400',
    symptoms: [
      'Small, dark, water-soaked spots on leaves',
      'Spots enlarge and become angular with yellow halos',
      'Raised scabby spots on fruit',
      'Defoliation in severe cases'
    ],
    conditions: 'Warm temperatures (24-30°C) with high humidity and rainfall',
    management: [
      'Use disease-free seeds and transplants',
      'Copper-based bactericides',
      'Crop rotation (3-4 years)',
      'Avoid overhead irrigation'
    ],
    cropId: 3
  },
  {
    id: 9,
    name: 'Wheat Rust (Stripe)',
    pathogen: 'Puccinia striiformis (fungus)',
    imageUrl: '/api/placeholder/600/400',
    symptoms: [
      'Yellow-orange pustules arranged in stripes',
      'Found primarily on leaves and leaf sheaths',
      'Severe infections cause leaf necrosis',
      'Reduced grain filling and yield loss'
    ],
    conditions: 'Cool temperatures (10-15°C) with high humidity or rainfall',
    management: [
      'Plant resistant varieties',
      'Early season fungicide application',
      'Eliminate volunteer wheat plants',
      'Plant early-maturing varieties'
    ],
    cropId: 4
  },
  {
    id: 10,
    name: 'Wheat Powdery Mildew',
    pathogen: 'Blumeria graminis f. sp. tritici (fungus)',
    imageUrl: '/api/placeholder/600/400',
    symptoms: [
      'White powdery patches on leaves and stems',
      'Patches turn gray-brown with age',
      'Stunted growth and reduced tillering',
      'Yellow or necrotic areas on leaves'
    ],
    conditions: 'Cool temperatures (15-22°C) with high humidity but dry leaf surfaces',
    management: [
      'Plant resistant varieties',
      'Apply fungicides at early infection stages',
      'Proper nitrogen management',
      'Adequate plant spacing'
    ],
    cropId: 4
  }
];

const regions = [
  'All Regions',
  'Temperate',
  'Tropical',
  'Sub-tropical',
  'Mediterranean',
  'Arid'
];

export default function CropLibrary() {
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All Regions');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [expandedDisease, setExpandedDisease] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter crops based on search term and region
  const filteredCrops = cropsData.filter(crop => 
    crop.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filter === 'All Regions' || true) // Would filter by region if we had that data
  );

  // Get diseases for a specific crop
  interface Crop {
    id: number;
    name: string;
    scientificName: string;
    imageUrl: string;
    description: string;
    growingConditions: {
      soil: string;
      temperature: string;
      water: string;
      sunlight: string;
    };
    plantingGuide: {
      season: string;
      spacing: string;
      depth: string;
      germination: string;
    };
    diseases: number[];
  }

  interface Disease {
    id: number;
    name: string;
    pathogen: string;
    imageUrl: string;
    symptoms: string[];
    conditions: string;
    management: string[];
    cropId: number;
  }

  const getCropDiseases = (cropId: number): Disease[] => {
    return diseasesData.filter((disease) => disease.cropId === cropId);
  };

  // Toggle disease expansion
  interface ToggleDiseaseProps {
    id: number;
  }

  const toggleDisease = ({ id }: ToggleDiseaseProps): void => {
    if (expandedDisease === id) {
      setExpandedDisease(null);
    } else {
      setExpandedDisease(id);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      {/* Sidebar Component */}
      <Sidebar/>
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Header with Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-green-800">Crop Library</h1>
          <p className="mt-2 text-gray-600">
            Explore crops, identify diseases, and learn sustainable farming practices
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div 
          className="mb-8 bg-white rounded-lg shadow-md p-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search crops by name..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>
        </motion.div>

        {/* Main Grid/List View */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : selectedCrop ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {/* Crop Header with Image */}
            <div className="relative h-64 md:h-80">
              <div className="absolute inset-0">
                <Image
                  src={selectedCrop.imageUrl}
                  alt={selectedCrop.name}
                  layout="fill"
                  objectFit="cover"
                  className="w-full"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h2 className="text-3xl font-bold text-white">{selectedCrop.name}</h2>
                <p className="text-gray-200 italic">{selectedCrop.scientificName}</p>
                <button 
                  onClick={() => setSelectedCrop(null)}
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-colors"
                >
                  <ChevronDown size={20} />
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button 
                className={`flex items-center px-6 py-3 font-medium ${selectedTab === 'overview' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
                onClick={() => setSelectedTab('overview')}
              >
                <Info size={18} className="mr-2" />
                Overview
              </button>
              <button 
                className={`flex items-center px-6 py-3 font-medium ${selectedTab === 'diseases' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
                onClick={() => setSelectedTab('diseases')}
              >
                <AlertTriangle size={18} className="mr-2" />
                Diseases
              </button>
              <button 
                className={`flex items-center px-6 py-3 font-medium ${selectedTab === 'guide' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
                onClick={() => setSelectedTab('guide')}
              >
                <BookOpen size={18} className="mr-2" />
                Growing Guide
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Overview Tab */}
              {selectedTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-700 mb-6">{selectedCrop.description}</p>
                  
                  <h3 className="text-xl font-semibold text-green-800 mb-4">Growing Conditions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start bg-green-50 p-4 rounded-lg">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <ThermometerSun size={20} className="text-green-700" />
                      </div>
                      <div>
                        <h4 className="font-medium text-green-800">Temperature</h4>
                        <p className="text-gray-600">{selectedCrop.growingConditions.temperature}</p>
                      </div>
                    </div>
                    <div className="flex items-start bg-blue-50 p-4 rounded-lg">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Droplets size={20} className="text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800">Water Requirements</h4>
                        <p className="text-gray-600">{selectedCrop.growingConditions.water}</p>
                      </div>
                    </div>
                    <div className="flex items-start bg-yellow-50 p-4 rounded-lg">
                      <div className="bg-yellow-100 p-2 rounded-full mr-3">
                        <Sun size={20} className="text-yellow-700" />
                      </div>
                      <div>
                        <h4 className="font-medium text-yellow-800">Sunlight</h4>
                        <p className="text-gray-600">{selectedCrop.growingConditions.sunlight}</p>
                      </div>
                    </div>
                    <div className="flex items-start bg-brown-50 p-4 rounded-lg">
                      <div className="bg-amber-100 p-2 rounded-full mr-3">
                        <MapPin size={20} className="text-amber-700" />
                      </div>
                      <div>
                        <h4 className="font-medium text-amber-800">Soil</h4>
                        <p className="text-gray-600">{selectedCrop.growingConditions.soil}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Diseases Tab */}
              {selectedTab === 'diseases' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-600 mb-6">
                    Common diseases affecting {selectedCrop.name} and how to identify and manage them.
                  </p>
                  
                  {getCropDiseases(selectedCrop.id).map(disease => (
                    <motion.div 
                      key={disease.id} 
                      className="mb-4 border border-gray-200 rounded-lg overflow-hidden"
                      variants={itemVariants}
                    >
                      <div 
                        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleDisease({ id: disease.id })}
                      >
                        <div className="flex items-center">
                          <div className="bg-red-100 p-2 rounded-full mr-3">
                            <AlertTriangle size={20} className="text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{disease.name}</h3>
                            <p className="text-gray-500 text-sm">{disease.pathogen}</p>
                          </div>
                        </div>
                        {expandedDisease === disease.id ? 
                          <ChevronUp size={20} className="text-gray-500" /> : 
                          <ChevronDown size={20} className="text-gray-500" />
                        }
                      </div>
                      
                      {expandedDisease === disease.id && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                            <div>
                              <div className="aspect-w-16 aspect-h-9 mb-4 relative overflow-hidden rounded-lg">
                                <Image
                                  src={disease.imageUrl}
                                  alt={disease.name}
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                              <h4 className="font-medium text-gray-800 mb-2">Favorable Conditions</h4>
                              <p className="text-gray-600 mb-4">{disease.conditions}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">Symptoms</h4>
                              <ul className="mb-4 text-gray-600 space-y-1">
                                {disease.symptoms.map((symptom, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="inline-block rounded-full bg-red-100 h-2 w-2 mt-2 mr-2"></span>
                                    {symptom}
                                  </li>
                                ))}
                              </ul>
                              <h4 className="font-medium text-gray-800 mb-2">Management</h4>
                              <ul className="text-gray-600 space-y-1">
                                {disease.management.map((method, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="inline-block rounded-full bg-green-100 h-2 w-2 mt-2 mr-2"></span>
                                    {method}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Growing Guide Tab */}
              {selectedTab === 'guide' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-green-800 mb-4">Planting Guide</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start bg-green-50 p-4 rounded-lg">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <Calendar size={20} className="text-green-700" />
                        </div>
                        <div>
                          <h4 className="font-medium text-green-800">Planting Season</h4>
                          <p className="text-gray-600">{selectedCrop.plantingGuide.season}</p>
                        </div>
                      </div>
                      <div className="flex items-start bg-blue-50 p-4 rounded-lg">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <CloudRain size={20} className="text-blue-700" />
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-800">Germination</h4>
                          <p className="text-gray-600">{selectedCrop.plantingGuide.germination}</p>
                        </div>
                      </div>
                      <div className="flex items-start bg-orange-50 p-4 rounded-lg">
                        <div className="bg-orange-100 p-2 rounded-full mr-3">
                          <ChevronRightIcon size={20} className="text-orange-700" />
                        </div>
                        <div>
                          <h4 className="font-medium text-orange-800">Spacing</h4>
                          <p className="text-gray-600">{selectedCrop.plantingGuide.spacing}</p>
                        </div>
                      </div>
                      <div className="flex items-start bg-purple-50 p-4 rounded-lg">
                        <div className="bg-purple-100 p-2 rounded-full mr-3">
                          <ChevronsDownUp size={20} className="text-purple-700" />
                        </div>
                        <div>
                          <h4 className="font-medium text-purple-800">Planting Depth</h4>
                          <p className="text-gray-600">{selectedCrop.plantingGuide.depth}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-green-800 mb-4">Monthly Care Calendar</h3>
                    <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="py-2 px-3 bg-green-100 text-left rounded-tl-lg">Task</th>
                            <th className="py-2 px-3 bg-green-100 text-center">Jan</th>
                            <th className="py-2 px-3 bg-green-100 text-center">Feb</th>
                            <th className="py-2 px-3 bg-green-100 text-center">Mar</th>
                            <th className="py-2 px-3 bg-green-100 text-center">Apr</th>
                            <th className="py-2 px-3 bg-green-100 text-center">May</th>
                            <th className="py-2 px-3 bg-green-100 text-center">Jun</th>
                            <th className="py-2 px-3 bg-green-100 text-center">Jul</th>
                            <th className="py-2 px-3 bg-green-100 text-center">Aug</th>
                            <th className="py-2 px-3 bg-green-100 text-center">Sep</th>
                            <th className="py-2 px-3 bg-green-100 text-center">Oct</th>
                            <th className="py-2 px-3 bg-green-100 text-center">Nov</th>
                            <th className="py-2 px-3 bg-green-100 text-center rounded-tr-lg">Dec</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-3 font-medium">Planting</td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id === 4 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id !== 4 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id !== 4 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id === 3 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id === 4 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id === 4 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center"></td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-3 font-medium">Fertilizing</td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id !== 2 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id === 2 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id === 1 || selectedCrop.id === 3 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id === 2 || selectedCrop.id === 3 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id === 4 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center"></td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-3 font-medium">Pest Control</td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id === 3 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id === 1 || selectedCrop.id === 2 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id === 1 || selectedCrop.id === 3 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id === 2 || selectedCrop.id === 3 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id === 1 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center"></td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-medium">Harvesting</td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id === 4 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id === 3 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id === 1 || selectedCrop.id === 3 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id === 1 || selectedCrop.id === 2 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center">{selectedCrop.id === 2 || selectedCrop.id === 4 ? '✓' : ''}</td>
                            <td className="py-2 px-3 text-center"></td>
                            <td className="py-2 px-3 text-center"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-green-800 mb-4">Common Practices</h3>
                    <div className="bg-white border border-gray-200 rounded-lg">
                      <div className="border-b border-gray-200 p-4">
                        <h4 className="font-medium text-gray-800 mb-2">Soil Preparation</h4>
                        <p className="text-gray-600">
                          {selectedCrop.id === 1 && "Plow soil to a depth of 20-25cm. Incorporate organic matter like compost or well-rotted manure at 2-5 tons per hectare. Soil pH should be adjusted to 5.8-6.8 for optimal corn growth."}
                          {selectedCrop.id === 2 && "Puddle and level soil for even water distribution. For lowland rice, create a hardpan 15-20cm below surface to reduce water percolation. Soil pH should be maintained between 5.5-6.5."}
                          {selectedCrop.id === 3 && "Prepare raised beds 15-20cm high and 90-120cm wide. Mix in organic matter such as compost at a rate of 2-4kg per square meter. Ensure soil pH is between 6.0-6.8 for best nutrient availability."}
                          {selectedCrop.id === 4 && "Prepare a firm seedbed with good tilth. Remove weeds and large clods. A fine, firm seedbed allows good seed-to-soil contact. Apply base fertilizer according to soil test recommendations."}
                        </p>
                      </div>
                      <div className="border-b border-gray-200 p-4">
                        <h4 className="font-medium text-gray-800 mb-2">Irrigation Practices</h4>
                        <p className="text-gray-600">
                          {selectedCrop.id === 1 && "Critical irrigation periods include the knee-high stage, tasseling, silking, and grain filling. Maintain soil moisture near field capacity without waterlogging. Consider drip irrigation for water efficiency."}
                          {selectedCrop.id === 2 && "Maintain 5-7cm standing water in fields during vegetative to reproductive stages. Drain fields 7-10 days before harvest. Alternate wetting and drying can reduce water usage by 15-30% without yield loss."}
                          {selectedCrop.id === 3 && "Consistent moisture is crucial for tomatoes. Water deeply 2-3 times per week rather than frequent shallow watering. Use drip irrigation to reduce disease pressure. Mulch to conserve soil moisture."}
                          {selectedCrop.id === 4 && "Critical irrigation periods are at tillering, stem elongation, heading, and grain filling stages. Avoid waterlogging as it promotes disease. For winter wheat, ensure adequate moisture before winter dormancy."}
                        </p>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-800 mb-2">Sustainable Practices</h4>
                        <p className="text-gray-600">
                          {selectedCrop.id === 1 && "Practice crop rotation with legumes to improve soil fertility. Implement contour planting on sloping land to reduce erosion. Consider intercropping with beans or squash in traditional 'Three Sisters' planting."}
                          {selectedCrop.id === 2 && "Incorporate rice straw back into fields to improve soil organic matter. Use ducks for weed and pest management in organic systems. Practice crop rotation with legumes or other dryland crops."}
                          {selectedCrop.id === 3 && "Use mulch to suppress weeds and maintain soil moisture. Prune and stake plants for better air circulation. Rotate tomato planting areas every 3-4 years to reduce soilborne diseases."}
                          {selectedCrop.id === 4 && "Plant cover crops after harvest to reduce erosion and improve soil health. Use precision agriculture for optimized fertilizer application. Consider no-till or reduced tillage systems where appropriate."}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredCrops.length > 0 ? (
              filteredCrops.map(crop => (
                <motion.div
                  key={crop.id}
                  variants={itemVariants}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedCrop(crop)}
                >
                  <div className="relative h-48">
                    <Image
                      src={crop.imageUrl}
                      alt={crop.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{crop.name}</h3>
                    <p className="text-sm text-gray-500 italic mb-2">{crop.scientificName}</p>
                    <div className="flex items-center mt-3">
                      <Leaf size={16} className="text-green-600 mr-1" />
                      <span className="text-sm text-gray-600">{getCropDiseases(crop.id).length} common diseases</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">No crops found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter to find what you&apos;re looking for
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Disease Identification Tool (when no crop is selected) */}
        {!selectedCrop && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="bg-red-50 p-6 border-b border-red-100">
              <h2 className="text-2xl font-bold text-red-800 flex items-center">
                <AlertTriangle size={24} className="mr-2 text-red-600" />
                Disease Identification Tool
              </h2>
              <p className="mt-2 text-gray-700">
                Identify common crop diseases by symptoms and appearance
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Select symptoms</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">Leaf Symptoms</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-gray-600">Yellow/chlorotic</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-gray-600">Spots/lesions</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-gray-600">Wilting</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-gray-600">Powdery coating</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">Stem/Stalk Symptoms</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-gray-600">Cankers/lesions</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-gray-600">Discoloration</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-gray-600">Rotting</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-gray-600">Growth deformities</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">Fruit/Crop Symptoms</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-gray-600">Spots/blemishes</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-gray-600">Rotting</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-gray-600">Deformities</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                        <span className="ml-2 text-gray-600">Discoloration</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Crop Type
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="">Select crop type</option>
                      {cropsData.map(crop => (
                        <option key={crop.id} value={crop.id}>{crop.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plant Part Affected
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="">Select affected part</option>
                      <option value="leaves">Leaves</option>
                      <option value="stems">Stems/Stalks</option>
                      <option value="fruits">Fruits/Grains</option>
                      <option value="roots">Roots</option>
                      <option value="whole">Entire Plant</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Image (Optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Identify Disease
              </button>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Tips for Accurate Identification</h3>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="inline-block rounded-full bg-green-100 h-2 w-2 mt-2 mr-2"></span>
                    Take clear, well-lit photos of the affected plant parts
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block rounded-full bg-green-100 h-2 w-2 mt-2 mr-2"></span>
                    Include multiple angles and both healthy and diseased portions for comparison
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block rounded-full bg-green-100 h-2 w-2 mt-2 mr-2"></span>
                    Note the pattern of spread (random, clustered, field-wide)
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block rounded-full bg-green-100 h-2 w-2 mt-2 mr-2"></span>
                    Consider recent weather conditions and crop history
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}