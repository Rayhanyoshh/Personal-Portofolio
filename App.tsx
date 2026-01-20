import React, { useState, useEffect } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { PortfolioData, Section } from './types';
import { suggestMissingInfo } from './services/geminiService';
import { PanelLeft, Eye, Maximize2, RefreshCw, Cpu } from 'lucide-react';

const INITIAL_DATA: PortfolioData = {
  fullName: 'Rayhan Yoshara',
  title: 'Software Developer',
  bio: 'Experienced software developer with a strong background in the .NET Framework and full-stack development. Specializing in building robust industrial systems and automating workflows. Committed to delivering high-quality, efficient, and scalable software solutions.',
  email: 'rayhanyosh@gmail.com',
  linkedin: 'https://www.linkedin.com/in/rayhanyoshara',
  github: '',
  skills: ['Node.js', 'Vue.js', 'Next.js', '.NET 8', 'C#', 'SQL Server', 'MySQL', 'Python', 'SignalR', 'TypeScript', 'Tailwind CSS'],
  experiences: [
    {
      id: '1',
      role: 'Software Developer',
      company: 'PT Global Papua Abadi',
      period: 'May 2025 - Present',
      description: 'Automated Purchase Request processes using Node.js and Lark API. Built automation middleware for processing Excel attachments. Developed frontend web applications using Vue.js for media monitoring and salary portals.'
    },
    {
      id: '2',
      role: '.NET Developer',
      company: 'PT. Realta Chakradarma',
      period: 'May 2023 - May 2025',
      description: 'Developed Bimasakti Property & Tenancy Management System. Constructed backend and frontend using .NET technologies. Managed data with SQL Server. Integrated external services via Web API.'
    }
  ],
  projects: [
    {
      id: 'p4',
      title: 'Daimler Andon System',
      role: 'Full Stack Developer',
      description: 'Real-time Factory Management Dashboard (Andon) designed to enhance operational efficiency. Features live production monitoring using SignalR, dynamic RBAC, and interactive data visualization. Built with Monorepo architecture (Next.js 16 & .NET 8), incorporating industrial-grade security (JWT) and hybrid database synchronization (Cloud/Local).',
      tags: ['Next.js 16', '.NET 8', 'SignalR', 'MySQL', 'TypeScript', 'Tailwind CSS 4'],
      link: ''
    },
    {
      id: 'p1',
      title: 'Field Data Collection Ecosystem',
      role: 'Lead Full Stack Developer',
      description: 'Led end-to-end development of a field data collection system including a Python/SQL Server backend and Vue.js monitoring website for real-time data validation and management. Integrated with geospatial APIs (ArcGIS).',
      tags: ['Python', 'SQL Server', 'Vue.js', 'ArcGIS'],
      link: ''
    },
    {
      id: 'p2',
      title: 'Purchase Request Automation Service',
      role: 'Backend Developer',
      description: 'Automated the Purchase Request (PR) process across three companies (GPA, MNM, MNT) by building a Node.js backend service that integrates the Lark API with Accurate accounting software.',
      tags: ['Node.js', 'Lark API', 'Accurate', 'Automation'],
      link: ''
    },
    {
      id: 'p3',
      title: 'Foreman Work Proof Middleware',
      role: 'Automation Engineer',
      description: 'Built an intelligent automation middleware for the Foreman\'s Work Proof (BKM) process. The system reads and processes Excel attachments directly from Lark, significantly reducing manual labor and human error.',
      tags: ['Node.js', 'Excel Processing', 'Lark Integration'],
      link: ''
    }
  ]
};

const App: React.FC = () => {
  const [data, setData] = useState<PortfolioData>(INITIAL_DATA);
  const [activeSection, setActiveSection] = useState<Section>(Section.PERSONAL);
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [aiAdvice, setAiAdvice] = useState<string>("");
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);

  // Auto-generate advice when data changes significantly (debounced ideally, but simplified here)
  useEffect(() => {
    const timer = setTimeout(() => {
        // Only generate advice if we are missing key fields
        const isMissingEssentials = !data.fullName || !data.bio || data.projects.length === 0;
        
        if (process.env.API_KEY && isMissingEssentials && !aiAdvice) {
            handleGetAdvice();
        }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleGetAdvice = async () => {
    setIsGeneratingAdvice(true);
    const advice = await suggestMissingInfo(data);
    setAiAdvice(advice);
    setIsGeneratingAdvice(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black text-gray-200">
      
      {/* Top Bar - Tech/Cockpit Look */}
      <nav className="h-14 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4 shrink-0 shadow-lg z-50">
        <div className="flex items-center gap-2 text-white font-bold tracking-tight font-sans">
            <div className="w-8 h-8 bg-cyan-600 rounded flex items-center justify-center text-white shadow-[0_0_10px_#0891b2]">
                <Cpu size={20} />
            </div>
            <span className="tracking-wider uppercase text-sm md:text-base">PortoBuilder <span className="text-cyan-500">MK-II</span></span>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-900 p-1 rounded border border-gray-800">
             <button 
                onClick={() => setViewMode('editor')}
                className={`p-2 rounded transition-all ${viewMode === 'editor' ? 'bg-cyan-900/50 text-cyan-400 shadow-[0_0_5px_rgba(6,182,212,0.5)]' : 'text-gray-500 hover:text-cyan-200'}`}
                title="Editor Protocol"
             >
                <PanelLeft size={16} />
             </button>
             <button 
                onClick={() => setViewMode('split')}
                className={`hidden md:block p-2 rounded transition-all ${viewMode === 'split' ? 'bg-cyan-900/50 text-cyan-400 shadow-[0_0_5px_rgba(6,182,212,0.5)]' : 'text-gray-500 hover:text-cyan-200'}`}
                title="Split Configuration"
             >
                <div className="flex gap-0.5">
                    <div className={`w-1.5 h-3 border border-current rounded-[1px] ${viewMode === 'split' ? 'bg-current opacity-50' : ''}`}></div>
                    <div className={`w-1.5 h-3 border border-current rounded-[1px] ${viewMode === 'split' ? 'bg-current' : ''}`}></div>
                </div>
             </button>
             <button 
                onClick={() => setViewMode('preview')}
                className={`p-2 rounded transition-all ${viewMode === 'preview' ? 'bg-cyan-900/50 text-cyan-400 shadow-[0_0_5px_rgba(6,182,212,0.5)]' : 'text-gray-500 hover:text-cyan-200'}`}
                title="Launch Preview"
             >
                <Eye size={16} />
             </button>
        </div>

        <button 
            onClick={handleGetAdvice}
            disabled={isGeneratingAdvice}
            className="text-xs font-mono bg-cyan-700/20 border border-cyan-600 hover:bg-cyan-600/30 text-cyan-300 px-3 py-1.5 rounded flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_10px_#0891b2]"
        >
            <RefreshCw size={12} className={isGeneratingAdvice ? "animate-spin" : ""} />
            {isGeneratingAdvice ? "SCANNING..." : "AI DIAGNOSTIC"}
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Editor Panel */}
        <div className={`
            flex-1 overflow-hidden transition-all duration-300 bg-gray-900
            ${viewMode === 'preview' ? 'hidden' : 'block'}
            ${viewMode === 'split' ? 'w-1/2 max-w-[50vw]' : 'w-full'}
        `}>
            <Editor 
                data={data} 
                onChange={setData} 
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                aiAdvice={aiAdvice}
            />
        </div>

        {/* Preview Panel */}
        <div className={`
            flex-1 bg-black overflow-hidden transition-all duration-300 border-l border-gray-800
            ${viewMode === 'editor' ? 'hidden' : 'block'}
            ${viewMode === 'split' ? 'w-1/2' : 'w-full'}
        `}>
            <Preview data={data} />
        </div>

      </div>
    </div>
  );
};

export default App;