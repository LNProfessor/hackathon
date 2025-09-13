"""
LLM Service for AI Cyber Protecting App
Provides AI-powered security recommendations using OpenAI's API.
"""
import os
from openai import OpenAI

# Initialize OpenAI client
client = None

def initialize_openai_client():
    """Initialize the OpenAI client with API key from environment."""
    global client
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key:
        client = OpenAI(api_key=api_key)
        return True
    return False

def generate_recommendations(zone, risk_factors, location_context, threat_data):
    """
    Generate AI-powered security recommendations based on risk assessment.
    
    Args:
        zone (str): Security zone (Green, Yellow, Red)
        risk_factors (list): List of identified risk factors
        location_context (dict): Location information
        threat_data (dict): Threat intelligence data
    
    Returns:
        dict: Contains AI-generated recommendations and reason
    """
    # Initialize OpenAI client if not already done
    if client is None:
        if not initialize_openai_client():
            # Fallback to static recommendations if OpenAI is not available
            return generate_static_recommendations(zone, risk_factors, location_context, threat_data)
    
    try:
        # Prepare context for AI
        city = location_context.get('city', 'Unknown location')
        risk_summary = ', '.join(risk_factors) if risk_factors else 'No specific risks detected'
        threat_summary = threat_data.get('description', 'No active threats') if threat_data and threat_data.get('threat_detected') else 'No active threats'
        
        # Create prompt for AI
        prompt = f"""
You are a cybersecurity expert providing personalized security recommendations. 

Current Situation:
- Security Zone: {zone}
- Location: {city}
- Risk Factors: {risk_summary}
- Local Threats: {threat_summary}

Please provide:
1. A clear, concise reason why the user is in this security zone
2. 3-5 specific, actionable recommendations appropriate for their current risk level

Keep recommendations practical and immediately actionable. Use a professional but accessible tone.
For Red zones, emphasize urgency. For Yellow zones, focus on prevention. For Green zones, maintain good practices.

Format your response as JSON with two fields:
- "reason": A single sentence explaining why they're in this zone
- "recommendations": An array of specific action items
"""
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a cybersecurity expert assistant providing clear, actionable security advice."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        # Parse AI response
        ai_content = response.choices[0].message.content.strip()
        
        # Try to parse as JSON, fallback to static if parsing fails
        try:
            import json
            ai_result = json.loads(ai_content)
            return {
                "reason": ai_result.get("reason", generate_static_reason(zone, risk_factors, threat_data)),
                "recommendations": ai_result.get("recommendations", generate_static_recommendations_list(zone)),
                "ai_generated": True
            }
        except json.JSONDecodeError:
            # If AI response isn't valid JSON, extract manually or use static
            return generate_static_recommendations(zone, risk_factors, location_context, threat_data)
    
    except Exception as e:
        print(f"OpenAI API error: {str(e)}")
        # Fallback to static recommendations
        return generate_static_recommendations(zone, risk_factors, location_context, threat_data)

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

def test_openai_connection():
    """Test if OpenAI API connection is working."""
    try:
        if initialize_openai_client():
            # Make a simple test request
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": "Test connection - respond with 'OK'"}],
                max_tokens=10
            )
            return True
    except Exception as e:
        print(f"OpenAI connection test failed: {str(e)}")
        return False
    
    return False
