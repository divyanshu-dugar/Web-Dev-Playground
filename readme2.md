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

This is how we set up MongoDB with **Next.js API routes** using **Mongoose** (ODM). You will create a shared `mongooseConnect()` function and model, then build out CRUD API routes.

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

Setting up MongoDB URI in `.env.local` file:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/dbname
```

</details>

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
  <details>
  <summary>vercel.json (Custom Config)</summary>
  
  Example:
  
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/server.js" }
    ]
  }
  ```
  </details>
</details>

<details>
<summary>⚡ Next.js Starter (Optional) </summary>
<br/>
  
```bash
npx create-next-app@latest my-app --use-npm
```
</details>

