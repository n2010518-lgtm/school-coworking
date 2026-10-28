import { useState, useMemo } from 'react';
import { TrendingUp, Wallet, Clock, BarChart3, Building2, Calculator, ArrowUpRight } from 'lucide-react';

export default function ROICalculator() {
  const [hourlyRate, setHourlyRate] = useState(80);
  const [hoursPerDay, setHoursPerDay] = useState(6);
  const [workingDays, setWorkingDays] = useState(22);
  const [equipmentCost, setEquipmentCost] = useState(45000);

  const monthlyRevenue = useMemo(() => hourlyRate * hoursPerDay * workingDays, [hourlyRate, hoursPerDay, workingDays]);
  const paybackMonths = useMemo(() => {
    const m = equipmentCost / monthlyRevenue;
    return isFinite(m) && m > 0 ? m : 0;
  }, [equipmentCost, monthlyRevenue]);

  const yearlyRevenue = monthlyRevenue * 12;

  const fmt = (n: number) => n.toLocaleString('ru-RU');

  const sliderProps = (value: number, min: number, max: number, setter: (v: number) => void) => ({
    type: 'range',
    min,
    max,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setter(Number(e.target.value)),
    className: 'custom-range bg-gradient-to-r from-primary-500 to-accent-500',
    style: {
      background: `linear-gradient(to right, rgb(99 102 241) 0%, rgb(16 185 129) ${((value - min) / (max - min)) * 100}%, rgb(226 232 240) ${((value - min) / (max - min)) * 100}%, rgb(226 232 240) 100%)`,
    },
  });

  return (
    <section id="calculator" className="relative py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 rounded-full mb-4">
            Секция 3 — Для жюри-экономистов
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Бизнес-модель и Калькулятор окупаемости
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Двигайте ползунки, чтобы увидеть прогноз дохода школы и срок окупаемости оборудования в реальном времени.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sliders */}
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary-500" />
              Параметры
            </h3>

            <div className="space-y-7">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Стоимость часа аренды
                  </label>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{hourlyRate} сом</span>
                </div>
                <input {...sliderProps(hourlyRate, 0, 300, setHourlyRate)} />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0 сом</span><span>300 сом</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Загрузка залов (часов в день)
                  </label>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{hoursPerDay} ч</span>
                </div>
                <input {...sliderProps(hoursPerDay, 0, 12, setHoursPerDay)} />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0 ч</span><span>12 ч</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Рабочих дней в месяц
                  </label>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{workingDays} дн</span>
                </div>
                <input {...sliderProps(workingDays, 1, 30, setWorkingDays)} />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1 день</span><span>30 дней</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Стоимость закупки оборудования
                  </label>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{fmt(equipmentCost)} сом</span>
                </div>
                <input {...sliderProps(equipmentCost, 10000, 200000, setEquipmentCost)} />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>10 000</span><span>200 000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-8 bg-gradient-to-br from-primary-600/10 to-accent-600/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Прогнозируемый доход школы в месяц</p>
                  <p className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
                    {fmt(monthlyRevenue)} <span className="text-lg text-slate-500">сом</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-accent-600 dark:text-accent-400">
                <ArrowUpRight className="w-4 h-4" />
                <span>{fmt(yearlyRevenue)} сом в год</span>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-8 bg-gradient-to-br from-teal-500/10 to-primary-600/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-primary-500 flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Срок окупаемости оборудования</p>
                  <p className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
                    {paybackMonths > 0 ? paybackMonths.toFixed(1) : '∞'} <span className="text-lg text-slate-500">мес.</span>
                  </p>
                </div>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 to-primary-500 transition-all duration-500"
                  style={{ width: `${Math.min((paybackMonths / 24) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">Шкала: 0 — 24 месяца</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-5">
                <BarChart3 className="w-6 h-6 text-primary-500 mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Доход в день</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{fmt(hourlyRate * hoursPerDay)} сом</p>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <Building2 className="w-6 h-6 text-accent-500 mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400">ROI за год</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {equipmentCost > 0 ? `${((yearlyRevenue / equipmentCost) * 100).toFixed(0)}%` : '∞'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom insight banner */}
        <div className="mt-10 glass-card rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            При текущих параметрах проект окупается за <strong className="text-slate-900 dark:text-white">{paybackMonths > 0 ? paybackMonths.toFixed(1) : '∞'} месяцев</strong> и приносит школе <strong className="text-slate-900 dark:text-white">{fmt(yearlyRevenue)} сом в год</strong>. Это доказывает экономическую обоснованность инвестиций в школьный коворкинг и медиацентр.
          </p>
        </div>
      </div>
    </section>
  );
}
