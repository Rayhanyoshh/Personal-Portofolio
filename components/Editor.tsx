import React, { useState } from 'react';
import { PortfolioData, Project, Experience, Section } from '../types';
import { Plus, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { refineText } from '../services/geminiService';

interface EditorProps {
  data: PortfolioData;
  onChange: (newData: PortfolioData) => void;
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  aiAdvice: string;
}

export const Editor: React.FC<EditorProps> = ({ data, onChange, activeSection, setActiveSection, aiAdvice }) => {
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  const handleInputChange = (field: keyof PortfolioData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleAIEnhance = async (field: keyof PortfolioData, currentValue: string, context: string) => {
    if (!currentValue) return;
    setLoadingAI(field as string);
    const refined = await refineText(currentValue, context);
    onChange({ ...data, [field]: refined });
    setLoadingAI(null);
  };

  const addSkill = () => {
    onChange({ ...data, skills: [...data.skills, 'New Skill'] });
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...data.skills];
    newSkills[index] = value;
    onChange({ ...data, skills: newSkills });
  };

  const removeSkill = (index: number) => {
    onChange({ ...data, skills: data.skills.filter((_, i) => i !== index) });
  };

  // Projects Handlers
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: 'New Project',
      role: 'Developer',
      description: '',
      tags: [],
    };
    onChange({ ...data, projects: [...data.projects, newProject] });
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    onChange({
      ...data,
      projects: data.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    });
  };

  const removeProject = (id: string) => {
    onChange({ ...data, projects: data.projects.filter(p => p.id !== id) });
  };

  const handleProjectEnhance = async (id: string, text: string) => {
     if (!text) return;
     setLoadingAI(`project-${id}`);
     const refined = await refineText(text, "Project Description");
     updateProject(id, 'description', refined);
     setLoadingAI(null);
  }

  // Experience Handlers
  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      role: 'Role',
      company: 'Company',
      period: '2023 - Present',
      description: ''
    };
    onChange({ ...data, experiences: [...data.experiences, newExp] });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange({
      ...data,
      experiences: data.experiences.map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experiences: data.experiences.filter(e => e.id !== id) });
  };

    const handleExperienceEnhance = async (id: string, text: string) => {
     if (!text) return;
     setLoadingAI(`exp-${id}`);
     const refined = await refineText(text, "Job Experience Description");
     updateExperience(id, 'description', refined);
     setLoadingAI(null);
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-100 border-r border-gray-800">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-800 overflow-x-auto">
            {Object.values(Section).map(section => (
                <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                        activeSection === section 
                        ? 'text-indigo-400 border-b-2 border-indigo-400 bg-gray-800' 
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                    }`}
                >
                    {section}
                </button>
            ))}
        </div>

        {/* AI Suggestions Panel */}
        {aiAdvice && (
            <div className="m-4 p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-lg flex gap-3">
                <AlertCircle className="text-indigo-400 shrink-0" size={20} />
                <div className="text-sm text-indigo-200">
                    <p className="font-semibold mb-1">AI Coach Suggestions:</p>
                    <div className="whitespace-pre-wrap leading-relaxed">{aiAdvice}</div>
                </div>
            </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {activeSection === Section.PERSONAL && (
                <div className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Full Name</label>
                        <input 
                            type="text" 
                            value={data.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="e.g. Budi Santoso"
                        />
                    </div>
                     <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Professional Title</label>
                        <input 
                            type="text" 
                            value={data.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="e.g. Full Stack Developer"
                        />
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Professional Bio</label>
                            <button 
                                onClick={() => handleAIEnhance('bio', data.bio, 'Professional Biography')}
                                disabled={!data.bio}
                                className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                            >
                                <Sparkles size={12} />
                                {loadingAI === 'bio' ? 'Refining...' : 'AI Polish'}
                            </button>
                        </div>
                        <textarea 
                            value={data.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none h-32"
                            placeholder="Describe yourself..."
                        />
                    </div>
                    <div className="space-y-4 pt-4 border-t border-gray-800">
                        <h3 className="font-semibold text-gray-300">Contact Info</h3>
                        <input 
                            type="email" 
                            value={data.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white text-sm"
                            placeholder="Email Address"
                        />
                         <input 
                            type="text" 
                            value={data.linkedin || ''}
                            onChange={(e) => handleInputChange('linkedin', e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white text-sm"
                            placeholder="LinkedIn URL"
                        />
                        <input 
                            type="text" 
                            value={data.github || ''}
                            onChange={(e) => handleInputChange('github', e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white text-sm"
                            placeholder="GitHub URL"
                        />
                    </div>
                </div>
            )}

            {activeSection === Section.SKILLS && (
                <div className="space-y-4">
                    <p className="text-sm text-gray-400 mb-4">List your technical skills and tools.</p>
                    <div className="grid grid-cols-2 gap-3">
                        {data.skills.map((skill, idx) => (
                            <div key={idx} className="flex gap-2">
                                <input 
                                    type="text"
                                    value={skill}
                                    onChange={(e) => updateSkill(idx, e.target.value)}
                                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white"
                                />
                                <button onClick={() => removeSkill(idx)} className="text-gray-500 hover:text-red-400">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={addSkill}
                        className="w-full py-2 border-2 border-dashed border-gray-700 text-gray-500 rounded hover:border-indigo-500 hover:text-indigo-400 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Add Skill
                    </button>
                </div>
            )}

            {activeSection === Section.PROJECTS && (
                <div className="space-y-8">
                     {data.projects.map((project) => (
                         <div key={project.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 space-y-3">
                             <div className="flex justify-between items-start">
                                 <input 
                                    className="bg-transparent border-b border-transparent hover:border-gray-600 focus:border-indigo-500 text-lg font-bold text-white focus:outline-none w-full"
                                    value={project.title}
                                    onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                                    placeholder="Project Title"
                                 />
                                 <button onClick={() => removeProject(project.id)} className="text-gray-500 hover:text-red-400 ml-2">
                                    <Trash2 size={18} />
                                </button>
                             </div>
                             
                             <input 
                                className="w-full bg-transparent border-b border-gray-700 hover:border-gray-600 focus:border-indigo-500 text-sm text-indigo-400 focus:outline-none pb-1"
                                value={project.role}
                                onChange={(e) => updateProject(project.id, 'role', e.target.value)}
                                placeholder="Your Role (e.g. Lead Developer)"
                             />

                             <div className="relative">
                                <textarea 
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-sm text-gray-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none min-h-[5rem]"
                                    value={project.description}
                                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                                    placeholder="What did you build? What tech stack did you use?"
                                />
                                <button 
                                    onClick={() => handleProjectEnhance(project.id, project.description)}
                                    disabled={!project.description}
                                    className="absolute bottom-2 right-2 p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 disabled:opacity-0 transition-opacity"
                                    title="AI Polish Description"
                                >
                                    {loadingAI === `project-${project.id}` ? <span className="animate-spin">⌛</span> : <Sparkles size={14} />}
                                </button>
                             </div>
                             <div className="grid grid-cols-2 gap-2">
                                <input 
                                    placeholder="Demo / Repository URL"
                                    className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-xs text-gray-300"
                                    value={project.link || ''}
                                    onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                                />
                                <input 
                                    placeholder="Tags (comma separated)"
                                    className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-xs text-gray-300"
                                    value={project.tags.join(', ')}
                                    onChange={(e) => updateProject(project.id, 'tags', e.target.value.split(',').map(t => t.trim()))}
                                />
                             </div>
                         </div>
                     ))}
                     <button 
                        onClick={addProject}
                        className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-indigo-400 font-medium rounded flex items-center justify-center gap-2 transition-colors"
                    >
                        <Plus size={18} /> Add New Project
                    </button>
                </div>
            )}

            {activeSection === Section.EXPERIENCE && (
                <div className="space-y-8">
                    {data.experiences.map((exp) => (
                         <div key={exp.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 space-y-3">
                             <div className="flex justify-between items-start mb-2">
                                 <div className="space-y-1 w-full">
                                    <input 
                                        className="bg-transparent border-b border-transparent hover:border-gray-600 focus:border-indigo-500 font-bold text-white focus:outline-none w-full"
                                        value={exp.role}
                                        onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                                        placeholder="Job Role"
                                    />
                                    <div className="flex gap-2">
                                        <input 
                                            className="bg-transparent text-sm text-indigo-400 focus:outline-none w-1/2"
                                            value={exp.company}
                                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                            placeholder="Company Name"
                                        />
                                        <input 
                                            className="bg-transparent text-sm text-gray-500 text-right focus:outline-none w-1/2"
                                            value={exp.period}
                                            onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                                            placeholder="Period (e.g. 2020-2022)"
                                        />
                                    </div>
                                 </div>
                                 <button onClick={() => removeExperience(exp.id)} className="text-gray-500 hover:text-red-400 ml-2">
                                    <Trash2 size={18} />
                                </button>
                             </div>
                             <div className="relative">
                                <textarea 
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-sm text-gray-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none min-h-[5rem]"
                                    value={exp.description}
                                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                    placeholder="What were your responsibilities and achievements?"
                                />
                                <button 
                                    onClick={() => handleExperienceEnhance(exp.id, exp.description)}
                                    disabled={!exp.description}
                                    className="absolute bottom-2 right-2 p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 disabled:opacity-0 transition-opacity"
                                    title="AI Polish Description"
                                >
                                    {loadingAI === `exp-${exp.id}` ? <span className="animate-spin">⌛</span> : <Sparkles size={14} />}
                                </button>
                             </div>
                         </div>
                     ))}
                     <button 
                        onClick={addExperience}
                        className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-indigo-400 font-medium rounded flex items-center justify-center gap-2 transition-colors"
                    >
                        <Plus size={18} /> Add Experience
                    </button>
                </div>
            )}

        </div>
    </div>
  );
};