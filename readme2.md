# Web Development Setup Reference

<b>This repository contains: </br></b>
👉🏻 Personal Reference Notes <br/>
👉🏻 Setup steps <br/>
👉🏻 Handy commands for building web apps using <mark>**Node.js**, **Express**, **EJS**, **Tailwind CSS**, and **databases** like **MongoDB** and **PostgreSQL** </mark>. <br/>
<br/>

## 🔧 Git & GitHub Setup

<details>
<summary>🚀 Initial Setup</summary>

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/divyanshu-dugar/repo-name.git
git push -u origin main  # future pushes can use just: git push
````

</details>

<details>
<summary>🌿 Branching Commands</summary>

```bash
git branch                    # view branches
git branch -m main            # rename current branch to main
git checkout main             # switch to main branch
# OR
git switch main
```

</details>

<details>
<summary>👤 Git Global Configuration</summary>

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

</details>
<br/>

## ⚙️ NPM vs Install

- `npm init` or `npm init -y` → creates `package.json`
- `npm install` → installs dependencies listed in `package.json` in `node_modules`
<br/>

## 🧪 Common Issues & Fixes

<details>
<summary>❗ NVM Not Found</summary>

```bash
# If `nvm` is not recognized
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
````

</details>

<details>
<summary>🧹 Data / Server Troubleshooting</summary>

* Already added bad data → remove it manually
* Data might not exist → use `?` optional chaining (`data?.field`)
* Data might not be pushed to hosting server
* Server not watching for changes → restart server

</details>
<br/>

## Setups

<details>
<summary>Express</summary>
<br/>
  
```bash
npm init -y
npm i express
```

Add `node_modules` to `.gitignore`
</details>

<details>
<summary>📦 Tailwind CSS</summary>
<br/>
  
```bash
npm install -D tailwindcss
npx tailwindcss init
```

Update `tailwind.config.js`:

```js
module.exports = {
  content: ["./views/**/*.html"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `package.json`:

```json
"scripts": {
  "tw:build": "tailwindcss build -i ./public/css/tailwind.css -o ./public/css/main.css"
}
```

Include in HTML:

```html
<link rel="stylesheet" href="/css/main.css" />
```

Build CSS:

```bash
npm run tw:build
```

</details>

<details>
<summary>🎨 DaisyUI</summary>
<br/>
  
```bash
npm i @tailwindcss/typography daisyui
```

Update plugins in `tailwind.config.js`:

```js
plugins: [require('@tailwindcss/typography'), require('daisyui')]
```

</details>

<details>
<summary>📂 Server.js - Static Files & Middleware</summary>
<br/>
  
```js
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
```

```js
res.sendFile(path.join(__dirname, 'views', 'home.html'));
```

```js
module.exports = app;
```

</details>

<details>
<summary> 📝 EJS Template Engine </summary>
<br/>
  
```bash
npm install ejs
```

In `server.js`:

```js
app.set('view engine', 'ejs');
```
</details>

<details>
<summary>🛢️ PostgreSQL Setup - Using Sequelize 🐘</summary>
<br/>

```bash
npm install sequelize pg pg-hstore
```

In `server.js`:

```js
const Sequelize = require('sequelize');
```
</details>

<details>
<summary>🍃 MongoDB Setup - Using Mongoose 🌿</summary>
<br/>
<br/>

<details>
  <summary>MongoDB + Next.js</summary>
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
    <summary>MongoDB + Express.js</summary>
    <br/>
    
</details>

<br/>
</details>


<details>
<summary>📦 MongoDB Native Driver</summary>
<br/>
  
```bash
npm install mongodb
```

</details>

<details>
<summary>🚀 Deployment with Vercel</summary>
  
  <br/>
  
  <details>
  <summary>vercel.json</summary>
  <br/>
  
  ```json
  {
    "version": 2,
    "builds": [
      {
        "src": "server.js",
        "use": "@vercel/node",
        "config": { "includeFiles": ["dist/**"] }
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "server.js"
      }
    ]
  }
  ```
  </details>

  <br/>
</details>

<details>
<summary>⚡ Next.js Starter (Optional) </summary>
<br/>
  
```bash
npx create-next-app@latest my-app --use-npm
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
