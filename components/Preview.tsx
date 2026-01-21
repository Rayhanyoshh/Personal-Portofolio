import React from 'react';
import { PortfolioData } from '../types';
import { Mail, Linkedin, Github, ExternalLink, Activity, Cpu, Database, Terminal, Shield, Copy } from 'lucide-react';
import { TerminalHero } from './TerminalHero';
import { VantaBackground } from './VantaBackground';
import { GitHubStats } from './GitHubStats';
import { ScrollAnimation } from './ScrollAnimation';
import { Parallax } from './Parallax';
import { TiltCard } from './TiltCard';
import { SkillProgress } from './SkillProgress';
import { useToast } from './Toast';

interface PreviewProps {
  data: PortfolioData;
}

// Extract username from GitHub URL
const extractGitHubUsername = (url: string): string => {
  if (!url) return '';
  const match = url.match(/github\.com\/([^\/]+)/);
  return match ? match[1] : '';
};

export const Preview: React.FC<PreviewProps> = ({ data }) => {
  const githubUsername = extractGitHubUsername(data.github);
  const { showToast } = useToast();

  const copyEmailToClipboard = async () => {
    if (data.email) {
      try {
        await navigator.clipboard.writeText(data.email);
        showToast('success', 'Email copied to clipboard!');
      } catch (err) {
        showToast('error', 'Failed to copy email');
      }
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-950 text-slate-100 font-sans relative selection:bg-cyan-500 selection:text-black">
      {/* HUD Overlay Effects */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent z-50 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 p-4 font-tech text-[10px] text-cyan-800 opacity-50 pointer-events-none z-50">
        SYS.VER.3.0.1 // ONLINE
      </div>

      {/* Header / HUD Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_#06b6d4]"></div>
                <h1 className="font-hero font-bold text-xl tracking-widest uppercase text-slate-200">
                    {data.fullName ? data.fullName.split(' ')[0] : "USER"}<span className="text-cyan-500">.LOG</span>
                </h1>
            </div>
            <nav className="flex gap-6 font-tech text-xs tracking-widest text-cyan-500/80">
                <a href="#about" className="hover:text-cyan-400 hover:shadow-[0_0_8px_#06b6d4] transition-all">[ IDENTITY ]</a>
                <a href="#projects" className="hover:text-cyan-400 hover:shadow-[0_0_8px_#06b6d4] transition-all">[ SCHEMATICS ]</a>
                <a href="#experience" className="hover:text-cyan-400 hover:shadow-[0_0_8px_#06b6d4] transition-all">[ LOGS ]</a>
            </nav>
        </div>
      </header>

      {/* Hero Section with Vanta Background */}
      <VantaBackground>
        <section id="about" className="min-h-[80vh] flex flex-col justify-center items-center py-20 px-6">
          <TerminalHero 
            fullName={data.fullName || "Unknown User"}
            title={data.title || "System Operator"}
            bio={data.bio || "No biography data detected."}
          />
          
          {/* Social Links */}
          <div className="flex gap-4 mt-8 z-10">
            {data.email && (
              <>
                <a href={`mailto:${data.email}`} className="group relative px-6 py-2 bg-slate-900/80 overflow-hidden font-tech text-cyan-400 text-sm border border-cyan-500/30 hover:border-cyan-400 transition-all tech-border backdrop-blur-sm">
                  <div className="absolute inset-0 w-0 bg-cyan-500/10 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
                  <span className="relative flex items-center gap-2"><Mail size={16} /> INITIALIZE_COMMS</span>
                </a>
                <button
                  onClick={copyEmailToClipboard}
                  className="p-2 text-slate-400 hover:text-cyan-400 transition-colors border border-slate-700 hover:border-cyan-400 rounded-sm bg-slate-900/80 backdrop-blur-sm group"
                  title="Copy email to clipboard"
                >
                  <Copy size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </>
            )}
            {data.github && (
              <a href={data.github} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-white transition-colors border border-slate-700 hover:border-white rounded-sm bg-slate-900/80 backdrop-blur-sm">
                <Github size={20} />
              </a>
            )}
            {data.linkedin && (
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-cyan-400 transition-colors border border-slate-700 hover:border-cyan-400 rounded-sm bg-slate-900/80 backdrop-blur-sm">
                <Linkedin size={20} />
              </a>
            )}
          </div>
        </section>
      </VantaBackground>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-24">

        {/* Skills / System Capabilities */}
        <ScrollAnimation animation="fade-up">
          <section id="skills" className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                   <div className="h-[1px] flex-1 bg-slate-800"></div>
                   <h4 className="font-hero text-2xl font-bold text-slate-200 flex items-center gap-2 uppercase tracking-widest">
                      <Cpu className="text-cyan-500 animate-pulse" /> System Capabilities
                  </h4>
                  <div className="h-[1px] flex-1 bg-slate-800"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.skills.length > 0 ? (
                      data.skills.map((skill, index) => {
                          // Define skill levels (you can customize this)
                          const skillLevels: Record<string, number> = {
                            'Node.js': 90,
                            'Vue.js': 85,
                            'Next.js': 88,
                            '.NET 8': 92,
                            'C#': 90,
                            'SQL Server': 85,
                            'MySQL': 83,
                            'Python': 80,
                            'SignalR': 85,
                            'TypeScript': 87,
                            'Tailwind CSS': 90,
                          };
                          
                          return (
                            <SkillProgress
                              key={index}
                              skill={skill}
                              level={skillLevels[skill] || 75}
                              yearsOfExperience={index < 4 ? 2 : 1} // Customize as needed
                              index={index}
                            />
                          );
                      })
                  ) : (
                      <span className="text-slate-600 font-tech">AWAITING DATA INPUT...</span>
                  )}
              </div>
          </section>
        </ScrollAnimation>

        {/* GitHub Stats Section */}
        {githubUsername && (
          <ScrollAnimation animation="fade-up" delay={100}>
            <section id="github" className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[1px] flex-1 bg-slate-800"></div>
                <h4 className="font-hero text-2xl font-bold text-slate-200 flex items-center gap-2 uppercase tracking-widest">
                  <Github className="text-cyan-500" /> GitHub Activity
                </h4>
                <div className="h-[1px] flex-1 bg-slate-800"></div>
              </div>
              
              <GitHubStats username={githubUsername} />
            </section>
          </ScrollAnimation>
        )}

        {/* Experience / Mission Logs */}
        <ScrollAnimation animation="fade-up" delay={200}>
          <section id="experience" className="space-y-10">
            <h4 className="font-hero text-3xl font-bold text-white flex items-center gap-3 border-b border-slate-800 pb-4">
                <Activity className="text-amber-500" /> MISSION LOGS
            </h4>
            
            <div className="relative space-y-12 pl-4 md:pl-0">
                {/* Timeline Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-slate-800 hidden md:block"></div>

                {data.experiences.length > 0 ? (
                    data.experiences.map((exp, index) => (
                        <div key={exp.id} className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                            
                            {/* Central Node */}
                            <div className="absolute left-0 md:left-1/2 w-4 h-4 -translate-x-[5px] md:-translate-x-1/2 mt-1.5 bg-slate-950 border-2 border-amber-500 rounded-full z-10 shadow-[0_0_10px_#f59e0b]"></div>

                            <div className="flex-1 ml-6 md:ml-0">
                                <div className={`bg-slate-900/40 p-6 border-l-2 ${index % 2 === 0 ? 'border-l-amber-500/50' : 'border-l-cyan-500/50'} hover:bg-slate-800/40 transition-colors relative`}>
                                     {/* Tech Decoration */}
                                     <div className="absolute top-0 right-0 p-2 opacity-20">
                                        <div className="w-16 h-16 border-t border-r border-white rounded-tr-lg"></div>
                                     </div>

                                    <div className="flex flex-col mb-3">
                                        <span className="font-tech text-xs text-amber-500 mb-1">TIMESTAMP: {exp.period}</span>
                                        <h5 className="font-hero text-xl font-bold text-white uppercase tracking-wide">{exp.role}</h5>
                                        <p className="text-sm font-tech text-slate-400">@ {exp.company}</p>
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed border-t border-slate-800/50 pt-3">
                                        {exp.description}
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1 hidden md:block"></div> 
                        </div>
                    ))
                ) : (
                    <p className="text-slate-600 font-tech">NO LOGS FOUND...</p>
                )}
            </div>
        </section>
        </ScrollAnimation>

        {/* Projects / Schematics */}
        <ScrollAnimation animation="fade-up" delay={300}>
          <section id="projects" className="space-y-10">
            <h4 className="font-hero text-3xl font-bold text-white flex items-center gap-3">
                <Database className="text-cyan-500" /> PROJECT SCHEMATICS
            </h4>
            
            <div className="grid grid-cols-1 gap-8">
                {data.projects.length > 0 ? (
                    data.projects.map((project) => (
                        <TiltCard key={project.id}>
                          <div className="group relative bg-slate-900 border border-slate-800 tech-border hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300">
                            
                            {/* Hover Scanline Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden tech-border z-0">
                                <div className="absolute top-0 w-full h-[2px] bg-cyan-400/50 shadow-[0_0_10px_#06b6d4] animate-[scanline_2s_linear_infinite]"></div>
                            </div>

                            <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row gap-6">
                                
                                {/* Left: Technical Header */}
                                <div className="md:w-1/3 space-y-4 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-6">
                                    <div>
                                        <span className="font-tech text-[10px] text-cyan-500 uppercase tracking-widest">PROJECT_ID: {project.id.toUpperCase()}</span>
                                        <h5 className="font-hero text-2xl font-bold text-white uppercase leading-tight mt-1 group-hover:text-cyan-400 transition-colors">
                                            {project.title}
                                        </h5>
                                    </div>
                                    
                                    {project.role && (
                                        <div className="bg-slate-800/50 px-3 py-2 border-l-2 border-amber-500">
                                            <p className="font-tech text-[10px] text-slate-400 uppercase">ASSIGNED ROLE</p>
                                            <p className="font-bold text-amber-500 text-sm tracking-wide">{project.role}</p>
                                        </div>
                                    )}

                                    {project.link && (
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-tech text-slate-400 hover:text-cyan-400 transition-colors mt-2">
                                            <ExternalLink size={14} /> ACCESS REPOSITORY
                                        </a>
                                    )}
                                </div>

                                {/* Right: Details & Terminal View */}
                                <div className="md:w-2/3 flex flex-col">
                                    <div className="flex-1 font-mono text-sm text-slate-300 leading-relaxed bg-black/30 p-4 rounded border border-slate-800/50 mb-4">
                                        <div className="flex gap-1.5 mb-2 opacity-50">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                                        </div>
                                        <p className="text-cyan-500/80 mb-2 font-tech text-xs">$ cat description.txt</p>
                                        {project.description}
                                        <span className="animate-pulse inline-block w-2 h-4 bg-cyan-500 ml-1 align-middle"></span>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="font-tech text-[10px] text-slate-500 uppercase tracking-widest">TECH_STACK_MODULES_LOADED:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.map((tag, i) => (
                                                <span key={i} className="px-2 py-1 bg-cyan-950/50 border border-cyan-900 text-cyan-400 text-xs font-tech rounded-sm uppercase tracking-wider hover:bg-cyan-900/30 transition-colors">
                                                    [{tag}]
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Corner Accents */}
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/30 group-hover:border-cyan-400 transition-colors rounded-tr-[10px]"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/30 group-hover:border-cyan-400 transition-colors rounded-bl-[10px]"></div>
                        </div>
                        </TiltCard>
                    ))
                ) : (
                    <div className="p-10 border border-dashed border-slate-800 text-center font-tech text-slate-600">
                        // NO SCHEMATICS UPLOADED //
                    </div>
                )}
            </div>
          </section>
        </ScrollAnimation>

        {/* Footer */}
        <footer id="contact" className="pt-20 pb-10 text-center border-t border-slate-800 bg-gradient-to-t from-black to-transparent">
            <h2 className="font-hero text-3xl font-bold text-white mb-8 tracking-widest">ESTABLISH CONNECTION</h2>
            <div className="flex justify-center gap-6 mb-8">
                 {data.email ? (
                    <a href={`mailto:${data.email}`} className="text-xl font-tech text-cyan-500 hover:text-cyan-300 hover:shadow-[0_0_15px_#06b6d4] transition-all">
                        {`< ${data.email} />`}
                    </a>
                 ) : (
                     <span className="text-slate-600">OFFLINE</span>
                 )}
            </div>
            <p className="text-slate-600 text-xs font-tech tracking-widest">
                SYSTEM COPYRIGHT © {new Date().getFullYear()} {data.fullName.toUpperCase() || "USER"}. ALL RIGHTS RESERVED.
            </p>
        </footer>
      </main>
    </div>
  );
};