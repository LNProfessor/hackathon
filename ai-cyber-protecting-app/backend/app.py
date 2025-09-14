"""
AI Cyber Protecting App - Backend API
Flask application that provides security risk assessment based on location and threat intelligence.
"""
import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Import services
from services.risk_calculator import calculate_risk
from services.location_service import get_location_context
from services.email_service_simple import send_red_alert_email
from services.llm_service import suggest_safe_locations
from services.network_service import get_user_ip

WHITELISTED_LOCATIONS_FILENAME = '../database/whitelisted_locations'

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "message": "AI Cyber Protecting App Backend is running",
        "version": "1.0.0"
    })

@app.route('/api/check-security', methods=['POST'])
def check_security():
    """
    Main security assessment endpoint.
    
    Expected JSON payload:
    {
        "latitude": 40.7128,
        "longitude": -74.0060,
    }
    """
    try:
        i = 0
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        # Extract required fields
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        ip = get_user_ip(request)

        # Validate required fields
        if latitude is None or longitude is None:
            return jsonify({
                "error": "Missing required fields: latitude and longitude"
            }), 400

        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except (ValueError, TypeError):
            return jsonify({
                "error": "Invalid latitude or longitude format"
            }), 400

        # Step 1: Get location context
        location_context = get_location_context(latitude, longitude)
        zipcode = location_context['postcode']

        # Step 2: Calculate risk score using weighted scoring engine
        risk_assessment = calculate_risk(latitude, longitude, ip, zipcode)

        # Step 3: Generate recommendations (AI-powered or static fallback)
        # suggested_locations = suggest_safe_locations(latitude, longitude)
        # risk_assessment["suggestedLocations"] = suggested_locations["suggestedLocations"]
        
        return jsonify(risk_assessment)
    
    except Exception as e:
        # Log error and return generic error response
        print(f"Error in check_security endpoint: {str(e)}")
        return jsonify({
            "error": "Internal server error occurred during security check",
            "details": str(e) if app.debug else None
        }), 500
    
@app.route('/api/configure-user', methods=['POST'])
def configure_user():
    try:
        return jsonify({"status": "success", "message": "Configuration saved."}), 200

    except Exception as e:
        print(f"An error occurred in /api/configure-user: {e}")
        return jsonify({"error": "An internal server error occurred."}), 200

# @app.route('/api/test-connection', methods=['GET'])
# def test_connection():
#     """Test endpoint to verify backend connectivity and service status."""
#     try:
#         # Test OpenAI connection
#         openai_status = test_openai_connection()
        
#         # Test basic services
#         test_lat, test_lon = 40.7128, -74.0060  # NYC coordinates
#         test_city = get_city(test_lat, test_lon)
#         test_threats = get_threats_by_city(test_city)
        
#         return jsonify({
#             "status": "success",
#             "services": {
#                 "location_service": "operational" if test_city else "error",
#                 "threat_service": "operational" if test_threats else "error",
#                 "openai_service": "operational" if openai_status else "unavailable",
#                 "email_service": "operational"  # Always available in demo mode
#             },
#             "test_results": {
#                 "sample_city": test_city,
#                 "threats_detected": test_threats.get('threat_detected', False)
#             }
#         })
    
#     except Exception as e:
#         return jsonify({
#             "status": "error",
#             "message": str(e)
#         }), 500

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    """Handle 405 errors."""
    return jsonify({"error": "Method not allowed"}), 405

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    # Get configuration from environment
    debug_mode = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    port = int(os.getenv('FLASK_PORT', 5000))
    
    print("=" * 60)
    print("🚀 AI Cyber Protecting App Backend Starting...")
    print("=" * 60)
    print(f"Debug Mode: {debug_mode}")
    print(f"Port: {port}")
    print("=" * 60)
    
    # Run the Flask application
    app.run(
        debug=debug_mode,
        host='0.0.0.0',
        port=port
    )
