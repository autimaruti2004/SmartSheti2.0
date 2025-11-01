// Backend runs on port 3001 by default in SmartSheti_backend/index.js
const API_BASE_URL = 'http://localhost:3001/api';

export async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    // Some endpoints may return empty body
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        // If the server response wasn't in the 200-299 range
        throw new Error((data && data.message) || 'Something went wrong');
    }

    return data;
}

// Utility functions for common API calls
export const auth = {
    login: (mobile, password) => 
        apiCall('/auth/signin', {
            method: 'POST',
            body: JSON.stringify({ mobile, password })
        }),
    
    register: (userData) => 
        apiCall('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData)
        }),
    
    getProfile: () => 
        apiCall('/auth/me'),

    changePassword: (oldPassword, newPassword) =>
        apiCall('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ oldPassword, newPassword })
        })
};

// Password reset API utilities
// Password reset: backend routes are mounted under /api/password
export const forgotPasswordEmail = (email) =>
    apiCall('/password/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
    });

export const verifyEmailToken = (token, newPassword) =>
    apiCall('/password/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword })
    });

export const forgotPasswordMobile = (mobile) =>
    apiCall('/password/forgot-password-mobile', {
        method: 'POST',
        body: JSON.stringify({ mobile })
    });

export const verifyMobileOTP = (mobile, otp, newPassword) =>
    apiCall('/password/reset-password-mobile', {
        method: 'POST',
        body: JSON.stringify({ mobile, otp, newPassword })
    });

// Add other API utilities for different features
export const user = {
    updateProfile: (userData) =>
        apiCall('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(userData)
        }),
};

export const soilReport = {
    getReports: () => apiCall('/soil-reports'),
    addReport: (reportData) => 
        apiCall('/soil-reports', {
            method: 'POST',
            body: JSON.stringify(reportData)
        }),
};

// Weather endpoints (backend expects path param)
export const weather = {
    getCurrent: (location) => apiCall(`/weather/${encodeURIComponent(location)}`),
    getForecast: (location) => apiCall(`/weather/forecast/${encodeURIComponent(location)}`),
};

// Market price endpoints
export const marketPrice = {
    // If crop is provided, backend has /market/commodity/:name
    getPrices: (crop) => {
        if (crop) return apiCall(`/market/commodity/${encodeURIComponent(crop)}`);
        return apiCall('/market');
    },
    getMarketDetails: (marketId) => apiCall(`/market/market/${encodeURIComponent(marketId)}`),
};

export const cropAdvice = {
    getAdvice: (params) => apiCall('/crop-advice', {
        method: 'POST',
        body: JSON.stringify(params)
    }),
};

export const schemes = {
    getSchemes: () => apiCall('/schemes'),
    getSchemeById: (id) => apiCall(`/schemes/${encodeURIComponent(id)}`),
};

// Locations API
export const locations = {
    getDistricts: () => apiCall('/locations/districts'),
    getSubdistricts: (district) => apiCall(`/locations/subdistricts?district=${encodeURIComponent(district)}`),
    getVillages: (district, subDistrict) => apiCall(`/locations/villages?district=${encodeURIComponent(district)}&subDistrict=${encodeURIComponent(subDistrict)}`),
    getTree: () => apiCall('/locations/tree')
};