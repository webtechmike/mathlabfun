// Template for Firebase configuration
// Copy this file to .firebaseConfig.js and replace the placeholder values with your actual Firebase config
// You can get these values from your Firebase Console > Project Settings > General > Your apps

// Check if we're in development or production
const isDevelopment = process.env.NODE_ENV === "development";

// Firebase configuration with fallbacks for local development
export const firebaseConfig = {
    apiKey:
        process.env.REACT_APP_FIREBASE_API_KEY ||
        (isDevelopment ? "your_api_key_here" : ""),
    authDomain:
        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
        (isDevelopment ? "your_project_id.firebaseapp.com" : ""),
    projectId:
        process.env.REACT_APP_FIREBASE_PROJECT_ID ||
        (isDevelopment ? "your_project_id" : ""),
    storageBucket:
        process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
        (isDevelopment ? "your_project_id.appspot.com" : ""),
    messagingSenderId:
        process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ||
        (isDevelopment ? "your_messaging_sender_id" : ""),
    appId:
        process.env.REACT_APP_FIREBASE_APP_ID ||
        (isDevelopment ? "your_app_id" : ""),
    measurementId:
        process.env.REACT_APP_FIREBASE_MEASUREMENT_ID ||
        (isDevelopment ? "your_measurement_id" : ""),
};
