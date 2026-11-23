import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Check, Download, Sparkles, Film, Tv, Heart, Clock } from 'lucide-react';
import { useAppStore } from '../store';
import { PosterCard } from '../components/PosterCard';
import { RatingChart } from '../components/RatingChart';
import { TitleDetailModal } from '../components/TitleDetailModal';
import { LibraryItem } from '../types';
import { useToast } from '../components/Toast';

export const Profile: React.FC = () => {
  const { profile, updateProfile, library, sections, toggleFavorite } = useAppStore();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [bannerUrl, setBannerUrl] = useState(profile.bannerUrl || '');
  const [favoriteQuote, setFavoriteQuote] = useState(profile.favoriteQuote || '');

  const [activeItem, setActiveItem] = useState<LibraryItem | null>(null);

  const ratedItems = library
    .filter((i) => i.rating !== null)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const topRated = ratedItems.slice(0, 5);

  const moviesCount = library.filter((i) => i.mediaType === 'movie').length;
  const tvCount = library.filter((i) => i.mediaType === 'tv').length;
  const animeCount = library.filter((i) => i.mediaType === 'anime').length;

  const avgScore =
    ratedItems.length > 0
      ? (ratedItems.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ratedItems.length).toFixed(1)
      : '0.0';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      username: username.trim() || 'Anonymous',
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim() || profile.avatarUrl,
      bannerUrl: bannerUrl.trim() || profile.bannerUrl,
      favoriteQuote: favoriteQuote.trim(),
    });
    setIsEditing(false);
    showToast('Profile updated successfully!');
  };

  const handleExportHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.username}'s Watch Catalog & Ratings — RatingX</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #0A0A0F; color: #FFFFFF; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 9999px; }
  </style>
</head>
<body class="p-6 md:p-12 max-w-6xl mx-auto min-h-screen">
  <!-- Profile Hero Header -->
  <div class="relative rounded-3xl overflow-hidden bg-zinc-900/90 border border-white/10 shadow-2xl mb-10">
    <div class="h-44 md:h-56 w-full bg-zinc-950 overflow-hidden relative">
      <img src="${profile.bannerUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80'}" class="w-full h-full object-cover opacity-50" />
      <div class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
    </div>
    <div class="p-6 md:p-8 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16">
      <div class="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
        <img src="${profile.avatarUrl}" class="w-28 h-28 md:w-32 md:h-32 rounded-3xl object-cover border-4 border-zinc-900 shadow-2xl shadow-purple-950/60" />
        <div>
          <h1 class="text-3xl md:text-4xl font-black">@${profile.username}</h1>
          <p class="text-zinc-400 text-sm mt-1 max-w-xl leading-relaxed">${profile.bio || 'Cinema & Anime Catalog'}</p>
          ${profile.favoriteQuote ? `<p class="text-xs text-purple-400 italic mt-2">“${profile.favoriteQuote}”</p>` : ''}
          <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-xs font-semibold">
            <span class="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">${library.length} Titles</span>
            <span class="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">★ Avg ${avgScore}/10</span>
            <span class="px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">❤️ ${library.filter((i) => i.favorite).length} Favs</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Rated Catalog Grid -->
  <div class="flex items-center justify-between mb-6">
    <h2 class="text-2xl font-black flex items-center gap-2">⭐ Rated Catalog (${ratedItems.length})</h2>
    <span class="text-xs text-zinc-500">Sorted by highest score</span>
  </div>

  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
    ${ratedItems
      .map(
        (item) => `
      <div class="rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden flex flex-col justify-between hover:border-purple-500/40 transition-all shadow-lg">
        <div class="relative aspect-[2/3] bg-zinc-950">
          <img src="${item.posterPath || ''}" class="w-full h-full object-cover" loading="lazy" />
          <div class="absolute top-2 right-2 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-xl text-amber-400 font-extrabold text-xs border border-amber-500/30">
            ★ ${item.rating !== null ? item.rating.toFixed(1) : '—'}/10
          </div>
          <div class="absolute top-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded-full text-zinc-300 text-[10px] uppercase font-bold tracking-wider">
            ${item.mediaType}
          </div>
        </div>
        <div class="p-3">
          <h3 class="font-bold text-sm truncate text-zinc-100">${item.title}</h3>
          <p class="text-xs text-zinc-400 mt-0.5">${item.year}</p>
          ${item.tags && item.tags.length > 0 ? `<div class="flex flex-wrap gap-1 mt-1.5">${item.tags.map((t: string) => `<span class="px-1.5 py-0.5 bg-white/5 rounded text-[9px] text-zinc-400">#${t}</span>`).join('')}</div>` : ''}
          ${item.note ? `<p class="mt-2 text-[11px] italic text-zinc-300 bg-black/50 p-2 rounded-lg border border-white/5">"${item.note}"</p>` : ''}
        </div>
      </div>
    `
      )
      .join('')}
  </div>

  <footer class="mt-20 pt-8 border-t border-white/10 text-center text-xs text-zinc-500 space-y-1">
    <p>Curated with <a href="https://github.com/davCreate/RatingX" class="text-purple-400 font-semibold underline">RatingX</a> — Discover, Organize & Rate Cinema and Anime.</p>
    <p>© ${new Date().getFullYear()} @${profile.username}</p>
  </footer>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.username}-ratingx-catalog.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported interactive HTML portfolio!');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Profile Banner & Info */}
      <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl">
        {/* Banner Image */}
        <div className="h-44 md:h-56 w-full bg-zinc-950 overflow-hidden relative">
          {profile.bannerUrl && (
            <img
              src={profile.bannerUrl}
              alt="Profile banner"
              className="w-full h-full object-cover opacity-50 pointer-events-none"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Content details */}
        <div className="p-6 md:p-8 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            <img
              src={profile.avatarUrl}
              alt={profile.username}
              className="w-28 h-28 md:w-32 md:h-32 rounded-3xl object-cover border-4 border-zinc-900 shadow-2xl shadow-purple-950"
            />
            <div className="space-y-1.5">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-white">@{profile.username}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Public Profile
                </span>
              </div>
              <p className="text-sm text-zinc-300 max-w-xl leading-relaxed">
                {profile.bio || 'Cinema & Anime Catalog'}
              </p>
              {profile.favoriteQuote && (
                <p className="text-xs text-purple-400 italic font-medium">
                  “{profile.favoriteQuote}”
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center md:justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
            <button
              type="button"
              onClick={handleExportHtml}
              className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Export a standalone HTML webpage you can share with friends"
            >
              <Download className="w-3.5 h-3.5" />
              Export HTML Portfolio
            </button>
          </div>
        </div>

        {/* Edit Profile Drawer */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 md:p-8 border-t border-white/10 bg-zinc-950/70"
          >
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
              <h3 className="font-bold text-sm text-white">Edit Your Public Profile</h3>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">Bio / About Me</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">Favorite Film / Anime Quote</label>
                <input
                  type="text"
                  placeholder="e.g. 'To infinity and beyond'..."
                  value={favoriteQuote}
                  onChange={(e) => setFavoriteQuote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Avatar Image URL</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Banner Image URL</label>
                  <input
                    type="url"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Save Profile
              </button>
            </form>
          </motion.div>
        )}
      </div>

      {/* Stats Breakdown & Rating Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/5 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-zinc-100 uppercase tracking-wider mb-4">
              Catalog Composition
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-white/5">
                <span className="flex items-center gap-2 text-xs font-medium text-cyan-300">
                  <Film className="w-4 h-4" /> Movies
                </span>
                <span className="font-mono text-sm font-bold text-white">{moviesCount}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-white/5">
                <span className="flex items-center gap-2 text-xs font-medium text-purple-300">
                  <Tv className="w-4 h-4" /> TV Series
                </span>
                <span className="font-mono text-sm font-bold text-white">{tvCount}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-white/5">
                <span className="flex items-center gap-2 text-xs font-medium text-pink-300">
                  <Sparkles className="w-4 h-4" /> Anime
                </span>
                <span className="font-mono text-sm font-bold text-white">{animeCount}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl text-xs text-purple-300 flex items-center gap-2">
            <Heart className="w-4 h-4 shrink-0 text-red-400 fill-red-400" />
            <span>{library.filter((i) => i.favorite).length} titles pinned to your Hall of Fame</span>
          </div>
        </div>

        {/* Rating Distribution Graph */}
        <div className="lg:col-span-2">
          <RatingChart items={library} />
        </div>
      </div>

      {/* Top 5 Hall of Fame */}
      {topRated.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Top Rated Hall of Fame
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {topRated.map((item) => (
              <PosterCard
                key={item.id}
                item={item}
                onClick={() => setActiveItem(item)}
                onToggleFavorite={() => toggleFavorite(item.id)}
                sectionName={sections.find((s) => s.id === item.sectionId)?.name}
                isLibrary
              />
            ))}
          </div>
        </section>
      )}

      {/* Title Detail Modal */}
      <TitleDetailModal
        item={activeItem}
        isOpen={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        onToast={showToast}
      />
    </div>
  );
};
