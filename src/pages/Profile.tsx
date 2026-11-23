import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit3, Check, Download, Sparkles, Film, Tv, Heart, MapPin, Globe,
  Award, Pin, Star, Palette, Image as ImageIcon, Link as LinkIcon, Camera
} from 'lucide-react';
import { useAppStore } from '../store';
import { PosterCard } from '../components/PosterCard';
import { RatingChart } from '../components/RatingChart';
import { TitleDetailModal } from '../components/TitleDetailModal';
import { LibraryItem, SocialLinks } from '../types';
import { useToast } from '../components/Toast';

const PRESET_BANNERS = [
  { id: 'cinema', label: 'Cinema Hall', url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80' },
  { id: 'cyberpunk', label: 'Neon Cyberpunk', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80' },
  { id: 'anime', label: 'Tokyo Twilight', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80' },
  { id: 'scifi', label: 'Interstellar Nebula', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80' },
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=400&q=80',
];

const AVATAR_FRAMES = [
  { id: 'none', label: 'None', border: 'border-zinc-800' },
  { id: 'neon-purple', label: 'Violet Halo', border: 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.7)]' },
  { id: 'gold', label: 'Gold Crown', border: 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.7)]' },
  { id: 'emerald', label: 'Emerald Glow', border: 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.7)]' },
  { id: 'cyberpunk', label: 'Cyberpunk', border: 'border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.8)]' },
];

const ACCENT_COLORS = ['#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#06B6D4'];

export const Profile: React.FC = () => {
  const { profile, updateProfile, library, sections, toggleFavorite, togglePinnedFavorite } = useAppStore();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'pinned' | 'badges'>('overview');

  // Form State
  const [displayName, setDisplayName] = useState(profile.displayName || profile.username);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location || '');
  const [pronouns, setPronouns] = useState(profile.pronouns || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [avatarFrame, setAvatarFrame] = useState(profile.avatarFrame || 'none');
  const [bannerUrl, setBannerUrl] = useState(profile.bannerUrl);
  const [accentColor, setAccentColor] = useState(profile.accentColor || '#8B5CF6');
  const [favoriteQuote, setFavoriteQuote] = useState(profile.favoriteQuote || '');
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(profile.socialLinks || {});

  const [activeItem, setActiveItem] = useState<LibraryItem | null>(null);

  const ratedItems = library
    .filter((i) => i.rating !== null)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const pinnedItems = library.filter((i) => (profile.pinnedFavorites || []).includes(String(i.externalId)));

  const moviesCount = library.filter((i) => i.mediaType === 'movie').length;
  const tvCount = library.filter((i) => i.mediaType === 'tv').length;
  const animeCount = library.filter((i) => i.mediaType === 'anime').length;

  const avgScore =
    ratedItems.length > 0
      ? (ratedItems.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ratedItems.length).toFixed(1)
      : '0.0';

  // Badges Earned Check
  const badges = [
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      desc: 'Rated at least one title a flawless 10.0/10',
      unlocked: library.some((i) => i.rating === 10),
      icon: '🏆',
    },
    {
      id: 'otaku',
      title: 'Anime Otaku',
      desc: 'Rated 2 or more anime titles',
      unlocked: animeCount >= 2,
      icon: '🌸',
    },
    {
      id: 'cinephile',
      title: 'Cinema Virtuoso',
      desc: 'Collected movies across diverse genres',
      unlocked: moviesCount >= 2,
      icon: '🎬',
    },
    {
      id: 'critic',
      title: 'Prolific Critic',
      desc: 'Wrote personal notes on 3 or more titles',
      unlocked: library.filter((i) => Boolean(i.note?.trim())).length >= 3,
      icon: '✍️',
    },
  ];

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
          showToast('Avatar image loaded!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setBannerUrl(reader.result);
          showToast('Banner image loaded!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName: displayName.trim() || username.trim(),
      username: username.trim() || 'Anonymous',
      bio: bio.trim(),
      location: location.trim(),
      pronouns: pronouns.trim(),
      avatarUrl: avatarUrl.trim() || profile.avatarUrl,
      avatarFrame: avatarFrame,
      bannerUrl: bannerUrl.trim() || profile.bannerUrl,
      accentColor: accentColor,
      favoriteQuote: favoriteQuote.trim(),
      socialLinks: socialLinks,
    });
    setIsEditing(false);
    showToast('Profile fully updated and saved!');
  };

  const handleExportHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.displayName || profile.username}'s Watch Catalog — RatingX</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #0A0A0F; color: #FFFFFF; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 9999px; }
  </style>
</head>
<body class="p-6 md:p-12 max-w-6xl mx-auto min-h-screen">
  <div class="relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl mb-10">
    <div class="h-52 w-full bg-zinc-950 overflow-hidden relative">
      <img src="${profile.bannerUrl}" class="w-full h-full object-cover opacity-60" />
      <div class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
    </div>
    <div class="p-6 md:p-8 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16">
      <div class="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
        <img src="${profile.avatarUrl}" class="w-32 h-32 rounded-3xl object-cover border-4 border-zinc-900 shadow-2xl" />
        <div>
          <h1 class="text-3xl md:text-4xl font-black">${profile.displayName || profile.username}</h1>
          <p class="text-xs text-purple-400 font-mono">@${profile.username} ${profile.pronouns ? `• (${profile.pronouns})` : ''} ${profile.location ? `• 📍 ${profile.location}` : ''}</p>
          <p class="text-zinc-400 text-sm mt-2 max-w-xl">${profile.bio || 'Cinema & Anime Catalog'}</p>
          ${profile.favoriteQuote ? `<p class="text-xs text-amber-400 italic mt-2">“${profile.favoriteQuote}”</p>` : ''}
        </div>
      </div>
    </div>
  </div>

  <h2 class="text-2xl font-black mb-6">⭐ Rated Titles (${ratedItems.length})</h2>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
    ${ratedItems
      .map(
        (item) => `
      <div class="rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden flex flex-col justify-between">
        <div class="relative aspect-[2/3] bg-zinc-950">
          <img src="${item.posterPath || ''}" class="w-full h-full object-cover" />
          <div class="absolute top-2 right-2 px-2.5 py-1 bg-black/80 rounded-xl text-amber-400 font-extrabold text-xs border border-amber-500/30">
            ★ ${item.rating !== null ? item.rating.toFixed(1) : '—'}/10
          </div>
        </div>
        <div class="p-3">
          <h3 class="font-bold text-sm truncate">${item.title}</h3>
          <p class="text-xs text-zinc-400">${item.year} • ${item.mediaType.toUpperCase()}</p>
          ${item.note ? `<p class="mt-2 text-[11px] italic text-zinc-300 bg-black/50 p-2 rounded-lg">"${item.note}"</p>` : ''}
        </div>
      </div>
    `
      )
      .join('')}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.username}-ratingx-profile.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Profile exported as HTML portfolio!');
  };

  const selectedFrameClass =
    AVATAR_FRAMES.find((f) => f.id === profile.avatarFrame)?.border || 'border-zinc-800';

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Profile Banner & Identity Header */}
      <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl">
        {/* Banner */}
        <div className="h-48 md:h-64 w-full bg-zinc-950 overflow-hidden relative">
          <img
            src={profile.bannerUrl}
            alt="Profile banner"
            className="w-full h-full object-cover opacity-60 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Content details */}
        <div className="p-6 md:p-8 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-20">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            {/* Avatar with Custom Frame */}
            <div className="relative">
              <img
                src={profile.avatarUrl}
                alt={profile.displayName || profile.username}
                className={`w-32 h-32 md:w-36 md:h-36 rounded-3xl object-cover border-4 ${selectedFrameClass} transition-all duration-300 shadow-2xl`}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <h1 className="text-2xl md:text-4xl font-black text-white">
                  {profile.displayName || profile.username}
                </h1>
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono"
                  style={{ backgroundColor: `${profile.accentColor}25`, color: profile.accentColor }}
                >
                  @{profile.username}
                </span>
                {profile.pronouns && (
                  <span className="text-xs text-zinc-400">({profile.pronouns})</span>
                )}
              </div>

              {profile.location && (
                <p className="text-xs text-zinc-400 flex items-center justify-center md:justify-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                  <span>{profile.location}</span>
                </p>
              )}

              <p className="text-sm text-zinc-300 max-w-xl leading-relaxed">
                {profile.bio || 'No bio provided yet.'}
              </p>

              {profile.favoriteQuote && (
                <p className="text-xs italic font-medium" style={{ color: profile.accentColor }}>
                  “{profile.favoriteQuote}”
                </p>
              )}

              {/* Social links pills */}
              {profile.socialLinks && (
                <div className="flex items-center gap-2 pt-1 flex-wrap justify-center md:justify-start">
                  {profile.socialLinks.letterboxd && (
                    <a
                      href={profile.socialLinks.letterboxd}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-zinc-950/80 hover:bg-zinc-800 text-[11px] text-zinc-300 border border-white/5 flex items-center gap-1"
                    >
                      <Film className="w-3 h-3 text-emerald-400" /> Letterboxd
                    </a>
                  )}
                  {profile.socialLinks.mal && (
                    <a
                      href={profile.socialLinks.mal}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-zinc-950/80 hover:bg-zinc-800 text-[11px] text-zinc-300 border border-white/5 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-blue-400" /> MAL
                    </a>
                  )}
                  {profile.socialLinks.twitter && (
                    <a
                      href={profile.socialLinks.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-zinc-950/80 hover:bg-zinc-800 text-[11px] text-zinc-300 border border-white/5 flex items-center gap-1"
                    >
                      <Globe className="w-3 h-3 text-cyan-400" /> Twitter/X
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center md:justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="px-5 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditing ? 'Close Editor' : 'Customize Profile'}
            </button>
            <button
              type="button"
              onClick={handleExportHtml}
              className="px-5 py-2.5 rounded-2xl text-white text-xs font-semibold shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              style={{ backgroundColor: profile.accentColor }}
            >
              <Download className="w-3.5 h-3.5" />
              Share / Export
            </button>
          </div>
        </div>

        {/* FULL PROFILE CUSTOMIZATION SUITE DRAWER */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-6 md:p-8 border-t border-white/10 bg-zinc-950/90"
            >
              <form onSubmit={handleSaveProfile} className="space-y-6 max-w-3xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-400" />
                    Customize Profile Appearance & Identity
                  </h3>
                  <span className="text-xs text-zinc-400">All fields save locally & sync with HTML export</span>
                </div>

                {/* Identity Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">Username Handle (@)</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">Location / Country</label>
                    <input
                      type="text"
                      placeholder="e.g. Los Angeles, CA / Tokyo"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">Pronouns</label>
                    <input
                      type="text"
                      placeholder="e.g. they/them, she/her, he/him"
                      value={pronouns}
                      onChange={(e) => setPronouns(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Bio & Quote */}
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Bio / About You</label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Favorite Quote / Motto</label>
                  <input
                    type="text"
                    value={favoriteQuote}
                    onChange={(e) => setFavoriteQuote(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Avatar & Frames Customization */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-purple-400" />
                      Avatar Image & Presets
                    </label>
                    <label className="text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer">
                      Upload from Disk
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                  </div>

                  <input
                    type="url"
                    placeholder="Paste Avatar Image URL..."
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500"
                  />

                  {/* Preset Avatars */}
                  <div className="flex items-center gap-2">
                    {PRESET_AVATARS.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(av)}
                        className={`w-10 h-10 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                          avatarUrl === av ? 'ring-2 ring-purple-500 scale-110' : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={av} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  {/* Avatar Frames */}
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1.5">
                      Avatar Glow Frame
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {AVATAR_FRAMES.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setAvatarFrame(f.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            avatarFrame === f.id
                              ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                              : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Banner Customization */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-purple-400" />
                      Profile Banner
                    </label>
                    <label className="text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer">
                      Upload Banner from Disk
                      <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                    </label>
                  </div>

                  <input
                    type="url"
                    placeholder="Paste Banner Image URL..."
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500"
                  />

                  {/* Preset Banners */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_BANNERS.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBannerUrl(b.url)}
                        className={`relative h-14 rounded-xl overflow-hidden border text-xs font-semibold transition-all cursor-pointer ${
                          bannerUrl === b.url ? 'ring-2 ring-purple-500' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={b.url} alt={b.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                          {b.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profile Accent Color */}
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-2">
                    Profile Accent Theme Color
                  </label>
                  <div className="flex items-center gap-3">
                    {ACCENT_COLORS.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setAccentColor(col)}
                        className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                          accentColor === col ? 'scale-125 ring-2 ring-white shadow-lg' : 'opacity-60 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                    <LinkIcon className="w-4 h-4 text-purple-400" />
                    Social & Catalog Links
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="url"
                      placeholder="Letterboxd URL..."
                      value={socialLinks.letterboxd || ''}
                      onChange={(e) => setSocialLinks({ ...socialLinks, letterboxd: e.target.value })}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white"
                    />
                    <input
                      type="url"
                      placeholder="MyAnimeList URL..."
                      value={socialLinks.mal || ''}
                      onChange={(e) => setSocialLinks({ ...socialLinks, mal: e.target.value })}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white"
                    />
                    <input
                      type="url"
                      placeholder="Twitter / X URL..."
                      value={socialLinks.twitter || ''}
                      onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-2.5 rounded-xl text-xs font-bold text-white shadow-xl transition-all cursor-pointer flex items-center gap-1.5"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Check className="w-4 h-4" />
                    Save All Changes
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pinned 4 All-Time Favorites Spotlight */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pin className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Top 4 Pinned Favorites Spotlight
            </h2>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            {pinnedItems.length} of 4 pinned
          </span>
        </div>

        {pinnedItems.length === 0 ? (
          <div className="p-8 rounded-3xl bg-zinc-900/40 border border-dashed border-white/10 text-center space-y-2">
            <Star className="w-8 h-8 text-amber-400/60 mx-auto" />
            <h4 className="text-sm font-bold text-zinc-300">No pinned favorites yet</h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Open any title from your library and click the Pin button to highlight your top 4 all-time favorites here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {pinnedItems.map((item) => (
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
        )}
      </section>

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
            <span>{library.filter((i) => i.favorite).length} titles pinned in Favorites</span>
          </div>
        </div>

        {/* Rating Distribution Graph */}
        <div className="lg:col-span-2">
          <RatingChart items={library} />
        </div>
      </div>

      {/* Profile Badges & Milestones */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            Curator Badges & Achievements
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition-all ${
                b.unlocked
                  ? 'bg-zinc-900 border-amber-500/30 shadow-lg shadow-amber-500/10'
                  : 'bg-zinc-950/40 border-white/5 opacity-50'
              }`}
            >
              <div className="text-2xl mb-2">{b.icon}</div>
              <h4 className="font-bold text-sm text-white">{b.title}</h4>
              <p className="text-[11px] text-zinc-400 mt-1">{b.desc}</p>
              <span
                className={`inline-block mt-3 px-2 py-0.5 rounded text-[10px] font-bold ${
                  b.unlocked ? 'bg-amber-400/20 text-amber-300' : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {b.unlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </section>

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
