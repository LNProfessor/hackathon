"""
Risk Scoring Engine for AI Cyber Protecting App
Implements a weighted risk scoring system based on location, WiFi, and threat intelligence.
"""
from services.location_service import check_location_is_whitelisted
from services.network_service import get_network_info

# TODO: Make this a tuple
NETWORK_TYPE = {
    0: "Residential/Private",
    1: "Untrusted/Unknown Public Hotspot",
    2: "Trusted Public Network",
    3: "VPN/Proxy",
    4: "Unknown",
}

def calculate_risk(latitude, longitude, ip, num_threats):
    """
    Calculate weighted risk score based on multiple factors.
    
    Args:
        latitude (float): User's current latitude
        longitude (float): User's current longitude
        ip (str): Connected WiFi network SSID
        num_threats (int): Threat intelligence for the user's location
    
    Returns:
        dict: Contains risk_score, zone, and risk_factors
    """
    print("a")
    risk_score = 0
    risk_factors = []
    print("a")
    # Factor 1: Location-based risk (+2 points if not at home)
    isAtSafeLocation, distanceFromSafeLocation = check_location_is_whitelisted(latitude, longitude)
    print("a")
    if not isAtSafeLocation:
        risk_score += 2
        risk_factors.append(f"Location: {distanceFromSafeLocation:.1f}km from the closest safe location")
    print("b")
    # Factor 2: WiFi Security risk (+4 points for unsafe networks)
    network_type = get_network_info(ip)
    if network_type not in [0, 2, 3]:
        risk_score += 4
        risk_factors.append(f"Unsafe WiFi: 'You are on {NETWORK_TYPE[network_type]}")
    print("c")
    # Factor 3: Local cyber threat intelligence (+5 points if threats present)
    # if threats_data and threats_data.get('threat_detected'):
    #     risk_score += 5
    #     threat_type = threats_data.get('type', 'Unknown threat')
    #     risk_factors.append(f"Active threat: {threat_type} reported in area")
    
    # Determine security zone based on total score
    if risk_score == 0:
        zone = "Green"
    elif 1 <= risk_score <= 5:
        zone = "Yellow"
    else:  # 6+ points
        zone = "Red"
    print("d")
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
