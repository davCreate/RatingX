import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, User, Settings, Sparkles, Folder } from 'lucide-react';
import { useAppStore } from '../store';

export const Sidebar: React.FC = () => {
  const { sections, library, profile } = useAppStore();

  const ratedCount = library.filter((i) => i.rating !== null).length;

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/search', label: 'Search & Explore', icon: Search },
    { to: '/library', label: 'My Library', icon: Library, badge: library.length },
    { to: '/profile', label: 'Public Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0E0E14] border-r border-white/5 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-zinc-200 to-purple-400 bg-clip-text text-transparent">
              RatingX
            </span>
            <span className="block text-[10px] font-semibold tracking-widest text-purple-400 uppercase">
              0-10 Catalog
            </span>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="px-3 py-2 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-black/40 text-zinc-300">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Custom Sections Quick List */}
        <div className="px-6 pt-6 pb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            My Folders ({sections.length})
          </span>
        </div>

        <div className="px-3 space-y-0.5 max-h-48 overflow-y-auto">
          {sections.map((sec) => {
            const count = library.filter((i) => i.sectionId === sec.id).length;
            return (
              <NavLink
                key={sec.id}
                to={`/library?section=${sec.id}`}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                    isActive
                      ? 'bg-white/10 text-purple-300 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-2 truncate">
                  <span>{sec.icon}</span>
                  <span className="truncate">{sec.name}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">{count}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* User Profile Mini Footer */}
      <div className="p-4 border-t border-white/5 m-3 rounded-2xl bg-zinc-950/50">
        <NavLink to="/profile" className="flex items-center gap-3 group">
          <img
            src={profile.avatarUrl}
            alt={profile.username}
            className="w-9 h-9 rounded-full object-cover border border-purple-500/30 group-hover:border-purple-400 transition-colors"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-200 truncate group-hover:text-purple-300 transition-colors">
              @{profile.username}
            </p>
            <p className="text-[10px] text-zinc-400">
              {ratedCount} titles rated
            </p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};
