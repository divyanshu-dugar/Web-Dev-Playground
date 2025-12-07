// app/express-setup-reference/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Database, 
  Server, 
  FolderTree, 
  FileCode, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronRight,
  Cpu,
  Cloud,
  GitBranch,
  Palette,
  Eye,
  Zap,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';
import Link from 'next/link';

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: string;
  prismLanguage: string;
  code: string;
  icon: React.ReactNode;
  tags: string[];
  isSetup?: boolean;
  filePath?: string;
}

const ExpressSetupReference = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'setup': true,
    'mongodb': false,
    'server': false,
    'tailwind': false,
    'ejs': false,
    'postgresql': false,
    'deployment': false
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const codeBlocksRef = useRef<(HTMLPreElement | null)[]>([]);

  // Initialize Prism highlighting
  useEffect(() => {
    Prism.highlightAll();
    
    return () => {
      codeBlocksRef.current = [];
    };
  }, [expandedSections]);

  const snippets: CodeSnippet[] = [
    {
      id: 'basic-setup',
      title: 'Express.js Basic Setup',
      description: 'Initialize Link new Express.js application with npm',
      language: 'bash',
      prismLanguage: 'bash',
      code: `npm init -y
npm i express`,
      icon: <Terminal className="w-5 h-5" />,
      tags: ['setup', 'npm', 'express'],
      isSetup: true,
      filePath: 'Terminal'
    },
    {
      id: 'gitignore',
      title: '.gitignore Configuration',
      description: 'Essential .gitignore file for Node.js/Express projects',
      language: 'bash',
      prismLanguage: 'bash',
      code: `# Dependencies
node_modules/

# Environment variables
.env
.env.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory
coverage/

# Build output
dist/
build/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db`,
      icon: <GitBranch className="w-5 h-5" />,
      tags: ['git', 'configuration', 'ignore'],
      isSetup: true,
      filePath: '.gitignore'
    },
    {
      id: 'server-basic',
      title: 'Basic Express Server',
      description: 'Minimal Express server setup with port configuration',
      language: 'javascript',
      prismLanguage: 'javascript',
      code: `const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign Link port

// start the server on the port and output Link confirmation to the console
app.listen(HTTP_PORT, () => console.log(\`server listening on: \${HTTP_PORT}\`));`,
      icon: <Server className="w-5 h-5" />,
      tags: ['server', 'basic', 'setup'],
      filePath: 'server.js'
    },
    {
      id: 'middleware-static',
      title: 'Middleware & Static Files',
      description: 'Configure middleware and serve static files',
      language: 'javascript',
      prismLanguage: 'javascript',
      code: `const path = require('path');
const express = require('express');
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from 'views' directory
app.use(express.static(path.join(__dirname, 'views')));

// Example route serving HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Export the app (important for Vercel deployment)
module.exports = app;`,
      icon: <Cpu className="w-5 h-5" />,
      tags: ['middleware', 'static', 'configuration'],
      filePath: 'server.js'
    },
    {
      id: 'folder-structure',
      title: 'Recommended Folder Structure',
      description: 'Professional folder structure for Express.js applications',
      language: 'bash',
      prismLanguage: 'bash',
      code: `/server
  ├── config/
  │   └── db.js                 # Database connection setup
  ├── models/
  │   └── Site.js               # Mongoose schema and model
  ├── controllers/
  │   └── siteController.js     # Business logic abstraction
  ├── routes/
  │   └── siteRoutes.js         # Express routes
  ├── middleware/
  │   └── auth.js               # Custom middleware
  ├── public/
  │   ├── css/
  │   │   └── main.css          # Compiled CSS
  │   ├── js/
  │   │   └── app.js            # Frontend JavaScript
  │   └── images/               # Static images
  ├── views/
  │   ├── home.html             # HTML templates
  │   └── partials/             # Template partials
  ├── .env                      # Environment variables
  ├── .gitignore               # Git ignore file
  ├── package.json             # Dependencies and scripts
  └── server.js                # Express entry point`,
      icon: <FolderTree className="w-5 h-5" />,
      tags: ['structure', 'organization', 'best-practices'],
      filePath: 'Project Structure'
    },
    {
      id: 'mongodb-connection',
      title: 'MongoDB Connection Setup',
      description: 'Mongoose connection configuration with error handling',
      language: 'javascript',
      prismLanguage: 'javascript',
      code: `// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async (connectionString) => {
  try {
    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(\`✅ MongoDB Connected: \${conn.connection.host}\`);
    return conn;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

module.exports = connectDB;`,
      icon: <Database className="w-5 h-5" />,
      tags: ['mongodb', 'mongoose', 'database', 'connection'],
      filePath: 'server/config/db.js'
    },
    {
      id: 'mongoose-schema',
      title: 'Mongoose Schema & Model',
      description: 'Complete Mongoose schema with nested schemas and validation',
      language: 'javascript',
      prismLanguage: 'javascript',
      code: `// server/models/Site.js
const mongoose = require('mongoose');

const dateSchema = new mongoose.Schema({
  year: {
    type: String,
    required: [true, 'Year is required'],
    match: [/^\\d{4}$/, 'Please enter Link valid 4-digit year']
  },
  type: {
    type: String,
    enum: ['designated', 'proposed', 'rejected'],
    default: 'designated'
  }
}, { _id: false });

const locationSchema = new mongoose.Schema({
  town: {
    type: String,
    required: [true, 'Town name is required'],
    trim: true
  },
  latitude: {
    type: Number,
    min: -90,
    max: 90,
    required: true
  },
  longitude: {
    type: Number,
    min: -180,
    max: 180,
    required: true
  }
}, { _id: false });

const provinceOrTerritorySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    uppercase: true,
    minlength: 2,
    maxlength: 2
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['province', 'territory'],
    required: true
  },
  region: {
    type: String,
    enum: ['Western', 'Central', 'Atlantic', 'Northern'],
    required: true
  },
  capital: String
}, { _id: false });

const siteSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: [true, 'Site name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Site name must be at least 3 characters'],
    maxlength: [100, 'Site name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: true,
    minlength: [10, 'Description must be at least 10 characters']
  },
  dates: [dateSchema],
  designated: {
    type: Number,
    required: true,
    min: 1800,
    max: new Date().getFullYear()
  },
  image: {
    type: String,
    match: [/^https?:\\/\\//, 'Please enter Link valid URL']
  },
  location: locationSchema,
  provinceOrTerritory: provinceOrTerritorySchema,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp on save
siteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create text index for search functionality
siteSchema.index({ siteName: 'text', description: 'text' });

module.exports = mongoose.model('Site', siteSchema);`,
      icon: <FileCode className="w-5 h-5" />,
      tags: ['mongodb', 'mongoose', 'schema', 'model', 'validation'],
      filePath: 'server/models/Site.js'
    },
    {
      id: 'express-routes',
      title: 'Express Routes with Controllers',
      description: 'Complete REST API routes with controller abstraction',
      language: 'javascript',
      prismLanguage: 'javascript',
      code: `// server/routes/siteRoutes.js
const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');

// GET all sites with pagination and filtering
router.get('/sites', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, region, sortBy = 'siteName', order = 'asc' } = req.query;
    
    const result = await siteController.getAllSites({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      region,
      sortBy,
      order
    });
    
    res.status(200).json({
      success: true,
      count: result.sites.length,
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      data: result.sites
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// GET single site by ID
router.get('/sites/:id', async (req, res) => {
  try {
    const site = await siteController.getSiteById(req.params.id);
    
    if (!site) {
      return res.status(404).json({ 
        success: false, 
        error: 'Site not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: site
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch site' 
    });
  }
});

// POST create new site
router.post('/sites', async (req, res) => {
  try {
    const site = await siteController.createSite(req.body);
    
    res.status(201).json({
      success: true,
      data: site,
      message: 'Site created successfully'
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        error: err.message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create site' 
    });
  }
});

// PUT update site
router.put('/sites/:id', async (req, res) => {
  try {
    const site = await siteController.updateSite(req.params.id, req.body);
    
    if (!site) {
      return res.status(404).json({ 
        success: false, 
        error: 'Site not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: site,
      message: 'Site updated successfully'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update site' 
    });
  }
});

// DELETE site
router.delete('/sites/:id', async (req, res) => {
  try {
    const site = await siteController.deleteSite(req.params.id);
    
    if (!site) {
      return res.status(404).json({ 
        success: false, 
        error: 'Site not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Site deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete site' 
    });
  }
});

module.exports = router;`,
      icon: <Zap className="w-5 h-5" />,
      tags: ['routes', 'rest', 'api', 'express'],
      filePath: 'server/routes/siteRoutes.js'
    },
    {
      id: 'tailwind-setup',
      title: 'Tailwind CSS Configuration',
      description: 'Setup Tailwind CSS with Express.js',
      language: 'bash',
      prismLanguage: 'bash',
      code: `# Install Tailwind CSS and dependencies
npm install -D tailwindcss
npx tailwindcss init

# Install additional plugins (optional)
npm install -D @tailwindcss/typography daisyui`,
      icon: <Palette className="w-5 h-5" />,
      tags: ['tailwind', 'css', 'styling'],
      isSetup: true,
      filePath: 'Terminal'
    },
    {
      id: 'tailwind-config',
      title: 'Tailwind Configuration File',
      description: 'Tailwind CSS configuration for Express.js projects',
      language: 'javascript',
      prismLanguage: 'javascript',
      code: `// tailwind.config.js
module.exports = {
  content: [
    "./views/**/*.html",
    "./public/**/*.js",
    "./public/**/*.css"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
  
  // DaisyUI themes
  daisyui: {
    themes: ['light', 'dark', 'cupcake'],
    darkTheme: "dark",
  },
}

// package.json scripts
"scripts": {
  "tw:build": "tailwindcss build -i ./public/css/tailwind.css -o ./public/css/main.css",
  "tw:watch": "tailwindcss build -i ./public/css/tailwind.css -o ./public/css/main.css --watch",
  "tw:prod": "NODE_ENV=production tailwindcss build -i ./public/css/tailwind.css -o ./public/css/main.css --minify"
}`,
      icon: <FileCode className="w-5 h-5" />,
      tags: ['tailwind', 'configuration', 'daisyui'],
      filePath: 'tailwind.config.js'
    },
    {
      id: 'ejs-setup',
      title: 'EJS Template Engine Setup',
      description: 'Configure EJS as the template engine for Express.js',
      language: 'bash',
      prismLanguage: 'bash',
      code: `# Install EJS
npm install ejs`,
      icon: <Eye className="w-5 h-5" />,
      tags: ['ejs', 'templates', 'views'],
      isSetup: true,
      filePath: 'Terminal'
    },
    {
      id: 'vercel-deployment',
      title: 'Vercel Deployment Configuration',
      description: 'Deploy Express.js applications to Vercel',
      language: 'json',
      prismLanguage: 'json',
      code: `// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node",
      "config": { 
        "includeFiles": ["public/**", "views/**", "dist/**"] 
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js",
      "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      "headers": {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
        "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
      }
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}

// Common Vercel deployment errors and solutions:
// 1. 404 Error:
//    - Ensure vercel.json exists in root
//    - Make sure server.js exports the app: module.exports = app;
//    - Check if routes are properly configured

// 2. 500 Error:
//    - Add environment variables in Vercel dashboard
//    - Ensure all dependencies are in package.json
//    - Check for missing modules:
//      const dotenv = require("dotenv");
//      dotenv.config();`,
      icon: <Cloud className="w-5 h-5" />,
      tags: ['deployment', 'vercel', 'production'],
      filePath: 'vercel.json'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Snippets' },
    { id: 'setup', label: 'Setup Commands', topics: ['setup', 'npm', 'configuration'] },
    { id: 'database', label: 'Database', topics: ['mongodb', 'mongoose', 'database'] },
    { id: 'routes', label: 'Routes & API', topics: ['routes', 'rest', 'api'] },
    { id: 'frontend', label: 'Frontend', topics: ['tailwind', 'css', 'ejs', 'templates'] },
    { id: 'deployment', label: 'Deployment', topics: ['deployment', 'vercel', 'production'] }
  ];

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeFilter === 'all') return matchesSearch;
    
    const filter = filters.find(f => f.id === activeFilter);
    return matchesSearch && snippet.tags.some(tag => filter?.topics?.includes(tag));
  });

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      javascript: 'bg-yellow-600',
      bash: 'bg-gray-700',
      json: 'bg-amber-600',
      typescript: 'bg-blue-600',
      default: 'bg-purple-600'
    };
    return colors[language] || colors.default;
  };

  const getLanguageIcon = (language: string) => {
    const icons: Record<string, React.ReactNode> = {
      javascript: <FileCode className="w-4 h-4" />,
      bash: <Terminal className="w-4 h-4" />,
      json: <FileCode className="w-4 h-4" />,
    };
    return icons[language] || <FileCode className="w-4 h-4" />;
  };

  const sectionGroups = [
    {
      id: 'setup',
      title: 'Basic Setup',
      icon: Terminal,
      color: 'text-blue-400',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'mongodb',
      title: 'MongoDB with Mongoose',
      icon: Database,
      color: 'text-green-400',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'server',
      title: 'Server Configuration',
      icon: Server,
      color: 'text-purple-400',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'tailwind',
      title: 'Styling & Templates',
      icon: Palette,
      color: 'text-pink-400',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      id: 'deployment',
      title: 'Deployment',
      icon: Cloud,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200'
    }
  ];

  return (
    <div className="min-h-screen bg-lient-to-br from-gray-900 via-gray-900 to-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
      
      <div className="relative">
        {/* Header */}
        <header className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-linear-to-r from-green-600 to-emerald-600 rounded-lg">
                    <Server className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      Express.js Setup Reference
                    </h1>
                    <p className="text-gray-400 mt-1">Complete Express.js configurations, setups, and best practices</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                  <div className="text-2xl font-bold text-white">{snippets.length}</div>
                  <div className="text-sm text-gray-400">Code Snippets</div>
                </div>
                <div className="h-8 w-px bg-gray-800 hidden md:block" />
                <Link 
                  href="https://expressjs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Express.js Docs
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Bar */}
          <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">4+</div>
                  <div className="text-sm text-gray-400">Database Options</div>
                </div>
                <Database className="w-8 h-8 text-green-400" />
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">REST</div>
                  <div className="text-sm text-gray-400">API Ready</div>
                </div>
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">3+</div>
                  <div className="text-sm text-gray-400">Template Engines</div>
                </div>
                <Eye className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">Vercel</div>
                  <div className="text-sm text-gray-400">Deployment Ready</div>
                </div>
                <Cloud className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search Express.js snippets, configurations, or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {filters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                      activeFilter === filter.id
                        ? 'bg-linear-to-r from-green-600 to-emerald-600 text-white'
                        : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {activeFilter === filter.id && <Filter className="w-4 h-4" />}
                      {filter.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Setup Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Terminal className="w-6 h-6 text-green-400" />
              Quick Setup Commands
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSnippets.filter(s => s.isSetup).map(snippet => (
                <div
                  key={snippet.id}
                  className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {snippet.icon}
                      <h3 className="font-semibold text-white">{snippet.title}</h3>
                    </div>
                    <button
                      onClick={() => copyToClipboard(snippet.code, snippet.id)}
                      className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedId === snippet.id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{snippet.description}</p>
                  
                  <div className="relative group/code">
                    <div className="absolute top-2 right-2 flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getLanguageColor(snippet.language)} flex items-center gap-1`}>
                        {getLanguageIcon(snippet.language)}
                        {snippet.language}
                      </span>
                      {snippet.filePath && (
                        <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-medium">
                          {snippet.filePath}
                        </span>
                      )}
                    </div>
                    <pre className="bg-gray-900/80 border border-gray-700 rounded-xl p-4 overflow-x-auto text-sm scrollbar-thin mt-2">
                      <code className={`language-${snippet.prismLanguage}`}>
                        {snippet.code}
                      </code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-6">
            {sectionGroups.map(section => {
              const Icon = section.icon;
              const sectionSnippets = filteredSnippets.filter(s => 
                s.id.includes(section.id) && !s.isSetup
              );

              if (sectionSnippets.length === 0) return null;

              return (
                <div key={section.id} className="bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-green-400" />
                      <h2 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
                        {section.title}
                      </h2>
                      <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm font-medium">
                        {sectionSnippets.length} snippets
                      </span>
                    </div>
                    {expandedSections[section.id] ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    )}
                  </button>

                  {expandedSections[section.id] && (
                    <div className="p-6 pt-0 space-y-6">
                      {sectionSnippets.map((snippet, index) => (
                        <div key={snippet.id} className="border border-gray-700 rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm">
                          <div className="px-6 py-4 border-b border-gray-800 bg-linear-to-r from-gray-900 to-gray-800">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                {snippet.icon}
                                <div>
                                  <h3 className="font-semibold text-white">{snippet.title}</h3>
                                  <p className="text-gray-400 text-sm mt-1">{snippet.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getLanguageColor(snippet.language)} flex items-center gap-1`}>
                                    {getLanguageIcon(snippet.language)}
                                    {snippet.language}
                                  </span>
                                  {snippet.filePath && (
                                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-medium">
                                      {snippet.filePath}
                                    </span>
                                  )}
                                </div>
                                <button
                                  onClick={() => copyToClipboard(snippet.code, snippet.id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
                                >
                                  {copiedId === snippet.id ? (
                                    <>
                                      <Check className="w-4 h-4 text-green-400" />
                                      <span className="text-sm text-green-400">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-4 h-4 text-gray-400" />
                                      <span className="text-sm text-gray-300">Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <div className="absolute top-0 left-0 right-0 h-8 bg-linear-to-b from-gray-900 to-transparent pointer-events-none" />
                            <pre 
                              ref={el => {
                                if (el) {
                                  codeBlocksRef.current[index] = el;
                                }
                              }}
                              className="m-0! p-6! bg-gray-900 text-gray-100 overflow-x-auto text-sm leading-relaxed scrollbar-thin max-h-[500px] overflow-y-auto"
                            >
                              <code className={`language-${snippet.prismLanguage}`}>
                                {snippet.code}
                              </code>
                            </pre>
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-gray-900 to-transparent pointer-events-none" />
                          </div>
                          {snippet.tags && snippet.tags.length > 0 && (
                            <div className="px-6 py-3 border-t border-gray-800 bg-gray-900/80">
                              <div className="flex flex-wrap gap-2">
                                {snippet.tags.map(tag => (
                                  <span
                                    key={tag}
                                    className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-medium hover:bg-gray-700 transition-colors cursor-default"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Additional Resources */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Additional Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link 
                href="https://mongoosejs.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-green-500/50 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-8 h-8 text-green-400" />
                  <div>
                    <h3 className="font-bold text-white">Mongoose Documentation</h3>
                    <p className="text-sm text-gray-400">Complete MongoDB ODM guide</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">Learn about schemas, models, queries, and middleware</p>
              </Link>
              
              <Link 
                href="https://tailwindcss.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-blue-500/50 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Palette className="w-8 h-8 text-blue-400" />
                  <div>
                    <h3 className="font-bold text-white">Tailwind CSS Docs</h3>
                    <p className="text-sm text-gray-400">Utility-first CSS framework</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">Complete reference for Tailwind CSS classes and utilities</p>
              </Link>
              
              <Link 
                href="https://vercel.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-cyan-500/50 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Cloud className="w-8 h-8 text-cyan-400" />
                  <div>
                    <h3 className="font-bold text-white">Vercel Deployment</h3>
                    <p className="text-sm text-gray-400">Serverless deployment platform</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">Deploy Express.js applications with zero configuration</p>
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-linear-to-r from-green-600 to-emerald-600 rounded-lg">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-white">Express.js Reference</div>
                  <div className="text-sm text-gray-400">Part of WebDev Playground</div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link>
                <Link href="/next-js-setup-reference" className="text-gray-400 hover:text-white transition-colors text-sm">Next.js</Link>
                <Link href="https://expressjs.com" className="text-gray-400 hover:text-white transition-colors text-sm">Official Docs</Link>
                <Link href="https://github.com/divyanshu-dugar" className="text-gray-400 hover:text-white transition-colors text-sm">GitHub</Link>
              </div>
            </div>
            
            <div className="text-center text-gray-500 text-sm mt-8 pt-6 border-t border-gray-800">
              Comprehensive Express.js setup reference • Always updated with best practices
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ExpressSetupReference;