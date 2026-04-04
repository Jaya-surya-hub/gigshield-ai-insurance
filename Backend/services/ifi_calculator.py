import os
import json
import datetime
from sqlalchemy.orm import Session
import google.generativeai as genai
from dotenv import load_dotenv  # <-- Import dotenv
from models import ZoneIFI

# Load environment variables from the .env file
load_dotenv()

def get_live_agentic_ifi(zone_id: str) -> dict:
    """The LLM Agent that searches and calculates the score."""
    parts = zone_id.split('_')
    search_location = f"{parts[-1].title()}, {parts[0].title()}" if len(parts) > 1 else zone_id
    
    # Fetch the API key securely from the environment variables
    api_key = os.environ.get("GEMINI_API_KEY")
    
    if not api_key:
        print("⚠️ GEMINI_API_KEY not found. Agent offline.")
        return {"score": 1.0, "reasoning": "Fallback rules applied (No API Key)."}

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-pro')

    prompt = f"""
    You are an expert Urban Infrastructure Agent. Analyze the current infrastructure status of {search_location}, India.
    Consider recent news regarding:
    1. Flooding history and storm water drain quality.
    2. Road conditions (potholes, ongoing smart city digging).
    3. Traffic congestion during heavy rains.

    Based on your analysis, calculate an Infrastructure Fragility Index (IFI) score between 0.50 (Highly Resilient) and 1.80 (Highly Fragile).
    
    Respond STRICTLY in the following JSON format:
    {{
        "ifi_score": 1.25,
        "summary": "2 sentences explaining the recent infra developments justifying the score."
    }}
    """

    try:
        response = model.generate_content(prompt)
        response_text = response.text.replace('```json', '').replace('```', '').strip()
        data = json.loads(response_text)
        return {
            "score": float(data.get("ifi_score", 1.0)),
            "reasoning": data.get("summary", "Analysis complete.")
        }
    except Exception as e:
        print(f"❌ Agent failed: {e}")
        return {"score": 1.0, "reasoning": "Fallback rules applied (Agent Error)."}

def get_zone_ifi(zone_id: str, db: Session) -> float:
    """
    Checks the DB. If data is missing or > 15 days old, dispatches the Agent.
    Otherwise, returns the cached score instantly.
    """
    now = datetime.datetime.utcnow()
    zone_record = db.query(ZoneIFI).filter(ZoneIFI.zone_id == zone_id).first()

    # 1. CHECK DATABASE CACHE
    if zone_record:
        age_days = (now - zone_record.last_updated).days
        
        # If it's fresh (under 15 days), use it!
        if age_days < 15:
            print(f"⚡ [DB HIT] IFI for {zone_id} is {zone_record.score} (Updated {age_days} days ago)")
            return zone_record.score
            
        print(f"🔄 [STALE DATA] IFI for {zone_id} is {age_days} days old. Dispatching Agent...")
    else:
        print(f"🔍 [NEW ZONE] No record for {zone_id}. Dispatching Agent...")

    # 2. RUN THE AGENT (Because data is stale or missing)
    agent_report = get_live_agentic_ifi(zone_id)
    new_score = agent_report['score']
    new_reasoning = agent_report['reasoning']

    # 3. SAVE TO DATABASE
    if zone_record:
        # Update existing row
        zone_record.score = new_score
        zone_record.reasoning = new_reasoning
        zone_record.last_updated = now
    else:
        # Create new row
        new_zone = ZoneIFI(
            zone_id=zone_id,
            score=new_score,
            reasoning=new_reasoning,
            last_updated=now
        )
        db.add(new_zone)

    db.commit()
    print(f"💾 [SAVED] New IFI score {new_score} saved to database for {zone_id}.")
    return new_score

def get_zone_reasoning(zone_id: str, db: Session) -> str:
    """Helper to fetch the reasoning text for the frontend Quote screen."""
    zone_record = db.query(ZoneIFI).filter(ZoneIFI.zone_id == zone_id).first()
    return zone_record.reasoning if zone_record else "Standard urban parameters applied."