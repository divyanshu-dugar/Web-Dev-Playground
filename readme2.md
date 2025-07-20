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

```bash
npm install mongoose
```

In `mongo.js`:

```js
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://ddugar:omDUX1qvsnZoGIDT@legosets.fsc8a.mongodb.net/databaseName?retryWrites=true&w=majority&appName=LegoSets");
```

</details>

<details>
<summary>📦 MongoDB Native Driver</summary>

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

