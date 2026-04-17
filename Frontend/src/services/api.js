import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

export const gigShieldAPI = {
    getZones: async () => {
        try {
            const response = await apiClient.get('/zones');
            return response.data;
        } catch (error) {
            console.error("Error fetching zones:", error);
            return [];
        }
    },

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
    getWorkerPolicy: async (workerId) => {
        try {
            const response = await apiClient.get('/policies/worker/' + workerId);
            return response.data;
        } catch (error) {
            console.error("Error fetching policy:", error);
            return null;
        }
    },
    pausePolicy: async (policyId) => {
        try {
            const response = await apiClient.patch(`/policies/${policyId}/pause`);
            return response.data;
        } catch (error) {
            console.error("Error pausing policy:", error);
            throw error;
        }
    },
    registerWorker: async (phone, zone) => {
        try {
            const response = await apiClient.post('/register-worker', { phone_number: phone, home_zone_id: zone });
            return response.data;
        } catch (error) {
            console.error("Error registering worker:", error);
            // Return fallback — Onboarding already handles this with .catch()
            throw error;
        }
    },
    getClaimHistory: async (workerId) => {
        try {
            const response = await apiClient.get(`/claims/${workerId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching claims:", error);
            return [];
        }
    },
    getWorkerGigScore: async (workerId) => {
        try {
            const response = await apiClient.get(`/workers/${workerId}/gigscore`);
            return response.data;
        } catch (error) {
            console.error("Error fetching gigscore:", error);
            return null;
        }
    },
    
    createWeatherAlert: async (zoneId) => {
        try {
            const response = await apiClient.post(`/admin/create-alert?zone_id=${zoneId}`);
            return response.data;
        } catch (error) {
            console.error("Error creating alert:", error);
            throw error;
        }
    },
    
    clearWeatherAlerts: async (zoneId) => {
        try {
            const response = await apiClient.post(`/admin/clear-alerts?zone_id=${zoneId}`);
            return response.data;
        } catch (error) {
            console.error("Error clearing alerts:", error);
            throw error;
        }
    }
};
