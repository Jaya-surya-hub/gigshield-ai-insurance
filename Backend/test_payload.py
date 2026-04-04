import requests

# Mimic the dashboard payload exactly
payload = {
    "zone_id": "COIMBATORE_WARD56",
    "live_lat": 11.0168,
    "live_lon": 76.9558,
    "is_moving": True,
    "kinematic_variance": 0.0
}
res = requests.post("http://127.0.0.1:8000/api/v1/evaluate-zone", json=payload)
print(res.status_code, res.text)
