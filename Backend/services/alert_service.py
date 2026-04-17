import datetime
from sqlalchemy.orm import Session
from models import WeatherAlert

LOCKOUT_HOURS = 48  

def is_enrollment_locked(zone_id: str, db: Session) -> dict:
    '''
    Returns whether new enrollment is blocked for a zone.
    Enrollment is locked if there is an active RED/ORANGE weather alert
    for the zone with more than LOCKOUT_HOURS until expiry.
    '''
    now = datetime.datetime.utcnow()
    lockout_cutoff = now + datetime.timedelta(hours=LOCKOUT_HOURS)

    active_alert = db.query(WeatherAlert).filter(
        WeatherAlert.zone_id == zone_id,
        WeatherAlert.is_active == True,
        WeatherAlert.alert_type.in_(['RED', 'ORANGE']),
        WeatherAlert.expires_at > now  
    ).first()

    if not active_alert:
        return { 'locked': False, 'reason': None, 'expires_at': None }

    hours_remaining = (active_alert.expires_at - now).total_seconds() / 3600

    return {
        'locked': True,
        'reason': f'{active_alert.alert_type} weather alert active for {zone_id}.',
        'hours_remaining': round(hours_remaining, 1),
        'alert_type': active_alert.alert_type,
        'expires_at': active_alert.expires_at.isoformat(),
        'message': f'New enrollment is suspended {LOCKOUT_HOURS}hrs around weather alerts to protect pool integrity.'
    }

def create_demo_alert(zone_id: str, db: Session) -> WeatherAlert:
    '''Creates a simulated RED alert for demo purposes.'''
    now = datetime.datetime.utcnow()
    alert = WeatherAlert(
        zone_id=zone_id,
        alert_type='RED',
        source='SIMULATED',
        issued_at=now,
        expires_at=now + datetime.timedelta(hours=72),
        is_active=True
    )
    db.add(alert)
    db.commit()
    return alert

def clear_alerts(zone_id: str, db: Session):
    '''Clears all active alerts for a zone (for demo reset).'''
    db.query(WeatherAlert).filter(
        WeatherAlert.zone_id == zone_id,
        WeatherAlert.is_active == True
    ).update({'is_active': False})
    db.commit()