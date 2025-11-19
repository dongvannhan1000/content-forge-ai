# Firebase Setup Guide

This guide will help you complete the Firebase integration for your ai-content-generator project.

## 📋 Prerequisites

- A Google account
- Node.js and npm installed
- Firebase package already installed ✅

## 🔥 Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "AI Content Generator")
4. (Optional) Enable Google Analytics
5. Click **"Create project"**

## 🔑 Step 2: Get Firebase Configuration

1. In your Firebase project, click the **⚙️ gear icon** → **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** (`</>`) to add a web app
4. Register your app with a nickname (e.g., "AI Content Generator Web")
5. Copy the `firebaseConfig` object - you'll need these values

## 📝 Step 3: Configure Environment Variables

1. In your project root, create a `.env.local` file (copy from `.env.local.example`):

```bash
# Copy the example file
cp .env.local.example .env.local
```

2. Open `.env.local` and fill in your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id
```

> **Important**: Never commit `.env.local` to git - it's already in `.gitignore` ✅

## 🔐 Step 4: Enable Firebase Authentication

1. In Firebase Console, go to **"Build"** → **"Authentication"**
2. Click **"Get started"**
3. Click on **"Email/Password"** under "Sign-in method"
4. Enable **"Email/Password"**
5. Click **"Save"**

## 📚 Step 5: Set Up Firestore Database

1. In Firebase Console, go to **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
   - **Note**: Change to production mode later with proper security rules
4. Choose a location (pick closest to your users)
5. Click **"Enable"**

### Firestore Security Rules (Optional for Production)

For development, test mode is fine. For production, update your rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Articles collection - users can only read/write their own articles
    match /articles/{article} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                     request.resource.data.userId == request.auth.uid;
    }
    
    // User settings - users can only read/write their own settings
    match /userSettings/{userId} {
      allow read, write: if request.auth != null && 
                           userId == request.auth.uid;
    }
  }
}
```

## 📦 Step 6: Set Up Firebase Storage (Optional)

If you want to store generated images:

1. In Firebase Console, go to **"Build"** → **"Storage"**
2. Click **"Get started"**
3. Start in **test mode** (for development)
4. Click **"Done"**

### Storage Security Rules (Optional for Production)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                    request.auth.uid == userId;
    }
  }
}
```

## ✅ Step 7: Verify Setup

1. Start your development server:

```bash
npm run dev
```

2. Open your browser to `http://localhost:3000`

3. Check the browser console for any Firebase errors

4. Try signing up with a test account

5. Check Firebase Console → Authentication to see the new user

## 🏗️ Project Structure

Your project now has the following Firebase integration:

```
/ai-content-generator
├── /lib
│   └── /firebase
│       ├── config.ts          # Firebase initialization
│       └── index.ts           # Barrel exports
├── /services                   # Service layer (no Firebase in UI!)
│   ├── auth.service.ts        # Authentication operations
│   ├── firestore.service.ts   # Database operations
│   └── storage.service.ts     # File storage operations
├── /contexts
│   └── auth-context.tsx       # Auth state management
├── /hooks
│   ├── use-articles.ts        # Article CRUD + real-time
│   └── use-settings.ts        # Settings sync
├── /types
│   └── index.ts               # TypeScript types
├── .env.local.example         # Template
└── .env.local                 # Your credentials (gitignored)
```

## 🎯 Usage Examples

### Using Authentication

```typescript
import { useAuth } from '@/contexts/auth-context';

function MyComponent() {
  const { user, login, signup, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return <div>{user ? `Welcome ${user.name}` : 'Not logged in'}</div>;
}
```

### Using Articles Hook

```typescript
import { useArticles } from '@/hooks/use-articles';

function ArticlesPage() {
  const { articles, createArticle, updateArticle, deleteArticle, isLoading } = useArticles();

  const handleCreate = async () => {
    await createArticle({
      title: 'My Article',
      content: 'Lorem ipsum...',
      mode: 'topics',
      status: 'draft',
      createdAt: new Date(),
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {articles.map(article => (
        <div key={article.id}>{article.title}</div>
      ))}
    </div>
  );
}
```

### Using Settings Hook

```typescript
import { useSettings } from '@/hooks/use-settings';

function SettingsPage() {
  const { settings, saveSettings, isLoading } = useSettings();

  const handleSave = async () => {
    await saveSettings({
      promptSettings: {
        defaultBlogPrompt: 'Custom prompt...',
        defaultSocialPostPrompt: 'Custom social prompt...',
      },
      outputSettings: settings.outputSettings,
      imageSettings: settings.imageSettings,
    });
  };

  return <div>{/* Your settings UI */}</div>;
}
```

## 🔍 Troubleshooting

### "Firebase: Error (auth/...)"

- Check that you've enabled Email/Password authentication in Firebase Console
- Verify your `.env.local` has the correct credentials

### "Missing or insufficient permissions"

- Check Firestore security rules
- Make sure you're logged in

### "Cannot find module '@/services/...'"

- Verify that TypeScript paths are configured in `tsconfig.json`
- Restart your development server

## 🚀 Next Steps

1. **Set up production security rules** when ready to deploy
2. **Add more authentication providers** (Google, GitHub, etc.)
3. **Implement data validation** in Firestore rules
4. **Add indexes** for complex queries in Firestore
5. **Set up Firebase Hosting** for deployment

## 📖 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**Need help?** Check the Firebase Console for errors or refer to the Firebase documentation.
