# Agricultural Management System

A NextJS-based web application for agricultural management that helps farmers monitor crops, plan irrigation, schedule harvests, track farm performance, and check weather conditions - all without requiring IoT hardware.

## System Overview

This application provides a comprehensive dashboard for agricultural management with simulated sensor data and manual inputs to demonstrate how a smart farming system would work.

### Core Features

1. **Landing Page**
   - Introduction to the platform with visually appealing farm graphics
   - Login/signup functionality for farmers
   - Feature highlights and benefits section
   - Quick demo preview

2. **Dashboard**
   - Summary of farm status (crop health, irrigation status, upcoming events)
   - Weather widget showing current conditions and forecast
   - Quick-access cards to all modules
   - Notification panel showing alerts and reminders

3. **Crop Monitoring**
   - Symptom-based disease identification (dropdown selection)
   - Photo upload for visual reference (stored in database only)
   - Health status tracking with manual inputs
   - Historical crop health visualization

4. **Smart Irrigation Manager**
   - Manual moisture level input form
   - Visual field map showing moisture status
   - Automated recommendations based on moisture thresholds
   - Irrigation scheduling calendar
   - Simulated activation controls

5. **Weather Monitoring**
   - Current weather conditions for farm location
   - 7-day weather forecast
   - Weather alerts and warnings
   - Historical weather data visualization
   - Precipitation probability and amounts
   - Temperature trends and extremes
   - Wind speed and direction indicators
   - Customizable weather parameters display

6. **Harvest Calendar**
   - Interactive calendar for planning farm activities
   - Event creation for planting, fertilizing, harvesting, etc.
   - Reminder system for upcoming activities
   - Historical record view

7. **Reporting Module**
   - Crop performance charts
   - Harvest yield tracking
   - Weather impact analysis
   - PDF/CSV export functionality
   - Season-to-season comparison

8. **Crop Library**
   - Database of common crops with care instructions
   - Simple lookup by crop type and region
   - Basic disease identification guides with visual references
   - Optimal growing conditions reference

## Technical Implementation

### Frontend Structure (NextJS 15)

```
app/
├── layout.tsx              # Main layout with navigation
├── page.tsx                # Landing page (homepage)
├── auth/
│   └── page.tsx            # Combined login/signup screen
├── dashboard/
│   └── page.tsx            # Main dashboard overview
├── crop-monitoring/
│   └── page.tsx            # Crop monitoring interface
├── irrigation/
│   └── page.tsx            # Irrigation management interface
├── weather/
│   └── page.tsx            # Weather monitoring interface
├── calendar/
│   └── page.tsx            # Harvest planning calendar
├── reports/
│   └── page.tsx            # Reports generation interface
├── library/
│   └── page.tsx            # Crop library interface
└── components/             # Shared components folder
    ├── Sidebar.tsx         # Navigation sidebar
    ├── Header.tsx          # App header with user info
    ├── Footer.tsx          # Landing page footer
    ├── WeatherWidget.tsx   # Weather display component
    ├── WeatherForecast.tsx # Weekly forecast component
    ├── WeatherChart.tsx    # Weather data visualization
    ├── WeatherAlert.tsx    # Weather alerts component
    ├── CropCard.tsx        # Crop information card
    ├── FieldMap.tsx        # Visual field representation
    ├── AlertNotification.tsx # Notification component
    ├── ChartComponents.tsx # Reusable chart elements
    ├── CalendarComponent.tsx # Reusable calendar
    ├── DropdownSelect.tsx  # Custom dropdown component
    ├── ImageUploader.tsx   # Image upload component
    └── StatCard.tsx        # Statistics display card
```

### Backend (Express + MongoDB)

#### MongoDB Models:

1. **User Model**
   ```javascript
   {
     username: String,
     email: String,
     password: String (hashed),
     farms: [FarmSchema]
   }
   ```

2. **Farm Model**
   ```javascript
   {
     name: String,
     location: {
       latitude: Number,
       longitude: Number,
       address: String
     },
     size: Number,
     crops: [CropSchema]
   }
   ```

3. **Crop Model**
   ```javascript
   {
     type: String,
     plantedDate: Date,
     estimatedHarvestDate: Date,
     field: String,
     status: String,
     healthRecords: [HealthRecordSchema]
   }
   ```

4. **Moisture Reading Model**
   ```javascript
   {
     fieldId: String,
     timestamp: Date,
     moistureLevel: Number,
     irrigationActivated: Boolean
   }
   ```

5. **Weather Data Model**
   ```javascript
   {
     farmId: String,
     timestamp: Date,
     temperature: Number,
     humidity: Number,
     precipitation: Number,
     windSpeed: Number,
     windDirection: String,
     conditions: String,
     alerts: [String]
   }
   ```

6. **Calendar Event Model**
   ```javascript
   {
     title: String,
     date: Date,
     description: String,
     type: String,
     completed: Boolean
   }
   ```

7. **Expense Model**
   ```javascript
   {
     date: Date,
     category: String,
     amount: Number,
     description: String
   }
   ```

#### API Endpoints:

1. **Authentication**
   - `POST /api/auth/register` - Register a new user
   - `POST /api/auth/login` - Login and get token
   - `GET /api/auth/profile` - Get current user profile

2. **Farm Management**
   - `GET /api/farms` - Get all farms for a user
   - `POST /api/farms` - Add a new farm
   - `GET /api/farms/:id` - Get farm details
   - `PUT /api/farms/:id` - Update farm details

3. **Crop Monitoring**
   - `GET /api/crops` - Get all crops
   - `POST /api/crops` - Add a new crop
   - `GET /api/crops/:id` - Get crop details
   - `PUT /api/crops/:id` - Update crop details
   - `POST /api/crops/:id/health` - Add health record
   - `POST /api/crops/:id/image` - Upload crop image

4. **Irrigation Management**
   - `GET /api/moisture` - Get moisture readings
   - `POST /api/moisture` - Add moisture reading
   - `POST /api/irrigation/activate` - Simulate irrigation activation
   - `GET /api/irrigation/history` - Get irrigation history

5. **Weather Services**
   - `GET /api/weather/current/:farmId` - Get current weather for farm location
   - `GET /api/weather/forecast/:farmId` - Get 7-day forecast for farm
   - `GET /api/weather/history/:farmId` - Get historical weather data
   - `GET /api/weather/alerts/:farmId` - Get active weather alerts
   - `POST /api/weather/preferences` - Save user weather display preferences

6. **Calendar Management**
   - `GET /api/events` - Get all calendar events
   - `POST /api/events` - Create calendar event
   - `PUT /api/events/:id` - Update calendar event
   - `DELETE /api/events/:id` - Delete calendar event

7. **Reports**
   - `GET /api/reports/crops` - Get crop performance reports
   - `GET /api/reports/irrigation` - Get irrigation reports
   - `GET /api/reports/weather` - Get weather impact reports
   - `GET /api/reports/expenses` - Get financial reports
   - `GET /api/reports/export/:type` - Export reports (PDF/CSV)

8. **Library**
   - `GET /api/library/crops` - Get crop library entries
   - `GET /api/library/crops/:id` - Get specific crop information
   - `GET /api/library/diseases` - Get disease identification information

9. **Expenses**
   - `GET /api/expenses` - Get all expenses
   - `POST /api/expenses` - Add new expense
   - `PUT /api/expenses/:id` - Update expense
   - `DELETE /api/expenses/:id` - Delete expense
   - `GET /api/expenses/summary` - Get expense summary

## Weather Monitoring Module

The Weather Monitoring page provides comprehensive weather information specific to the farm's location to help farmers make informed decisions about planting, irrigation, and harvesting activities.

### Key Weather Features

1. **Current Conditions Display**
   - Real-time temperature, humidity, and precipitation data
   - Visual representation of current weather conditions (sunny, cloudy, rain, etc.)
   - UV index and solar radiation metrics
   - Soil temperature estimates based on air temperature

2. **7-Day Weather Forecast**
   - Daily high and low temperatures
   - Precipitation probability and amounts
   - Wind speed and direction forecasts
   - Visual forecast summary with intuitive icons

3. **Weather Alerts System**
   - Integration with national weather service APIs
   - Customizable alert thresholds for extreme conditions
   - Push notifications for severe weather warnings
   - Historical alert tracking

4. **Weather Data Visualization**
   - Interactive charts showing weather patterns over time
   - Temperature and precipitation trend analysis
   - Comparison with historical averages
   - Seasonal pattern visualization

5. **Weather-Based Recommendations**
   - Irrigation suggestions based on precipitation forecasts
   - Frost/freeze warnings with crop protection recommendations
   - Optimal planting and harvesting windows based on forecasts
   - Severe weather preparation checklists

6. **Historical Weather Analysis**
   - Monthly and yearly weather summaries
   - Growing degree days calculations
   - Comparison of current season to previous years
   - Extreme weather event records

7. **Integration with Other Modules**
   - Weather data incorporated into irrigation scheduling
   - Calendar events automatically adjusted based on weather forecasts
   - Crop disease risk assessment using weather patterns
   - Weather impact analysis in reporting module

### Weather Data Sources

The system uses a combination of:
- Public weather APIs (OpenWeatherMap, Weather.gov, etc.)
- Manual data entry for locations without reliable API coverage
- Historical weather databases for trend analysis
- User-reported conditions for validation and hyperlocal accuracy

## Disease Identification Without AI

Instead of using AI for disease detection, we'll implement a knowledge-based approach:

1. **Symptom Selection**:
   - Form with dropdown menus for different symptoms (leaf discoloration, spots, wilting)
   - Options for affected plant parts (leaves, stems, roots)
   - Severity scales (mild, moderate, severe)

2. **Rule-Based Analysis**:
   - Database of common crop diseases with associated symptoms
   - Conditional logic that matches selected symptoms to possible diseases
   - Example: If (yellow leaves + brown spots + wilting) then suggest "Possible fungal infection"

3. **Reference Images**:
   - Database of disease reference images
   - Visual comparison between uploaded photos and reference images
   - Side-by-side comparison feature

4. **Image Storage**:
   - Store uploaded images in MongoDB or file system
   - Associate images with crop and date
   - Image history to track progression

## Weather Impact on Farm Management

The system also analyzes how weather conditions affect various aspects of farm management:

1. **Weather-Adjusted Irrigation**
   - Automated irrigation reductions when precipitation is forecasted
   - Increased watering recommendations during heat waves
   - Frost protection irrigation scheduling

2. **Weather-Responsive Scheduling**
   - Calendar events that automatically adjust based on weather conditions
   - Suggestions for rescheduling farm activities based on upcoming weather
   - Weather-dependent task prioritization

3. **Climate Analysis for Crop Selection**
   - Historical weather pattern analysis to guide crop selections
   - Growing season length calculations
   - Frost date predictions for seasonal planning

## Project Setup

1. **Next.js Setup**:
   ```bash
   npx create-next-app@latest agricultural-system --typescript
   ```

2. **Install Dependencies**:
   ```bash
   npm install tailwindcss postcss autoprefixer react-calendar recharts axios mongoose express bcrypt jsonwebtoken
   ```

3. **Configure Tailwind**:
   ```bash
   npx tailwindcss init -p
   ```

4. **Backend Setup**:
   ```bash
   mkdir server
   cd server
   npm init -y
   npm install express mongoose bcrypt jsonwebtoken cors dotenv
   ```

5. **Weather API Integration**:
   ```bash
   npm install node-fetch
   ```

6. **Development Steps**:
   1. Set up database models and API routes
   2. Implement authentication system
   3. Build core dashboard components
   4. Develop individual feature modules including weather monitoring
   5. Connect frontend to API endpoints
   6. Integrate with weather data sources
   7. Style with Tailwind CSS
   8. Test and debug functionality

## Running the Project

1. **Start the Frontend**:
   ```bash
   npm run dev
   ```

2. **Start the Backend**:
   ```bash
   cd server
   npm run start
   ```

## Environment Variables

Create a `.env.local` file in the root directory with:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
MONGODB_URI=mongodb://localhost:27017/agricultural-system
JWT_SECRET=your_jwt_secret
OPENWEATHER_API_KEY=your_openweather_api_key
WEATHER_GOV_API_ENDPOINT=https://api.weather.gov
```

## Project Team

- Developer: [Your Name]
- Designer: [Designer Name]
- Project Manager: [PM Name]
- Weather Systems Specialist: [Specialist Name]

## License

MIT