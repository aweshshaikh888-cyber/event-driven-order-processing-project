from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Incident, RescueTeam, HospitalShelter, WeatherAlert

router = APIRouter(prefix="/map", tags=["Interactive Map"])

@router.get("/layers")
def get_map_layers(db: Session = Depends(get_db)):
    incidents = db.query(Incident).all()
    teams = db.query(RescueTeam).all()
    facilities = db.query(HospitalShelter).all()
    weather_alerts = db.query(WeatherAlert).all()
    
    # Format map incident markers
    incident_markers = []
    for inc in incidents:
        # Determine severity color
        color_map = {
            "No Damage": "#10b981",       # Green
            "Low Damage": "#22c55e",      # Green
            "Moderate Damage": "#eab308", # Yellow
            "Severe Damage": "#f97316",   # Orange
            "Critical Damage": "#ef4444"  # Red
        }
        incident_markers.append({
            "id": inc.id,
            "code": inc.incident_code,
            "title": inc.title,
            "disaster_type": inc.disaster_type,
            "severity": inc.severity,
            "color": color_map.get(inc.severity, "#f97316"),
            "latitude": inc.latitude,
            "longitude": inc.longitude,
            "status": inc.status,
            "priority_score": inc.priority_score,
            "priority_category": inc.priority_category,
            "affected_people": inc.affected_people_est,
            "image_url": inc.image_url,
            "gradcam_url": inc.gradcam_url,
            "location_name": inc.location_name
        })
        
    team_markers = []
    for t in teams:
        if t.latitude and t.longitude:
            team_markers.append({
                "id": t.id,
                "name": t.name,
                "specialization": t.specialization,
                "lead_name": t.lead_name,
                "status": t.status,
                "latitude": t.latitude,
                "longitude": t.longitude,
                "phone": t.contact_phone,
                "member_count": t.member_count
            })
            
    facility_markers = []
    for f in facilities:
        facility_markers.append({
            "id": f.id,
            "name": f.name,
            "facility_type": f.facility_type,
            "address": f.address,
            "latitude": f.latitude,
            "longitude": f.longitude,
            "total_capacity": f.total_capacity,
            "available_capacity": f.available_capacity,
            "phone": f.contact_phone,
            "services": f.services,
            "status": f.status
        })
        
    return {
        "incidents": incident_markers,
        "rescue_teams": team_markers,
        "facilities": facility_markers,
        "weather_alerts": weather_alerts
    }
