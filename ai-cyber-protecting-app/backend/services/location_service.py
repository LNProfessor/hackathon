"""
Location Service for AI Cyber Protecting App
Provides location-based utilities including city lookup and distance calculations.
"""
import os
from dotenv import load_dotenv

import requests
from requests.structures import CaseInsensitiveDict

import math

WHITELISTED_LOCATIONS_FILENAME = '/database/whitelisted_locations'

def get_address(latitude, longitude):
    load_dotenv()
    api_key = os.getenv('GEOAPIFY_API_KEY')

    url = f"https://api.geoapify.com/v1/geocode/reverse?lat={latitude}&lon={longitude}&apiKey={api_key}"

    headers = CaseInsensitiveDict()
    headers["Accept"] = "application/json"

    response = requests.get(url, headers=headers)
    location = response.json()['features'][0]['properties']
    
    address = {
        'housenumber': location['housenumber'],
        'street': location['street'],
        'state': location['state'],
        'country': location['country'],
        'postcode': location['postcode']
    }

    return address

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the distance between two points on Earth using the Haversine formula.
    
    Args:
        lat1, lon1: Latitude and longitude of first point
        lat2, lon2: Latitude and longitude of second point
    
    Returns:
        float: Distance in kilometers
    """
    # Convert latitude and longitude from degrees to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    # Haversine formula
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    a = (math.sin(dlat/2)**2 + 
         math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2)
    c = 2 * math.asin(math.sqrt(a))
    
    # Radius of Earth in kilometers
    earth_radius_km = 6371
    
    return earth_radius_km * c

def get_location_context(latitude, longitude):
    """
    Get contextual information about a location.
    
    Returns:
        dict: Location context including city and coordinate info
    """
    return get_address(latitude, longitude)

def check_location_is_whitelisted(user_latitude, user_longitude):
    distance_from_closest_safe_location = math.inf

    with open(WHITELISTED_LOCATIONS_FILENAME, 'r') as file:
        for line in file:
            
            safe_latitude, safe_longitude = line.split("|")
            distance_from_safe_location = calculate_distance(user_latitude, user_longitude, safe_latitude, safe_longitude)
    
            # Consider "home" if within 0.5 km radius
            if distance_from_safe_location <= 0.5:
                return True, distance_from_safe_location # User is at a safe location :)
            
            distance_from_closest_safe_location = min(distance_from_closest_safe_location, distance_from_safe_location)
                
        return False, distance_from_closest_safe_location # User is at unknown location :(