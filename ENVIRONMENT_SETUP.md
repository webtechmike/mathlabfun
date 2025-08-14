# Environment Variables Setup

This project uses environment variables for Firebase configuration with conditional handling for different environments.

## Environment Handling

The Firebase configuration now uses environment variables for all environments:

-   **Development**: Uses environment variables from `.env` file
-   **Production**: Uses environment variables from deployment platform (Netlify, Vercel, etc.)

## Local Development

For local development, you need to set up your Firebase configuration:

1. Copy the Firebase config template: `cp src/.firebaseConfig.template.js src/.firebaseConfig.js`
2. Copy the Firebase project template: `cp .firebaserc.template .firebaserc`
3. Create a `.env` file in the root directory with your Firebase credentials (see below)
4. You can get these values from your Firebase Console > Project Settings > General > Your apps

**Important**: The Firebase configuration file is now in `.gitignore` to prevent exposing credentials. You must set up environment variables for the app to work.

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_app_id_here
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

## Netlify Deployment

1. Go to your Netlify dashboard
2. Navigate to Site settings > Environment variables
3. Add each of the following variables with their corresponding values:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_app_id_here
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

## Important Notes

-   All environment variables must be prefixed with `REACT_APP_` to be accessible in the React application
-   The `.env` file should be added to `.gitignore` to keep sensitive information out of version control
-   Never commit API keys or other sensitive information to your repository
-   **The application requires environment variables to be set for both development and production**
