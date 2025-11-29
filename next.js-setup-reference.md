# Next.js Setup Reference

```bash
npx create-next-app@latest my-app --use-npm
```
</details>

## Setups

<details>
<summary>NextAuth - OAuth</summary>

## NextAuth.js

NextAuth.js is the standard for Next.js applications and handles OAuth beautifully.

### Installation
```bash
npm install next-auth
```

### 1. Setup API Route

**app/api/auth/[...nextauth]/route.ts**
```tsx
import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import FacebookProvider from 'next-auth/providers/facebook';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
      if (user) {
        token.id = (user as any).id; // NextAuth default user doesn't include id
      }
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }): Promise<Session> {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      (session as any).accessToken = token.accessToken;
      return session;
    }
  },

  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },

  secret: process.env.NEXTAUTH_SECRET!,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

```

### 2. Create Auth Provider

**providers/AuthProvider.tsx**
```tsx
'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

### 3. Update Layout

**app/layout.tsx**
```tsx
import AuthProvider from '@/providers/AuthProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 4. Create Sign-in Page

**app/auth/signin/page.tsx**
```tsx
'use client';

import { signIn, getSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: '/dashboard',
      });
      
      if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to VapeStore
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your account with
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleOAuthSignIn('google')}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300 disabled:opacity-50"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              🔍
            </span>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <button
            onClick={() => handleOAuthSignIn('github')}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-300 disabled:opacity-50"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              💻
            </span>
            {isLoading ? 'Signing in...' : 'Continue with GitHub'}
          </button>

          <button
            onClick={() => handleOAuthSignIn('facebook')}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 disabled:opacity-50"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              📘
            </span>
            {isLoading ? 'Signing in...' : 'Continue with Facebook'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 5. Update Navbar with Auth

**components/Layout/Navbar.tsx**
```tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="...">
      {/* ... other nav code ... */}
      
      {status === 'loading' ? (
        <div className="animate-pulse">Loading...</div>
      ) : session ? (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2"
          >
            <img
              src={session.user?.image || '/default-avatar.png'}
              alt={session.user?.name || 'User'}
              className="w-8 h-8 rounded-full"
            />
            <span>{session.user?.name}</span>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <button
                onClick={() => signOut()}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex space-x-4">
          <Link
            href="/auth/signin"
            className="text-gray-700 hover:text-purple-600"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="bg-purple-600 text-white px-4 py-2 rounded-md"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
```

## Environment Variables

**.env.local**
```env
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# Clerk (if using)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
```
</details>

<details>
<summary>Tailwindcss + Next.js Setup</summary>
<br/>
  
```js
// File - talwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
}
```

```js
// File - globals.css

@import "tailwindcss";
```

🔹 NextAuth Environment Variables
## 🔐 NEXTAUTH_SECRET

This is just a randomly generated key.

Generate it:

Option 1 (recommended)
openssl rand -base64 32

Option 2 (in VSCode terminal)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'));"


Put this in .env.local:

NEXTAUTH_SECRET=your_generated_secret_here

🔹 Google OAuth Credentials (Google Client ID & Secret)
Steps:

Go to Google Cloud Console
https://console.cloud.google.com/

Create a project (or use an existing one)

Left sidebar → APIs & Services → OAuth consent screen

Choose: External

Fill app name + email

Save

Left sidebar → Credentials

Click Create Credentials → OAuth Client ID

Application type: Web Application

Add redirect URIs:

http://localhost:3000/api/auth/callback/google


Google gives you:

GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx

🔹 GitHub OAuth Credentials
Steps:

Go to
https://github.com/settings/developers

Click OAuth Apps → New OAuth App

Fill:

Homepage URL:

http://localhost:3000


Authorization callback URL:

http://localhost:3000/api/auth/callback/github


GitHub gives:

GITHUB_ID=xxxx
GITHUB_SECRET=xxxx

🔹 Facebook OAuth Credentials
Steps:

Go to
https://developers.facebook.com/

Create App → Choose Consumer

Add product: Facebook Login → Web

Set redirect URL:

http://localhost:3000/api/auth/callback/facebook


Go to Settings → Basic

Copy App ID and App Secret

Put in .env.local:

FACEBOOK_CLIENT_ID=xxxx
FACEBOOK_CLIENT_SECRET=xxxx

</details>

<details>
<summary>🍃 MongoDB + Next.js Setup - Using Mongoose 🌿</summary>
<br/>
    
This is how we set up MongoDB with **Next.js API routes** using **Mongoose** (ODM). You will create a shared `mongooseConnect()` function and `model`, then build out CRUD API routes.
  
  ### 📦 Install Mongoose
  
  ```bash
  npm install mongoose
  ````
  
  ### 📁 lib/dbUtils.js
  
  This contains both out Mongoose connection logic and the model, in this case `UserModel`.
  
  ```js
  // File: lib/dbUtils.js
  
  import mongoose from 'mongoose';
  
  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
  });
  
  mongoose.models = {}; // Avoid OverwriteModelError in dev
  export const UserModel = mongoose.model('users', userSchema);
  
  export async function mongooseConnect() {
    if (mongoose.connections[0].readyState) {
      return true; // Already connected
    }
  
    try {
      await mongoose.connect("mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority");
      return true;
    } catch (err) {
      throw new Error(err);
    }
  }
  ```
<br/>

  <details>
    <summary>API Routes - App Router</summary>

  ### 🧩 API Routes – Create, Read (All)
  
  ```js
  // File: app/api/work-experience/route.js

import { mongooseConnect, WorkExperienceModel } from '@/lib/dbUtils';

export async function GET() {
  try {
    await mongooseConnect();
    const workExperiences = await WorkExperienceModel.find();
    return new Response(JSON.stringify(workExperiences), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('GET error:', err);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  try {
    await mongooseConnect();
    const body = await request.json();

    const newExperience = new WorkExperienceModel(body);
    await newExperience.save();

    return new Response(
      JSON.stringify({ message: `Work Experience: ${newExperience.title} Created` }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('POST error:', err);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

  ```
  
  ### 🧩 API Routes – Read (One), Update, Delete
  
  ```js
  // File: app/api/work-experience/[id]/route.js

import { mongooseConnect, WorkExperienceModel } from '@/lib/dbUtils';

export async function GET(request, { params }) {
  try {
    await mongooseConnect();
    const { id } = params;
    
    const workExperience = await WorkExperienceModel.findById(id);
    
    if (!workExperience) {
      return new Response(JSON.stringify({ message: 'Work experience not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify(workExperience), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('GET error:', err);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(request, { params }) {
  try {
    await mongooseConnect();
    const { id } = params;
    const body = await request.json();
    
    const updatedExperience = await WorkExperienceModel.findByIdAndUpdate(
      id,
      body,
      { new: true } // Return the updated document
    );
    
    if (!updatedExperience) {
      return new Response(JSON.stringify({ message: 'Work experience not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(
      JSON.stringify({ 
        message: `Work Experience: ${updatedExperience.title} Updated`,
        data: updatedExperience
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('PUT error:', err);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    await mongooseConnect();
    const { id } = params;
    
    const deletedExperience = await WorkExperienceModel.findByIdAndDelete(id);
    
    if (!deletedExperience) {
      return new Response(JSON.stringify({ message: 'Work experience not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(
      JSON.stringify({ 
        message: `Work Experience: ${deletedExperience.title} Deleted`
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('DELETE error:', err);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
  ```
    
  </details>
<br/>
  <details>
    <summary>API Routes - Page Router</summary>

  ### 🧩 API Routes – Create, Read (All)
  
  ```js
  // File: /pages/api/users/index.js
  
  import { UserModel, mongooseConnect } from '@/lib/dbUtils';
  
  export default async function handler(req, res) {
    const { name } = req.body;
    const { method } = req;
  
    try {
      await mongooseConnect();
  
      switch (method) {
        case 'GET': // GET /api/users
          const users = await UserModel.find().exec();
          res.status(200).json(users);
          break;
  
        case 'POST': // POST /api/users
          const newUser = new UserModel({ name });
          await newUser.save();
          res.status(200).json({ message: `User: ${name} Created` });
          break;
  
        default:
          res.setHeader('Allow', ['GET', 'POST']);
          res.status(405).end(`Method ${method} Not Allowed`);
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  ```
  
  ### 🧩 API Routes – Read (One), Update, Delete
  
  ```js
  // File: /pages/api/users/[id].js
  
  import { UserModel, mongooseConnect } from '@/lib/dbUtils';
  
  export default async function handler(req, res) {
    const { id } = req.query;
    const { name } = req.body;
    const { method } = req;
  
    try {
      await mongooseConnect();
  
      switch (method) {
        case 'GET': // GET /api/users/:id
          const user = await UserModel.findById(id).exec();
          res.status(200).json(user);
          break;
  
        case 'PUT': // PUT /api/users/:id
          await UserModel.updateOne({ _id: id }, { $set: { name } }).exec();
          res.status(200).json({ message: `User with id: ${id} updated` });
          break;
  
        case 'DELETE': // DELETE /api/users/:id
          await UserModel.deleteOne({ _id: id }).exec();
          res.status(200).json({ message: `Deleted User with id: ${id}` });
          break;
  
        default:
          res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
          res.status(405).end(`Method ${method} Not Allowed`);
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  ```
  </details>
  <br/>
  
  Setting up MongoDB URI in `.env.local` file:
  
  ```
  MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/dbname
  ```
  
</details>

<details>
<summary>📦 MongoDB Native Driver</summary>
<br/>
  
```bash
npm install mongodb
```

</details>

<details>
<summary><strong>Setup Global SWR Configuration in Next.js (App Router)</strong></summary>

#### 📁 1. Create a fetcher function

**File:** `/lib/fetcher.ts`

```ts
// lib/fetcher.ts
export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // @ts-ignore
    error.info = await res.json();
    // @ts-ignore
    error.status = res.status;
    throw error;
  }

  return res.json();
};
```

---

#### 🧩 2. Create a Client Component wrapper for SWR

**File:** `/components/SWRProvider.tsx`

```tsx
// components/SWRProvider.tsx
'use client';

import { SWRConfig } from 'swr';
import { fetcher } from '@/lib/fetcher';

export default function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ fetcher }}>
      {children}
    </SWRConfig>
  );
}
```

---

#### ⚙️ 3. Wrap your layout with SWRProvider

**File:** `/app/layout.tsx`

```tsx
// app/layout.tsx
import SWRProvider from '@/components/SWRProvider';
import Navbar from '@/components/Navbar'; // adjust based on your structure

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="black">
      <body className="antialiased">
        <SWRProvider>
          <Navbar />
          <main>{children}</main>
        </SWRProvider>
      </body>
    </html>
  );
}
```

</details>

<details>
  <summary><strong>Setup Global SWR Configuration in Next.js (Page Router)</strong></summary>

### Global Configuration in `_app.js`

```js
// pages/_app.js
import { SWRConfig } from 'swr';
import Layout from '@/components/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        fetcher: async (url) => {
          const res = await fetch(url);
          if (!res.ok) {
            const error = new Error('An error occurred while fetching the data.');
            error.info = await res.json();
            error.status = res.status;
            throw error;
          }
          return res.json();
        },
      }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SWRConfig>
  );
}
```

---

### 🚀 Using `useSWR` to Fetch Data in a Page

```js
// pages/pageName.js
import { useRouter } from 'next/router';
import useSWR from 'swr';

export default function ArtworkPage() {
  const router = useRouter();
  const finalQuery = router.asPath.split('?')[1];

  const { data, error, isLoading } = useSWR(finalQuery ? `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}` : null);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading artwork.</p>;

  return (
    <pre>{JSON.stringify(data, null, 2)}</pre> // or render custom component
  );
}
```
</details>
