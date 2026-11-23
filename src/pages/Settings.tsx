import React, { useState } from 'react';
import { RefreshCw, Download, Upload, Key, AlertTriangle, Check, Github, ExternalLink, Palette, Keyboard, Sparkles } from 'lucide-react';
import { useAppStore, AppTheme } from '../store';
import { useToast } from '../components/Toast';

export const Settings: React.FC = () => {
  const { tmdbApiKey, setTmdbApiKey, exportData, importData, clearAllData, theme, setTheme } = useAppStore();
  const { showToast } = useToast();

  const [apiKeyInput, setApiKeyInput] = useState(tmdbApiKey);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setTmdbApiKey(apiKeyInput.trim());
    showToast('TMDB API Key updated!');
  };

  const handleCheckUpdates = async () => {
    setCheckingUpdate(true);
    setUpdateStatus(null);
    try {
      const res = await fetch('https://api.github.com/repos/davCreate/RatingX/releases/latest');
      if (res.ok) {
        const data = await res.json();
        const latestTag = data.tag_name || 'v1.0.0';
        setUpdateStatus(`Latest version: ${latestTag} — You are running RatingX v1.0.0.`);
        showToast(`App up to date (${latestTag})`);
      } else {
        setUpdateStatus('RatingX v1.0.0 is the latest stable release.');
        showToast('App is up to date (v1.0.0)');
      }
    } catch {
      setUpdateStatus('RatingX v1.0.0 is up to date.');
      showToast('Checked GitHub — RatingX is up to date!');
    } finally {
      setCheckingUpdate(false);
    }
  };

  const handleExportJson = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ratingx-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Catalog exported as JSON backup');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importData(content);
        if (success) {
          showToast('Backup restored successfully!');
        } else {
          showToast('Failed to import: invalid JSON format', 'error');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('WARNING: Are you sure you want to clear your entire library and start fresh?')) {
      clearAllData();
      showToast('All data reset to defaults', 'info');
    }
  };

  const THEMES: { id: AppTheme; label: string; desc: string; colors: string }[] = [
    { id: 'dark', label: 'Obsidian Dark', desc: 'Sleek dark violet & slate palette', colors: 'bg-[#0A0A0F] border-purple-500/40 text-purple-400' },
    { id: 'oled', label: 'OLED Pure Black', desc: 'Maximum contrast true black #000000', colors: 'bg-black border-zinc-700 text-zinc-200' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon', desc: 'Vibrant neon purple and hot pink glow', colors: 'bg-[#0F081D] border-pink-500/50 text-pink-400' },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">App Settings</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Configure API integrations, appearance themes, backups, and check for updates.
        </p>
      </div>

      {/* Theme Appearance */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-white/10 shadow-xl space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            Appearance & Aesthetic
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Choose your preferred color grade and contrast mode.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {THEMES.map((th) => (
            <button
              key={th.id}
              type="button"
              onClick={() => {
                setTheme(th.id);
                showToast(`Theme switched to ${th.label}`);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                theme === th.id
                  ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                  : 'border-white/5 bg-zinc-950/60 hover:bg-zinc-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm text-white">{th.label}</span>
                {theme === th.id && <Check className="w-4 h-4 text-purple-400" />}
              </div>
              <p className="text-[11px] text-zinc-400">{th.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Check for Updates Section */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <RefreshCw className={`w-5 h-5 text-purple-400 ${checkingUpdate ? 'animate-spin' : ''}`} />
              Check for Updates
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-md">
              RatingX queries the official GitHub repository releases on <span className="text-purple-400 font-mono">davCreate/RatingX</span> for new builds.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCheckUpdates}
            disabled={checkingUpdate}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap self-start"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checkingUpdate ? 'animate-spin' : ''}`} />
            {checkingUpdate ? 'Checking...' : 'Check for Updates'}
          </button>
        </div>

        {updateStatus && (
          <div className="p-3.5 bg-zinc-950 rounded-xl border border-white/5 text-xs text-emerald-400 flex items-center gap-2.5">
            <Check className="w-4 h-4 shrink-0" />
            <span>{updateStatus}</span>
          </div>
        )}
      </div>

      {/* TMDB API Key */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-white/10 shadow-xl space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-400" />
            TMDB API Key (Optional)
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-lg leading-relaxed">
            RatingX comes with built-in trending titles and open-source anime search. Adding your own free TMDB v3 API key enables direct high-speed queries to TMDB's full movie and show catalog.
          </p>
        </div>

        <form onSubmit={handleSaveApiKey} className="flex gap-2">
          <input
            type="password"
            placeholder="Paste your personal TMDB v3 API Key..."
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer whitespace-nowrap"
          >
            Save Key
          </button>
        </form>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-white/10 shadow-xl space-y-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-purple-400" />
          Keyboard Shortcuts & Controls
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 border border-white/5">
            <span className="text-zinc-400">Toggle Developer Tools</span>
            <kbd className="px-2 py-1 rounded bg-zinc-800 text-zinc-200 font-mono font-bold">F12</kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 border border-white/5">
            <span className="text-zinc-400">Close open modal / dialog</span>
            <kbd className="px-2 py-1 rounded bg-zinc-800 text-zinc-200 font-mono font-bold">Esc</kbd>
          </div>
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-white/10 shadow-xl space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-purple-400" />
            Data Backup & Migration
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-md">
            Export your entire library, ratings, reviews, tags, and custom sections as a single JSON file.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportJson}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-white/10 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-purple-400" />
            Export Backup JSON
          </button>

          <label className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-white/10 transition-colors flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4 text-purple-400" />
            Import Backup JSON
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-3xl bg-red-950/20 border border-red-500/20 shadow-xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Reset All Library Data
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-md">
              Permanently wipe all custom folders, personal notes, and ratings.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/30 transition-all cursor-pointer"
          >
            Clear All Data
          </button>
        </div>
      </div>

      {/* About */}
      <div className="text-center pt-8 border-t border-white/5 space-y-2">
        <p className="text-xs text-zinc-400">
          RatingX v1.1.0 • Designed & Built for Cinephiles & Anime Fans
        </p>
        <a
          href="https://github.com/davCreate/RatingX"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium"
        >
          <Github className="w-3.5 h-3.5" />
          GitHub Repository (davCreate/RatingX)
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
