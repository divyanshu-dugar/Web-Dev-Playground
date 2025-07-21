# Express Setup Reference

```bash
npm init -y
npm i express
```

👉🏻 Add `node_modules` to `.gitignore`

<details>
<summary>📂 Server.js - Web server setup using express.js</summary>
<br/>

```js
const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
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

## Other Setups with Express

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
