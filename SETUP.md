# Setup Guide

## Prerequisites
- Node.js 18+ installed
- Firebase account
- Google AI Studio account (for Gemini API)
- Stripe account (optional, for payments)

## Step 1: Clone and Install

```bash
git clone https://github.com/yourusername/draftrapid.git
cd draftrapid
npm install
```

## Step 2: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password and Google)
4. Create a Firestore database
5. Get your config from Project Settings

## Step 3: Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Copy the key

## Step 4: Environment Variables

Create `.env.local` file:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Step 5: Firestore Security Rules

In Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /content/{contentId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    
    match /brandVoices/{voiceId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 6: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 7: Test

1. Sign up with email or Google
2. Go to Dashboard
3. Generate content
4. Check Library, Calendar, AI Tools

## Troubleshooting

### Firebase Connection Issues
- Check if API keys are correct
- Verify Firebase project is active
- Check browser console for errors

### Gemini API Issues
- Verify API key is valid
- Check quota limits in Google AI Studio
- Ensure billing is enabled if required

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup.
