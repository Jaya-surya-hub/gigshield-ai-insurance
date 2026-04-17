import requests
import os

def get_aqi(lat: float, lon: float) -> float:
    api_key = os.getenv("AQICN_TOKEN", "demo")
    url = f"https://api.waqi.info/feed/geo:{lat};{lon}/?token={api_key}"
    try:
        r = requests.get(url, timeout=5)
        data = r.json()
        return float(data['data']['aqi'])
    except Exception as e:
        print(f"Error fetching AQI: {e}")
        return 0.0  # failsafe
