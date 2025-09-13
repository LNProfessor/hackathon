"""
Risk Scoring Engine for AI Cyber Protecting App
Implements a weighted risk scoring system based on location, WiFi, and threat intelligence.
"""
import os
from .location_service import calculate_distance

# Safe WiFi SSIDs (pre-configured safe zones)
SAFE_SSIDS = [
    'Starbucks_WiFi',
    'Target_Guest_WiFi', 
    'Barnes_Noble_WiFi',
    'Home_Network',
    'Office_Secure_WiFi'
]

def calculate_risk(latitude, longitude, wifi_ssid, threats_data):
    """
    Calculate weighted risk score based on multiple factors.
    
    Args:
        latitude (float): User's current latitude
        longitude (float): User's current longitude
        wifi_ssid (str): Connected WiFi network SSID
        threats_data (dict): Threat intelligence for the user's location
    
    Returns:
        dict: Contains risk_score, zone, and risk_factors
    """
    risk_score = 0
    risk_factors = []
    
    # Factor 1: Location-based risk (+2 points if not at home)
    home_lat = float(os.getenv('HOME_LAT', 40.7128))
    home_lon = float(os.getenv('HOME_LON', -74.0060))
    
    distance_from_home = calculate_distance(latitude, longitude, home_lat, home_lon)
    
    # Consider "home" if within 0.5 km radius
    if distance_from_home > 0.5:
        risk_score += 2
        risk_factors.append(f"Location: {distance_from_home:.1f}km from home")
    
    # Factor 2: WiFi Security risk (+4 points for unsafe networks)
    if wifi_ssid and wifi_ssid not in SAFE_SSIDS:
        risk_score += 4
        risk_factors.append(f"Unsafe WiFi: '{wifi_ssid}' not in safe zone list")
    
    # Factor 3: Local cyber threat intelligence (+5 points if threats present)
    if threats_data and threats_data.get('threat_detected'):
        risk_score += 5
        threat_type = threats_data.get('type', 'Unknown threat')
        risk_factors.append(f"Active threat: {threat_type} reported in area")
    
    # Determine security zone based on total score
    if risk_score == 0:
        zone = "Green"
    elif 1 <= risk_score <= 5:
        zone = "Yellow"
    else:  # 6+ points
        zone = "Red"
    
    return {
        'risk_score': risk_score,
        'zone': zone,
        'risk_factors': risk_factors
    }

def get_zone_message(zone):
    """Get the appropriate message for each security zone."""
    messages = {
        "Green": "You're in a Green Zone. Your current environment appears secure.",
        "Yellow": "You're in a Yellow Zone. This is a slightly elevated risk environment. Stay aware of your surroundings and ensure your devices are locked when not in use.",
        "Red": "Warning: You are in a Red Zone. Your environment poses a significant digital and physical security risk."
    }
    return messages.get(zone, "Unknown security zone.")

def get_base_recommendations(zone):
    """Get base security recommendations for each zone."""
    recommendations = {
        "Green": [
            "Continue following good security practices.",
            "Keep your devices updated.",
            "Maintain awareness of your surroundings."
        ],
        "Yellow": [
            "Enable device auto-lock with a short timeout.",
            "Avoid accessing sensitive accounts on public networks.",
            "Keep personal belongings secure and in sight.",
            "Consider using a VPN for added protection."
        ],
        "Red": [
            "Enable your VPN immediately.",
            "Ensure 2-Factor Authentication is active on critical accounts.",
            "Avoid accessing sensitive information.",
            "Consider relocating to a more secure location.",
            "Keep all devices locked when not actively in use."
        ]
    }
    return recommendations.get(zone, [])
