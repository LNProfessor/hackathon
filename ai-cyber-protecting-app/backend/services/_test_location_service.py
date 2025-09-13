from dotenv import load_dotenv
import os

def get_address(latitude, longitude):
    import requests
    from requests.structures import CaseInsensitiveDict
    
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

print(get_address(51.21709661403662, 6.7782883744862374))