# Environment Variables Setup

This project uses environment variables for Firebase configuration with conditional handling for different environments.

## Environment Handling

The Firebase configuration automatically handles different environments:

- **Development**: Uses hardcoded fallback values for local development
- **Production**: Uses environment variables from Netlify

## Local Development

For local development, no `.env` file is needed. The application will automatically use the fallback values configured in `src/.firebaseConfig.js`.

If you want to override these values for local development, you can create a `.env` file in the root directory with the following variables:

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
REACT_APP_FIREBASE_API_KEY=AIzaSyDVBYoVF3YLM4G9uSiaG6oGQ9uoztFxdxs
REACT_APP_FIREBASE_AUTH_DOMAIN=mathlabfun.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=mathlabfun
REACT_APP_FIREBASE_STORAGE_BUCKET=mathlabfun.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=813261118335
REACT_APP_FIREBASE_APP_ID=1:813261118335:web:3b3100da1997a1dd3f584a
REACT_APP_FIREBASE_MEASUREMENT_ID=G-7GYFQSRB76
```

## Important Notes

- All environment variables must be prefixed with `REACT_APP_` to be accessible in the React application
- The `.env` file should be added to `.gitignore` to keep sensitive information out of version control
- Never commit API keys or other sensitive information to your repository
- The application will work locally without any environment variables due to fallback values
