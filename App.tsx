import React, { useState } from 'react';
import { Preview } from './components/Preview';
import { PortfolioData } from './types';
import { CursorFollower } from './components/CursorFollower';
import { MatrixRain } from './components/MatrixRain';
import { FloatingIcons } from './components/FloatingIcons';
import { ParticleExplosion } from './components/ParticleExplosion';
import { ToastProvider } from './components/Toast';
import { ReadingProgress } from './components/ReadingProgress';
import { KonamiCode, EasterEggModal } from './components/KonamiCode';

const INITIAL_DATA: PortfolioData = {
  fullName: 'Rayhan Yoshara',
  title: 'Software Developer',
  bio: 'Software developer specializing in digital transformation for sugar plantation and manufacturing industries. Experienced in building end-to-end systems for operational monitoring, workflow automation, and data-driven decision support using .NET and modern full-stack technologies. Committed to delivering scalable, efficient, and production-ready solutions for industrial environments.',
  email: 'rayhanyoshara@gmail.com',
  linkedin: 'https://www.linkedin.com/in/rayhanyoshara',
  github: 'https://github.com/Rayhanyoshh',
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
      tags: ['Next.js 16', '.NET 8', 'SignalR', 'MySQL', 'TypeScript', 'Tailwind CSS 4', 'Jotai', 'Zod', 'Recharts'],
      link: ''
    },
    {
      id: 'p5',
      title: 'Dangae Kanban Barcode System',
      role: 'Full Stack Developer',
      description: 'Digital Kanban inventory management system integrated with barcode scanning for real-time tracking on the production floor (Gemba). Features "Switch Matrix" for dynamic flow configuration, dual-layer security (User + Device Auth), and Final Inspection modules. Built with high-performance asynchronous Python backend (FastAPI) to handle concurrent scanning operations.',
      tags: ['FastAPI', 'Python', 'Next.js', 'TypeScript', 'MySQL', 'SQLAlchemy', 'Alembic'],
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
import { CyberpunkDino } from './components/CyberpunkDino';
import { Gamepad2 } from 'lucide-react';
import { FaviconManager } from './components/FaviconManager';
import demoGif from './components/project-preview.gif';

const App: React.FC = () => {
  const [data] = useState<PortfolioData>({
    ...INITIAL_DATA,
    projects: INITIAL_DATA.projects.map(p => ({ ...p, image: demoGif }))
  });
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [showGame, setShowGame] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-black text-gray-200">
        {/* Animated Favicon */}
        <FaviconManager />
        
        {/* Reading Progress Bar */}
        <ReadingProgress />
        
        {/* Konami Code */}
        <KonamiCode onUnlock={() => {
          console.log('Unlock triggered in App');
          setShowEasterEgg(true);
        }} />
        
        {/* Easter Egg Modal */}
        {showEasterEgg && <EasterEggModal onClose={() => setShowEasterEgg(false)} />}
        
        {/* Cyberpunk Dino Game Modal */}
        {showGame && <CyberpunkDino onClose={() => setShowGame(false)} />}
        
        {/* Interactive Animations */}
        <CursorFollower />
        <MatrixRain />
        <FloatingIcons />
        <ParticleExplosion />
        
        {/* Main Portfolio Content */}
        <Preview data={data} />
        
        {/* Floating Game Button */}
        <button
          onClick={() => setShowGame(true)}
          className="fixed bottom-6 right-6 z-[100] p-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all hover:scale-110 animate-[bounce_2s_infinite]"
          title="Play Cyberpunk Dino"
        >
          <Gamepad2 size={24} />
        </button>
      </div>
    </ToastProvider>
  );
};

export default App;