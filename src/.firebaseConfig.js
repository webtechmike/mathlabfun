// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Check if we're in development or production
const isDevelopment = process.env.NODE_ENV === "development";

// Firebase configuration with fallbacks for local development
// IMPORTANT: Replace these placeholder values with your actual Firebase config
// You can get these values from your Firebase Console > Project Settings > General > Your apps
export const firebaseConfig = {
    apiKey:
        process.env.REACT_APP_FIREBASE_API_KEY ||
        "AIzaSyDVBYoVF3YLM4G9uSiaG6oGQ9uoztFxdxs",
    authDomain:
        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
        "mathlabfun.firebaseapp.com",
    projectId:
        process.env.REACT_APP_FIREBASE_PROJECT_ID ||
        "mathlabfun",
    storageBucket:
        process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
        "mathlabfun.appspot.com",
    messagingSenderId:
        process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ||
        "813261118335",
    appId:
        process.env.REACT_APP_FIREBASE_APP_ID ||
        "1:813261118335:web:3b3100da1997a1dd3f584a",
    measurementId:
        process.env.REACT_APP_FIREBASE_MEASUREMENT_ID ||
        "G-7GYFQSRB76",
};
