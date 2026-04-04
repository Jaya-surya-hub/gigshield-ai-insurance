#import requests
#import json
#import os

# Ideally, these are loaded from your .env file
#GW_CLOUD_URL = os.getenv("GW_CLOUD_URL", "https://your-tenant.guidewire.net/cc/rest/hackathon/v1")
#GW_API_USER = os.getenv("GW_API_USER", "su") # Superuser for hackathon sandbox
#GW_API_PASS = os.getenv("GW_API_PASS", "gw")

#def initiate_zero_touch_claim(policy_number: str, trigger_type: str, payout: float, zone: str):
   # """
 #   Sends a POST request to the Guidewire ClaimCenter Edge API to trigger a parametric claim.
   # """
  #  endpoint = f"{GW_CLOUD_URL}/parametric/trigger"
    
    # The JSON payload matching the arguments of our Gosu function
   # payload = {
    #    "workerPolicyNumber": policy_number,
     #   "triggerType": trigger_type,
      #  "payoutAmount": round(payout, 2),
       # "eventZone": zone
    #}
    
    #headers = {
     #   "Content-Type": "application/json",
      #  "Accept": "application/json"
    #}
    
    #try:
        # Using Basic Auth for the hackathon sandbox environment
     #   response = requests.post(
      #      endpoint, 
       #     json=payload, 
        #    auth=(GW_API_USER, GW_API_PASS),
         #   headers=headers,
          #  timeout=10 # Fail fast if Guidewire is down
        #)
        
        #response.raise_for_status() # Raise an exception for bad status codes
        
        # Expecting the success string we defined in the Gosu class
        #result = response.json()
        #print(f"✅ Guidewire Success: {result.get('message')}")
        #return result
        
    #except requests.exceptions.RequestException as e:
     #   print(f"❌ Guidewire API Error: {e}")
        # In a real app, you would queue this in Redis to retry later
       # return {"status": "error", "details": str(e)}
def initiate_zero_touch_claim(policy_number: str, trigger_type: str, payout: float, zone: str):
    """
    MOCK Guidewire API: Simulates a successful ClaimCenter POST request for local testing.
    """
    print(f"✅ Mock Guidewire: Pushing Claim for {policy_number} -> ₹{payout} INR")
    
    # We pretend Guidewire responded perfectly
    return {
        "status": "success", 
        "message": "Claim created successfully in PolicyCenter",
        "claim_number": f"CLM-MOCK-{policy_number[-3:]}"
    }