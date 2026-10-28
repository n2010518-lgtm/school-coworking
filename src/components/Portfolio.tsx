import { useState } from 'react';
import { Play, Video, Headphones, Film, X, Calendar, User, Clock, Pause } from 'lucide-react';
import { portfolioItems, type PortfolioItem } from '@/data/content';

const typeConfig = {
  video: { icon: Video, label: 'Видео', color: 'from-primary-500 to-primary-700' },
  podcast: { icon: Headphones, label: 'Подкаст', color: 'from-accent-500 to-teal-600' },
  project: { icon: Film, label: 'Проект', color: 'from-teal-500 to-primary-600' },
};

export default function Portfolio() {
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <section id="portfolio" className="relative py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 rounded-full mb-4">
            Секция 4
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Портфолио медиацентра
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Проекты, подкасты и видео, созданные учениками в нашем пространстве.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => {
            const cfg = typeConfig[item.type];
            const Icon = cfg.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setSelected(item); setPlaying(false); }}
                className="group text-left glass-card rounded-2xl overflow-hidden hover:scale-[1.03] hover:shadow-2xl transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className={`relative h-44 bg-gradient-to-br ${cfg.color} overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full bg-white/30"
                        style={{
                          width: `${20 + i * 15}%`,
                          height: `${20 + i * 15}%`,
                          top: `${10 + i * 12}%`,
                          left: `${5 + i * 18}%`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all">
                      <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    {cfg.label}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-white text-xs font-mono">
                    {item.duration}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-display font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {item.author}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {item.date}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Player modal */}
      {selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelected(null)}>
          <div
            className="glass-card rounded-3xl max-w-2xl w-full shadow-2xl animate-scale-in overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Player area */}
            <div className={`relative h-56 bg-gradient-to-br ${typeConfig[selected.type].color} flex items-center justify-center`}>
              <button
                onClick={() => setPlaying(!playing)}
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all"
              >
                {playing ? (
                  <Pause className="w-7 h-7 text-white" fill="white" />
                ) : (
                  <Play className="w-7 h-7 text-white ml-1" fill="white" />
                )}
              </button>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              {/* Fake progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">
                <div
                  className="h-full bg-white/80 transition-all"
                  style={{ width: playing ? '45%' : '0%' }}
                />
              </div>
            </div>

            {/* Info */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                {(() => {
                  const cfg = typeConfig[selected.type];
                  const Icon = cfg.icon;
                  return (
                    <span className="px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-medium flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" /> {cfg.label}
                    </span>
                  );
                })()}
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {selected.duration}
                </span>
              </div>

              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">
                {selected.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                {selected.description}
              </p>

              <div className="flex items-center justify-between text-sm border-t border-slate-200 dark:border-white/10 pt-4">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <User className="w-4 h-4" /> {selected.author}
                </span>
                <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Calendar className="w-4 h-4" /> {selected.date}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
