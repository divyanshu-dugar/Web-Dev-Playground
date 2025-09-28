# Next.js Setup Reference

```bash
npx create-next-app@latest my-app --use-npm
```
</details>

## Setups

<details>
<summary>Tailwindcss + Next.js Setup</summary>

```js
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
