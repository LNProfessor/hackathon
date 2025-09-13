"""
Threat Intelligence Service for AI Cyber Protecting App
Provides criminal threat information based on geographic location.
"""
import os
from dotenv import load_dotenv

import json
from datetime import datetime
import google.generativeai as genai

# CityProtect uses this specific date format in their API requests
DATE_FORMAT = "%Y-%m-%dT%H:%M:%S.%fZ"

def get_cyber_threats_by_zip(zip_code: str) -> int:
    """
    Uses the Gemini API to generate a mock list of realistic cyber threats for a given zip code.
    
    Args:
        zip_code (str): The user's zip code.

    Returns:
        dict: A dictionary containing cyber threat data or an error message.
    """

    # --- Environment Variable Setup ---
    # Make sure to add your GEMINI_API_KEY to your .env file
    try:
        load_dotenv()
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    except Exception as e:
        print(f"Error configuring Gemini API: {e}. Please check your GEMINI_API_KEY.")
        
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    # Current date for context
    current_date = datetime.now()

    prompt = f"""
    Act as a senior cyber-intelligence analyst. Your task is to generate a realistic, mock list of 0-3 recent cyber threats for Zipcode location {zip_code}.
    Base these threats on recent, publicly available news about the city, or its well-known characteristics (e.g., major universities, industries, events).
    The current date is {current_date}. The threats should be plausible for the past month. If a city is safe enough, you can just return an empty list of cyber threats.

    The output MUST be a JSON object with a single key "threats" which contains a list of threat dictionaries.
    Each dictionary in the list must have the following keys:
    - "threat_type": A short description (e.g., "Phishing Scam", "Ransomware Attack", "Data Breach").
    - "target": The group being targeted (e.g., "Local University Students", "Small Business Owners", "General Public").
    - "description": A one-sentence summary of the threat.
    - "reported_date": A realistic date within the last month, formatted as "YYYY-MM-DD".
    - "severity": A rating of "Low", "Medium", or "High".

    Example format:
    {{
      "threats": [
        {{
          "threat_type": "Phishing Scam",
          "target": "Local University Students",
          "description": "Emails pretending to be from the university's financial aid office are attempting to steal login credentials.",
          "reported_date": "2025-08-28",
          "severity": "High"
        }}
      ]
    }}

    Generate the JSON object for Zipcode {zip_code} now.
    """

    try:
        response = model.generate_content(prompt)
        # Clean up the response to extract only the JSON part
        json_text = response.text.strip().replace("```json", "").replace("```", "").strip()
        threat_data = json.loads(json_text)
        return len(threat_data)
    except Exception as e:
        print(f"Error calling Gemini API or parsing its response: {e}")
        # {"error": "Failed to generate cyber threat data."}
        return 0