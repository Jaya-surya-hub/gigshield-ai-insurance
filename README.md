# GigShield – AI-Powered Parametric Insurance for Food Delivery Partners

> **"If the disruption happens, the payout happens — no paperwork, no delays, no questions."**

![Phase](https://img.shields.io/badge/Phase-1%20Seed-blueviolet)
![Persona](https://img.shields.io/badge/Persona-Food%20Delivery%20(Zomato%20%7C%20Swiggy)-orange)
![Model](https://img.shields.io/badge/Model-Parametric%20Insurance-green)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20PostgreSQL-blue)

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Our Solution](#our-solution)
3. [Target Persona & Scenarios](#target-persona--scenarios)
4. [Application Workflow](#application-workflow)
5. [Weekly Premium Model](#weekly-premium-model)
6. [Parametric Triggers & Payout Table](#parametric-triggers--payout-table)
7. [AI/ML Architecture](#aiml-architecture)
8. [Fraud Detection Engine](#fraud-detection-engine)
9. [GigScore — Worker Trust Index](#gigscore--worker-trust-index)
10. [Tech Stack](#tech-stack)
11. [System Architecture](#system-architecture)
12. [Platform Choice — Web](#platform-choice--web)
13. [6-Week Development Roadmap](#6-week-development-roadmap)
14. [Business Model](#business-model)
15. [Future Scope](#future-scope)

---

## Problem Statement

India's food delivery ecosystem is powered by hundreds of thousands of delivery partners working for platforms like **Zomato** and **Swiggy**. These workers earn Rs.8,000–Rs.15,000/month — entirely dependent on daily active delivery hours.

### The Core Crisis

When uncontrollable external disruptions strike — heavy rain, dangerous AQI levels, sudden curfews, or platform outages — these workers:

- Cannot step outside or access pickup/drop locations
- Lose 20–30% of weekly income overnight
- Have zero financial safety net to absorb the shock
- Face no insurance product designed for their reality

Unlike salaried workers, gig delivery partners bear **100% of income risk** from factors entirely outside their control. No sick leave. No income guarantee. No backup.

> A Swiggy delivery partner in Chennai during a flood day earns Rs.0 — while their rent, EMI, and grocery bills don't pause.

---

## Our Solution

**GigShield** is an **AI-powered parametric income protection platform** built exclusively for food delivery partners on Zomato and Swiggy.

### What Makes It Parametric?

Traditional insurance requires you to file a claim and prove a loss. Parametric insurance works differently:

> We monitor the real world. When a pre-defined trigger fires (e.g., rainfall > 50mm), eligible workers automatically receive their payout — no forms, no waiting, no rejection.

### Key Pillars

| Pillar | Description |
|--------|-------------|
| **Instant Auto-Payout** | Triggered by real-world data, not manual claims |
| **AI-Personalized Pricing** | Weekly premium tailored to your zone, history, and GigScore |
| **Multi-Layer Fraud Detection** | GPS validation + Buddy Verification + Isolation Forest |
| **Predictive Coverage Upgrade** | AI forecasts risky days 48hrs ahead and auto-upgrades your plan |
| **Weekly Subscription Model** | Rs.49–Rs.99/week — aligned with gig worker pay cycles |

---

## Target Persona & Scenarios

### Primary Persona

```
Name          : Ramesh / Priya (Composite)
Platform      : Zomato / Swiggy delivery partner
City          : Chennai, Bangalore, Mumbai, Delhi
Monthly Income: Rs.8,000 – Rs.15,000
Working Hours : 8–12 hrs/day
Device        : Android smartphone (entry-to-mid range)
Language      : Tamil / Kannada / Hindi + Basic English
Concern       : "What happens to my family if I can't deliver for 2 days?"
```

### Real-World Scenarios GigShield Covers

**Scenario 1 — Heavy Rain in Chennai**
> Cyclone Michaung hits Chennai. Roads flood. Zomato suspends operations in 3 zones. Ramesh cannot work for 2 days. GigShield detects rainfall > 50mm via weather API, cross-checks that Zomato order volume in Ramesh's zone dropped by 65%, and auto-initiates payout of 50% of his weekly income within 2 hours.

**Scenario 2 — AQI Spike in Delhi**
> Delhi AQI crosses 350 (Severe). Local authorities advise against outdoor activity. Priya (Swiggy, Delhi) cannot safely work. GigShield detects AQI > 300 sustained for 4+ hours and processes 40% weekly income payout automatically.

**Scenario 3 — Local Bandh / Curfew in Bangalore**
> A sudden political protest leads to a city-wide bandh. Roads are blocked. Swiggy operations halt. GigShield detects verified government alert + near-zero order activity + GPS inactivity of 90%+ of zone workers, and fires 70% weekly income payout.

**Scenario 4 — Platform Outage**
> Zomato faces a backend outage lasting 3 hours during peak dinner time. No orders flow. GigShield's uptime monitor detects the outage, validates it against GPS data showing workers are active but idle, and triggers 30% weekly income payout.

---

## Application Workflow

```
WORKER JOURNEY
──────────────────────────────────────────────────────────────────

1. ONBOARDING (2 minutes)
   Worker opens GigShield web app
   → Enters phone number (OTP verification)
   → Selects platform: Zomato / Swiggy
   → Inputs home zone / primary delivery area
   → Enters UPI ID for payouts
   → AI generates initial Risk Profile + GigScore (starts at 50/100)
   → Selects weekly plan (Rs.49 / Rs.69 / Rs.99)
   → Policy activated instantly

2. ACTIVE COVERAGE WEEK
   Worker delivers normally
   → GigShield monitors weather, AQI, govt alerts, platform uptime in background
   → GigScore updates daily based on activity and GPS consistency
   → 48hr ahead: AI sends predictive alert if disruption expected
      "Heavy rain expected Thursday in your zone — coverage auto-upgraded"

3. DISRUPTION EVENT
   Trigger condition fires (e.g., rain > 50mm)
   → AI engine validates event authenticity
   → Cross-checks order volume drop on Zomato/Swiggy in worker's zone
   → Buddy Verification: checks if 3+ nearby workers also went inactive
   → Fraud score calculated via Isolation Forest
   → If all checks pass → PAYOUT INITIATED (< 2 hours)

4. PAYOUT
   Worker receives UPI notification
   → Dashboard shows: "Rs.420 credited — Rain disruption cover (Tues)"
   → GigScore maintained / adjusted
   → Coverage auto-renews next week

5. DASHBOARD
   Worker sees : GigScore, active plan, earnings protected, payout history
   Insurer sees : Loss ratio, zone risk heatmap, fraud flags, next-week risk forecast
```

---

## Weekly Premium Model

### Why Weekly?

Gig workers are paid weekly (or daily) by platforms. Monthly premiums create affordability friction. GigShield's pricing matches the worker's **actual cash flow rhythm**.

### Premium Tiers

| Plan | Weekly Cost | Coverage | Max Weekly Payout |
|------|------------|----------|------------------|
| Basic Shield | Rs.49/week | Rain + AQI only | Up to Rs.600 |
| Full Shield | Rs.69/week | Rain + AQI + Curfew | Up to Rs.1,000 |
| Total Shield | Rs.99/week | All 4 triggers + Platform Outage | Up to Rs.1,500 |

### Dynamic Pricing Factors (AI-Adjusted Weekly)

The base tier price is adjusted +/- Rs.10–20 based on:

| Factor | Impact |
|--------|--------|
| GigScore > 75 | -Rs.10 to -Rs.15 (loyalty reward) |
| High-risk zone (flood-prone, high AQI historical) | +Rs.10 to +Rs.20 |
| Previous clean claim history (no fraud flags) | -Rs.5 |
| New worker (< 4 weeks on platform) | Neutral (50/100 base GigScore) |
| Zone historically safe (low weather events last 12 months) | -Rs.10 |

> **Example**: Ramesh in Chennai (flood-prone zone, GigScore 82) on Full Shield:
> Base Rs.69 + Zone risk +Rs.15 - GigScore discount -Rs.12 = **Rs.72/week**

### Premium Collection
- Auto-deducted weekly (Sunday midnight) via UPI mandate
- Worker can pause coverage for 1 week (max 2 pauses/year)
- No cancellation penalty

---

## Parametric Triggers & Payout Table

> **Important**: GigShield covers **income loss only**. No vehicle repair. No medical. No accidents.

| # | Trigger | Condition | Data Source | Payout (% of weekly income) |
|---|---------|-----------|-------------|----------------------------|
| 1 | Heavy Rainfall | > 50mm rainfall in 24hrs in worker's zone | OpenWeatherMap API | 50% |
| 2 | Severe AQI | AQI > 300 sustained for 4+ hours | AQICN API | 40% |
| 3 | Curfew / Bandh | Verified government alert + zone inactivity > 80% | Govt alert feed + GPS | 70% |
| 4 | Platform Outage | Zomato/Swiggy downtime > 2 hours during 11am–11pm | Uptime monitor + order volume | 30% |
| 5 | Flood Warning | Flood warning issued by IMD for worker's district | IMD API / mock | 60% |

### Payout Calculation Example

```
Worker         : Priya, Swiggy, Bangalore
Weekly income  : Rs.2,800
Plan           : Full Shield (Rs.69/week)

Trigger fires  : Heavy Rainfall (Tuesday)
Payout         = 50% of Rs.2,800 = Rs.1,400

Net position:
  Received      : Rs.1,400
  Premium paid  : Rs.69
  Net benefit   : Rs.1,331
```

### Multi-Trigger Handling

If two triggers fire in the same week, the **higher payout trigger applies** (no stacking). Worker receives the maximum single-event payout for that week.

---

## AI/ML Architecture

### 1. Dynamic Premium Pricing Engine

**Model**: XGBoost Regressor

**Training Features**:
```
- worker_zone_id          (encoded zone from city grid)
- zone_flood_history_12m  (count of flood events in 12 months)
- zone_avg_aqi_30d        (rolling 30-day average AQI)
- worker_gigscore         (0–100, computed daily)
- worker_claim_count      (lifetime claims filed)
- platform                (0=Zomato, 1=Swiggy)
- season                  (monsoon / winter / summer)
- week_of_year            (1–52)
```

**Output**: Adjusted weekly premium in Rs. (within +/- Rs.20 of base tier)

**Retraining**: Weekly batch retraining using new claim and weather data

---

### 2. Predictive Risk Intelligence (48hr Forecaster)

**Model**: Time-Series LSTM / ARIMA hybrid on zone-level weather data

**What it does**:
- Ingests 7-day weather forecast from OpenWeatherMap
- Predicts probability of trigger-level disruption per zone for next 48 hours
- If probability > 60% — worker receives proactive alert + auto coverage upgrade
- Insurer dashboard shows zone-level risk heatmap for upcoming week

**Sample Alert to Worker**:
```
GigShield Alert
Heavy rain (>50mm) is forecasted in your zone (Velachery, Chennai)
on Thursday between 2PM–8PM.

Your coverage has been auto-upgraded for Thursday.
If rain exceeds threshold, Rs.1,400 will be credited automatically.
Stay safe.
```

---

### 3. Hyper-Local Zone Risk Scoring

Instead of city-level risk, GigShield scores each **1km² zone** individually:

```
Zone Risk Score = f(
  historical_flood_events,
  avg_aqi_last_90_days,
  waterlogging_complaint_density,
  distance_from_water_body,
  infrastructure_score
)
```

- Implemented using **K-Means clustering** to group zones into: Low / Medium / High / Extreme risk
- Premium and coverage levels are dynamically mapped to zone risk bucket
- Visualized as a heatmap on the insurer dashboard

---

## Fraud Detection Engine

GigShield uses a **3-layer fraud detection system** — unique to the gig delivery context.

### Layer 1 — Isolation Forest (Statistical Anomaly Detection)

**Model**: `sklearn.ensemble.IsolationForest`

Detects anomalous claim patterns using features:
```
- time_since_last_claim
- claim_frequency_30d
- gps_activity_at_trigger_time
- distance_from_declared_zone
- worker_gigscore
- order_activity_at_trigger_time (platform API)
```

Workers with anomaly score below threshold are flagged for manual review.

---

### Layer 2 — Buddy Verification (Social Cross-Check)

> **Core insight**: A real weather event affects ALL workers in a zone — not just one.

**Logic**:
```
When a claim is filed for worker W in zone Z:

1. Identify all GigShield workers active in zone Z (within 1km radius)
2. Check: how many of them also went inactive at the same time?

   IF count_inactive_nearby >= 3:
     → Event is real → AUTO-APPROVE claim

   IF count_inactive_nearby == 1 (only the claimant):
     → Suspicious → FLAG for AI review + manual verification

   IF count_inactive_nearby == 0:
     → High fraud risk → REJECT + notify worker
```

This creates a **self-verifying worker community** with no extra work required from anyone.

---

### Layer 3 — GPS & Platform Correlation

- **GPS Spoofing Detection**: Compare declared zone with live GPS coordinates at trigger time. Distance > 5km from declared zone → flag.
- **Platform Order Volume Check**: Cross-reference Zomato/Swiggy order volume in the zone. If orders did not drop during claimed disruption → flag.
- **Duplicate Claim Prevention**: Hash-based deduplication on (worker_id + trigger_type + trigger_date).

---

## GigScore — Worker Trust Index

GigScore is a **dynamic, daily-updated trust score (0–100)** assigned to every GigShield worker.

### Why GigScore?

It rewards honest, active workers with lower premiums and faster claim processing — creating a virtuous cycle of loyalty and trust.

### Score Factors

| Factor | Weight | Direction |
|--------|--------|-----------|
| Days active on platform (last 30d) | 30% | More active = higher score |
| GPS consistency (declared zone vs actual) | 25% | Consistent = higher score |
| Claim history (frequency, legitimacy) | 25% | Clean history = higher score |
| Order completion rate (from platform API) | 20% | Higher completion = higher score |

### GigScore Tiers & Benefits

| Score Range | Tier | Benefit |
|-------------|------|---------|
| 80–100 | Trusted | -Rs.15/week premium, priority payout (< 1hr) |
| 60–79 | Active | -Rs.8/week premium, standard payout (< 2hrs) |
| 40–59 | New | Standard premium, standard payout |
| 0–39 | Flagged | +Rs.10/week, manual claim review |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React.js (PWA) | Web app, mobile-responsive |
| **Backend** | FastAPI (Python) | REST APIs, trigger engine |
| **ML Models** | scikit-learn, XGBoost, statsmodels | Pricing, fraud, forecasting |
| **Database** | PostgreSQL | Workers, policies, claims, payouts |
| **Cache / Queue** | Redis | Real-time trigger queue, alert dispatch |
| **Weather API** | OpenWeatherMap (free tier) | Rainfall, forecast data |
| **AQI API** | AQICN (free tier) | Air quality index |
| **Payments** | Razorpay (test mode) / UPI simulator | Mock payout processing |
| **Notifications** | Firebase Cloud Messaging | Push alerts to workers |
| **Hosting** | Render / Railway (free tier) | Backend + ML model serving |
| **Auth** | OTP via MSG91 (free tier) / mock | Phone number verification |
| **Monitoring** | Uptime Robot (free) | Platform outage detection |

---

## System Architecture

The diagram below shows the full data flow — from external data sources through the AI core engine, ML processing layers, FastAPI backend, and out to both the worker and insurer dashboards.

![GigShield System Architecture](./assets/architecture.png)

### Architecture Layer Breakdown

**Layer 1 — External Data Sources**
Five real-world data feeds power the system: OpenWeatherMap (rainfall), AQICN (AQI), Platform API (order volume drop), Government Alerts (curfews/strikes), and GPS Feed (worker location).

**Layer 2 — AI Core Engine**
All incoming data is processed centrally for real-time trigger monitoring, hyper-local zone risk scoring, and 48-hour predictive forecasting.

**Layer 3 — ML Processing (3 parallel modules)**
- **Premium Engine**: XGBoost + GigScore + zone risk scoring → personalized weekly price
- **Fraud Detection**: Isolation Forest anomaly detection + Buddy Verification → fraud score
- **Claims Processor**: Automated trigger evaluation → zero-touch payout initiation

**Layer 4 — FastAPI Backend + PostgreSQL**
Handles policy management, authentication, push notifications, GigScore pipeline, and payout orchestration via Razorpay test mode.

**Layer 5 — Dashboards**
- **Worker Dashboard**: GigScore, active plan, earnings protected, payout history
- **Insurer Dashboard**: Loss ratios, zone risk heatmap, fraud flags, next-week predictions

---

## Platform Choice — Web

**Decision: Progressive Web App (PWA) via React.js**

| Criteria | Reasoning |
|----------|-----------|
| No app store needed | Workers can access instantly via WhatsApp link / SMS |
| Works on low-end Android | PWA is lightweight, no 100MB app download |
| Offline support | Service workers cache key screens |
| Easy OTA updates | No version fragmentation |
| UPI deep links work natively | Seamless payout initiation |

A native Android app may be added in Phase 3 if adoption warrants.

---

## 6-Week Development Roadmap

### Phase 1 — Seed (Weeks 1–2): Ideate & Know Your Worker
**Theme**: Foundations & Research

- [x] Problem validation and persona research
- [x] README + system design document
- [x] Define parametric triggers and payout structure
- [x] Define GigScore model and Buddy Verification concept
- [ ] Basic project scaffolding (React frontend + FastAPI backend)
- [ ] Database schema design (workers, policies, claims, payouts)
- [ ] OpenWeatherMap + AQICN API integration (basic calls)

**Deliverable**: README.md + GitHub repo + 2-min strategy video

---

### Phase 2 — Scale (Weeks 3–4): Protect Your Worker
**Theme**: Core Product Build

- [ ] Worker onboarding flow (phone OTP → zone selection → plan selection)
- [ ] Policy creation with weekly pricing logic
- [ ] XGBoost premium pricing model (trained on synthetic data)
- [ ] Real-time trigger monitoring engine (weather + AQI checks every 15 min)
- [ ] Basic Isolation Forest fraud detection
- [ ] Worker dashboard (GigScore, active plan, status)
- [ ] Mock claim auto-initiation on trigger fire
- [ ] Admin panel (basic): view policies, trigger events

**Deliverable**: Working demo — onboarding + trigger + mock payout + 2-min demo video

---

### Phase 3 — Soar (Weeks 5–6): Perfect for Your Worker
**Theme**: Intelligence, Fraud & Scale

- [ ] Buddy Verification system (zone co-inactivity cross-check)
- [ ] GPS spoofing detection + platform order volume correlation
- [ ] 48hr predictive risk forecaster (LSTM/ARIMA) + push notifications
- [ ] Razorpay test mode / UPI simulator for instant payouts
- [ ] Insurer dashboard: loss ratios, zone risk heatmap, fraud flags
- [ ] GigScore daily update pipeline
- [ ] Multi-trigger week handling logic
- [ ] System stress testing + UI polish

**Deliverable**: Full platform demo + 5-min walkthrough video + final pitch deck

---

## Business Model

### Revenue
- Weekly subscription premiums collected from workers
- Target: 10,000 active workers x avg Rs.70/week = **Rs.70,00,000/month**

### Cost Structure
- Expected claim ratio: ~40% of premium pool (parametric = predictable)
- Infrastructure: Minimal (serverless + free tier APIs in early stage)
- Customer acquisition: B2B2C via Zomato/Swiggy fleet manager partnerships

### Why This Is Sustainable
- **Parametric = no ambiguity** in claims → low operational overhead
- **GigScore = self-selecting low-risk pool** → better loss ratio over time
- **Weekly model = high touchpoint** → strong retention vs annual insurance

---

## Future Scope

| Feature | Timeline |
|---------|----------|
| Expand to grocery (Zepto/Blinkit/Dunzo) persona | Phase 4 |
| Expand to e-commerce (Amazon/Flipkart) persona | Phase 4 |
| Blockchain-backed claim audit trail | Phase 5 |
| AI Copilot — "Best hours to work this week" advisor | Phase 5 |
| Ride-sharing drivers (Uber/Ola) persona | Phase 6 |
| B2B API: White-label GigShield for platforms | Phase 6 |
| Expand to Southeast Asia (Indonesia, Vietnam) | Year 2 |

---

## Important Disclaimers

- GigShield covers **income loss only** — no vehicle repair, no medical, no accident claims
- This platform is built for the **Guidewire DEVTrails 2026** hackathon
- Payment integrations use **test/sandbox/mock modes only**
- External API data used under **free tier terms**

---

## Links

- **GitHub Repository**: *(this repo)*
- **Phase 1 Demo Video**: *(link to be added)*
- **System Design Doc**: *(link to be added)*

---

<div align="center">

**Built for India's 15 million gig delivery workers**

*GigShield — Protect smarter. Earn braver.*

</div>
