import os
import json
import datetime
import requests
from sqlalchemy.orm import Session
from dotenv import load_dotenv  

# --- NEW SDK IMPORTS ---
from google import genai
from google.genai import types

from models import ZoneIFI

# Load environment variables from the .env file
load_dotenv()

def search_local_news(query: str) -> str:
    """Searches the internet for live news regarding weather, traffic, and infrastructure for a specific query."""
    print(f"🌐 [AGENT TOOL] Fetching live internet data for query: '{query}'...")
    api_key = os.environ.get("TAVILY_API_KEY")
    if not api_key:
        print("⚠️ [AGENT TOOL] Tavily API key missing. Cannot fetch live data.")
        return "Tavily API key missing. Cannot fetch live data."
        
    url = "https://api.tavily.com/search"
    payload = {
        "api_key": api_key,
        "query": query,
        "search_depth": "advanced",
        "include_answer": False,
        "max_results": 3,
        "topic": "news"
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        results_str = ""
        for i, item in enumerate(data.get("results", [])):
            results_str += f"{i+1}. {item.get('title')}: {item.get('content')}\n"
            
        print("✅ [AGENT TOOL] Live data retrieved successfully.")
        return results_str if results_str else "No news found."
    except Exception as e:
        print(f"❌ [AGENT TOOL] Search failed: {e}")
        return f"Warning: Live search failed due to an error: {e}"

def search_civic_infrastructure(location_query: str) -> str:
    """Searches open internet sources for official civic infrastructure updates, road tenders, and municipal pothole/drain repairs."""
    print(f"🏗️ [AGENT TOOL] Searching civic infrastructure databases for: '{location_query}'...")
    api_key = os.environ.get("TAVILY_API_KEY")
    if not api_key:
        return "Tavily API key missing. Cannot fetch live data."
        
    url = "https://api.tavily.com/search"
    payload = {
        "api_key": api_key,
        "query": f"{location_query} municipal corporation infrastructure road repair storm water drain tender",
        "search_depth": "advanced",
        "include_answer": False,
        "max_results": 3,
        "topic": "general"
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        results_str = ""
        for i, item in enumerate(data.get("results", [])):
            results_str += f"{i+1}. {item.get('title')}: {item.get('content')}\n"
            
        print("✅ [AGENT TOOL] Civic data retrieved successfully.")
        return results_str if results_str else "No recent structural updates found."
    except Exception as e:
        print(f"❌ [AGENT TOOL] Search failed: {e}")
        return f"Warning: Civic search failed due to an error: {e}"

def get_live_agentic_ifi(zone_id: str) -> dict:
    """An advanced Tool-Calling Agent that autonomously searches live news and calculates the IFI."""
    parts = zone_id.split('_')
    location_name = f"{parts[-1].title()}, {parts[0].title()}" if len(parts) > 1 else zone_id
    
    api_key = os.environ.get("GEMINI_API_KEY")
    
    if not api_key:
        print("⚠️ GEMINI_API_KEY not found. Agent offline.")
        return {"score": 1.0, "reasoning": "Fallback rules applied (No API Key)."}

    # --- NEW SDK CLIENT INITIALIZATION ---
    client = genai.Client(api_key=api_key)

    system_prompt = f"""
    You are an expert Urban Infrastructure Agent. Your goal is to assess the structural fragility of {location_name}, India.
    
    CRITICAL INSTRUCTIONS:
    1. First, use `search_civic_infrastructure` to find structural upgrades or degradation (e.g., road digging, new storm drains, municipal tenders) from recent months.
    2. Then, use `search_local_news` to find live news from the past 48 hours about sudden flooding or structural failures.
    3. Synthesize BOTH data sources. Remember, IFI measures long-term structural resilience, not just yesterday's weather.
    
    Do NOT guess. You must actively use your tools to retrieve live data for "{location_name}".
    
    After reviewing the live tool data, calculate an Infrastructure Fragility Index (IFI) score between 0.50 (Highly Resilient) and 1.80 (Highly Fragile).
    """

    print(f"🤖 [AGENT INITIATED] Connecting to Gemini ReAct loop for {location_name}...")
    try:
        # --- NEW SDK CONFIGURATION ---
        # The new SDK automatically handles the tool calling loop when functions are passed
        # We also enforce "application/json" so it never breaks your app with markdown
        config = types.GenerateContentConfig(
            system_instruction=system_prompt,
            tools=[search_local_news, search_civic_infrastructure],
            response_mime_type="application/json",
            temperature=0.2
        )
        
        # Start the chat with the new syntax
        chat = client.chats.create(model='gemini-flash-latest', config=config)
        
        response = chat.send_message(
            f'Assess the infrastructure fragility of {location_name}. Return EXACTLY this JSON structure: {{"ifi_score": 1.25, "summary": "2 sentences explaining the recent infra developments."}}'
        )
        
        # Parse the guaranteed JSON
        response_text = response.text.strip()
        data = json.loads(response_text)
        
        return {
            "score": float(data.get("ifi_score", 1.0)),
            "reasoning": data.get("summary", "Analysis complete.")
        }
    except Exception as e:
        print(f"❌ Agent execution failed: {e}")
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
