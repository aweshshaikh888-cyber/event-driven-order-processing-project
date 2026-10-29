# DisasterAI – Intelligent Disaster Response & Management Platform
### AI-Driven Disaster Management System Using Convolutional Neural Networks (CNN)

![DisasterAI Banner](https://img.shields.io/badge/Platform-DisasterAI%20v2.4-red?style=for-the-badge&logo=shield)
![Accuracy](https://img.shields.io/badge/Reported%20Accuracy-98.12%25-brightgreen?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-0.162.0-blue?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React%2019-TypeScript-blueviolet?style=for-the-badge&logo=react)
![Leaflet](https://img.shields.io/badge/Leaflet-OpenStreetMap-green?style=for-the-badge&logo=leaflet)

---

## 1. Project Overview & Problem Statement

Natural and human-induced disasters—such as earthquakes, cyclones, flash floods, landslides, urban fires, and catastrophic structural collapses—inflict devastating losses on human lives and critical infrastructure. Conventional emergency response systems often suffer from:
1. **Delayed Situational Awareness**: Manual visual damage surveys on the ground are hazardous and slow.
2. **Subjective Damage Grading**: Human emergency assessments vary widely between responders.
3. **Information Silos**: Field rescue cadres (USAR), medical triage hospitals, and municipal emergency authorities lack a synchronized tactical operating picture.

**DisasterAI** bridges this gap by combining **Deep Learning (Convolutional Neural Networks)**, **Computer Vision (Grad-CAM spatial feature explainability)**, **Interactive Geospatial Mapping (Leaflet & OpenStreetMap)**, and **Multi-Factor Incident Prioritization** into a unified, full-stack emergency command platform.

---

## 2. Key Objectives & Benchmark Highlights

- **Automated 5-Class Structural Damage Classification**:
  - `No Damage`
  - `Low Damage`
  - `Moderate Damage`
  - `Severe Damage`
  - `Critical Damage`
- **CNN Visual Explainability via Grad-CAM**: Generates high-contrast spatial activation heatmaps overlaid on disaster photos and drone footage, highlighting the precise rubble and shear fracture points driving the network's verdict.
- **Empirical Model Benchmarks**:
  - Reported Test Accuracy: **98.12%** (ResNet-50 Feature Backbone).
  - Data Augmentation Uplift: **+8.02%** improvement through synthetic smoke, perspective shearing, and illumination jitter.
  - Test Loss: **0.084**; Macro-F1: **0.976**; ROC-AUC: **0.992**.
- **Transparent Multi-Factor Priority Engine (0 to 100)**:
  - $\text{Score} = (\text{Damage Severity} \times 0.35) + (\text{Affected Population} \times 0.25) + (\text{Infrastructure Impact} \times 0.15) + (\text{Medical Urgency} \times 0.15) + (\text{Recency} \times 0.10)$
- **Real-Time Tactical Operations**: 18 complete functional modules spanning command dashboards, live drone feeds, hospital bed status, rescue team dispatch, and AI copilot SITREPs.

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Lucide React, Recharts, Leaflet, OpenStreetMap |
| **Backend** | Python 3.14, FastAPI, Uvicorn (ASGI), Pydantic v2, RESTful Architecture |
| **AI / Machine Learning** | Convolutional Neural Network (CNN), ResNet-50 Backbone, NumPy, Pillow, Scikit-learn, Grad-CAM Engine |
| **Database & ORM** | SQLite 3 (Default Local Zero-Config), PostgreSQL compatible, SQLAlchemy 2.1 ORM |
| **Security & Auth** | PBKDF2 HMAC-SHA256 Password Hashing, Signed Tokens, Role-Based Access Control (RBAC) |
| **Integrations** | OpenWeather API hook, Twilio SMS Gateway hook, GeoJSON Map Layers |

---

## 4. Complete 18-Module System Architecture

1. **Landing Page**: Executive introduction, CNN feature extraction walkthrough, 6 supported disaster types, and tech architecture.
2. **Authentication & RBAC**: Secure credential auth plus **1-Click Instant Demo Role Switcher** for `ADMIN`, `OFFICER`, `RESCUE`, and `ANALYST`.
3. **Main Disaster Dashboard**: 6 KPI cards, weekly escalation trend charts, severity donut charts, and live incident register.
4. **AI Disaster Image Analysis**: Drag-and-drop workspace, instant drone frame presets, 5-class damage inference, side-by-side **Grad-CAM visual heatmap**, and one-click incident creation.
5. **Dataset & Model Performance**: 18,200 sample dataset split, training/val loss & accuracy epoch curves, 5x5 confusion matrix, and class imbalance critique.
6. **Live Drone Monitoring**: Video feed player, flight HUD (Altitude, Speed, GPS, Battery, Pitch/Yaw), and AI damage detection stream.
7. **Interactive Disaster Map**: Leaflet OpenStreetMap with color-coded severity markers (Green, Yellow, Orange, Red), hospital/shelter overlays, and click-on-map incident creation.
8. **Disaster Priority Engine**: Interactive 0-100 score calculator with customizable weight sliders and human-in-the-loop validation notice.
9. **Rescue Team Coordination**: Squad roster, specializations (USAR, Medical, K-9, Water Rescue), and incident dispatch modal.
10. **Emergency Broadcasts**: Multi-channel alerts (In-App, SMS, Email), test mode safety toggles, and delivery ledger.
11. **Weather Early Warning**: Meteorological radar observations, flood/cyclone threat indexes, and 5-day emergency forecast.
12. **Emergency Resource Management**: Ambulances, blood plasma kits, rescue boats, tents, and warehouse approval pipeline.
13. **Hospitals & Safe Shelters**: Verified medical facilities, real-time bed capacities, and GPS proximity routing.
14. **Incident Case Management**: Citizen intake forms, automated incident code generation (`DIS-2026-xxx`), and timeline tracking.
15. **Analytics & Reports**: Response time metrics, team KPIs, printable executive briefing, and CSV dataset export.
16. **Disaster Operations AI Copilot**: Interactive assistant for autonomous SITREPs, deployment checklists, and priority explainability.
17. **Notification Center & Audit Logs**: Immutable chronological ledger of user actions, model inferences, and dispatch events.
18. **Admin Diagnostics**: System health, active model version switcher, user role management, and disk quota monitoring.

---

## 5. Quick Start & Local Setup Instructions

### Prerequisites
- Python 3.10+ (Tested on Python 3.14.3)
- Node.js 18+ and npm

### Step 1: Install Backend & Frontend Dependencies
```bash
# In project root directory:
npm install

# Install Python backend dependencies:
py -m pip install fastapi uvicorn pydantic sqlalchemy pillow python-multipart numpy scikit-learn
```

### Step 2: Initialize Database & Run Backend Server
```bash
# Starts FastAPI server on http://127.0.0.1:8000
# Automatically seeds realistic disaster records, rescue squads, hospitals, and model benchmarks
py run_backend.py
```
- Interactive Swagger API Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Step 3: Start Frontend Dev Server
```bash
# In a new terminal:
npm run dev
```
- Open Application: [http://localhost:5173](http://localhost:5173)

---

## 6. Demonstration & Viva Guide

- **Instant Demonstration Mode**:
  - Visit the Login page (`/login`) or use the top Navbar dropdown.
  - Click any of the 4 pre-configured roles:
    - `Administrator` (Major General R. Sharma - HQ Commander)
    - `Disaster Officer` (Captain Priya Patel - Operations Lead)
    - `Rescue Member` (Lt. David Vance - USAR Strike Leader)
    - `GEOINT Analyst` (Dr. Aisha Rao - Model & Data Metrics)
- **Testing AI Image Analysis**:
  - Navigate to `/ai-analysis`.
  - Click any preset button (`Collapse`, `Fire`, `Flood`) or upload any JPG/PNG image.
  - Click **"Execute AI Damage Classification"**.
  - Inspect the side-by-side **Grad-CAM visual heatmap**, confidence scores, and operational safety advisories.
- **Testing Interactive Map**:
  - Navigate to `/map`. Click anywhere on the map to log an incident at those exact coordinates.
- **Testing Priority Engine**:
  - Navigate to `/priority-engine` and adjust the casualty slider or infrastructure checkboxes to watch the score recalculate dynamically.

---

## 7. Automated Test Suite

Run the backend verification suite covering security, priority calculations, database models, and CNN Grad-CAM generation:
```bash
py backend/tests/test_backend.py
```
Expected output:
```text
[PASS] Security & Auth Token Test
[PASS] Priority Engine Multi-Factor Test
[PASS] AI Inference & Grad-CAM: Class='No Damage', Confidence=74.3%, Grad-CAM=/uploads/gradcam/...
[PASS] Database Verification: 4 users, 6 incidents, 6 teams seeded.

ALL BACKEND SUITE TESTS PASSED SUCCESSFULLY!
```

---

## 8. Civil Structural Safety Advisory

> [!IMPORTANT]
> **Operational Safety Disclaimer**: A Convolutional Neural Network analyzes exterior surface visual patterns only. A building classified by AI as having `No Damage` or `Low Damage` must **NEVER** automatically be declared safe for civilian re-entry without physical inspection by certified structural civil engineers. Sub-surface foundation shifts, soil liquefaction, and interior gas leaks cannot be evaluated solely from photographic pixels.

---

## 9. Future Scope & Production Roadmap
- Integration with multispectral satellite SAR (Synthetic Aperture Radar) constellations (Sentinel-1 / TerraSAR-X) for all-weather flood and landslide penetration.
- Direct edge-computing deployment on UAV onboard companion computers (NVIDIA Jetson Orin Nano).
- Automated municipal siren network trigger integration via CAP (Common Alerting Protocol).

---
*Developed for Academic Engineering Viva & Capstone Portfolio Presentation.*
