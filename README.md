# GigShield – AI-Powered Parametric Insurance for Food Delivery Partners

> **"If the disruption happens, the payout happens — no paperwork, no delays, no questions."**

![Phase](https://img.shields.io/badge/Phase-1%20Seed-blueviolet)
![Persona](https://img.shields.io/badge/Persona-Food%20Delivery%20(Zomato%20%7C%20Swiggy)-orange)
![Model](https://img.shields.io/badge/Model-Parametric%20Insurance-green)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20PostgreSQL-blue)

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Our Solution — The Unicorn Edge](#our-solution--the-unicorn-edge)
3. [Target Persona & Scenarios](#target-persona--scenarios)
4. [Application Workflow](#application-workflow)
5. [Weekly Premium Model](#weekly-premium-model)
6. [Parametric Triggers & Payout Table](#parametric-triggers--payout-table)
7. [AI/ML Architecture](#aiml-architecture)
8. [Fraud Detection Engine](#fraud-detection-engine)
9. [Adversarial Defense & Anti-Spoofing Strategy](#adversarial-defense--anti-spoofing-strategy)
10. [GigScore — Worker Trust Index](#gigscore--worker-trust-index)
11. [Tech Stack](#tech-stack)
12. [System Architecture](#system-architecture)
13. [Platform Choice — Web](#platform-choice--web)
14. [6-Week Development Roadmap](#6-week-development-roadmap)
15. [Business Model](#business-model)
16. [Future Scope](#future-scope)

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

## Our Solution — The Unicorn Edge

**GigShield** is an **AI-powered parametric income protection platform** built exclusively for food delivery partners on Zomato and Swiggy.

### What Makes It Parametric?

Traditional insurance requires you to file a claim and prove a loss. Parametric insurance works differently:

> We monitor the real world. When a pre-defined trigger fires (e.g., rainfall > 50mm), eligible workers automatically receive their payout — no forms, no waiting, no rejection.

### The Infrastructure Fragility Index (IFI)

Unlike standard products, GigShield uses an **Infrastructure Fragility Index** per delivery zone. We recognize that environmental triggers are not one-size-fits-all:

> 50mm of rain in a well-developed area like Peelamedu (Coimbatore) is a minor delay. In a low-lying industrial zone with poor drainage, the same 50mm is a total income halt.

Our AI weights payout thresholds based on the **physical vulnerability of the worker's specific zone** — not a city-wide average.

### Key Pillars

| Pillar | Description |
|--------|-------------|
| **Instant Auto-Payout** | Triggered by real-world data, not manual claims |
| **Infrastructure-Weighted Triggers** | Payout thresholds adapt to local drainage and traffic quality |
| **Dwell-Time Guard** | Pays stipends for excessive wait times at restaurants — insuring invisible labor |
| **AI-Personalized Pricing** | Weekly premium tailored to zone IFI, history, and GigScore |
| **Kinematic Fraud Detection** | Physics-based GPS validation — we trust the laws of physics, not coordinates |
| **Penalty Reimbursement** | Covers platform deductions caused by confirmed extreme weather |
| **Predictive Coverage Upgrade** | AI forecasts risky days 48hrs ahead and auto-upgrades your plan |
| **Weekly Subscription Model** | Rs.25–Rs.99/week — aligned with gig worker pay cycles |

---

## Target Persona & Scenarios

### Primary Persona

```
Name          : Ramesh / Priya (Composite)
Platform      : Zomato / Swiggy delivery partner
City          : Chennai, Bangalore, Mumbai, Delhi, Coimbatore
Monthly Income: Rs.8,000 – Rs.15,000
Working Hours : 8–12 hrs/day
Device        : Android smartphone (entry-to-mid range)
Language      : Tamil / Kannada / Hindi + Basic English
Concern       : "What happens to my family if I can't deliver for 2 days?"
```

### Real-World Scenarios GigShield Covers

**Scenario 1 — The Peelamedu vs. Low-Lying Zone Rain Factor (IFI in Action)**
> 40mm of rain hits Coimbatore. In Peelamedu, infrastructure holds — roads drain, work continues, no payout fires. In a nearby low-lying industrial zone with poor drainage, the same 40mm causes waterlogging and a total halt. GigShield detects the zone's high Fragility Index and triggers a 30% payout for the stalled worker — while the Peelamedu worker correctly receives nothing. Same rain. Different ground reality. Different response.

**Scenario 2 — Heavy Rain in Chennai**
> Cyclone Michaung hits Chennai. Roads flood. Zomato suspends operations in 3 zones. Ramesh cannot work for 2 days. GigShield detects rainfall > 50mm via weather API, cross-checks that Zomato order volume in Ramesh's zone dropped by 65%, and auto-initiates payout of 50% of his weekly income within 2 hours.

**Scenario 3 — The Invisible Labor Dwell-Time Event**
> A rider is stuck at a popular cloud kitchen for 45 minutes during a dinner rush surge — waiting for the order to be prepared. GigShield tracks GPS dwell-time at the restaurant pin. Once the 15-minute fair-wait threshold is breached, the system begins accruing a Rs.2/minute waiting stipend to compensate for lost delivery opportunity during that time.

**Scenario 4 — AQI Spike in Delhi**
> Delhi AQI crosses 350 (Severe). Local authorities advise against outdoor activity. Priya (Swiggy, Delhi) cannot safely work. GigShield detects AQI > 300 sustained for 4+ hours and processes 40% weekly income payout automatically.

**Scenario 5 — Environmental Penalty Relief**
> During a 44°C heatwave in Hyderabad, a delivery partner's orders are reported damaged due to heat-spoilage. The platform deducts Rs.150 from their daily pay. GigShield validates the active extreme heat trigger and automatically reimburses the penalty deduction — protecting the worker's net income without any manual dispute.

**Scenario 6 — Local Bandh / Curfew in Bangalore**
> A sudden political protest leads to a city-wide bandh. Roads are blocked. Swiggy operations halt. GigShield detects verified government alert + near-zero order activity + GPS inactivity of 90%+ of zone workers, and fires 70% weekly income payout.

**Scenario 7 — Platform Outage**
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
   → System assigns Zone IFI score automatically
   → Enters UPI ID for payouts
   → AI generates initial Risk Profile + GigScore (starts at 50/100)
   → Selects weekly plan (Rs.49 / Rs.69 / Rs.99)
   → Premium adjusted based on zone IFI
   → Policy activated instantly

2. ACTIVE COVERAGE WEEK
   Worker delivers normally
   → GigShield monitors weather, AQI, govt alerts, platform uptime in background
   → GPS dwell-time tracking active at restaurant/customer pins
   → GigScore updates daily based on activity and GPS consistency
   → 48hr ahead: AI sends predictive alert if disruption expected
      "Heavy rain expected Thursday in your zone — coverage auto-upgraded"

3. DISRUPTION EVENT
   Trigger condition fires (e.g., rain > zone IFI-adjusted threshold)
   → Kinematic validation: IMU + GPS cross-check runs automatically
   → Buddy Verification: checks if 3+ nearby workers also went inactive
   → Platform order volume drop cross-checked
   → Fraud score calculated via Isolation Forest
   → If all checks pass → PAYOUT INITIATED (< 2 hours)

4. PAYOUT
   Worker receives UPI notification
   → Dashboard shows: "Rs.420 credited — Rain disruption cover (Tues)"
   → GigScore maintained / adjusted
   → Coverage auto-renews next week

5. DASHBOARD
   Worker sees : GigScore, active plan, earnings protected, dwell stipends, payout history
   Insurer sees : Loss ratio, zone IFI heatmap, fraud flags, next-week risk forecast
```

---

## Weekly Premium Model

### Why Weekly?

Gig workers are paid weekly (or daily) by platforms. Monthly premiums create affordability friction. GigShield's pricing matches the worker's **actual cash flow rhythm**.

### Premium Tiers

| Plan | Weekly Cost | Coverage | Max Weekly Payout |
|------|------------|----------|------------------|
| Basic Shield | Rs.49/week | Rain + AQI only | Up to Rs.600 |
| Full Shield | Rs.69/week | Rain + AQI + Curfew + Dwell | Up to Rs.1,000 |
| Total Shield | Rs.99/week | All triggers + Outage + Penalty Protection | Up to Rs.1,500 |

### Dynamic Pricing Factors (AI-Adjusted Weekly)

The base tier price is adjusted based on:

| Factor | Impact |
|--------|--------|
| GigScore > 75 | -Rs.10 to -Rs.15 (loyalty reward) |
| High IFI zone (flood-prone, poor drainage) | +Rs.10 to +Rs.20 |
| Low IFI zone (Peelamedu-style, good infrastructure) | -Rs.10 |
| Previous clean claim history (no fraud flags) | -Rs.5 |
| New worker (< 4 weeks on platform) | Neutral (50/100 base GigScore) |

> **Example**: Ramesh in a low-lying zone of Chennai (high IFI, GigScore 82) on Full Shield:
> Base Rs.69 + IFI risk +Rs.15 - GigScore discount -Rs.12 = **Rs.72/week**

> **Example**: Priya in Peelamedu (low IFI, GigScore 70) on Full Shield:
> Base Rs.69 - IFI discount -Rs.10 - GigScore -Rs.8 = **Rs.51/week**

### Premium Collection
- Auto-deducted weekly (Sunday midnight) via UPI mandate
- Worker can pause coverage for 1 week (max 2 pauses/year)
- No cancellation penalty

---

## Parametric Triggers & Payout Table

> **Important**: GigShield covers **income loss only**. No vehicle repair. No medical. No accidents.

| # | Trigger | Condition | Data Source | Payout |
|---|---------|-----------|-------------|--------|
| 1 | Heavy Rainfall | > 50mm–80mm (adjusted by Zone IFI) | OpenWeatherMap API | 50% of weekly income |
| 2 | Severe AQI | AQI > 300 sustained for 4+ hours | AQICN API | 40% of weekly income |
| 3 | Curfew / Bandh | Verified govt alert + zone inactivity > 80% | Govt alert feed + GPS | 70% of weekly income |
| 4 | Platform Outage | Zomato/Swiggy downtime > 2 hrs (11am–11pm) | Uptime monitor + order volume | 30% of weekly income |
| 5 | Flood Warning | IMD flood warning for worker's district | IMD API / mock | 60% of weekly income |
| 6 | Extreme Heat | > 42°C for 3+ consecutive hours | OpenWeatherMap API | 25% of weekly income |
| 7 | Dwell-Time | > 15 min wait at restaurant/customer pin | GPS + Platform API | Rs.2/minute stipend |
| 8 | Penalty Protection | Weather trigger active + platform deduction detected | Platform API (simulated) | 100% of deduction amount |

### IFI-Adjusted Trigger Thresholds

| Zone Type | Example | Rainfall Trigger | Rationale |
|-----------|---------|-----------------|-----------|
| Low IFI (good infrastructure) | Peelamedu, Coimbatore | > 80mm | Roads drain well, minor impact |
| Medium IFI | Typical urban ward | > 50mm | Standard threshold |
| High IFI (poor drainage, low-lying) | Industrial outskirts | > 35mm | Floods rapidly, high impact |

### Multi-Trigger Handling

If two triggers fire in the same week, the **higher payout trigger applies** (no stacking). Dwell-time stipends are additive and paid separately regardless of other active triggers.

---

## AI/ML Architecture

### 1. Dynamic Premium Pricing Engine

**Model**: XGBoost Regressor

**Training Features**:
```
- worker_zone_id              (encoded zone from city grid)
- zone_ifi_score              (Infrastructure Fragility Index 0–100)
- zone_flood_history_12m      (count of flood events in 12 months)
- zone_drainage_quality       (municipal data / complaint density)
- zone_avg_aqi_30d            (rolling 30-day average AQI)
- worker_gigscore             (0–100, computed daily)
- worker_claim_count          (lifetime claims filed)
- platform                    (0=Zomato, 1=Swiggy)
- season                      (monsoon / winter / summer)
- week_of_year                (1–52)
```

**Output**: Adjusted weekly premium in Rs.

**Retraining**: Weekly batch retraining using new claim and weather data

---

### 2. Infrastructure Fragility Index (IFI) Scoring

GigShield scores each **1km² zone** individually using:

```
IFI Score = weighted_sum(
  historical_flood_events       × 0.25,
  drainage_complaint_density    × 0.20,
  distance_from_water_body      × 0.20,
  avg_aqi_last_90_days          × 0.15,
  road_surface_quality_index    × 0.10,
  elevation_below_sea_level     × 0.10
)
```

**Trigger Multiplier Logic**:
```python
def get_rain_threshold(zone_ifi):
    if zone_ifi >= 75:      # High fragility
        return 35           # Triggers at 35mm
    elif zone_ifi >= 40:    # Medium fragility
        return 50           # Triggers at 50mm (standard)
    else:                   # Low fragility (Peelamedu-type)
        return 80           # Triggers at 80mm
```

- Implemented using **K-Means clustering**: Low / Medium / High / Extreme IFI tiers
- Visualized as a zone heatmap on the insurer dashboard
- Updated monthly using municipal complaint data + flood event history

---

### 3. Predictive Risk Intelligence (48hr Forecaster)

**Model**: Time-Series LSTM / ARIMA hybrid on zone-level weather data

**What it does**:
- Ingests 7-day weather forecast from OpenWeatherMap
- Predicts probability of IFI-adjusted trigger per zone for next 48 hours
- If probability > 60% — worker receives proactive alert + auto coverage upgrade
- Insurer dashboard shows zone-level risk heatmap for upcoming week

**Sample Alert to Worker**:
```
GigShield Alert
Heavy rain (>50mm) is forecasted in your zone (Velachery, Chennai)
on Thursday between 2PM–8PM.

Your IFI zone threshold: 40mm (High Fragility Zone)
Trigger probability: 87%

Your coverage has been auto-upgraded for Thursday.
If rain exceeds threshold, Rs.1,400 will be credited automatically.
Stay safe.
```

---

## Fraud Detection Engine

GigShield uses a **4-layer fraud detection system** — purpose-built for the gig delivery context.

### Layer 1 — Isolation Forest (Statistical Anomaly Detection)

**Model**: `sklearn.ensemble.IsolationForest`

Detects anomalous claim patterns using:
```
- time_since_last_claim
- claim_frequency_30d
- gps_activity_at_trigger_time
- distance_from_declared_zone
- worker_gigscore
- order_activity_at_trigger_time (platform API)
- imu_entropy_at_trigger_time   (NEW — sensor fusion signal)
```

Workers with anomaly score below threshold are flagged for review.

---

### Layer 2 — Buddy Verification (Social Cross-Check)

> **Core insight**: A real weather event affects ALL workers in a zone — not just one.

```
When a claim is filed for worker W in zone Z:

1. Identify all GigShield workers in zone Z (within 1km radius)
2. Check: how many also went inactive at the same time?

   IF count_inactive_nearby >= 3:
     → Event is real → AUTO-APPROVE claim

   IF count_inactive_nearby == 1 (only the claimant):
     → Suspicious → FLAG for AI review

   IF count_inactive_nearby == 0:
     → High fraud risk → REJECT + notify worker
```

Strike Fabricator Filter: For social strike claims, deactivation must be statistically significant across a **5km macro-zone** — preventing small groups from manufacturing a fake strike.

---

### Layer 3 — GPS & Platform Correlation

- **Platform Order Volume Check**: Cross-reference Zomato/Swiggy order volume. If orders did not drop during claimed disruption → flag.
- **Double-Dipping Shield**: Detects if a worker claims inactivity on Swiggy while actively completing orders on Zomato using app-traffic analysis.
- **Duplicate Claim Prevention**: Hash-based deduplication on (worker_id + trigger_type + trigger_date).

---

### Layer 4 — Kinematic Sensor Fusion (Ghost Rider Detection)

Cross-verifies GPS coordinates with the smartphone's **Inertial Measurement Unit (IMU)**:

```
Ghost Rider Detection Logic:

IF GPS shows movement or stalling in red-alert zone
AND accelerometer detects zero road vibration
AND gyroscope shows no tilt or turning motion
AND barometer reads stable indoor pressure

→ PHYSICS GAP DETECTED → Flag as "Simulated Movement"

IF GPS is static
AND IMU shows high-entropy micro-vibrations (wind, rain impact, human movement)

→ Consistent with genuine outdoor stranding → APPROVE
```

This layer catches spoofers who fake GPS location while sitting safely at home — their device physics cannot lie even when coordinates can.

---

## Adversarial Defense & Anti-Spoofing Strategy

> In response to coordinated GPS-spoofing syndicates exploiting parametric insurance platforms, GigShield has upgraded from simple location-tracking to **Multi-Signal Kinematic Validation**. We no longer trust the GPS coordinate. We trust the laws of physics.

### 1. The Differentiation — Kinematic vs. Synthetic Movement

Our system differentiates between a genuinely stranded worker and a spoofer by identifying the **Physics Gap**:

**The Spoofer Profile**:
- GPS shows movement or stalling in a red-alert zone
- Device IMU (accelerometer + gyroscope + barometer) shows a "Laboratory Static" state
- Zero road vibration, zero gyroscopic tilt, stable indoor barometric pressure
- Behavioral biometrics show robotic, optimized app navigation

**The Stranded Worker Profile**:
- GPS is static in a disruption zone
- IMU detects "High Entropy" — micro-vibrations from wind, rain impact on the device, erratic human movement while seeking shelter
- App interaction shows irregular, stressed navigation patterns
- Battery drain consistent with outdoor usage in poor weather

**The Core Logic**:
```
IF Δ(GPS_Velocity) > 0  AND  Δ(Accelerometer_Energy) ≈ 0
→ SYNTHETIC MOVEMENT — Flag claim automatically

IF GPS is static  AND  IMU_Entropy > threshold
→ GENUINE STRANDING — Proceed to payout
```

---

### 2. The Data — Beyond GPS Coordinates

To dismantle professional fraud rings, GigShield analyzes a **5-Point Telemetric Signature**:

**Sensor Fusion (IMU)**
- Accelerometer: detects road texture and vibration patterns
- Gyroscope: detects leaning into turns, braking, human movement
- Barometer: senses real pressure drop of an outdoor storm vs. stable indoor pressure of a bedroom

**Network Fingerprinting**
- Cross-references reported GPS with Wi-Fi BSSID triangulation and Cell Tower IDs (LBS)
- A spoofer can change GPS coordinates — they cannot spoof the MAC addresses of routers in a flooded neighborhood
- If reported location shows a flood zone but connected Wi-Fi belongs to a residential apartment — flagged

**Device Integrity Audit**
- Real-time scan for "Allow Mock Locations" enabled in developer settings
- Root / jailbreak status detection
- Presence of virtualization hooks used by GPS spoofing applications

**Behavioral Biometrics**
- Genuine delivery partners show inconsistent typing rhythms and erratic app navigation during stressful weather
- Bots and static spoofers show robotic, optimized navigation patterns with unnaturally consistent timing

**Platform Correlation**
- Real-time API check with Zomato/Swiggy
- If a worker claims to be "stranded" but the platform shows a successful "Order Handed Over" event 5km away in the last 30 minutes — payout is halted instantly

---

### 3. The UX Balance — The Human-in-the-Loop Fail-Safe

To ensure honest workers are not penalized by noisy sensor data during a genuine network drop in bad weather, GigShield implements a **Progressive Friction Model**:

**The Benefit-of-the-Doubt Buffer**
- Workers with GigScore 80+ receive an **immediate partial payout (50%)** even if signals are "Amber"
- Remaining balance is released after a 12-hour background audit
- Low-score workers receive a smaller immediate partial payout pending verification

**Live-Action Verification (LAV)**
- If a claim is flagged as "Suspicious" (not confirmed fraud), the app prompts a **3-second Storm Check**
- Worker records a short video of their surroundings
- AI analyzes the video for environmental consistency — rain patterns, ambient sound, lighting conditions
- Passing the Storm Check instantly overrides the flag and releases the payout

**Dispute Transparency**
- Instead of a cold "Rejected" notification, the worker sees:
  > "Verification Delayed: Environmental data is inconsistent with your reported location. Upload a photo of your surroundings to unlock your payout."
- This maintains worker trust while deterring casual spoofers
- All disputes are logged and reviewable by the worker

---

## GigScore — Worker Trust Index

GigScore is a **dynamic, daily-updated trust score (0–100)** assigned to every GigShield worker.

### Why GigScore?

It rewards honest, active workers with lower premiums and faster claim processing — creating a virtuous cycle of loyalty and trust.

### Score Factors

| Factor | Weight | Direction |
|--------|--------|-----------|
| Days active on platform (last 30d) | 30% | More active = higher score |
| GPS + IMU consistency (declared zone vs actual) | 25% | Consistent = higher score |
| Claim history (frequency, legitimacy) | 25% | Clean history = higher score |
| Order completion rate (from platform API) | 20% | Higher completion = higher score |

### GigScore Tiers & Benefits

| Score Range | Tier | Benefit |
|-------------|------|---------|
| 80–100 | Trusted | -Rs.15/week premium, 50% immediate payout on Amber flags, priority processing (< 1hr) |
| 60–79 | Active | -Rs.8/week premium, standard payout (< 2hrs) |
| 40–59 | New | Standard premium, standard payout |
| 0–39 | Flagged | +Rs.10/week, mandatory manual claim review |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React.js (PWA) | Mobile-first web app, responsive |
| **Backend** | FastAPI (Python) | REST APIs, trigger engine, payout orchestration |
| **ML Models** | scikit-learn, XGBoost, statsmodels | Pricing, fraud detection, IFI scoring, forecasting |
| **Sensor Fusion** | Android IMU APIs (via PWA bridge) | Accelerometer, gyroscope, barometer data collection |
| **Database** | PostgreSQL | Workers, policies, claims, payouts, IFI zone data |
| **Cache / Queue** | Redis | Real-time trigger queue, alert dispatch |
| **Weather API** | OpenWeatherMap (free tier) | Rainfall, temperature, 7-day forecast |
| **AQI API** | AQICN (free tier) | Air quality index, real-time data |
| **Maps / Zone** | Google Maps API / OpenStreetMap | Zone boundary mapping, IFI visualization |
| **Payments** | Razorpay (test mode) / UPI simulator | Mock payout processing |
| **Notifications** | Firebase Cloud Messaging | Push alerts, predictive upgrades |
| **Hosting** | Render / Railway (free tier) | Backend + ML model serving |
| **Auth** | OTP via MSG91 (free tier) / mock | Phone number verification |
| **Monitoring** | Uptime Robot (free) | Platform outage detection |
| **Guidewire APD** | Guidewire PolicyCenter (simulated) | Policy line visualization — Gig Income Guard |
| **Jutro** | Jutro Digital Platform | Worker dashboard UI framework (L-shape layout) |
| **Video Analysis** | OpenCV / cloud vision API | Live-Action Verification storm check processing |

---

## System Architecture

The diagram below shows the full data flow — from external data sources through the AI core engine, ML processing layers, FastAPI backend, and out to both the worker and insurer dashboards.

![GigShield System Architecture](./assets/architecture.png)

### Architecture Layer Breakdown

**Layer 1 — External Data Sources**
Six real-world data feeds power the system: OpenWeatherMap (rainfall + heat), AQICN (AQI), Platform API (order volume drop), Government Alerts (curfews/strikes), GPS + IMU Feed (worker location + sensor data), and Municipal Data (drainage quality for IFI).

**Layer 2 — AI Core Engine**
All incoming data is processed centrally for real-time trigger monitoring, IFI-adjusted threshold evaluation, kinematic fraud validation, and 48-hour predictive forecasting.

**Layer 3 — ML Processing (4 parallel modules)**
- **Premium Engine**: XGBoost + GigScore + IFI zone scoring → personalized weekly price
- **Fraud Detection**: Isolation Forest + Buddy Verification + Kinematic Sensor Fusion → fraud score
- **Claims Processor**: IFI-adjusted trigger evaluation → zero-touch payout initiation
- **IFI Engine**: Zone fragility scoring → dynamic threshold and premium multiplier

**Layer 4 — FastAPI Backend + PostgreSQL**
Handles policy management, authentication, push notifications, GigScore pipeline, dwell-time tracking, and payout orchestration via Razorpay test mode.

**Layer 5 — Dashboards**
- **Worker Dashboard**: GigScore, active plan, earnings protected, dwell stipend history, payout history, fraud dispute portal
- **Insurer Dashboard**: Loss ratios, IFI zone heatmap, fraud flags, kinematic anomaly logs, next-week predictions

---

## Platform Choice — Web

**Decision: Progressive Web App (PWA) via React.js**

| Criteria | Reasoning |
|----------|-----------|
| No app store needed | Workers can access instantly via WhatsApp link / SMS |
| Works on low-end Android | PWA is lightweight, no 100MB app download |
| IMU sensor access | Modern PWA APIs support accelerometer and gyroscope |
| Offline support | Service workers cache key screens |
| Easy OTA updates | No version fragmentation |
| UPI deep links work natively | Seamless payout initiation |

A native Android app may be added in Phase 3 for deeper IMU sensor access if PWA sensor APIs prove insufficient.

---

## 6-Week Development Roadmap

### Phase 1 — Seed (Weeks 1–2): Ideate & Know Your Worker
**Theme**: Foundations & Research

- [x] Problem validation and persona research
- [x] README + system design document
- [x] Define parametric triggers with IFI-adjusted thresholds
- [x] Define GigScore, Buddy Verification, Kinematic Fraud concepts
- [x] Define Adversarial Defense & Anti-Spoofing architecture
- [ ] Basic project scaffolding (React PWA frontend + FastAPI backend)
- [ ] Database schema design (workers, policies, claims, payouts, ifi_zones)
- [ ] OpenWeatherMap + AQICN API integration (basic calls)

**Deliverable**: README.md + GitHub repo + 2-min strategy video

---

### Phase 2 — Scale (Weeks 3–4): Protect Your Worker
**Theme**: Core Product Build

- [ ] Worker onboarding flow (OTP → zone selection → IFI assignment → plan selection)
- [ ] Policy creation with IFI-adjusted weekly pricing logic
- [ ] XGBoost premium pricing model (trained on synthetic data with IFI features)
- [ ] Real-time trigger monitoring engine (weather + AQI checks every 15 min)
- [ ] IFI zone scoring engine (K-Means on zone data)
- [ ] GPS dwell-time tracker for restaurant/customer pins
- [ ] Basic Isolation Forest fraud detection
- [ ] Worker dashboard (GigScore, active plan, dwell stipend tracker)
- [ ] Mock claim auto-initiation on IFI-adjusted trigger fire

**Deliverable**: Working demo — onboarding + IFI trigger + mock payout + 2-min demo video

---

### Phase 3 — Soar (Weeks 5–6): Perfect for Your Worker
**Theme**: Intelligence, Fraud & Scale

- [ ] Kinematic sensor fusion (IMU + GPS Physics Gap detection)
- [ ] Buddy Verification + Strike Fabricator Filter
- [ ] Double-Dipping Shield (cross-platform activity detection)
- [ ] Live-Action Verification (Storm Check video + AI analysis)
- [ ] Network Fingerprinting (Wi-Fi BSSID + Cell Tower cross-check)
- [ ] 48hr predictive risk forecaster (LSTM/ARIMA) + push notifications
- [ ] Razorpay test mode / UPI simulator for instant payouts
- [ ] Insurer dashboard: loss ratios, IFI heatmap, kinematic anomaly logs
- [ ] GigScore daily update pipeline
- [ ] System stress testing + UI polish (Jutro framework)

**Deliverable**: Full platform demo + 5-min walkthrough video + final pitch deck

---

## Business Model

### Revenue
- Weekly subscription premiums from workers
- Target: 10,000 active workers x avg Rs.70/week = **Rs.70,00,000/month**

### Cost Structure
- Expected claim ratio: ~40% of premium pool (parametric = predictable)
- IFI-adjusted thresholds further reduce false trigger payouts
- Infrastructure: Minimal (serverless + free tier APIs in early stage)
- Customer acquisition: B2B2C via Zomato/Swiggy fleet manager partnerships

### Why This Is Sustainable
- **IFI = precise triggers** → fewer false payouts → better loss ratio
- **GigScore = self-selecting low-risk pool** → improved loss ratio over time
- **Kinematic fraud detection** → syndicate-proof liquidity pool
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
- Sensor fusion features use device IMU APIs — no personal biometric data is stored

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
