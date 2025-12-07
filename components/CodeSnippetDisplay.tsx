// components/CodeSnippetDisplay.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, Copy, ChevronDown, ChevronRight, Terminal, Database, Palette, Shield, Zap, FileCode, Code } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-tomorrow.css';

interface CodeSnippet {
  id: string;
  title: string;
  description?: string;
  language: string;
  code: string;
  icon?: React.ReactNode;
  tags?: string[];
  isSetup?: boolean;
  prismLanguage?: string;
}

const CodeSnippetDisplay = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'nextauth': true,
    'tailwind': false,
    'mongodb-mongoose': false,
    'mongodb-native': false,
    'swr-app': false,
    'swr-page': false
  });
  const codeBlocksRef = useRef<(HTMLPreElement | null)[]>([]);

  // Initialize Prism highlighting
  useEffect(() => {
    Prism.highlightAll();
  }, [expandedSections]);

  const snippets: CodeSnippet[] = [
    {
      id: 'nextjs-setup',
      title: 'Next.js Setup',
      description: 'Create a new Next.js application with TypeScript and Tailwind CSS',
      language: 'bash',
      prismLanguage: 'bash',
      code: `npx create-next-app@latest my-app --use-npm`,
      icon: <Terminal className="w-5 h-5 text-blue-400" />,
      tags: ['setup', 'cli'],
      isSetup: true
    },
    {
      id: 'nextauth-api-route',
      title: 'NextAuth.js API Route',
      description: 'Complete NextAuth.js configuration with multiple OAuth providers',
      language: 'typescript',
      prismLanguage: 'typescript',
      code: `import NextAuth, { type NextAuthOptions } from 'next-auth';
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
        token.id = (user as any).id;
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
export { handler as GET, handler as POST };`,
      icon: <Shield className="w-5 h-5 text-green-400" />,
      tags: ['authentication', 'oauth', 'security']
    },
    {
      id: 'nextauth-env',
      title: 'NextAuth Environment Variables',
      description: 'Required environment variables for NextAuth.js configuration',
      language: 'env',
      prismLanguage: 'bash',
      code: `# NextAuth.js
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
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret`,
      icon: <Shield className="w-5 h-5 text-green-400" />,
      tags: ['environment', 'configuration']
    },
    {
      id: 'tailwind-config',
      title: 'Tailwind CSS Configuration',
      description: 'Complete Tailwind CSS setup for Next.js',
      language: 'javascript',
      prismLanguage: 'javascript',
      code: `// File - tailwind.config.js
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
}`,
      icon: <Palette className="w-5 h-5 text-pink-400" />,
      tags: ['styling', 'configuration']
    },
    {
      id: 'tailwind-global-css',
      title: 'Global CSS with Tailwind',
      description: 'Global CSS file with Tailwind directives',
      language: 'css',
      prismLanguage: 'css',
      code: `/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }
}

@layer utilities {
  .scrollbar-thin {
    scrollbar-width: thin;
  }
  
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
}`,
      icon: <Palette className="w-5 h-5 text-pink-400" />,
      tags: ['styling', 'css']
    },
    {
      id: 'mongodb-mongoose-setup',
      title: 'MongoDB with Mongoose Setup',
      description: 'Complete MongoDB connection setup using Mongoose',
      language: 'javascript',
      prismLanguage: 'javascript',
      code: `// File: lib/dbUtils.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

mongoose.models = {}; // Avoid OverwriteModelError in dev
export const UserModel = mongoose.model('users', userSchema);

export async function mongooseConnect() {
  if (mongoose.connections[0].readyState) {
    return true; // Already connected
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    return true;
  } catch (err) {
    throw new Error(err);
  }
}`,
      icon: <Database className="w-5 h-5 text-cyan-400" />,
      tags: ['database', 'mongodb', 'orm']
    },
    {
      id: 'mongodb-crud-api',
      title: 'MongoDB CRUD API Routes',
      description: 'Complete CRUD operations with MongoDB and Next.js API routes',
      language: 'javascript',
      prismLanguage: 'javascript',
      code: `// File: app/api/users/route.js
import { mongooseConnect, UserModel } from '@/lib/dbUtils';

export async function GET() {
  try {
    await mongooseConnect();
    const users = await UserModel.find();
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  try {
    await mongooseConnect();
    const body = await request.json();
    const newUser = new UserModel(body);
    await newUser.save();
    
    return new Response(
      JSON.stringify({ message: 'User created successfully', user: newUser }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}`,
      icon: <Database className="w-5 h-5 text-cyan-400" />,
      tags: ['database', 'api', 'crud']
    },
    {
      id: 'swr-config',
      title: 'SWR Global Configuration',
      description: 'Global SWR setup with fetcher and provider',
      language: 'typescript',
      prismLanguage: 'typescript',
      code: `// lib/fetcher.ts
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
}`,
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      tags: ['data-fetching', 'caching', 'hooks']
    },
    {
      id: 'swr-usage',
      title: 'Using SWR in Components',
      description: 'How to use SWR for data fetching in React components',
      language: 'typescript',
      prismLanguage: 'typescript',
      code: `// components/UserList.tsx
'use client';

import useSWR from 'swr';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function UserList() {
  const { data: users, error, isLoading } = useSWR<User[]>('/api/users');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Error loading users: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users?.map((user) => (
        <div key={user.id} className="p-4 bg-white border rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-900">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
        </div>
      ))}
    </div>
  );
}`,
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      tags: ['data-fetching', 'react', 'hooks']
    },
    {
      id: 'package-json',
      title: 'Package.json Dependencies',
      description: 'Complete package.json with all required dependencies',
      language: 'json',
      prismLanguage: 'json',
      code: `{
  "name": "nextjs-saas-starter",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "next": "14.0.0",
    "next-auth": "^4.24.5",
    "mongoose": "^8.0.0",
    "mongodb": "^6.0.0",
    "swr": "^2.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.309.0",
    "tailwind-merge": "^2.0.0",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/mongodb": "^4.0.0",
    "@types/mongoose": "^5.0.0",
    "autoprefixer": "^10.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "14.0.0",
    "postcss": "^8.0.0",
    "prismjs": "^1.29.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.0"
  }
}`,
      icon: <FileCode className="w-5 h-5 text-orange-400" />,
      tags: ['dependencies', 'npm', 'package']
    }
  ];

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
      typescript: 'bg-blue-600',
      javascript: 'bg-yellow-600',
      bash: 'bg-gray-700',
      json: 'bg-amber-600',
      css: 'bg-pink-600',
      env: 'bg-emerald-600',
      default: 'bg-purple-600'
    };
    return colors[language] || colors.default;
  };

  const getLanguageIcon = (language: string) => {
    const icons: Record<string, React.ReactNode> = {
      typescript: <Code className="w-4 h-4" />,
      javascript: <Code className="w-4 h-4" />,
      bash: <Terminal className="w-4 h-4" />,
      json: <FileCode className="w-4 h-4" />,
      css: <Palette className="w-4 h-4" />,
      env: <Shield className="w-4 h-4" />,
    };
    return icons[language] || <Code className="w-4 h-4" />;
  };

  const sectionGroups = [
    {
      id: 'nextauth',
      title: 'NextAuth.js Configuration',
      icon: Shield,
      color: 'text-green-400',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'tailwind',
      title: 'Tailwind CSS Setup',
      icon: Palette,
      color: 'text-pink-400',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      id: 'mongodb-mongoose',
      title: 'MongoDB with Mongoose',
      icon: Database,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200'
    },
    {
      id: 'swr-app',
      title: 'SWR Configuration',
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-linear-to-r from-purple-600 to-blue-600 rounded-2xl mb-6">
            <FileCode className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Web Development Snippets
          </h1>
          <p className="text-gray-400 mt-4 text-lg max-w-3xl mx-auto">
            A collection of production-ready code snippets with beautiful syntax highlighting
          </p>
        </div>

        {/* Setup Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-black-200 mb-6 flex items-center gap-3">
            <Terminal className="w-6 h-6 text-blue-400" />
            Quick Setup Commands
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snippets.filter(s => s.isSetup).map(snippet => (
              <div
                key={snippet.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 border border-gray-700 hover:border-blue-500/50 group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {snippet.icon}
                      <h3 className="font-semibold text-gray-200 group-hover:text-white transition-colors">
                        {snippet.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => copyToClipboard(snippet.code, snippet.id)}
                      className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors group/copy"
                      title="Copy to clipboard"
                    >
                      {copiedId === snippet.id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400 group-hover/copy:text-white" />
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
                    </div>
                    <pre className="bg-gray-900/80 border border-gray-700 rounded-xl p-4 overflow-x-auto text-sm scrollbar-thin group-hover/code:border-gray-600 transition-colors">
                      <code className={`language-${snippet.prismLanguage}`}>
                        {snippet.code}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6">
          {sectionGroups.map(section => {
            const Icon = section.icon;
            const sectionSnippets = snippets.filter(s => 
              s.id.includes(section.id.split('-')[0]) && !s.isSetup
            );

            if (sectionSnippets.length === 0) return null;

            return (
              <div key={section.id} className={`${section.bgColor} rounded-2xl shadow-2xl border ${section.borderColor} border-opacity-30 overflow-hidden`}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-800/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${section.color}`} />
                    <h2 className="text-xl font-bold text-black group-hover:text-white transition-colors">
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
                  <div className="p-6 pt-5 space-y-6">
                    {sectionSnippets.map((snippet, index) => (
                      <div key={snippet.id} className="border border-gray-700 rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm">
                        <div className="px-6 py-4 border-b border-gray-800 bg-linear-to-r from-gray-900 to-gray-800">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              {snippet.icon}
                              <div>
                                <h3 className="font-semibold text-gray-200">{snippet.title}</h3>
                                {snippet.description && (
                                  <p className="text-gray-400 text-sm mt-1">{snippet.description}</p>
                                )}
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getLanguageColor(snippet.language)} flex items-center gap-1`}>
                                {getLanguageIcon(snippet.language)}
                                {snippet.language}
                              </span>
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
                                  <span className="text-sm text-gray-300">Copy Code</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute top-0 left-0 right-0 h-8 bg-linear-to-b from-gray-900 to-transparent pointer-events-none" />
                          <pre 
  ref={el => {
    if (el && codeBlocksRef.current) {
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

        {/* Footer Stats */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700">
              <div className="text-3xl font-bold text-purple-400">{snippets.length}</div>
              <div className="text-gray-400 text-sm mt-2">Total Snippets</div>
            </div>
            <div className="text-center p-6 bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700">
              <div className="text-3xl font-bold text-blue-400">
                {Array.from(new Set(snippets.flatMap(s => s.tags || []))).length}
              </div>
              <div className="text-gray-400 text-sm mt-2">Technologies</div>
            </div>
            <div className="text-center p-6 bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700">
              <div className="text-3xl font-bold text-green-400">
                {Array.from(new Set(snippets.map(s => s.language))).length}
              </div>
              <div className="text-gray-400 text-sm mt-2">Languages</div>
            </div>
            <div className="text-center p-6 bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700">
              <div className="text-3xl font-bold text-cyan-400">
                {snippets.filter(s => s.isSetup).length}
              </div>
              <div className="text-gray-400 text-sm mt-2">Quick Setups</div>
            </div>
          </div>
          
          {/* Prism Theme Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Syntax highlighting powered by <span className="text-purple-400">Prism.js</span> with the <span className="text-blue-400">&quot;prism-tomorrow&quot;</span> theme
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippetDisplay;