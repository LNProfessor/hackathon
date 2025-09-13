"""
Threat Intelligence Service for AI Cyber Protecting App
Provides cyber threat information based on geographic location.
"""
from datetime import datetime, timedelta

# Mock threat intelligence data (for v1.0 implementation)
MOCK_THREATS = {
    "New York": {
        "type": "Phishing Scam", 
        "reported": "2025-09-12",
        "severity": "High",
        "description": "Widespread phishing campaign targeting financial institutions"
    },
    "Chicago": {
        "type": "Ransomware Attack", 
        "reported": "2025-09-10",
        "severity": "Critical",
        "description": "Ransomware targeting small businesses in the area"
    },
    "Los Angeles": {
        "type": "WiFi Spoofing", 
        "reported": "2025-09-11",
        "severity": "Medium",
        "description": "Fake WiFi hotspots detected in public areas"
    },
    "San Francisco": {
        "type": "Data Breach", 
        "reported": "2025-09-09",
        "severity": "High",
        "description": "Major tech company data breach affecting local users"
    }
}

def get_threats_by_city(city):
    """
    Retrieve threat intelligence for a specific city.
    
    Args:
        city (str): Name of the city to check for threats
    
    Returns:
        dict: Threat information or None if no threats found
    """
    if city in MOCK_THREATS:
        threat_data = MOCK_THREATS[city].copy()
        
        # Check if threat is recent (within last 7 days)
        threat_date = datetime.strptime(threat_data["reported"], "%Y-%m-%d")
        days_ago = (datetime.now() - threat_date).days
        
        if days_ago <= 7:
            threat_data["threat_detected"] = True
            threat_data["days_since_reported"] = days_ago
            threat_data["is_recent"] = True
        else:
            threat_data["threat_detected"] = False
            threat_data["days_since_reported"] = days_ago
            threat_data["is_recent"] = False
        
        return threat_data
    
    return {
        "threat_detected": False,
        "message": "No recent threats detected in this area"
    }

def get_threat_summary(threat_data):
    """
    Generate a human-readable summary of threat information.
    
    Args:
        threat_data (dict): Threat information from get_threats_by_city
    
    Returns:
        str: Formatted threat summary
    """
    if not threat_data or not threat_data.get("threat_detected"):
        return "No active threats detected in your area."
    
    threat_type = threat_data.get("type", "Unknown threat")
    severity = threat_data.get("severity", "Unknown")
    days_ago = threat_data.get("days_since_reported", 0)
    
    if days_ago == 0:
        time_desc = "today"
    elif days_ago == 1:
        time_desc = "yesterday"
    else:
        time_desc = f"{days_ago} days ago"
    
    return f"{severity} severity {threat_type} reported {time_desc}"

def assess_threat_risk_level(threat_data):
    """
    Assess the risk level based on threat data.
    
    Returns:
        str: Risk level (Low, Medium, High, Critical)
    """
    if not threat_data or not threat_data.get("threat_detected"):
        return "Low"
    
    severity = threat_data.get("severity", "Unknown").lower()
    days_ago = threat_data.get("days_since_reported", 999)
    
    # Recent threats (0-2 days) increase risk level
    if days_ago <= 2:
        if severity in ["critical", "high"]:
            return "Critical"
        elif severity == "medium":
            return "High"
        else:
            return "Medium"
    
    # Older but recent threats (3-7 days)
    elif days_ago <= 7:
        if severity == "critical":
            return "High"
        elif severity == "high":
            return "Medium"
        else:
            return "Low"
    
    return "Low"
