"""
Location Service for AI Cyber Protecting App
Provides location-based utilities including city lookup and distance calculations.
"""
import math

# Mock city data for reverse geocoding (simplified for v1.0)
CITY_BOUNDARIES = {
    "New York": {
        "lat_range": (40.4774, 40.9176),
        "lon_range": (-74.2591, -73.7004)
    },
    "Chicago": {
        "lat_range": (41.6444, 42.0230),
        "lon_range": (-87.9401, -87.5244)
    },
    "Los Angeles": {
        "lat_range": (33.7037, 34.3373),
        "lon_range": (-118.6682, -118.1553)
    },
    "San Francisco": {
        "lat_range": (37.7081, 37.8085),
        "lon_range": (-122.5170, -122.3558)
    },
    "Miami": {
        "lat_range": (25.7617, 25.8554),
        "lon_range": (-80.3762, -80.1301)
    }
}

def get_city(latitude, longitude):
    """
    Perform reverse geocoding to get city name from coordinates.
    
    Args:
        latitude (float): Latitude coordinate
        longitude (float): Longitude coordinate
    
    Returns:
        str: City name or "Unknown" if not found
    """
    for city, boundaries in CITY_BOUNDARIES.items():
        lat_min, lat_max = boundaries["lat_range"]
        lon_min, lon_max = boundaries["lon_range"]
        
        if (lat_min <= latitude <= lat_max and 
            lon_min <= longitude <= lon_max):
            return city
    
    return "Unknown"

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
    city = get_city(latitude, longitude)
    
    return {
        "city": city,
        "coordinates": {
            "latitude": latitude,
            "longitude": longitude
        },
        "formatted_location": f"{city} ({latitude:.4f}, {longitude:.4f})"
    }
