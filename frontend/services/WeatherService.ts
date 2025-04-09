// src/services/weatherService.ts

import axios from 'axios';

// Weather types - Adapted for WeatherAPI.com
export interface WeatherData {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    wind_deg: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    uvi: number;
    visibility: number;
    pressure: number;
    dew_point: number;
    clouds: number;
    rain?: { '1h': number };
    snow?: { '1h': number };
  };
  hourly: Array<{
    dt: number;
    temp: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    pop: number; // Probability of precipitation
  }>;
  daily: Array<{
    dt: number;
    temp: {
      day: number;
      min: number;
      max: number;
      night: number;
      eve: number;
      morn: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    pop: number; // Probability of precipitation
    humidity: number;
    wind_speed: number;
    wind_deg: number;
    rain?: number;
    snow?: number;
  }>;
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
}

export interface FarmLocation {
  lat: number;
  lon: number;
  name: string;
}

// Get weather icon based on weather condition - Using WeatherAPI icons
export const getWeatherIcon = (iconCode: string) => {
  // WeatherAPI uses different icon codes
  return `https://cdn.weatherapi.com/weather/64x64/day/${iconCode}.png`;
};

// Get background color class based on weather condition
export const getWeatherColorClass = (weatherMain: string): string => {
  switch (weatherMain.toLowerCase()) {
    case 'clear':
    case 'sunny':
      return 'bg-gradient-to-br from-blue-400 to-indigo-600';
    case 'clouds':
    case 'cloudy':
    case 'partly cloudy':
      return 'bg-gradient-to-br from-gray-300 to-gray-500';
    case 'rain':
    case 'drizzle':
    case 'light rain':
    case 'moderate rain':
      return 'bg-gradient-to-br from-blue-700 to-indigo-900';
    case 'thunderstorm':
      return 'bg-gradient-to-br from-purple-700 to-gray-900';
    case 'snow':
    case 'blizzard':
    case 'light snow':
      return 'bg-gradient-to-br from-blue-100 to-gray-300';
    case 'mist':
    case 'fog':
    case 'haze':
      return 'bg-gradient-to-br from-gray-400 to-gray-600';
    default:
      return 'bg-gradient-to-br from-emerald-400 to-indigo-500';
  }
};

// Get weather advice for farmers based on weather condition
export const getWeatherAdvice = (weatherData: WeatherData): string[] => {
  const advice: string[] = [];
  const currentWeather = weatherData.current.weather[0].main.toLowerCase();
  const currentTemp = weatherData.current.temp;
  const windSpeed = weatherData.current.wind_speed;
  const uvIndex = weatherData.current.uvi;
  const rainProbability = Math.max(...weatherData.hourly.slice(0, 12).map(h => h.pop)) * 100;
  
  // Temperature-based advice
  if (currentTemp > 30) {
    advice.push("High temperatures may stress crops. Consider additional irrigation and avoid midday field work.");
    advice.push("Check irrigation systems and water crops in the early morning or late evening.");
  } else if (currentTemp < 5) {
    advice.push("Near freezing temperatures. Consider frost protection for sensitive crops.");
    advice.push("Delay seeding or transplanting until temperatures increase.");
  }
  
  // Weather condition advice
  switch (currentWeather) {
    case 'clear':
    case 'sunny':
      advice.push("Good day for field work, harvesting, and crop monitoring.");
      if (uvIndex > 6) {
        advice.push("High UV index. Ensure proper hydration for outdoor workers.");
      }
      break;
    case 'clouds':
    case 'cloudy':
    case 'partly cloudy':
      advice.push("Suitable conditions for most field operations and crop maintenance.");
      break;
    case 'rain':
    case 'drizzle':
    case 'light rain':
    case 'moderate rain':
      advice.push("Delay operations like spraying pesticides or fertilizers.");
      advice.push("Check fields for proper drainage and potential erosion issues.");
      break;
    case 'thunderstorm':
      advice.push("Secure equipment and delay all field operations due to lightning risk.");
      advice.push("Check fields after the storm for damage and waterlogging.");
      break;
    case 'snow':
    case 'blizzard':
      advice.push("Protect sensitive crops and greenhouse structures from snow load.");
      advice.push("Ensure livestock have adequate shelter and water is not frozen.");
      break;
    case 'mist':
    case 'fog':
    case 'haze':
      advice.push("Delay spraying operations as fog can affect chemical effectiveness.");
      advice.push("Use caution with farm equipment due to reduced visibility.");
      break;
  }
  
  // Wind advice
  if (windSpeed > 20) {
    advice.push("High wind speeds. Secure loose structures and postpone spraying operations.");
  }
  
  // Rain probability advice
  if (rainProbability > 70) {
    advice.push(`${rainProbability.toFixed(0)}% chance of precipitation in the next 12 hours. Plan field operations accordingly.`);
  }
  
  return advice;
};

// API key handling with verification
export const verifyApiKey = async (): Promise<{ isValid: boolean, message: string }> => {
  const apiKey = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;
  
  if (!apiKey) {
    return { 
      isValid: false, 
      message: 'API key not found in environment variables. Check your .env.local file.' 
    };
  }
  
  // Log truncated key for debugging
  console.log(`Verifying API key: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);
  
  try {
    // Test the API key with a simple request to validate
    // Using Nairobi as test location for Kenya support
    const testResponse = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Nairobi`,
      { timeout: 5000 }
    );
    
    return { 
      isValid: true, 
      message: 'API key validated successfully' 
    };
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      return { 
        isValid: false, 
        message: 'API key is invalid or inactive. Please check your WeatherAPI account.' 
      };
    } else if (error.response) {
      return { 
        isValid: false, 
        message: `API validation failed with status ${error.response.status}: ${error.response.data?.error?.message || 'Unknown error'}` 
      };
    } else if (error.request) {
      return { 
        isValid: false, 
        message: 'Network issue: No response received from WeatherAPI. Check your internet connection.' 
      };
    } else {
      return { 
        isValid: false, 
        message: `API key validation failed: ${error.message}` 
      };
    }
  }
};

// Get user's current location using browser geolocation API
export const getUserLocation = (): Promise<FarmLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Get location name from coordinates using reverse geocoding
        try {
          const locationName = await getLocationNameFromCoordinates(position.coords.latitude, position.coords.longitude);
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            name: locationName
          });
        } catch (error) {
          // If reverse geocoding fails, just use coordinates
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            name: 'Current Location'
          });
        }
      },
      (error) => {
        console.error('Error getting user location:', error);
        reject(error);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
};

// Get location name from coordinates using a free reverse geocoding service
export const getLocationNameFromCoordinates = async (lat: number, lon: number): Promise<string> => {
  try {
    // Use nominatim OpenStreetMap service for reverse geocoding
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
      { 
        headers: { 'User-Agent': 'FarmWeather/1.0' } // OpenStreetMap requires a User-Agent
      }
    );
    
    const data = response.data;
    
    // Extract relevant location information
    const city = data.address.city || data.address.town || data.address.village || data.address.hamlet;
    const county = data.address.county;
    const state = data.address.state;
    const country = data.address.country;
    
    // Format location name based on available data
    let locationName = '';
    if (city) locationName += city;
    if (county && !locationName.includes(county)) locationName += locationName ? `, ${county}` : county;
    if (state && !locationName.includes(state)) locationName += locationName ? `, ${state}` : state;
    if (country) locationName += locationName ? `, ${country}` : country;
    
    return locationName || 'Current Location';
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return 'Current Location'; // Fallback
  }
};

// Get location from IP using IP geolocation service (fallback when browser geolocation is denied)
export const getLocationFromIP = async (): Promise<FarmLocation> => {
  try {
    // First try ipapi.co
    try {
      const response = await axios.get('https://ipapi.co/json/');
      return {
        lat: response.data.latitude,
        lon: response.data.longitude,
        name: `${response.data.city || 'Unknown'}, ${response.data.region || ''}, ${response.data.country_name || ''}`
      };
    } catch (error) {
      console.log('First IP geolocation service failed, trying alternative');
      
      // If first service fails, try ipinfo.io (has better coverage for Africa)
      const response = await axios.get('https://ipinfo.io/json');
      const [lat, lon] = response.data.loc.split(',').map(Number);
      return {
        lat,
        lon,
        name: `${response.data.city || 'Unknown'}, ${response.data.region || ''}, ${response.data.country || ''}`
      };
    }
  } catch (error) {
    console.error('All IP geolocation services failed:', error);
    
    // If in Kenya, use Nairobi as default
    const kenyaDefault = { lat: -1.2921, lon: 36.8219, name: 'Nairobi, Kenya (Default)' };
    
    // Try to detect if user is likely in Kenya from timezone or language
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    
    if (timezone.includes('Nairobi') || timezone === 'Africa/Nairobi' || language === 'sw-KE') {
      return kenyaDefault;
    }
    
    // Otherwise use global default
    return { lat: 40.7128, lon: -74.006, name: 'Default Location' };
  }
};

// Main weather fetching function using WeatherAPI.com
export const fetchWeatherData = async (location: FarmLocation): Promise<WeatherData> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;
    
    if (!apiKey) {
      console.error('WeatherAPI key is missing in environment variables');
      return getDummyWeatherData(location);
    }
    
    console.log(`Fetching weather data for ${location.name} using WeatherAPI`);
    
    // Fetch forecast data (includes current weather + forecast)
    const response = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location.lat},${location.lon}&days=7&aqi=no&alerts=no`,
      { 
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('WeatherAPI request successful');
    
    // Transform WeatherAPI response to match our WeatherData interface
    const apiData = response.data;
    
    // Map current weather data
    const current = {
      temp: apiData.current.temp_c,
      feels_like: apiData.current.feelslike_c,
      humidity: apiData.current.humidity,
      wind_speed: apiData.current.wind_kph / 3.6, // Convert to m/s
      wind_deg: apiData.current.wind_degree,
      weather: [
        {
          id: mapWeatherConditionToId(apiData.current.condition.text),
          main: mapWeatherConditionToMain(apiData.current.condition.text),
          description: apiData.current.condition.text.toLowerCase(),
          icon: apiData.current.condition.icon.split('/').pop()?.split('.')[0] || '113' // Extract the icon code
        }
      ],
      uvi: apiData.current.uv,
      visibility: apiData.current.vis_km * 1000, // Convert to meters
      pressure: apiData.current.pressure_mb,
      dew_point: apiData.current.dewpoint_c || (apiData.current.temp_c - ((100 - apiData.current.humidity) / 5)), // Approximated if not available
      clouds: apiData.current.cloud
    };
    
    // Map hourly forecast data
    const hourly = apiData.forecast.forecastday.flatMap((day: any) => 
      day.hour.map((hour: any) => ({
        dt: new Date(hour.time).getTime() / 1000,
        temp: hour.temp_c,
        weather: [
          {
            id: mapWeatherConditionToId(hour.condition.text),
            main: mapWeatherConditionToMain(hour.condition.text),
            description: hour.condition.text.toLowerCase(),
            icon: hour.condition.icon.split('/').pop()?.split('.')[0] || '113'
          }
        ],
        pop: hour.chance_of_rain / 100
      }))
    ).slice(0, 24); // Get first 24 hours
    
    // Map daily forecast data
    const daily = apiData.forecast.forecastday.map((day: any) => ({
      dt: new Date(day.date).getTime() / 1000,
      temp: {
        day: day.day.avgtemp_c,
        min: day.day.mintemp_c,
        max: day.day.maxtemp_c,
        night: day.hour[23]?.temp_c || day.day.mintemp_c, // Use temperature at 11 PM for night
        eve: day.hour[18]?.temp_c || day.day.avgtemp_c,   // Use temperature at 6 PM for evening 
        morn: day.hour[8]?.temp_c || day.day.avgtemp_c    // Use temperature at 8 AM for morning
      },
      weather: [
        {
          id: mapWeatherConditionToId(day.day.condition.text),
          main: mapWeatherConditionToMain(day.day.condition.text),
          description: day.day.condition.text.toLowerCase(),
          icon: day.day.condition.icon.split('/').pop()?.split('.')[0] || '113'
        }
      ],
      pop: day.day.daily_chance_of_rain / 100,
      humidity: day.day.avghumidity,
      wind_speed: day.day.maxwind_kph / 3.6,  // Convert to m/s
      wind_deg: day.hour[12]?.wind_degree || 180, // Try to get wind direction from noon hour
      rain: day.day.totalprecip_mm || 0,
      snow: day.day.totalsnow_cm || 0
    }));
    
    // Create the final WeatherData object
    const weatherData: WeatherData = {
      current,
      hourly,
      daily,
      lat: apiData.location.lat,
      lon: apiData.location.lon,
      timezone: apiData.location.tz_id,
      timezone_offset: apiData.location.localtime_epoch - Math.floor(Date.now() / 1000) // Approximate offset
    };
    
    return weatherData;
  } catch (error: any) {
    console.error('Error fetching weather data from WeatherAPI:', error);
    if (error.response) {
      console.error('API Error:', error.response.data);
    }
    return getDummyWeatherData(location);
  }
};

// Helper function to map condition text to OpenWeather-like weather ID
function mapWeatherConditionToId(condition: string): number {
  const conditionLower = condition.toLowerCase();
  
  // Map common conditions to IDs in the OpenWeather range
  if (conditionLower.includes('thunder') || conditionLower.includes('lightning')) return 200;
  if (conditionLower.includes('drizzle')) return 300;
  if (conditionLower.includes('rain')) return 500;
  if (conditionLower.includes('snow')) return 600;
  if (conditionLower.includes('mist') || conditionLower.includes('fog')) return 700;
  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return 800;
  if (conditionLower.includes('cloud')) return 801;
  if (conditionLower.includes('overcast')) return 804;
  
  // Default
  return 800;
}

// Helper function to map condition text to main weather category
function mapWeatherConditionToMain(condition: string): string {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('thunder')) return 'Thunderstorm';
  if (conditionLower.includes('drizzle')) return 'Drizzle';
  if (conditionLower.includes('rain')) return 'Rain';
  if (conditionLower.includes('snow') || conditionLower.includes('sleet') || conditionLower.includes('ice')) return 'Snow';
  if (conditionLower.includes('mist') || conditionLower.includes('fog')) return 'Mist';
  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return 'Clear';
  if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) return 'Clouds';
  
  // Default
  return 'Clear';
}

// Function to get weather for user location with comprehensive error handling
export const getWeatherForUserLocation = async (): Promise<{ location: FarmLocation; weatherData: WeatherData; source: string }> => {
  try {
    // First verify API key
    const keyStatus = await verifyApiKey();
    if (!keyStatus.isValid) {
      console.error(`API key verification failed: ${keyStatus.message}`);
      // For Kenya users, default to Nairobi
      const kenyaDefault = { lat: -1.2921, lon: 36.8219, name: 'Nairobi, Kenya (Default)' };
      return { 
        location: kenyaDefault, 
        weatherData: getDummyWeatherData(kenyaDefault),
        source: 'dummy' 
      };
    }
    
    // Try browser geolocation first
    try {
      const location = await getUserLocation();
      const weatherData = await fetchWeatherData(location);
      return { 
        location, 
        weatherData,
        source: 'geolocation' 
      };
    } catch (geoError) {
      console.log('Geolocation failed, trying IP-based location', geoError);
      
      // Try IP-based location as fallback
      try {
        const ipLocation = await getLocationFromIP();
        const weatherData = await fetchWeatherData(ipLocation);
        return { 
          location: ipLocation, 
          weatherData,
          source: 'ip-location' 
        };
      } catch (ipError) {
        console.error('IP location also failed', ipError);
        
        // Try to detect if user is likely in Kenya from timezone or language
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const language = navigator.language;
        
        // For Kenya users, default to Nairobi
        if (timezone.includes('Nairobi') || timezone === 'Africa/Nairobi' || language === 'sw-KE') {
          const kenyaDefault = { lat: -1.2921, lon: 36.8219, name: 'Nairobi, Kenya (Default)' };
          const weatherData = await fetchWeatherData(kenyaDefault);
          return { 
            location: kenyaDefault, 
            weatherData,
            source: 'kenya-default' 
          };
        } else {
          // Global default
          const defaultLocation = { lat: 40.7128, lon: -74.006, name: 'Default Location' };
          const weatherData = await fetchWeatherData(defaultLocation);
          return { 
            location: defaultLocation, 
            weatherData,
            source: 'default-location' 
          };
        }
      }
    }
  } catch (error) {
    console.error('Unexpected error in getWeatherForUserLocation:', error);
    
    // Try to detect if user is likely in Kenya from timezone or language
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    
    // For Kenya users, default to Nairobi
    if (timezone.includes('Nairobi') || timezone === 'Africa/Nairobi' || language === 'sw-KE') {
      const kenyaDefault = { lat: -1.2921, lon: 36.8219, name: 'Nairobi, Kenya (Default)' };
      return { 
        location: kenyaDefault, 
        weatherData: getDummyWeatherData(kenyaDefault),
        source: 'error-kenya-fallback' 
      };
    } else {
      // Global default
      const defaultLocation = { lat: 40.7128, lon: -74.006, name: 'Default Location' };
      return { 
        location: defaultLocation, 
        weatherData: getDummyWeatherData(defaultLocation),
        source: 'error-fallback' 
      };
    }
  }
};

// Function to search for a location by name (useful for location selection)
export const searchLocationByName = async (query: string): Promise<FarmLocation[]> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;
    
    if (!apiKey) {
      throw new Error('API key is missing');
    }
    
    const response = await axios.get(
      `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${encodeURIComponent(query)}`,
      { timeout: 5000 }
    );
    
    // Map response to our FarmLocation format
    return response.data.map((item: any) => ({
      lat: item.lat,
      lon: item.lon,
      name: `${item.name}, ${item.region || ''}, ${item.country || ''}`
    }));
  } catch (error) {
    console.error('Error searching for location:', error);
    return [];
  }
};

// Function to get weather for multiple farm locations
export const fetchMultipleFarmWeather = async (locations: FarmLocation[]): Promise<Map<string, WeatherData>> => {
  try {
    // First verify API key once to avoid multiple verification requests
    const keyStatus = await verifyApiKey();
    if (!keyStatus.isValid) {
      console.error(`API key verification failed: ${keyStatus.message}`);
      // Return dummy data for all locations
      const weatherMap = new Map<string, WeatherData>();
      locations.forEach(location => {
        weatherMap.set(location.name, getDummyWeatherData(location));
      });
      return weatherMap;
    }
    
    const weatherMap = new Map<string, WeatherData>();
    
    // Using Promise.all to fetch weather data for all locations in parallel
    const weatherPromises = locations.map(async (location) => {
      try {
        const weatherData = await fetchWeatherData(location);
        return { location, weatherData, success: true };
      } catch (error) {
        console.error(`Error fetching weather for ${location.name}:`, error);
        return { location, weatherData: getDummyWeatherData(location), success: false };
      }
    });
    
    const results = await Promise.all(weatherPromises);
    
    // Populate the map with results
    results.forEach(({ location, weatherData }) => {
      weatherMap.set(location.name, weatherData);
    });
    
    return weatherMap;
  } catch (error) {
    console.error('Error fetching multiple farm weather data:', error);
    throw error;
  }
};

// Get dummy weather data for testing or when API fails - Now customized for location
export const getDummyWeatherData = (location?: FarmLocation): WeatherData => {
  const defaultLocation = location || { lat: -1.2921, lon: 36.8219, name: 'Nairobi, Kenya (Default)' };
  
  // Use location-specific defaults for Kenya
  let tempBase = 22.5;  // Default temperature base
  let conditionSets = [
    ["Clear", "Clouds", "Rain", "Clear", "Clouds", "Clear", "Rain"],
    ["clear sky", "few clouds", "light rain", "clear sky", "overcast clouds", "clear sky", "light rain"]
  ];
  
  // Kenya-specific adjustments
  if (defaultLocation.lat < 5 && defaultLocation.lat > -5 && 
      defaultLocation.lon > 33 && defaultLocation.lon < 42) {
    // East Africa region approximation
    tempBase = 25.0;  // Higher base temperature for East Africa
    conditionSets = [
      ["Clear", "Partly Cloudy", "Rain", "Clear", "Cloudy", "Clear", "Thunderstorm"],
      ["clear sky", "partly cloudy", "light rain", "clear sky", "cloudy", "clear sky", "thunderstorm"]
    ];
  }
  
  return {
    lat: defaultLocation.lat,
    lon: defaultLocation.lon,
    timezone: defaultLocation.name.includes("Kenya") ? "Africa/Nairobi" : "UTC",
    timezone_offset: defaultLocation.name.includes("Kenya") ? 10800 : 0, // +3 hours for Kenya
    current: {
      temp: tempBase,
      feels_like: tempBase - 0.7,
      humidity: 65,
      wind_speed: 3.6,
      wind_deg: 220,
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "113"
        }
      ],
      uvi: 8.2, // Higher UV for equatorial regions
      visibility: 10000,
      pressure: 1015,
      dew_point: 15,
      clouds: 5
    },
    hourly: Array(24).fill(null).map((_, index) => ({
      dt: Math.floor(Date.now() / 1000) + (index * 3600),
      temp: tempBase + Math.sin(index) * 3,
      weather: [{
        id: index % 5 === 0 ? 500 : 800,
        main: index % 5 === 0 ? "Rain" : "Clear",
        description: index % 5 === 0 ? "light rain" : "clear sky",
        icon: index % 5 === 0 ? "176" : "113"
      }],
      pop: index % 5 === 0 ? 0.4 : 0.1
    })),
    daily: Array(7).fill(null).map((_, index) => ({
      dt: Math.floor(Date.now() / 1000) + (index * 86400),
      temp: {
        day: tempBase + Math.sin(index) * 5,
        min: tempBase - 7 + Math.sin(index) * 3,
        max: tempBase + 8 + Math.sin(index) * 4,
        night: tempBase - 4 + Math.sin(index) * 2,
        eve: tempBase + 3 + Math.sin(index) * 3,
        morn: tempBase - 6 + Math.sin(index) * 2
      },
      weather: [{
        id: [800, 801, 500, 800, 804, 800, 500][index],
        main: conditionSets[0][index],
        description: conditionSets[1][index],
        icon: ["113", "116", "176", "113", "122", "113", "176"][index]
      }],
      pop: [0.1, 0.2, 0.7, 0.0, 0.3, 0.1, 0.6][index],
      humidity: 60 + Math.sin(index) * 10,
      wind_speed: 3 + Math.sin(index) * 2,
      wind_deg: 180 + index * 20
    }))
  };
};

// Convert temperature from Celsius to Fahrenheit
export const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9/5) + 32;
};

// Get wind direction as a string
export const getWindDirection = (degrees: number): string => {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

// Example usage in a component or page
export const initializeWeatherService = async (): Promise<{
  apiKeyStatus: { isValid: boolean; message: string };
  userLocation?: FarmLocation;
  weatherData?: WeatherData;
}> => {
  try {
    // Step 1: Verify API key
    const apiKeyStatus = await verifyApiKey();
    console.log('API Key status:', apiKeyStatus);
    
    if (!apiKeyStatus.isValid) {
      return { apiKeyStatus };
    }
    
    // Step 2: Get user location and weather
    const { location, weatherData } = await getWeatherForUserLocation();
    
    return {
      apiKeyStatus,
      userLocation: location,
      weatherData
    };
  } catch (error) {
    console.error('Weather service initialization failed:', error);
    return {
      apiKeyStatus: { isValid: false, message: 'Weather service initialization failed' }
    };
  }
};