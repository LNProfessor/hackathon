"""
LLM Service for AI Cyber Protecting App
Provides AI-powered security recommendations using OpenAI's API.
"""
import json
import os
from datetime import datetime
import google.generativeai as genai

# Global variable for the Gemini model, initialized to None
model = None

def initialize_gemini_client():
    """
    Initializes the Gemini client and model using the API key from environment variables.
    
    Returns:
        bool: True if initialization is successful, False otherwise.
    """
    global model
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable not found.")
        return False
    
    try:
        genai.configure(api_key=api_key)
        # Use a stable, recommended model
        model = genai.GenerativeModel('gemini-2.5-flash')
        print("Gemini client initialized successfully.")
        return True
    except Exception as e:
        print(f"Error initializing Gemini client: {e}")
        return False

def suggest_safe_locations(latitude: float, longitude: float) -> dict:
    """
    Finds nearby safe locations with good Wi-Fi using the Gemini API.

    Args:
        lat (float): The user's current latitude.
        lon (float): The user's current longitude.

    Returns:
        dict: A dictionary containing a list of suggested locations or an error.
    """

    global model
    if not model:
        if not initialize_gemini_client():
            return {"error": "LLM client is not initialized."}

    # Context provided by the user
    current_time = datetime.now()

    prompt = f"""
    Act as a local security and logistics expert. The user is currently at latitude {latitude} and longitude {longitude}.
    The current time is {current_time}.
    Your task is to identify 3-4 nearby public locations that are currently open and, importantly, known to be safe and have reliable, free Wi-Fi connections (e.g., well-known cafes, public libraries, large retail stores).

    For each location, provide the following details in a JSON object.
    The root of the JSON object must be a key "suggestedLocations" which contains a list of location dictionaries.
    Each dictionary in the list must have these exact keys:
    - "Name": The name of the business or place.
    - "Distance": A realistic, estimated distance in miles from the user's coordinates (e.g., "0.5 miles").
    - "Safety Level": Your expert assessment of the location's general safety on a scale from 1/10 to 10/10.
    - "Google Map Link": A plausible, mock Google Maps URL for the location.

    IMPORTANT: Sort the final list of locations primarily by "Safety Level" in descending order (safest first), and secondarily by "Distance" in ascending order (closest first).

    Example Format:
    {{
      "suggestedLocations": [
        {{
          "Name": "Starbucks",
          "Distance": "0.8 miles",
          "Safety Level": "8/10",
          "Google Map Link": "https://maps.google.com/maps?q=Starbucks+near+Lynchburg+VA"
        }},
        {{
          "Name": "Lynchburg Public Library",
          "Distance": "1.2 miles",
          "Safety Level": "8/10",
          "Google Map Link": "https://maps.google.com/maps?q=Lynchburg+Public+Library"
        }}
      ]
    }}
    Generate the JSON object now for the user's location.
    """
    try:
        response = model.generate_content(prompt)
        json_text = response.text.strip().replace("```json", "").replace("```", "").strip()
        locations_data = json.loads(json_text)
        print("Successfully generated safe locations from Gemini.")
        return locations_data
    except Exception as e:
        print(f"Error calling Gemini API for safe locations: {e}")
        return {"error": "Failed to generate safe location data."}

def generate_static_recommendations(zone, risk_factors, location_context, threat_data):
    """
    Generate static recommendations when AI is not available.
    
    Returns:
        dict: Contains reason and recommendations
    """
    reason = generate_static_reason(zone, risk_factors, threat_data)
    recommendations = generate_static_recommendations_list(zone)
    
    return {
        "reason": reason,
        "recommendations": recommendations,
        "ai_generated": False
    }

def generate_static_reason(zone, risk_factors, threat_data):
    """Generate a static reason based on risk factors."""
    if zone == "Green":
        return "You are in a secure environment with no identified risk factors."
    
    elif zone == "Yellow":
        if risk_factors:
            primary_risk = risk_factors[0]
            return f"You are in a moderately risky environment due to: {primary_risk.lower()}."
        return "You are in a moderately risky environment with some elevated security concerns."
    
    else:  # Red zone
        if len(risk_factors) > 1:
            return f"You are in a high-risk environment with multiple security concerns: {', '.join(risk_factors).lower()}."
        elif risk_factors:
            return f"You are in a high-risk environment due to: {risk_factors[0].lower()}."
        return "You are in a high-risk environment requiring immediate security precautions."

def generate_static_recommendations_list(zone):
    """Generate static recommendation lists for each zone."""
    if zone == "Green":
        return [
            "Continue following good security practices",
            "Keep your devices updated with the latest security patches",
            "Maintain awareness of your surroundings",
            "Regular security checkups are recommended"
        ]
    
    elif zone == "Yellow":
        return [
            "Enable device auto-lock with a short timeout",
            "Avoid accessing sensitive accounts on public networks",
            "Keep personal belongings secure and in sight",
            "Consider using a VPN for added protection",
            "Be extra cautious with email attachments and links"
        ]
    
    else:  # Red zone
        return [
            "Enable your VPN immediately",
            "Ensure 2-Factor Authentication is active on critical accounts",
            "Avoid accessing sensitive information until in a secure location",
            "Consider relocating to a more secure location",
            "Keep all devices locked when not actively in use",
            "Monitor your accounts for suspicious activity"
        ]