import requests

data = {
    "zone_id": "COIMBATORE_WARD56",
    "live_lat": None,
    "live_lon": None,
    "is_moving": False,
    "kinematic_variance": None
}

response = requests.post("http://127.0.0.1:8000/api/v1/evaluate-zone", json=data)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")

data2 = {
    "zone_id": "COIMBATORE_WARD56",
    "live_lat": None,
    "live_lon": None,
    "is_moving": False,
    "kinematic_variance": 0.0
}

response2 = requests.post("http://127.0.0.1:8000/api/v1/evaluate-zone", json=data2)
print(f"\nStatus2: {response2.status_code}")
print(f"Response2: {response2.text}")
