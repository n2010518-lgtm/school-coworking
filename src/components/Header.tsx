import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, Sparkles, Shield } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

type NavAction = {
  label: string;
  href?: string;
  action?: 'admin';
};

const navLinks: NavAction[] = [
  { label: 'Коворкинг', href: '#coworking' },
  { label: 'Афиша', href: '#events' },
  { label: 'Медиацентр', href: '#media' },
  { label: 'Калькулятор', href: '#calculator' },
  { label: 'Портфолио', href: '#portfolio' },
];

export default function Header({ onAdminClick }: { onAdminClick: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-lg shadow-primary-900/5 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <button onClick={() => scrollTo('#hero')} className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <span className="font-display font-bold text-lg text-slate-900 dark:text-white block leading-tight">
              Nexus Space
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              Коворкинг & Медиацентр
            </span>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => link.href && scrollTo(link.href)}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-all"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={onAdminClick}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-all flex items-center gap-1.5"
          >
            <Shield className="w-4 h-4" /> Админ
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:scale-110 transition-transform text-slate-700 dark:text-slate-200"
            aria-label="Переключить тему"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => scrollTo('#coworking')}
            className="hidden sm:inline-flex px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:scale-105 transition-all"
          >
            Забронировать
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 rounded-lg glass flex items-center justify-center text-slate-700 dark:text-slate-200"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden mt-3 mx-4 glass rounded-2xl p-4 animate-scale-in origin-top">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => link.href && scrollTo(link.href)}
              className="block w-full text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-all"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { onAdminClick(); setMenuOpen(false); }}
            className="block w-full text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-all flex items-center gap-2"
          >
            <Shield className="w-4 h-4" /> Админ
          </button>
        </nav>
      )}
    </header>
  );
}
