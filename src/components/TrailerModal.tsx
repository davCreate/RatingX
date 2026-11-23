import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Play } from 'lucide-react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  trailerUrl?: string | null;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({ isOpen, onClose, title, trailerUrl }) => {
  if (!isOpen) return null;

  // Extract youtube video id if standard URL
  let embedUrl: string | null = null;
  if (trailerUrl) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = trailerUrl.match(regExp);
    if (match && match[2].length === 11) {
      embedUrl = `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
    }
  }

  const searchUrl = trailerUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' official trailer')}`;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/80">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-purple-400 fill-purple-400" />
              <h3 className="font-bold text-sm text-white truncate max-w-md">
                Trailer: {title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={searchUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 flex items-center gap-1.5 border border-white/5 transition-colors"
              >
                <span>Open in YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Video Container */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={`${title} Trailer`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="text-center p-8 space-y-4">
                <Play className="w-16 h-16 text-purple-500 mx-auto opacity-75" />
                <h4 className="text-base font-bold text-white">Direct trailer embed not found</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Click the button below to watch the official high-resolution trailer on YouTube.
                </p>
                <a
                  href={searchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Watch on YouTube
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
