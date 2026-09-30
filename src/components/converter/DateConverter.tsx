import React, { useState, useEffect } from 'react';
import { 
  gregorianToJalali, 
  jalaliToGregorian, 
  getCurrentDates, 
  PERSIAN_MONTHS, 
  GREGORIAN_MONTHS, 
  PERSIAN_WEEKDAYS,
  isJalaliLeapYear,
  isGregorianLeapYear,
  formatJalaliReadable,
  getDaysDifference,
  addDaysToJalali
} from '../../utils/dateConverter';
import { 
  CalendarDays, 
  ArrowLeftRight, 
  Clock, 
  Calendar as CalendarIcon, 
  Copy, 
  Check, 
  RotateCcw,
  Sparkles,
  Hourglass
} from 'lucide-react';

export const DateConverter: React.FC = () => {
  const current = getCurrentDates();

  // Mode: shamsiToMiladi | miladiToShamsi | dateDiff | addDays
  const [activeTab, setActiveTab] = useState<'shamsiToMiladi' | 'miladiToShamsi' | 'dateDiff' | 'addDays'>('shamsiToMiladi');

  // Live Clock
  const [liveTime, setLiveTime] = useState<string>('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Copy notification state
  const [copied, setCopied] = useState(false);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // State 1: Shamsi to Miladi
  const [sYear, setSYear] = useState<number>(current.jalali.jy);
  const [sMonth, setSMonth] = useState<number>(current.jalali.jm);
  const [sDay, setSDay] = useState<number>(current.jalali.jd);

  const miladiResult = jalaliToGregorian(sYear, sMonth, sDay);
  const miladiDateObj = new Date(Date.UTC(miladiResult.gy, miladiResult.gm - 1, miladiResult.gd));
  const sDayOfWeek = PERSIAN_WEEKDAYS[miladiDateObj.getUTCDay()];
  const isSLeap = isJalaliLeapYear(sYear);

  // State 2: Miladi to Shamsi
  const [mYear, setMYear] = useState<number>(current.gregorian.gy);
  const [mMonth, setMMonth] = useState<number>(current.gregorian.gm);
  const [mDay, setMDay] = useState<number>(current.gregorian.gd);

  const shamsiResult = gregorianToJalali(mYear, mMonth, mDay);
  const mDateObj = new Date(Date.UTC(mYear, mMonth - 1, mDay));
  const mDayOfWeek = PERSIAN_WEEKDAYS[mDateObj.getUTCDay()];
  const isMLeap = isGregorianLeapYear(mYear);

  // State 3: Date Difference
  const [diffD1, setDiffD1] = useState({ y: current.jalali.jy, m: 1, d: 1 });
  const [diffD2, setDiffD2] = useState({ y: current.jalali.jy, m: current.jalali.jm, d: current.jalali.jd });
  const daysDiff = getDaysDifference(
    { y: diffD1.y, m: diffD1.m, d: diffD1.d, isJalali: true },
    { y: diffD2.y, m: diffD2.m, d: diffD2.d, isJalali: true }
  );

  // State 4: Add / Subtract Days (Due date finder)
  const [targetYear, setTargetYear] = useState(current.jalali.jy);
  const [targetMonth, setTargetMonth] = useState(current.jalali.jm);
  const [targetDay, setTargetDay] = useState(current.jalali.jd);
  const [daysToAdd, setDaysToAdd] = useState(30);

  const calculatedDueDate = addDaysToJalali(targetYear, targetMonth, targetDay, daysToAdd);

  // Days in selected shamsi month
  const getShamsiMonthDays = (month: number, year: number) => {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    return isJalaliLeapYear(year) ? 30 : 29;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Live Calendar Banner */}
      <div className="bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 text-white rounded-2xl p-6 shadow-xl shadow-black/30 border border-slate-800/80 backdrop-blur-md relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-emerald-500 before:via-teal-400 before:to-emerald-600">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-xs">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                تقویم رسمی و ساعت لحظه‌ای کشور
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                امروز {current.jalali.weekday}، {current.jalali.jd} {current.jalali.monthName} {current.jalali.jy}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/70 px-4 py-2.5 rounded-xl border border-slate-700/60 shadow-inner">
            <div className="text-left">
              <span className="text-[11px] text-slate-400 block">میلادی:</span>
              <span className="text-xs font-mono font-semibold text-slate-200">
                {current.gregorian.dateString}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-700/80" />
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-mono font-bold">{liveTime || '۰۰:۰۰:۰۰'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center justify-center">
        <div className="bg-slate-200/80 dark:bg-slate-900 border border-transparent dark:border-slate-800 p-1.5 rounded-2xl flex flex-wrap items-center justify-center gap-1 transition-colors">
          <button
            onClick={() => setActiveTab('shamsiToMiladi')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'shamsiToMiladi'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4 text-emerald-500" />
            <span>تبدیل شمسی به میلادی</span>
          </button>

          <button
            onClick={() => setActiveTab('miladiToShamsi')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'miladiToShamsi'
                ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4 text-blue-500" />
            <span>تبدیل میلادی به شمسی</span>
          </button>

          <button
            onClick={() => setActiveTab('dateDiff')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'dateDiff'
                ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Hourglass className="w-4 h-4 text-purple-500" />
            <span>فاصله زمانی بین دو تاریخ</span>
          </button>

          <button
            onClick={() => setActiveTab('addDays')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'addDays'
                ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span>محاسبه موعد و سررسید (+روز)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SHAMSI TO MILADI */}
      {activeTab === 'shamsiToMiladi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">انتخاب تاریخ خورشیدی (شمسی)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">سال، ماه و روز را مشخص نمایید</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSYear(current.jalali.jy);
                  setSMonth(current.jalali.jm);
                  setSDay(current.jalali.jd);
                }}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>تنظیم روی امروز</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Day */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">روز</label>
                <select
                  value={sDay}
                  onChange={(e) => setSDay(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono"
                >
                  {Array.from({ length: getShamsiMonthDays(sMonth, sYear) }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">ماه</label>
                <select
                  value={sMonth}
                  onChange={(e) => setSMonth(Number(e.target.value))}
                  className="w-full px-2 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                >
                  {PERSIAN_MONTHS.map((name, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}. {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">سال</label>
                <input
                  type="number"
                  value={sYear}
                  onChange={(e) => setSYear(Number(e.target.value))}
                  min="1300"
                  max="1450"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono text-center"
                />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-300 flex justify-between items-center">
              <span>وضعیت سال خورشیدی:</span>
              <span className={`font-semibold ${isSLeap ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-400'}`}>
                {isSLeap ? 'سال کبیسه (۳۶۶ روز - اسفند ۳۰ روزه)' : 'سال عادی (۳۶۵ روز - اسفند ۲۹ روزه)'}
              </span>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4 transition-colors">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">معادل دقیق تقویم میلادی (Gregorian):</span>

            <div className="bg-slate-950 dark:bg-black/60 border border-slate-800 text-white rounded-2xl p-6 text-center space-y-2">
              <span className="text-emerald-400 text-xs font-medium block">
                {sDayOfWeek} (Weekday)
              </span>
              <div className="text-3xl font-extrabold font-mono tracking-wide">
                {miladiResult.gy}-{String(miladiResult.gm).padStart(2, '0')}-{String(miladiResult.gd).padStart(2, '0')}
              </div>
              <p className="text-xs text-slate-300">
                {miladiResult.gd} {GREGORIAN_MONTHS[miladiResult.gm - 1]} {miladiResult.gy}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-500 dark:text-slate-400">
                تاریخ شمسی ورودی: {formatJalaliReadable(sYear, sMonth, sDay)}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `${miladiResult.gy}/${String(miladiResult.gm).padStart(2, '0')}/${String(miladiResult.gd).padStart(2, '0')}`
                  )
                }
                className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'کپی شد' : 'کپی تاریخ میلادی'}</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MILADI TO SHAMSI */}
      {activeTab === 'miladiToShamsi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">انتخاب تاریخ میلادی (Gregorian)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Year, Month, Day</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMYear(current.gregorian.gy);
                  setMMonth(current.gregorian.gm);
                  setMDay(current.gregorian.gd);
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Today</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Day</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={mDay}
                  onChange={(e) => setMDay(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-mono text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Month</label>
                <select
                  value={mMonth}
                  onChange={(e) => setMMonth(Number(e.target.value))}
                  className="w-full px-2 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                >
                  {GREGORIAN_MONTHS.map((name, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}. {name.split(' ')[0]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Year</label>
                <input
                  type="number"
                  value={mYear}
                  onChange={(e) => setMYear(Number(e.target.value))}
                  min="1920"
                  max="2050"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-mono text-center"
                />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-300 flex justify-between items-center">
              <span>وضعیت سال میلادی:</span>
              <span className={`font-semibold ${isMLeap ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-400'}`}>
                {isMLeap ? 'Leap Year (کبیسه - ۳۶۶ روز)' : 'Standard Year (عادی - ۳۶۵ روز)'}
              </span>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4 transition-colors">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">معادل تقویم خورشیدی (شمسی):</span>

            <div className="bg-gradient-to-br from-emerald-700 to-teal-800 text-white rounded-2xl p-6 text-center space-y-2">
              <span className="text-emerald-200 text-xs font-medium block">
                {mDayOfWeek}
              </span>
              <div className="text-3xl font-extrabold font-mono tracking-wide">
                {shamsiResult.jy}/{String(shamsiResult.jm).padStart(2, '0')}/{String(shamsiResult.jd).padStart(2, '0')}
              </div>
              <p className="text-sm font-semibold text-emerald-100">
                {formatJalaliReadable(shamsiResult.jy, shamsiResult.jm, shamsiResult.jd)}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-500 dark:text-slate-400">
                ورودی میلادی: {mYear}/{mMonth}/{mDay}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `${shamsiResult.jy}/${String(shamsiResult.jm).padStart(2, '0')}/${String(shamsiResult.jd).padStart(2, '0')}`
                  )
                }
                className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'کپی شد' : 'کپی تاریخ شمسی'}</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: DATE DIFFERENCE */}
      {activeTab === 'dateDiff' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6 transition-colors">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">محاسبه فاصله زمانی دقیق بین دو تاریخ خورشیدی</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">مناسب برای محاسبه سن، مدت قراردادها یا مدت اشتراک</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date 1 */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">تاریخ مبدا (اول)</span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={diffD1.d}
                  onChange={(e) => setDiffD1({ ...diffD1, d: Number(e.target.value) })}
                  className="px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-center text-slate-900 dark:text-white"
                  placeholder="روز"
                />
                <select
                  value={diffD1.m}
                  onChange={(e) => setDiffD1({ ...diffD1, m: Number(e.target.value) })}
                  className="px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {PERSIAN_MONTHS.map((m, i) => (
                    <option key={i + 1} value={i + 1}>{m}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={diffD1.y}
                  onChange={(e) => setDiffD1({ ...diffD1, y: Number(e.target.value) })}
                  className="px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-center text-slate-900 dark:text-white"
                  placeholder="سال"
                />
              </div>
            </div>

            {/* Date 2 */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">تاریخ مقصد (دوم)</span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={diffD2.d}
                  onChange={(e) => setDiffD2({ ...diffD2, d: Number(e.target.value) })}
                  className="px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-center text-slate-900 dark:text-white"
                  placeholder="روز"
                />
                <select
                  value={diffD2.m}
                  onChange={(e) => setDiffD2({ ...diffD2, m: Number(e.target.value) })}
                  className="px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {PERSIAN_MONTHS.map((m, i) => (
                    <option key={i + 1} value={i + 1}>{m}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={diffD2.y}
                  onChange={(e) => setDiffD2({ ...diffD2, y: Number(e.target.value) })}
                  className="px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-center text-slate-900 dark:text-white"
                  placeholder="سال"
                />
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-purple-900 dark:text-purple-300 block mb-1">اختلاف زمانی:</span>
              <div className="text-2xl font-extrabold text-purple-800 dark:text-purple-400 font-mono tabular-nums">
                {daysDiff.toLocaleString('fa-IR')} <span className="text-sm font-normal">روز کامل</span>
              </div>
            </div>
            <div className="text-xs text-purple-700 dark:text-purple-300 text-left sm:text-right space-y-1">
              <p>معادل تقریبی {(daysDiff / 30.4375).toFixed(1)} ماه</p>
              <p>معادل تقریبی {(daysDiff / 365.25).toFixed(2)} سال</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ADD/SUBTRACT DAYS (DUE DATE) */}
      {activeTab === 'addDays' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6 transition-colors">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">محاسبه تاریخ سررسید فاکتور و چک (+X روز)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">افزودن یا کسر روزهای معین از تاریخ صدور</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">تاریخ مبنا (صدور)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={targetDay}
                    onChange={(e) => setTargetDay(Number(e.target.value))}
                    className="px-2 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-center text-slate-900 dark:text-white"
                  />
                  <select
                    value={targetMonth}
                    onChange={(e) => setTargetMonth(Number(e.target.value))}
                    className="px-2 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {PERSIAN_MONTHS.map((m, i) => (
                      <option key={i + 1} value={i + 1}>{m}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={targetYear}
                    onChange={(e) => setTargetYear(Number(e.target.value))}
                    className="px-2 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-center text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  تعداد روزهای اضافه شده (سررسید)
                </label>
                <input
                  type="number"
                  value={daysToAdd}
                  onChange={(e) => setDaysToAdd(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-center text-slate-900 dark:text-white"
                />

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[7, 15, 30, 45, 60, 90].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDaysToAdd(d)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        daysToAdd === d 
                          ? 'bg-amber-600 text-white font-medium' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      +{d} روز
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Date Result Card */}
            <div className="bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-6 text-center space-y-2">
              <span className="text-xs text-amber-900 dark:text-amber-300 font-semibold block">
                موعد و سررسید نهایی ({calculatedDueDate.jalali.weekday}):
              </span>
              <div className="text-2xl font-extrabold text-amber-950 dark:text-amber-400 font-mono">
                {calculatedDueDate.jalali.dateString}
              </div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                {calculatedDueDate.jalali.readable}
              </p>
              <span className="text-[11px] text-amber-700/80 dark:text-amber-400/80 font-mono block pt-1">
                معادل میلادی: {calculatedDueDate.gregorian.dateString}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
