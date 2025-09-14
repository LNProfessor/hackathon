import requests

NETWORK_TYPE = {
    "Residential/Private Network": 0,
    "Untrusted/Unknown Public Network": 1,
    "Trusted Public Network": 2,
    "VPN/Proxy Network": 3,
    "Unknown Network": 4,
}

def get_network_info(ip_address: str) -> int:
    """Gets network metadata from an IP address."""
    if ip_address == "127.0.0.1":
        return 0 # "Local Development Network"

    try:
        response = requests.get(f"http://ip-api.com/json/{ip_address}?fields=isp,org")
        response.raise_for_status()
        data = response.json()

        # Simple logic to determine network type
        isp = data.get("isp", "").lower()
        org = data.get("org", "").lower()

        if any(term in isp for term in ["comcast", "verizon", "cox", "spectrum", "at&t"]):
            return NETWORK_TYPE["Residential/Private"]
        if any(term in isp for term in ["boingo", "gogo"]):
            return NETWORK_TYPE["Untrusted/Unknown Public Hotspot"]
        if any(term in org for term in ["amazon", "google", "digitalocean"]):
            return NETWORK_TYPE["VPN/Proxy"]
        
        # TODO: Call Chat to verify this is a trusted institution => Type: 2 or 1
        return NETWORK_TYPE["Untrusted/Unknown Public Hotspot"]
    
    except requests.RequestException as e:
        print(f"Could not get network info for {ip_address}: {e}")
        return NETWORK_TYPE["Unknown"]
    
def get_user_ip(request) -> str:
    """
    Gets the real user IP address, accounting for reverse proxies.
    """
    # The X-Forwarded-For header can be a comma-separated list of IPs.
    # The client's IP will be the first one in the list.
    if request.headers.getlist("X-Forwarded-For"):
        ip_address = request.headers.getlist("X-Forwarded-For")[0]
    else:
        # If the header is not present, fall back to remote_addr.
        # This is useful for development or direct connections.
        ip_address = request.remote_addr
    return ip_address