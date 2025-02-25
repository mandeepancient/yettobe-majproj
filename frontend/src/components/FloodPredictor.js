import React, { useState } from "react";
import axios from "axios";

const FloodPredictor = () => {
    const [formData, setFormData] = useState({
        rainfall_intensity_mm: "",
        traffic_density_before_rainfall: "",
        traffic_density_after_rainfall: "",
        road_condition: "",
        Drainage_Capacity: "",
        flood_prone: "",
        road_length_km: "",
        Humidity: "",
        Temp_Max: "",
        Temp_Min: "",
        Wind_Direction: "",
    });

    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setPrediction(null);
    
        // Format data correctly
        const formattedData = [{
            rainfall_intensity_mm: parseFloat(formData.rainfall_intensity_mm),
            traffic_density_before_rainfall: parseFloat(formData.traffic_density_before_rainfall),
            traffic_density_after_rainfall: parseFloat(formData.traffic_density_after_rainfall),
            road_condition: parseInt(formData.road_condition),
            Drainage_Capacity: parseFloat(formData.Drainage_Capacity),
            flood_prone: parseInt(formData.flood_prone),
            road_length_km: parseFloat(formData.road_length_km),
            Humidity: parseFloat(formData.Humidity),  // ✅ Fixing field names
            Temp_Max: parseFloat(formData.Temp_Max),  // ✅ Fixing field names
            Temp_Min: parseFloat(formData.Temp_Min),  // ✅ Fixing field names
            Wind_Direction: parseFloat(formData.Wind_Direction)  // ✅ Fixing field names
        }];
    
        try {
            const response = await axios.post("http://127.0.0.1:8000/predict", formattedData, {
                headers: { "Content-Type": "application/json" },
            });
    
            setPrediction(response.data.predictions[0]);
        } catch (error) {
            setError("Failed to get prediction. Check console for details.");
            console.error("API Error:", error);
        }
    };
    
    
    

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", textAlign: "center" }}>
            <h2>Flood Intensity Prediction</h2>
            <form onSubmit={handleSubmit}>
                {Object.keys(formData).map((key) => (
                    <div key={key} style={{ marginBottom: "10px" }}>
                        <label style={{ display: "block", textAlign: "left" }}>{key.replace(/_/g, " ")}:</label>
                        <input
                            type="number"
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "8px", fontSize: "16px" }}
                        />
                    </div>
                ))}
                <button type="submit" style={{ padding: "10px 15px", fontSize: "16px", cursor: "pointer" }}>
                    Predict
                </button>
            </form>

            {prediction !== null && (
                <div style={{ marginTop: "20px", fontSize: "18px", fontWeight: "bold", color: "green" }}>
                    Predicted Flood Intensity: {prediction.toFixed(2)}
                </div>
            )}

            {error && <div style={{ color: "red", marginTop: "20px" }}>{error}</div>}
        </div>
    );
};

export default FloodPredictor;
