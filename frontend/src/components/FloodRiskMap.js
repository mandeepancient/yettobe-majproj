import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const FloodRiskMap = () => {
    const [formData, setFormData] = useState({
        latitude: "",
        longitude: "",
        drainage_capacity: "",
        age_of_infrastructure: "",
    });

    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);
    const [mapData, setMapData] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setPrediction(null);

        const formattedData = [{
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            drainage_capacity: parseFloat(formData.drainage_capacity),
            age_of_infrastructure: parseFloat(formData.age_of_infrastructure),
        }];

        try {
            const responseProne = await axios.post("http://127.0.0.1:8000/predict_flood_prone", formattedData);
            const responseVulnerability = await axios.post("http://127.0.0.1:8000/predict_flood_vulnerability", formattedData);

            const isFloodProne = responseProne.data.predictions[0] === 1;
            const vulnerabilityScore = responseVulnerability.data.predictions[0];

            setPrediction({ isFloodProne, vulnerabilityScore });

            // Update map data
            setMapData([...mapData, {
                latitude: formData.latitude,
                longitude: formData.longitude,
                isFloodProne,
                vulnerabilityScore
            }]);
        } catch (error) {
            setError("Failed to get prediction. Check console for details.");
            console.error("API Error:", error);
        }
    };

    return (
        <div className="container">
            <h2>Flood Risk Mapping</h2>
            <form onSubmit={handleSubmit}>
                <input type="number" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} required />
                <input type="number" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} required />
                <input type="number" name="drainage_capacity" placeholder="Drainage Capacity" value={formData.drainage_capacity} onChange={handleChange} required />
                <input type="number" name="age_of_infrastructure" placeholder="Age of Infrastructure" value={formData.age_of_infrastructure} onChange={handleChange} required />
                <button type="submit">Predict</button>
            </form>

            {prediction && (
                <div>
                    <h3>Prediction Result:</h3>
                    <p>Flood Prone: {prediction.isFloodProne ? "Yes" : "No"}</p>
                    <p>Vulnerability Score: {prediction.vulnerabilityScore.toFixed(2)}</p>
                </div>
            )}

            {error && <p className="error">{error}</p>}

            <MapContainer center={[20, 78]} zoom={5} style={{ height: "500px", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {mapData.map((point, index) => (
                    <Marker key={index} position={[point.latitude, point.longitude]} color={point.isFloodProne ? "red" : "green"}>
                        <Popup>
                            Flood Prone: {point.isFloodProne ? "Yes" : "No"} <br />
                            Vulnerability Score: {point.vulnerabilityScore.toFixed(2)}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default FloodRiskMap;
