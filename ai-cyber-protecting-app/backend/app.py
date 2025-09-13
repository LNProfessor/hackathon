"""
AI Cyber Protecting App - Backend API
Flask application that provides security risk assessment based on location and threat intelligence.
"""
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Import services
from services.risk_scorer import calculate_risk, get_zone_message, get_base_recommendations
from services.location_service import get_city, get_location_context
from services.threat_service import get_threats_by_city, get_threat_summary
from services.email_service_simple import send_red_alert_email
from services.llm_service import generate_recommendations, test_openai_connection

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
        "wifiSSID": "City_Airport_Free_WiFi"
    }
    """
    try:
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        # Extract required fields
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        wifi_ssid = data.get('wifiSSID', '')
        
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
        city = location_context['city']
        
        # Step 2: Get threat intelligence for the area
        threat_data = get_threats_by_city(city)
        
        # Step 3: Calculate risk score using weighted scoring engine
        risk_assessment = calculate_risk(latitude, longitude, wifi_ssid, threat_data)
        
        risk_score = risk_assessment['risk_score']
        zone = risk_assessment['zone']
        risk_factors = risk_assessment['risk_factors']
        
        # Step 4: Generate recommendations (AI-powered or static fallback)
        recommendations_data = generate_recommendations(
            zone, risk_factors, location_context, threat_data
        )
        
        reason = recommendations_data['reason']
        recommendations = recommendations_data['recommendations']
        
        # Step 5: Handle Red Zone alert email
        email_sent = False
        security_code = None
        
        if zone == "Red":
            email_result = send_red_alert_email(location_context, risk_factors)
            email_sent = email_result['email_sent']
            security_code = email_result.get('security_code')
        
        # Step 6: Prepare response
        response_data = {
            "zone": zone,
            "score": risk_score,
            "reason": reason,
            "recommendations": recommendations,
            "emailSent": email_sent,
            "location": {
                "city": city,
                "coordinates": {
                    "latitude": latitude,
                    "longitude": longitude
                }
            },
            "threatInfo": {
                "detected": threat_data.get('threat_detected', False),
                "summary": get_threat_summary(threat_data) if threat_data.get('threat_detected') else None
            },
            "riskFactors": risk_factors
        }
        
        # Add security code to response if email was sent
        if security_code:
            response_data["securityCode"] = security_code
        
        return jsonify(response_data)
    
    except Exception as e:
        # Log error and return generic error response
        print(f"Error in check_security endpoint: {str(e)}")
        return jsonify({
            "error": "Internal server error occurred during security check",
            "details": str(e) if app.debug else None
        }), 500

@app.route('/api/test-connection', methods=['GET'])
def test_connection():
    """Test endpoint to verify backend connectivity and service status."""
    try:
        # Test OpenAI connection
        openai_status = test_openai_connection()
        
        # Test basic services
        test_lat, test_lon = 40.7128, -74.0060  # NYC coordinates
        test_city = get_city(test_lat, test_lon)
        test_threats = get_threats_by_city(test_city)
        
        return jsonify({
            "status": "success",
            "services": {
                "location_service": "operational" if test_city else "error",
                "threat_service": "operational" if test_threats else "error",
                "openai_service": "operational" if openai_status else "unavailable",
                "email_service": "operational"  # Always available in demo mode
            },
            "test_results": {
                "sample_city": test_city,
                "threats_detected": test_threats.get('threat_detected', False)
            }
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

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
    print(f"OpenAI Available: {'Yes' if test_openai_connection() else 'No (using static recommendations)'}")
    print("=" * 60)
    
    # Run the Flask application
    app.run(
        debug=debug_mode,
        host='0.0.0.0',
        port=port
    )
