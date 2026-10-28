import { useState, useEffect } from 'react';
import {
  Calendar, Clock, MapPin, User, Loader2, X, CheckCircle2,
  Mic, Brain, Rocket, Video, Users,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';

type Event = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  max_seats: number;
  registered: number;
  speaker: string | null;
};

const categoryConfig: Record<string, { icon: typeof Mic; label: string; color: string }> = {
  workshop: { icon: Mic, label: 'Воркшоп', color: 'from-primary-500 to-primary-700' },
  lecture: { icon: Brain, label: 'Лекция', color: 'from-accent-500 to-teal-600' },
  meetup: { icon: Rocket, label: 'Митап', color: 'from-teal-500 to-primary-600' },
};

export default function Events() {
  const { showToast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [signupEvent, setSignupEvent] = useState<Event | null>(null);
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    if (data) setEvents(data as Event[]);
    setLoading(false);
  }

  function openSignup(event: Event) {
    setSignupEvent(event);
    setName('');
    setClassName('');
    setErrors({});
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Введите имя';
    if (!className.trim()) e.className = 'Укажите класс';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSignup() {
    if (!validate() || !signupEvent) return;
    if (signupEvent.registered >= signupEvent.max_seats) {
      showToast('error', 'Мест нет', 'Все места на это событие уже заняты.');
      return;
    }
    setSubmitting(true);

    const { error: insertError } = await supabase
      .from('event_signups')
      .insert({
        event_id: signupEvent.id,
        student_name: name.trim(),
        class_name: className.trim(),
      });

    if (insertError) {
      setSubmitting(false);
      setErrors({ submit: 'Не удалось записаться. Попробуйте ещё раз.' });
      return;
    }

    const newRegistered = signupEvent.registered + 1;
    const { error: updateError } = await supabase
      .from('events')
      .update({ registered: newRegistered })
      .eq('id', signupEvent.id);

    setSubmitting(false);

    if (updateError) {
      showToast('error', 'Ошибка', 'Запись создана, но счётчик не обновлён.');
    } else {
      setEvents((prev) =>
        prev.map((e) => (e.id === signupEvent.id ? { ...e, registered: newRegistered } : e))
      );
      showToast('success', 'Вы записаны!', `Событие: ${signupEvent.title}. Осталось мест: ${signupEvent.max_seats - newRegistered}`);
    }

    setSignupEvent(null);
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <section id="events" className="relative py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-500/10 rounded-full mb-4">
            Афиша мероприятий
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Расписание событий и мастер-классов
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Воркшопы, лекции и митапы прямо в школьном коворкинге. Записывайся, пока есть места.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : events.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Пока нет запланированных событий</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event) => {
              const cfg = categoryConfig[event.category] || categoryConfig.workshop;
              const Icon = cfg.icon;
              const seatsLeft = event.max_seats - event.registered;
              const isFull = seatsLeft <= 0;
              const fillPercent = (event.registered / event.max_seats) * 100;
              const isPast = event.date < today;

              return (
                <div
                  key={event.id}
                  className="group glass-card rounded-2xl overflow-hidden hover:scale-[1.02] hover:shadow-2xl transition-all duration-300"
                >
                  {/* Header */}
                  <div className={`relative h-28 bg-gradient-to-br ${cfg.color} overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute rounded-full bg-white/30"
                          style={{
                            width: `${30 + i * 20}%`,
                            height: `${30 + i * 20}%`,
                            top: `${5 + i * 20}%`,
                            left: `${10 + i * 25}%`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-between px-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-5 h-5 text-white" />
                          <span className="text-xs font-medium text-white/90 uppercase tracking-wider">{cfg.label}</span>
                        </div>
                        <p className="text-white font-display text-lg font-bold">
                          {new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} · {event.time}
                        </p>
                      </div>
                      {isFull && (
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
                          Заполнено
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mb-4">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                      {event.speaker && (
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {event.speaker}</span>
                      )}
                    </div>

                    {/* Seats progress */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> Свободные места
                        </span>
                        <span className={`text-xs font-bold ${isFull ? 'text-red-500' : seatsLeft <= 3 ? 'text-amber-500' : 'text-accent-600 dark:text-accent-400'}`}>
                          {seatsLeft} / {event.max_seats}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isFull ? 'bg-red-400' : seatsLeft <= 3 ? 'bg-amber-400' : 'bg-gradient-to-r from-accent-400 to-teal-500'
                          }`}
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => openSignup(event)}
                      disabled={isFull || isPast}
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        isFull || isPast
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                          : 'text-white bg-gradient-to-r from-primary-600 to-accent-600 shadow-lg hover:shadow-xl hover:scale-[1.02]'
                      }`}
                    >
                      {isPast ? (
                        'Событие прошло'
                      ) : isFull ? (
                        'Мест нет'
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Записаться на событие
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Signup modal */}
      {signupEvent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setSignupEvent(null)}>
          <div
            className="glass-card rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Запись на событие</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{signupEvent.title}</p>
              </div>
              <button onClick={() => setSignupEvent(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Имя ученика</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Например: Айгерим"
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
                  placeholder="Например: 10-А"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-2 text-slate-900 dark:text-white outline-none transition-colors placeholder:text-slate-400 ${
                    errors.className ? 'border-red-400' : 'border-slate-200 dark:border-white/10 focus:border-primary-500'
                  }`}
                />
                {errors.className && <p className="text-xs text-red-500 mt-1">{errors.className}</p>}
              </div>
            </div>

            {/* Event summary */}
            <div className="mt-4 p-3 rounded-xl bg-primary-50 dark:bg-primary-500/10 text-xs space-y-1">
              <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Дата</span><span className="font-medium text-slate-900 dark:text-white">{signupEvent.date} · {signupEvent.time}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Место</span><span className="font-medium text-slate-900 dark:text-white">{signupEvent.location}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Осталось мест</span><span className="font-medium text-accent-600 dark:text-accent-400">{signupEvent.max_seats - signupEvent.registered}</span></div>
            </div>

            {errors.submit && <p className="text-sm text-red-500 mt-4">{errors.submit}</p>}

            <button
              onClick={handleSignup}
              disabled={submitting}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-60"
            >
              {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Запись...</> : <>Записаться <CheckCircle2 className="w-5 h-5" /></>}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
