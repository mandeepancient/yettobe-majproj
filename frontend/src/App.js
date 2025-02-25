import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const FloodRiskMap = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/get_flood_risk")
            .then(response => setData(response.data))
            .catch(error => console.error("Error fetching flood risk data:", error));
    }, []);

    return (
        <div>
            <h2>Flood Risk Map</h2>
            <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "500px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {data.map((location, index) => (
                    <Marker key={index} position={[location.latitude, location.longitude]}>
                        <Popup>
                            <b>Flood Vulnerability:</b> {location.flood_vulnerability_score}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default FloodRiskMap;
