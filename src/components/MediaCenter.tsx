import { useState } from 'react';
import { Camera, Mic, Lightbulb, CheckCircle2, Loader2, X, Send, Star } from 'lucide-react';
import { equipmentList, type Equipment } from '@/data/content';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';

const iconMap = { Camera, Mic, Lightbulb };

const categoryLabels: Record<string, string> = {
  all: 'Всё оборудование',
  camera: 'Камеры',
  audio: 'Аудио',
  lighting: 'Освещение',
};

const purposeOptions = [
  'Школьные новости',
  'Видео для хакатона',
  'Подкаст',
  'Учебный проект',
  'Другое',
];

export default function MediaCenter() {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<string>('all');
  const [requestItem, setRequestItem] = useState<Equipment | null>(null);
  const [purpose, setPurpose] = useState('');
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const filtered = filter === 'all' ? equipmentList : equipmentList.filter((e) => e.category === filter);

  function openRequest(item: Equipment) {
    setRequestItem(item);
    setPurpose('');
    setName('');
    setClassName('');
    setErrors({});
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!purpose) e.purpose = 'Выберите цель';
    if (!name.trim()) e.name = 'Введите имя';
    if (!className.trim()) e.className = 'Укажите класс';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate() || !requestItem) return;
    setSubmitting(true);
    const { error } = await supabase
      .from('equipment_requests')
      .insert({
        equipment_id: requestItem.id,
        equipment_name: requestItem.name,
        purpose,
        student_name: name.trim(),
        class_name: className.trim(),
        status: 'pending',
      });

    setSubmitting(false);
    if (error) {
      setErrors({ submit: 'Не удалось отправить запрос. Попробуйте ещё раз.' });
      showToast('error', 'Ошибка', 'Не удалось отправить запрос оборудования.');
      return;
    }
    setRequestItem(null);
    showToast('success', 'Запрос отправлен!', `Заявка на «${requestItem.name}» принята на рассмотрение.`);
  }

  return (
    <section id="media" className="relative py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-500/10 rounded-full mb-4">
            Секция 2
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Медиацентр и Прокат оборудования
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Профессиональная техника для подкастов, видео и фото. Бесплатно для школьных проектов.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filter === key
                  ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg shadow-primary-500/30'
                  : 'glass-card text-slate-600 dark:text-slate-300 hover:scale-105'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Equipment cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            return (
              <div
                key={item.id}
                className="group glass-card rounded-2xl overflow-hidden hover:scale-[1.03] hover:shadow-2xl transition-all duration-300"
              >
                {/* Visual header */}
                <div className="relative h-40 bg-gradient-to-br from-primary-600/20 via-accent-600/15 to-teal-500/20 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="w-20 h-20 text-primary-500/30 group-hover:scale-110 group-hover:text-primary-500/50 transition-all duration-500" />
                  </div>
                  {item.freeForSchool && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-accent-500 text-white text-xs font-semibold shadow-lg">
                      Бесплатно для школы
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3 h-3 fill-accent-400 text-accent-400" />
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  <ul className="space-y-1.5 mb-5">
                    {item.specs.map((spec, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent-500 flex-shrink-0" />
                        {spec}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {item.price}
                    </span>
                    <span className="text-xs text-slate-400">
                      {item.category === 'camera' ? 'Камера' : item.category === 'audio' ? 'Аудио' : 'Свет'}
                    </span>
                  </div>

                  <button
                    onClick={() => openRequest(item)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Запросить оборудование
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Request modal */}
      {requestItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setRequestItem(null)}>
          <div
            className="glass-card rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Запрос оборудования</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{requestItem.name}</p>
              </div>
              <button onClick={() => setRequestItem(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Цель съёмки</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-2 text-slate-900 dark:text-white outline-none transition-colors ${
                    errors.purpose ? 'border-red-400' : 'border-slate-200 dark:border-white/10 focus:border-primary-500'
                  }`}
                >
                  <option value="">Выберите цель</option>
                  {purposeOptions.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.purpose && <p className="text-xs text-red-500 mt-1">{errors.purpose}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Имя ученика</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Например: Бекзат"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-2 text-slate-900 dark:text-white outline-none transition-colors placeholder:text-slate-400 ${
                    errors.name ? 'border-red-400' : 'border-slate-200 dark:border-white/10 focus:border-primary-500'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Класс</label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Например: 11-А"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-2 text-slate-900 dark:text-white outline-none transition-colors placeholder:text-slate-400 ${
                    errors.className ? 'border-red-400' : 'border-slate-200 dark:border-white/10 focus:border-primary-500'
                  }`}
                />
                {errors.className && <p className="text-xs text-red-500 mt-1">{errors.className}</p>}
              </div>
            </div>

            {errors.submit && <p className="text-sm text-red-500 mt-4">{errors.submit}</p>}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-60"
            >
              {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Отправка...</> : <>Отправить запрос <Send className="w-4 h-4" /></>}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
