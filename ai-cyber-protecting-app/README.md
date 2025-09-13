# AI Cyber Protecting App

A full-stack web application that functions as a "Personal Security Co-pilot" to assess users' digital and physical security risk in real-time based on their location, Wi-Fi connection, and local cyber threat intelligence.

## 🚀 Features

- **Real-time Security Assessment**: Analyzes current location, network connection, and threat intelligence
- **Weighted Risk Scoring Engine**: Sophisticated algorithm that calculates risk scores based on multiple factors
- **Color-coded Security Zones**: Simple Green/Yellow/Red status system with clear recommendations
- **AI-Powered Recommendations**: Uses OpenAI to generate personalized security advice
- **Red Zone Alert System**: Automatic email alerts with location and emergency codes for high-risk situations
- **Modern UI**: Beautiful, responsive React interface with Tailwind CSS

## 🏗️ Architecture

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern, responsive styling
- **Geolocation API** for location detection
- Real-time security status display

### Backend
- **Python Flask** REST API
- **Weighted Risk Scoring Engine** with configurable parameters
- **Mock Threat Intelligence** system
- **Email Alert Service** for Red Zone incidents
- **OpenAI Integration** for AI-powered recommendations

## 📊 Risk Scoring Algorithm

The app uses a weighted scoring system:

| Risk Factor | Points | Description |
|-------------|--------|-------------|
| Away from Home | +2 | User is >0.5km from configured home location |
| Unsafe WiFi | +4 | Connected to network not in safe zone list |
| Local Threats | +5 | Recent cyber threats reported in user's city |

**Security Zones:**
- 🟢 **Green Zone**: 0 points (Secure)
- 🟡 **Yellow Zone**: 1-5 points (Caution)
- 🔴 **Red Zone**: 6+ points (Danger - triggers email alert)

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd ai-cyber-protecting-app/backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your settings:
   ```env
   # OpenAI API Configuration (optional - app works without it)
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Home Location (for risk calculation)
   HOME_LAT=40.7128
   HOME_LON=-74.0060
   
   # Email Configuration (optional - will print to console in demo mode)
   TARGET_EMAIL=user@example.com
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   
   # Flask Configuration
   FLASK_DEBUG=True
   FLASK_PORT=5000
   ```

5. **Start the backend server:**
   ```bash
   python app.py
   ```
   
   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ai-cyber-protecting-app/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:3000`

## 🧪 Testing the Application

### Demo Scenarios

1. **Green Zone (Safe):**
   - Use WiFi SSID: "Starbucks_WiFi" or "Home_Network"
   - Should result in 0-2 risk points

2. **Yellow Zone (Caution):**
   - Use WiFi SSID: "Random_Public_WiFi"
   - Should result in 2-4 risk points

3. **Red Zone (Danger):**
   - Use WiFi SSID: "City_Airport_Free_WiFi"
   - Test in New York or Chicago (cities with mock threats)
   - Should result in 6+ risk points and trigger email alert

### API Testing

Test the backend directly:

```bash
curl -X POST http://localhost:5000/api/check-security \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 40.7128,
    "longitude": -74.0060,
    "wifiSSID": "City_Airport_Free_WiFi"
  }'
```

## 🔧 Configuration

### Mock Data Customization

1. **Safe WiFi Networks** (`backend/services/risk_scorer.py`):
   ```python
   SAFE_SSIDS = [
       'Starbucks_WiFi',
       'Target_Guest_WiFi', 
       'Barnes_Noble_WiFi',
       'Home_Network',
       'Office_Secure_WiFi'
   ]
   ```

2. **Threat Intelligence** (`backend/services/threat_service.py`):
   ```python
   MOCK_THREATS = {
       "New York": {
           "type": "Phishing Scam", 
           "reported": "2025-09-12",
           "severity": "High"
       },
       "Chicago": {
           "type": "Ransomware Attack", 
           "reported": "2025-09-10",
           "severity": "Critical"
       }
   }
   ```

3. **Location Boundaries** (`backend/services/location_service.py`):
   Add new cities by defining their coordinate boundaries.

## 📡 API Documentation

### POST `/api/check-security`

**Request Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "wifiSSID": "City_Airport_Free_WiFi"
}
```

**Response:**
```json
{
  "zone": "Red",
  "score": 11,
  "reason": "You are in a high-risk environment with multiple security concerns: location: 5.2km from home, unsafe wifi: 'city_airport_free_wifi' not in safe zone list, active threat: phishing scam reported in area.",
  "recommendations": [
    "Enable your VPN immediately",
    "Ensure 2-Factor Authentication is active on critical accounts",
    "Avoid accessing sensitive information until in a secure location",
    "Consider relocating to a more secure location",
    "Keep all devices locked when not actively in use"
  ],
  "emailSent": true,
  "securityCode": "847291",
  "location": {
    "city": "New York",
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  },
  "threatInfo": {
    "detected": true,
    "summary": "High severity Phishing Scam reported today"
  },
  "riskFactors": [
    "Location: 5.2km from home",
    "Unsafe WiFi: 'City_Airport_Free_WiFi' not in safe zone list",
    "Active threat: Phishing Scam reported in area"
  ]
}
```

## 🔮 Future Enhancements

- **Real Threat Intelligence APIs**: Integration with actual cybersecurity feeds
- **Device Fingerprinting**: Enhanced device security analysis
- **Bluetooth Beacon Detection**: Proximity-based threat assessment
- **Machine Learning**: Predictive risk modeling
- **Mobile App**: Native iOS/Android applications
- **Multi-user Support**: User accounts and personalized settings
- **Historical Analytics**: Security trend tracking and reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Security Note

This is a demonstration application with mock data. For production use:
- Implement proper authentication and authorization
- Use real threat intelligence feeds
- Add rate limiting and input validation
- Secure API endpoints with proper authentication
- Implement proper logging and monitoring

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure both frontend and backend are running on correct ports
2. **Location Permission Denied**: Enable location access in browser settings
3. **OpenAI API Errors**: App will fall back to static recommendations if API key is invalid
4. **Email Not Sending**: Check SMTP configuration or use console output mode for testing

### Debug Mode

Enable debug logging:
```bash
export FLASK_DEBUG=True
```

View browser console for frontend debugging information.
