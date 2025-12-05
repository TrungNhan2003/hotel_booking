import axios from "axios";

// Axios instance setup (with base URL)
const api = axios.create({
    baseURL: "http://localhost:5000/api", // Base URL of the backend server
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Ensure cookies are sent
});

// Example: Sending a GET request
const checkConnection = async () => {
    try {
        // Sending GET request to the backend
        const response = await api.get("/hello");
        console.log("Backend response:", response.data); // Should log the response from backend
    } catch (error) {
        console.error("Error in Axios request:", error); // If the request fails
    }
};

checkConnection();
