# Environment Variables Setup

This project uses environment variables for Firebase configuration. Follow these steps to set up your environment:

## Local Development

1. Create a `.env` file in the root directory of the project
2. Add the following variables to your `.env` file:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyDVBYoVF3YLM4G9uSiaG6oGQ9uoztFxdxs
REACT_APP_FIREBASE_AUTH_DOMAIN=mathlabfun.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=mathlabfun
REACT_APP_FIREBASE_STORAGE_BUCKET=mathlabfun.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=813261118335
REACT_APP_FIREBASE_APP_ID=1:813261118335:web:3b3100da1997a1dd3f584a
REACT_APP_FIREBASE_MEASUREMENT_ID=G-7GYFQSRB76
```

## Netlify Deployment

1. Go to your Netlify dashboard
2. Navigate to Site settings > Environment variables
3. Add each of the above variables with their corresponding values

## Important Notes

- All environment variables must be prefixed with `REACT_APP_` to be accessible in the React application
- The `.env` file should be added to `.gitignore` to keep sensitive information out of version control
- Never commit API keys or other sensitive information to your repository
