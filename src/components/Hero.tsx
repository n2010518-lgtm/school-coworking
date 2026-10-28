import { ArrowRight, Camera, Mic, Users, Zap, TrendingUp, Calendar } from 'lucide-react';

const stats = [
  { icon: Zap, value: '0%', label: 'Пустующих стен', color: 'from-accent-400 to-teal-400' },
  { icon: Camera, value: '15+', label: 'Единиц профоборудования', color: 'from-primary-400 to-primary-600' },
  { icon: TrendingUp, value: '3 мес.', label: 'Окупаемость проекта', color: 'from-teal-400 to-accent-500' },
];

export default function Hero() {
  const scrollTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 bg-gradient-hero dark:bg-slate-950">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent-500/15 dark:bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-glow-pulse" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                AI-Стартап для школы
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6">
              Nexus Space
              <span className="block text-gradient mt-2">Школьный Коворкинг & Медиацентр</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-lg leading-relaxed">
              Пространство для твоих идей, подкастов и стартапов. Превращаем пустующие школьные помещения в многофункциональный центр для учеников.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollTo('#coworking')}
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 hover:scale-105 transition-all"
              >
                <Calendar className="w-5 h-5" />
                Забронировать место
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollTo('#media')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 glass rounded-xl hover:scale-105 transition-all"
              >
                <Camera className="w-5 h-5" />
                Арендовать студию/технику
              </button>
            </div>
          </div>

          {/* Visual panel */}
          <div className="hidden lg:block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <div className="glass-card rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-700/20 p-6 border border-primary-500/20">
                    <Users className="w-8 h-8 text-primary-500 mb-3" />
                    <p className="text-sm text-slate-600 dark:text-slate-300">Коворкинг зоны</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">3 зоны</p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-accent-500/20 to-teal-500/20 p-6 border border-accent-500/20">
                    <Mic className="w-8 h-8 text-accent-500 mb-3" />
                    <p className="text-sm text-slate-600 dark:text-slate-300">Медиацентр</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">Студия</p>
                  </div>
                  <div className="col-span-2 rounded-2xl bg-gradient-to-br from-primary-600/10 to-accent-600/10 p-6 border border-white/10">
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Активные зоны</p>
                    <div className="flex items-end gap-1 h-20">
                      {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-gradient-to-t from-primary-500 to-accent-400"
                          style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-accent-400 to-teal-500 rounded-2xl blur-xl opacity-40 animate-glow-pulse" />
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:scale-105 transition-transform animate-fade-in-up"
              style={{ animationDelay: `${0.4 + i * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
