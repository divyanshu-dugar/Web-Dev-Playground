// app/page.tsx
'use client';

import { useState } from 'react';
import { 
  Terminal, 
  Database, 
  Code2, 
  GitBranch, 
  BookOpen, 
  ExternalLink, 
  Search, 
  Filter,
  Zap,
  Shield,
  Palette,
  Server,
  Layers,
  FileCode,
  Globe,
  Cpu,
  Cloud,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ResourceCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  linear: string;
  tags: string[];
  link: string;
  stats?: {
    snippets: number;
    lastUpdated: string;
  };
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const resources: ResourceCard[] = [
    {
      id: 'nextjs',
      title: 'Next.js',
      description: 'Complete Next.js configuration with TypeScript, Tailwind, Auth, Database, and more.',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-blue-400',
      linear: 'from-blue-500 to-cyan-500',
      tags: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Auth'],
      link: '/next-js',
      stats: {
        snippets: 24,
        lastUpdated: '2 days ago'
      }
    },
    {
      id: 'express',
      title: 'Express.js Setup & API Development',
      description: 'Express.js server setup, middleware, routing, authentication, and REST API patterns.',
      icon: <Server className="w-6 h-6" />,
      color: 'text-green-400',
      linear: 'from-green-500 to-emerald-500',
      tags: ['Express', 'Node.js', 'REST API', 'Middleware', 'Authentication'],
      link: '/express-setup-reference',
      stats: {
        snippets: 18,
        lastUpdated: '1 week ago'
      }
    },
    {
      id: 'git',
      title: 'Git & GitHub Commands',
      description: 'Essential Git commands, workflows, branching strategies, and GitHub best practices.',
      icon: <GitBranch className="w-6 h-6" />,
      color: 'text-orange-400',
      linear: 'from-orange-500 to-red-500',
      tags: ['Git', 'GitHub', 'Version Control', 'Commands', 'Workflow'],
      link: '/git-commands',
      stats: {
        snippets: 32,
        lastUpdated: '3 days ago'
      }
    },
    {
      id: 'library',
      title: 'Web Development Library',
      description: 'Collection of useful libraries, tools, components, and development resources.',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'text-purple-400',
      linear: 'from-purple-500 to-pink-500',
      tags: ['Libraries', 'Tools', 'Components', 'Resources'],
      link: '/web-dev-library',
      stats: {
        snippets: 45,
        lastUpdated: 'Yesterday'
      }
    },
    {
      id: 'databases',
      title: 'Database Integration',
      description: 'MongoDB, PostgreSQL setup, ORMs, connection pooling, and query optimization.',
      icon: <Database className="w-6 h-6" />,
      color: 'text-cyan-400',
      linear: 'from-cyan-500 to-blue-500',
      tags: ['MongoDB', 'PostgreSQL', 'ORM', 'Database', 'Queries'],
      link: '/databases',
      stats: {
        snippets: 28,
        lastUpdated: '4 days ago'
      }
    },
    {
      id: 'authentication',
      title: 'Authentication & Security',
      description: 'NextAuth, JWT, OAuth, sessions, role-based access control, and security best practices.',
      icon: <Shield className="w-6 h-6" />,
      color: 'text-yellow-400',
      linear: 'from-yellow-500 to-amber-500',
      tags: ['Auth', 'Security', 'NextAuth', 'JWT', 'OAuth'],
      link: '/authentication',
      stats: {
        snippets: 16,
        lastUpdated: '1 week ago'
      }
    },
    {
      id: 'styling',
      title: 'Styling & UI Components',
      description: 'Tailwind CSS, component libraries, animation libraries, and responsive design patterns.',
      icon: <Palette className="w-6 h-6" />,
      color: 'text-pink-400',
      linear: 'from-pink-500 to-rose-500',
      tags: ['Tailwind', 'CSS', 'UI', 'Components', 'Animation'],
      link: '/styling',
      stats: {
        snippets: 22,
        lastUpdated: '2 days ago'
      }
    },
    {
      id: 'deployment',
      title: 'Deployment & DevOps',
      description: 'Vercel, Docker, CI/CD, environment variables, monitoring, and performance optimization.',
      icon: <Cloud className="w-6 h-6" />,
      color: 'text-indigo-400',
      linear: 'from-indigo-500 to-purple-500',
      tags: ['Deployment', 'DevOps', 'Docker', 'CI/CD', 'Vercel'],
      link: '/deployment',
      stats: {
        snippets: 19,
        lastUpdated: '5 days ago'
      }
    }
  ];

  const filters = [
    { id: 'all', label: 'All Topics' },
    { id: 'frontend', label: 'Frontend', topics: ['nextjs', 'styling'] },
    { id: 'backend', label: 'Backend', topics: ['express', 'databases', 'authentication'] },
    { id: 'tools', label: 'Tools', topics: ['git', 'library', 'deployment'] }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeFilter === 'all') return matchesSearch;
    
    const filter = filters.find(f => f.id === activeFilter);
    return matchesSearch && filter?.topics?.includes(resource.id);
  });

  const totalSnippets = resources.reduce((sum, resource) => sum + (resource.stats?.snippets || 0), 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
      
      <div className="relative">
        {/* Header */}
        <header className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg">
                    <Terminal className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Web-Development Playground
                    </h1>
                    <p className="text-gray-400 mt-1">Your personal web development knowledge base</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                  <div className="text-2xl font-bold text-white">{totalSnippets}+</div>
                  <div className="text-sm text-gray-400">Code Snippets</div>
                </div>
                <div className="h-8 w-px bg-gray-800 hidden md:block" />
                <button className="px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Add New Resource
                </button>
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
                  <div className="text-2xl font-bold text-white">{resources.length}</div>
                  <div className="text-sm text-gray-400">Topics</div>
                </div>
                <Layers className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">{totalSnippets}</div>
                  <div className="text-sm text-gray-400">Snippets</div>
                </div>
                <FileCode className="w-8 h-8 text-green-400" />
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">{Array.from(new Set(resources.flatMap(r => r.tags))).length}</div>
                  <div className="text-sm text-gray-400">Technologies</div>
                </div>
                <Cpu className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">Active</div>
                  <div className="text-sm text-gray-400">Always Updated</div>
                </div>
                <Globe className="w-8 h-8 text-yellow-400" />
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
                  placeholder="Search topics, snippets, or technologies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {filters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                      activeFilter === filter.id
                        ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white'
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

          {/* Resource Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Knowledge Base</h2>
              <div className="text-gray-400 text-sm">
                Showing {filteredResources.length} of {resources.length} topics
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map(resource => (
                <div
                  key={resource.id}
                  className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-linear-to-r ${resource.linear}`}>
                      {resource.icon}
                    </div>
                    <div className="flex items-center gap-2">
                      {resource.stats && (
                        <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-medium">
                          {resource.stats.snippets} snippets
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {resource.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                    {resource.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {resource.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-medium">
                        +{resource.tags.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div className="text-xs text-gray-500">
                      Updated {resource.stats?.lastUpdated}
                    </div>
                    <a
                      href={resource.link}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors group/link"
                    >
                      Explore
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredResources.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex p-4 bg-gray-800/50 rounded-2xl mb-4">
                  <Search className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No resources found</h3>
                <p className="text-gray-400">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-blue-500/50 transition-colors text-left group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Code2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="font-medium text-white">Create New Snippet</div>
                </div>
                <p className="text-sm text-gray-400">Add a new code snippet to any topic</p>
              </button>
              
              <button className="p-4 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-green-500/50 transition-colors text-left group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <BookOpen className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="font-medium text-white">Import from GitHub</div>
                </div>
                <p className="text-sm text-gray-400">Import snippets from your GitHub repositories</p>
              </button>
              
              <button className="p-4 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-purple-500/50 transition-colors text-left group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <ExternalLink className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="font-medium text-white">Export All Resources</div>
                </div>
                <p className="text-sm text-gray-400">Export your entire knowledge base as JSON/Markdown</p>
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Terminal className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-white">WebDev Playground</div>
                  <div className="text-sm text-gray-400">Personal knowledge base for web developers</div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Documentation</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">GitHub</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a>
              </div>
            </div>
            
            <div className="text-center text-gray-500 text-sm mt-8 pt-6 border-t border-gray-800">
              Built with Next.js, Tailwind CSS, and ❤️ by Web Developers
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}