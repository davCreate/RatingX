import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { ToastProvider } from './components/Toast';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Library } from './pages/Library';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { useAppStore } from './store';

export const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // '/' focuses search if not typing in an input
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        navigate('/search');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const themeStyle =
    theme === 'oled'
      ? 'bg-black text-white'
      : theme === 'cyberpunk'
      ? 'bg-[#0E061E] text-pink-50'
      : 'bg-[#0A0A0F] text-zinc-100';

  return (
    <ToastProvider>
      <div className={`flex h-screen w-screen overflow-hidden ${themeStyle} font-sans selection:bg-purple-600 selection:text-white`}>
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 h-screen overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="min-h-full pb-16"
            >
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/library" element={<Library />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </ToastProvider>
  );
};
