"""
Risk Scoring Engine for AI Cyber Protecting App
Implements a weighted risk scoring system based on location, WiFi, and threat intelligence.
"""
from services.location_service import check_location_is_whitelisted
from services.network_service import get_network_info
from services.threat_service import get_cyber_threats_by_zip

# TODO: Make this a tuple
NETWORK_TYPE = {
    0: "Residential/Private Network",
    1: "Untrusted/Unknown Public Network",
    2: "Trusted Public Network",
    3: "VPN/Proxy Network",
    4: "Unknown Network",
}

def calculate_risk(latitude, longitude, ip, zipcode):
    """
    Calculate weighted risk score based on multiple factors.
    
    Args:
        latitude (float): User's current latitude
        longitude (float): User's current longitude
        ip (str): Connected WiFi network SSID
        zipcode (int): Threat intelligence for the user's location
    
    Returns:
        dict: Contains risk_score, zone, and risk_factors
    """
    
    risk_score = 0
    risk_reasons = []
    risk_actions = []
    
    # Factor 1: Location-based risk (+2 points if not at home)
    isAtSafeLocation, distanceFromSafeLocation = check_location_is_whitelisted(latitude, longitude)
    if isAtSafeLocation:
        risk_reasons.append(["Good", f"Location: You are {distanceFromSafeLocation:.1f}km from the closest safe location"])
        risk_actions.append("")
    else:
        risk_score += 2
        risk_reasons.append(["Bad", f"Location: {distanceFromSafeLocation:.1f}km from the closest safe location"])
        risk_actions.append("Turn on the VPN")
    
    # Factor 2: WiFi Security risk (+4 points for unsafe networks)
    network_type = get_network_info(ip)
    if network_type in [1, 4]:
        risk_reasons.append(["Good", f"Network: 'You are on {NETWORK_TYPE[network_type]}"])
        risk_actions.append("")
    else:
        risk_score += 4
        risk_reasons.append(["Bad", f"Network: 'You are on {NETWORK_TYPE[network_type]}"])
        risk_actions.append("Activate 2-Factor Authentication for Your Laptop")
        risk_actions.append("Find a new work location")
    
    # # Factor 3: Local cyber threat intelligence (+5 points if threats present)
    # num_threats = get_cyber_threats_by_zip(zipcode)
    # if num_threats == 0:
    #     risk_reasons.append(["Good", f"Threats: 'There are {num_threats} active cyber threats in your area."])
    # else:
    #     risk_score += 5
    #     risk_reasons.append(["Bad", f"Threats: 'There are {num_threats} active cyber threats in your area."])
    #     if len(risk_actions) != 3:
    #         risk_actions.append("Activate 2-Factor Authentication for Your Laptop")
    #         risk_actions.append("Find a new work location")
    
    # Determine security zone based on total score
    if risk_score == 0:
        zone = "Green"
    elif 1 <= risk_score <= 5:
        zone = "Yellow"
    else:  # 6+ points
        zone = "Red"
    
    return {
        'score': risk_score,
        'zone': zone,
        'reasons': risk_reasons,
        'actions': risk_actions,
    }

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
