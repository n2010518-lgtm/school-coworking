import { Sparkles, Github, Mail, Heart } from 'lucide-react';

export default function Footer() {
  const scrollTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="relative bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-slate-900 dark:text-white block leading-tight">
                  Nexus Space
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Коворкинг & Медиацентр
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              Превращаем школьные помещения в пространство для идей, подкастов и стартапов. AI-стартап для школьного хакатона.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Навигация</h4>
            <ul className="space-y-2">
              {[
                { label: 'Коворкинг', href: '#coworking' },
                { label: 'Медиацентр', href: '#media' },
                { label: 'Калькулятор окупаемости', href: '#calculator' },
                { label: 'Портфолио', href: '#portfolio' },
              ].map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Контакты</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-110 hover:text-primary-500 transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-110 hover:text-primary-500 transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Школьный хакатон 2026
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © 2026 Nexus Space. Все права защищены.
          </p>
          <p className="text-sm text-slate-400 flex items-center gap-1.5">
            Сделано с <Heart className="w-4 h-4 text-red-400 fill-red-400" /> для школы
          </p>
        </div>
      </div>
    </footer>
  );
}
