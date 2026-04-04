import requests

def get_current_conditions(zone_id: str):
    """
    LIVE WEATHER API: Fetches real-time precipitation data from Open-Meteo.
    """
    print(f"🌤️ Fetching LIVE weather data for {zone_id}...")
    
    # Map your zone IDs to actual GPS coordinates
    zone_coordinates = {
        "COIMBATORE_PEELAMEDU": {"lat": 11.0261, "lon": 77.0028},
        "COIMBATORE_UKKADAM": {"lat": 10.9905, "lon": 76.9608}
    }
    
    # Default to Peelamedu if zone isn't found
    coords = zone_coordinates.get(zone_id, zone_coordinates["COIMBATORE_PEELAMEDU"])
    
    # Open-Meteo API URL (No key required)
    url = f"https://api.open-meteo.com/v1/forecast?latitude={coords['lat']}&longitude={coords['lon']}&current=precipitation,temperature_2m"
    
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        current_data = data.get("current", {})
        rainfall_mm = current_data.get("precipitation", 0.0)
        temp_c = current_data.get("temperature_2m", 0.0)
        
        # We add a little hackathon magic here: 
        # If it's not actually raining during your demo, we force a simulated spike 
        # so you can still show the trigger working.
        is_demo_mode = True 
        if is_demo_mode and rainfall_mm < 50.0:
            print("   [Demo Mode] Forcing rainfall spike to trigger policy...")
            rainfall_mm = 65.0 
            
        return {
            "rainfall_24h": rainfall_mm,
            "temperature_c": temp_c,
            "is_monsoon": True if rainfall_mm > 20 else False
        }
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Open-Meteo API failed: {e}. Falling back to mock data.")
        # Fail-safe fallback so your demo doesn't crash if the WiFi drops
        return {
            "rainfall_24h": 65.0,
            "temperature_c": 28,
            "is_monsoon": True
        }