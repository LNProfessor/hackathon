#!/bin/bash

echo "🐍 Starting AI Cyber Protecting App Backend..."
echo "============================================="

cd backend

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Start Flask app
echo "Starting Flask server on http://localhost:5000"
python app.py
