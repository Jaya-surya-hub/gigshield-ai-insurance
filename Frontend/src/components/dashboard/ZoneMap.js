import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Standard Leaflet Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

// Custom Blue Dot for the User's Live Location
const userIcon = new L.DivIcon({
    className: 'user-location-marker',
    html: `<div style="width: 16px; height: 16px; background-color: #3b82f6; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59,130,246,0.8);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
});

// Component to dynamically pan the map to the user
const MapPanner = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center[0] !== 0) map.flyTo(center, 14);
    }, [center, map]);
    return null;
};

const ZoneMap = ({ zoneId, userLocation }) => {
    const isPeelamedu = zoneId?.includes("PEELAMEDU");
    const zoneCenter = isPeelamedu ? [11.0261, 77.0028] : [10.9905, 76.9608];
    const zoneColor = isPeelamedu ? "#10b981" : "#f59e0b";

    // If we have live GPS, center on the user. Otherwise, center on the zone.
    const mapCenter = (userLocation?.lat && userLocation?.lon)
        ? [userLocation.lat, userLocation.lon]
        : zoneCenter;

    return (
        <div style={{ marginTop: '24px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)' }}>Live Coverage Area</h3>
                {userLocation?.isMoving && <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold' }}>🏃‍♂️ Motion Detected</span>}
            </div>

            <div style={{ height: '250px', width: '100%' }}>
                <MapContainer center={mapCenter} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapPanner center={mapCenter} />

                    {/* The Zone Boundary */}
                    <Circle center={zoneCenter} pathOptions={{ color: zoneColor, fillColor: zoneColor, fillOpacity: 0.2 }} radius={2000} />

                    {/* The User's Live Location */}
                    {(userLocation?.lat && userLocation?.lon) && (
                        <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
                            <Popup>Your live hardware location.</Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

export default ZoneMap;
