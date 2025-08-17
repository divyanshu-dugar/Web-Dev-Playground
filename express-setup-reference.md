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

## Other Setups for Express app

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

<details>
<summary>🍃 MongoDB + Express Setup - Using Mongoose 🌿</summary>
<br/>

```
npm install mongoose
```

### 📁 Recommended File/Folder Structure:

```
/server
  ├── config/
  │   └── db.js                 ← Mongoose connection setup
  ├── models/
  │   └── Site.js               ← Mongoose schema and model
  ├── controllers/
  │   └── siteController.js     ← Optional: DB logic abstraction
  ├── routes/
  │   └── siteRoutes.js         ← Express routes
  ├── server.js                 ← Express entry point
```

---

### 🔌 1. **Mongoose DB Connection Setup**

#### `server/config/db.js`

```js
const mongoose = require('mongoose');

const connectDB = async (connectionString) => {
  try {
    const conn = await mongoose.connect(connectionString);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

module.exports = connectDB;
```


### 📄 2. **Mongoose Schema + Model**

#### `server/models/Site.js`

```js
const mongoose = require('mongoose');

const dateSchema = new mongoose.Schema({
  year: String,
  type: String,
});

const locationSchema = new mongoose.Schema({
  town: String,
  latitude: Number,
  longitude: Number,
});

const provinceOrTerritorySchema = new mongoose.Schema({
  code: String,
  name: String,
  type: String,
  region: String,
  capital: String,
});

const siteSchema = new mongoose.Schema({
  siteName: String,
  description: String,
  dates: [dateSchema],
  designated: Number,
  image: String,
  location: locationSchema,
  provinceOrTerritory: provinceOrTerritorySchema,
});

module.exports = mongoose.model('Site', siteSchema);
```


### 📦 3. **Database Access Layer (Optional Abstraction)**

#### `server/controllers/siteController.js`

```js
const Site = require('../models/Site');

exports.addSite = async (data) => {
  const newSite = new Site(data);
  return await newSite.save();
};

exports.getAllSites = async (filters, page, perPage) => {
  const query = {};

  if (filters.region) {
    query['provinceOrTerritory.region'] = new RegExp(filters.region, 'i');
  } else if (filters.provinceOrTerritoryName) {
    query['provinceOrTerritory.name'] = new RegExp(filters.provinceOrTerritoryName, 'i');
  } else if (filters.name) {
    query.siteName = new RegExp(filters.name, 'i');
  }

  if (+page && +perPage) {
    return await Site.find(query)
      .sort({ siteName: 1 })
      .skip((page - 1) * +perPage)
      .limit(+perPage)
      .exec();
  }

  throw new Error('page and perPage query parameters must be valid numbers');
};

exports.getSiteById = async (id) => {
  return await Site.findById(id);
};

exports.updateSite = async (id, data) => {
  return await Site.updateOne({ _id: id }, { $set: data });
};

exports.deleteSite = async (id) => {
  return await Site.deleteOne({ _id: id });
};
```


### 🚏 4. **Express Routes**

#### `server/routes/siteRoutes.js`

```js
const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');

router.post('/sites', async (req, res) => {
  try {
    const site = await siteController.addSite(req.body);
    res.status(201).json(site);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add site' });
  }
});

router.get('/sites', async (req, res) => {
  try {
    const sites = await siteController.getAllSites(req.query, req.query.page, req.query.perPage);
    res.status(200).json(sites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/sites/:id', async (req, res) => {
  try {
    const site = await siteController.getSiteById(req.params.id);
    if (!site) return res.status(404).json({ message: 'Site not found' });
    res.status(200).json(site);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch site' });
  }
});

router.put('/sites/:id', async (req, res) => {
  try {
    await siteController.updateSite(req.params.id, req.body);
    res.status(200).json({ message: 'Site updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update site' });
  }
});

router.delete('/sites/:id', async (req, res) => {
  try {
    await siteController.deleteSite(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete site' });
  }
});

module.exports = router;
```


### 🚀 5. **Server Entry Point**

#### `server/server.js`

```js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const siteRoutes = require('./routes/siteRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Listening', developer: 'Divyanshu Dugar' });
});

app.use('/api', siteRoutes);

app.use((req, res) => {
  res.status(404).send('Resource Not Found!');
});

connectDB(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });
```

### 💡 Notes:

* ✅ Use `.env` for `MONGODB_CONN_STRING`
* 🧠 Model naming: use **PascalCase** (`Site.js`) and schema naming as per MongoDB collections (`site`)
* 📂 Organize logic using folders: `models/`, `controllers/`, `routes/`, `config/`
* 🪝 Connect this Express API to Next.js client via `/api/sites`.

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
