import { useState, useEffect } from 'react';
import {
  ClipboardList, Package, CheckCircle2, XCircle, Loader2, Calendar, Clock, User,
  GraduationCap, Camera, Mic, Lightbulb, RefreshCw, Trash2, PackageCheck, AlertCircle,
  LayoutDashboard, ArrowLeft,
} from 'lucide-react';
import { zones } from '@/data/content';
import { supabase, type Booking, type EquipmentRequest, type BookingStatus, type EquipmentRequestStatus } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';

const bookingStatusConfig: Record<BookingStatus, { label: string; color: string }> = {
  pending: { label: 'Ожидает', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' },
  confirmed: { label: 'Подтверждено', color: 'bg-accent-100 text-accent-700 dark:bg-accent-500/20 dark:text-accent-400' },
  cancelled: { label: 'Отменено', color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' },
};

const eqStatusConfig: Record<EquipmentRequestStatus, { label: string; color: string }> = {
  pending: { label: 'На рассмотрении', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' },
  approved: { label: 'Одобрено', color: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400' },
  issued: { label: 'Выдано', color: 'bg-accent-100 text-accent-700 dark:bg-accent-500/20 dark:text-accent-400' },
  rejected: { label: 'Отклонено', color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' },
};

const eqIconMap = { Camera, Mic, Lightbulb };

type Tab = 'bookings' | 'equipment';

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requests, setRequests] = useState<EquipmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    const [bRes, rRes] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('equipment_requests').select('*').order('created_at', { ascending: false }),
    ]);
    if (bRes.data) setBookings(bRes.data as Booking[]);
    if (rRes.data) setRequests(rRes.data as EquipmentRequest[]);
    setLoading(false);
  }

  async function updateBookingStatus(id: string, status: BookingStatus) {
    setUpdating(id);
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    setUpdating(null);
    if (error) {
      showToast('error', 'Ошибка', 'Не удалось обновить статус бронирования.');
      return;
    }
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    showToast('success', 'Статус обновлён', `Бронирование: ${bookingStatusConfig[status].label}`);
  }

  async function updateRequestStatus(id: string, status: EquipmentRequestStatus) {
    setUpdating(id);
    const { error } = await supabase.from('equipment_requests').update({ status }).eq('id', id);
    setUpdating(null);
    if (error) {
      showToast('error', 'Ошибка', 'Не удалось обновить статус заявки.');
      return;
    }
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    showToast('success', 'Статус обновлён', `Заявка: ${eqStatusConfig[status].label}`);
  }

  async function deleteBooking(id: string) {
    setUpdating(id);
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    setUpdating(null);
    if (error) {
      showToast('error', 'Ошибка', 'Не удалось удалить бронирование.');
      return;
    }
    setBookings((prev) => prev.filter((b) => b.id !== id));
    showToast('info', 'Удалено', 'Бронирование удалено из базы.');
  }

  async function deleteRequest(id: string) {
    setUpdating(id);
    const { error } = await supabase.from('equipment_requests').delete().eq('id', id);
    setUpdating(null);
    if (error) {
      showToast('error', 'Ошибка', 'Не удалось удалить заявку.');
      return;
    }
    setRequests((prev) => prev.filter((r) => r.id !== id));
    showToast('info', 'Удалено', 'Заявка удалена из базы.');
  }

  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const pendingRequests = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Панель администратора</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Управление бронированиями и заявками</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium glass-card rounded-xl hover:scale-105 transition-all text-slate-700 dark:text-slate-200"
            >
              <RefreshCw className="w-4 h-4" /> Обновить
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> На главную
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-2xl p-4">
            <ClipboardList className="w-6 h-6 text-primary-500 mb-2" />
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{bookings.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Всего бронирований</p>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <AlertCircle className="w-6 h-6 text-amber-500 mb-2" />
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{pendingBookings}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ожидают подтверждения</p>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <Package className="w-6 h-6 text-accent-500 mb-2" />
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{requests.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Заявок на технику</p>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <PackageCheck className="w-6 h-6 text-teal-500 mb-2" />
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{pendingRequests}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Заявок на рассмотрении</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('bookings')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              tab === 'bookings'
                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                : 'glass-card text-slate-600 dark:text-slate-300 hover:scale-105'
            }`}
          >
            <ClipboardList className="w-4 h-4" /> Бронирования ({bookings.length})
          </button>
          <button
            onClick={() => setTab('equipment')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              tab === 'equipment'
                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                : 'glass-card text-slate-600 dark:text-slate-300 hover:scale-105'
            }`}
          >
            <Package className="w-4 h-4" /> Заявки на технику ({requests.length})
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : tab === 'bookings' ? (
          /* Bookings table */
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400">
                <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Пока нет бронирований</p>
              </div>
            ) : (
              bookings.map((b) => {
                const cfg = bookingStatusConfig[b.status];
                const zoneName = zones.find((z) => z.id === b.zone)?.name ?? b.zone;
                return (
                  <div key={b.id} className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{zoneName}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {b.student_name}</span>
                        <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {b.class_name}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {b.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {b.time_slot}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {b.status !== 'confirmed' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'confirmed')}
                          disabled={updating === b.id}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-accent-600 rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Подтвердить
                        </button>
                      )}
                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'cancelled')}
                          disabled={updating === b.id}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" /> Отменить
                        </button>
                      )}
                      <button
                        onClick={() => deleteBooking(b.id)}
                        disabled={updating === b.id}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {updating === b.id && <Loader2 className="w-4 h-4 animate-spin text-primary-500" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Equipment requests */
          <div className="space-y-3">
            {requests.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Пока нет заявок на оборудование</p>
              </div>
            ) : (
              requests.map((r) => {
                const cfg = eqStatusConfig[r.status];
                return (
                  <div key={r.id} className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{r.equipment_name}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {r.student_name}</span>
                        <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {r.class_name}</span>
                        <span className="text-slate-400">Цель: {r.purpose}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {r.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateRequestStatus(r.id, 'approved')}
                            disabled={updating === r.id}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Одобрить
                          </button>
                          <button
                            onClick={() => updateRequestStatus(r.id, 'rejected')}
                            disabled={updating === r.id}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" /> Отклонить
                          </button>
                        </>
                      )}
                      {r.status === 'approved' && (
                        <button
                          onClick={() => updateRequestStatus(r.id, 'issued')}
                          disabled={updating === r.id}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-accent-600 rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50"
                        >
                          <PackageCheck className="w-4 h-4" /> Выдано
                        </button>
                      )}
                      <button
                        onClick={() => deleteRequest(r.id)}
                        disabled={updating === r.id}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {updating === r.id && <Loader2 className="w-4 h-4 animate-spin text-primary-500" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
