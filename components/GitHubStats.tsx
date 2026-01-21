import React, { useEffect, useState } from 'react';
import { Github, Users, BookOpen, GitFork, Activity } from 'lucide-react';

interface GitHubStatsProps {
  username: string;
}

interface GitHubUserData {
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  name: string;
  bio: string;
}

export const GitHubStats: React.FC<GitHubStatsProps> = ({ username }) => {
  const [userData, setUserData] = useState<GitHubUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch GitHub data');
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError('Could not load GitHub stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchGitHubData();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-lg animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 bg-slate-800 rounded"></div>
          <div className="h-20 bg-slate-800 rounded"></div>
          <div className="h-20 bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="bg-slate-900/50 border border-red-900/50 p-6 rounded-lg text-center">
        <p className="text-red-400 font-tech text-sm">{error || 'No data available'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Public Repos */}
        <div className="group bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 p-5 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]">
          <div className="flex items-center justify-between mb-3">
            <BookOpen className="text-cyan-500" size={24} />
            <span className="font-tech text-[10px] text-slate-500 uppercase">Repositories</span>
          </div>
          <p className="font-hero text-4xl font-bold text-white">{userData.public_repos}</p>
          <p className="text-slate-500 text-xs font-tech mt-1">PUBLIC REPOS</p>
        </div>

        {/* Followers */}
        <div className="group bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 p-5 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <div className="flex items-center justify-between mb-3">
            <Users className="text-amber-500" size={24} />
            <span className="font-tech text-[10px] text-slate-500 uppercase">Network</span>
          </div>
          <p className="font-hero text-4xl font-bold text-white">{userData.followers}</p>
          <p className="text-slate-500 text-xs font-tech mt-1">FOLLOWERS</p>
        </div>

        {/* Following */}
        <div className="group bg-slate-900/60 border border-slate-800 hover:border-green-500/50 p-5 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,197,94,0.1)]">
          <div className="flex items-center justify-between mb-3">
            <GitFork className="text-green-500" size={24} />
            <span className="font-tech text-[10px] text-slate-500 uppercase">Connections</span>
          </div>
          <p className="font-hero text-4xl font-bold text-white">{userData.following}</p>
          <p className="text-slate-500 text-xs font-tech mt-1">FOLLOWING</p>
        </div>
      </div>

      {/* Contribution Graph */}
      <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="text-cyan-500" size={18} />
          <h5 className="font-tech text-sm text-cyan-400 uppercase tracking-wider">Contribution Activity</h5>
        </div>
        <div className="overflow-x-auto">
          <img 
            src={`https://ghchart.rshah.org/06b6d4/${username}`}
            alt={`${username}'s GitHub Contribution Chart`}
            className="w-full max-w-full h-auto min-w-[600px]"
            loading="lazy"
          />
        </div>
      </div>

      {/* GitHub Profile Link */}
      <a 
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 hover:border-cyan-500 rounded transition-all text-sm font-tech text-slate-400 hover:text-cyan-400"
      >
        <Github size={16} />
        View Full Profile
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
      </a>
    </div>
  );
};
