import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

export const gigShieldAPI = {
    getQuote: async (zoneId) => {
        try {
            const response = await apiClient.get(`/get-quote`, { params: { zone_id: zoneId } });
            return response.data;
        } catch (error) {
            console.error("Error fetching quote:", error);
            throw error;
        }
    },

    evaluateZone: async (payload) => {
        try {
            const response = await apiClient.post(`/evaluate-zone`, payload);
            return response.data;
        } catch (error) { console.error("Error:", error); throw error; }
    },

    verifyEnvironment: async (payload) => {
        try {
            const response = await apiClient.post(`/verify-environment`, payload);
            return response.data;
        } catch (error) { console.error("Error:", error); throw error; }
    },

    getLocalWeather: async (lat, lon) => {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code&timezone=auto`;
            const response = await axios.get(url);
            return response.data.current;
        } catch (error) { console.error("Error:", error); return null; }
    },
    getClaimHistory: async (workerId) => {
        try {
            const response = await apiClient.get(`/claims/${workerId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching claims:", error);
            return [];
        }
    }
};