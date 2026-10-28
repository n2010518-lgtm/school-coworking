import { useState, useEffect, useMemo } from 'react';
import { BookOpen, Users, Presentation, CheckCircle2, Calendar, Clock, User, GraduationCap, Loader2, X, QrCode, ArrowRight, AlertCircle, Download, Share2, Sparkles } from 'lucide-react';
import { zones, timeSlots } from '@/data/content';
import { supabase, type Booking } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import QRCode from 'qrcode';
import { useTheme } from '@/context/ThemeContext';

const iconMap = { BookOpen, Users, Presentation };

const statusLabels: Record<string, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждено',
  cancelled: 'Отменено',
};

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  confirmed: 'bg-accent-100 text-accent-700 dark:bg-accent-500/20 dark:text-accent-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
};

export default function Coworking() {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<Booking | null>(null);
  const [qrUrl, setQrUrl] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slotOccupancy, setSlotOccupancy] = useState<Record<string, number>>({});

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (selectedZone && date) {
      loadSlotOccupancy();
    } else {
      setSlotOccupancy({});
    }
  }, [selectedZone, date, bookings]);

  async function loadBookings() {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) setBookings(data as Booking[]);
  }

  async function loadSlotOccupancy() {
    if (!selectedZone || !date) return;
    const { data } = await supabase
      .from('bookings')
      .select('time_slot, status')
      .eq('zone', selectedZone)
      .eq('date', date)
      .neq('status', 'cancelled');
    const counts: Record<string, number> = {};
    (data || []).forEach((row) => {
      const r = row as { time_slot: string };
      counts[r.time_slot] = (counts[r.time_slot] || 0) + 1;
    });
    setSlotOccupancy(counts);
  }

  useEffect(() => {
    if (success) {
      const passData = JSON.stringify({
        zone: success.zone,
        date: success.date,
        slot: success.time_slot,
        name: success.student_name,
        class: success.class_name,
        id: success.id,
      });
      QRCode.toDataURL(passData, {
        width: 240,
        margin: 2,
        color: { dark: theme === 'dark' ? '#ffffff' : '#1e1b4b', light: theme === 'dark' ? '#1e293b' : '#ffffff' },
      }).then(setQrUrl).catch(() => setQrUrl(''));
    }
  }, [success, theme]);

  const selectedZoneData = useMemo(() => zones.find((z) => z.id === selectedZone), [selectedZone]);
  const today = new Date().toISOString().split('T')[0];

  function isSlotFull(slotTime: string): boolean {
    if (!selectedZoneData) return false;
    return (slotOccupancy[slotTime] || 0) >= selectedZoneData.maxSeats;
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!selectedZone) e.zone = 'Выберите зону';
    if (!date) {
      e.date = 'Выберите дату';
    } else if (date < today) {
      e.date = 'Нельзя выбрать прошедшую дату';
    }
    if (!slot) {
      e.slot = 'Выберите время';
    } else if (isSlotFull(slot)) {
      e.slot = 'Все места на этот слот заняты';
    }
    if (!name.trim()) e.name = 'Введите имя';
    if (!className.trim()) e.className = 'Укажите класс';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate() || !selectedZone) return;
    setSubmitting(true);
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        zone: selectedZone,
        date,
        time_slot: slot,
        student_name: name.trim(),
        class_name: className.trim(),
        status: 'pending',
      })
      .select()
      .single();

    setSubmitting(false);
    if (error || !data) {
      setErrors({ submit: 'Не удалось забронировать. Попробуйте ещё раз.' });
      showToast('error', 'Ошибка бронирования', 'Не удалось сохранить бронь. Попробуйте ещё раз.');
      return;
    }
    setSuccess(data as Booking);
    showToast('success', 'Бронирование создано!', `Зона: ${selectedZoneData?.name}, ${date} в ${slot}`);
    setName('');
    setClassName('');
    setDate('');
    setSlot('');
    setSelectedZone(null);
    loadBookings();
  }

  function closeModal() {
    setSuccess(null);
    setQrUrl('');
  }

  function downloadPass() {
    if (!qrUrl || !success || !selectedZoneData) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `propusk_${success.student_name}_${success.date}.png`;
    link.click();
    showToast('success', 'Пропуск скачан!', 'PNG-файл сохранён на устройство.');
  }

  async function sharePass() {
    if (!success || !selectedZoneData) return;
    const shareText = `Мой пропуск Nexus Space\nЗона: ${selectedZoneData.name}\nДата: ${success.date}\nВремя: ${success.time_slot}\nУченик: ${success.student_name} (${success.class_name})`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Пропуск Nexus Space', text: shareText });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareText);
      showToast('info', 'Скопировано', 'Данные пропуска скопированы в буфер обмена.');
    }
  }

  return (
    <section id="coworking" className="relative py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 rounded-full mb-4">
            Секция 1
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Интерактивный Коворкинг
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Выбери зону, забронируй место и получи QR-пропуск. Всё в пару кликов.
          </p>
        </div>

        {/* Zone cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {zones.map((zone) => {
            const Icon = iconMap[zone.icon as keyof typeof iconMap];
            const isActive = selectedZone === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone.id)}
                className={`text-left p-6 rounded-2xl border-2 transition-all hover:scale-[1.02] ${
                  isActive
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 shadow-xl shadow-primary-500/20'
                    : 'border-slate-200 dark:border-white/10 glass-card hover:border-primary-300'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  isActive ? 'bg-gradient-to-br from-primary-500 to-accent-500' : 'bg-slate-100 dark:bg-slate-800'
                }`}>
                  <Icon className={`w-7 h-7 ${isActive ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`} />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {zone.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  {zone.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-accent-600 dark:text-accent-400 mb-3">
                  <Users className="w-4 h-4" />
                  {zone.capacity}
                </div>
                <ul className="space-y-1.5">
                  {zone.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-accent-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* Booking form */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-500" />
            Форма бронирования
          </h3>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Зона
              </label>
              <div className="flex flex-wrap gap-2">
                {zones.map((z) => (
                  <button
                    key={z.id}
                    onClick={() => { setSelectedZone(z.id); setSlot(''); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedZone === z.id
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {z.name}
                  </button>
                ))}
              </div>
              {errors.zone && <p className="text-xs text-red-500 mt-1">{errors.zone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" /> Дата
              </label>
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => { setDate(e.target.value); setSlot(''); }}
                className={`w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-2 text-slate-900 dark:text-white outline-none transition-colors ${
                  errors.date ? 'border-red-400' : 'border-slate-200 dark:border-white/10 focus:border-primary-500'
                }`}
              />
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Clock className="inline w-4 h-4 mr-1" /> Тайм-слот
              </label>
              <select
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                disabled={!selectedZone || !date}
                className={`w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-2 text-slate-900 dark:text-white outline-none transition-colors disabled:opacity-50 ${
                  errors.slot ? 'border-red-400' : 'border-slate-200 dark:border-white/10 focus:border-primary-500'
                }`}
              >
                <option value="">{selectedZone && date ? 'Выберите время' : 'Сначала выберите зону и дату'}</option>
                {timeSlots.map((s) => {
                  const full = isSlotFull(s);
                  const count = slotOccupancy[s] || 0;
                  return (
                    <option key={s} value={s} disabled={full}>
                      {s} {full ? '— заполнено' : selectedZoneData ? `(${count}/${selectedZoneData.maxSeats})` : ''}
                    </option>
                  );
                })}
              </select>
              {errors.slot && <p className="text-xs text-red-500 mt-1">{errors.slot}</p>}
              {selectedZoneData && date && (
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Максимум {selectedZoneData.maxSeats} мест на слот
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <User className="inline w-4 h-4 mr-1" /> Имя ученика
              </label>
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <GraduationCap className="inline w-4 h-4 mr-1" /> Класс
              </label>
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

          {errors.submit && (
            <p className="text-sm text-red-500 mt-4">{errors.submit}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-60 disabled:hover:scale-100"
          >
            {submitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Бронирование...</>
            ) : (
              <>Забронировать <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </div>

        {/* Recent bookings */}
        {bookings.length > 0 && (
          <div className="max-w-3xl mx-auto mt-10">
            <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">Последние бронирования</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
              {bookings.slice(0, 5).map((b) => (
                <div key={b.id} className="flex items-center justify-between px-4 py-3 rounded-xl glass-card text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-700 dark:text-slate-200 font-medium">{b.student_name} ({b.class_name})</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[b.status] || statusColors.pending}`}>
                      {statusLabels[b.status] || b.status}
                    </span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400">
                    {zones.find((z) => z.id === b.zone)?.name ?? b.zone} · {b.date} · {b.time_slot}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Success modal with QR pass */}
      {success && selectedZoneData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={closeModal}>
          <div
            className="glass-card rounded-3xl max-w-md w-full shadow-2xl animate-scale-in overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pass header */}
            <div className="bg-gradient-to-br from-primary-600 to-accent-600 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8" />
              <div className="flex justify-between items-start relative">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs font-medium uppercase tracking-wider opacity-90">Nexus Space</span>
                  </div>
                  <h3 className="font-display text-xl font-bold">Твой электронный пропуск</h3>
                </div>
                <button onClick={closeModal} className="text-white/70 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-white/20 text-xs font-medium">
                  {statusLabels[success.status] || 'Ожидает'}
                </span>
              </div>
            </div>

            {/* QR + details */}
            <div className="p-6">
              <div className="flex flex-col items-center mb-5">
                {qrUrl ? (
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-lg">
                    <img src={qrUrl} alt="QR-пропуск" className="w-44 h-44" />
                  </div>
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center text-slate-400">
                    <QrCode className="w-12 h-12" />
                  </div>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">Покажи этот QR-код на входе</p>
              </div>

              <div className="space-y-2 text-sm border-t border-slate-200 dark:border-white/10 pt-4 mb-5">
                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Ученик</span><span className="font-medium text-slate-900 dark:text-white">{success.student_name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Класс</span><span className="font-medium text-slate-900 dark:text-white">{success.class_name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Зона</span><span className="font-medium text-slate-900 dark:text-white">{selectedZoneData.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Дата</span><span className="font-medium text-slate-900 dark:text-white">{success.date}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Время</span><span className="font-medium text-slate-900 dark:text-white">{success.time_slot}</span></div>
              </div>

              {/* Download / share buttons */}
              <div className="flex gap-3">
                <button
                  onClick={downloadPass}
                  disabled={!qrUrl}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  <Download className="w-4 h-4" /> Скачать
                </button>
                <button
                  onClick={sharePass}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 glass-card rounded-xl hover:scale-[1.02] transition-all"
                >
                  <Share2 className="w-4 h-4" /> Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
