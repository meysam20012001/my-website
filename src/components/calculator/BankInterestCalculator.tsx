import React, { useState } from 'react';
import { 
  calculateDepositInterest, 
  calculateLoanInstallments,
  LoanCalculationResult,
  DepositCalculationResult
} from '../../utils/financialCalculations';
import { formatToman } from '../../utils/dateConverter';
import { numberToPersianWords } from '../../utils/numberToPersianWords';
import { 
  Landmark, 
  Coins, 
  BadgePercent, 
  Calendar, 
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

export const BankInterestCalculator: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'deposit' | 'loan'>('deposit');

  // Deposit State
  const [depositAmount, setDepositAmount] = useState<number>(100000000); // 100 million Tomans
  const [depositRate, setDepositRate] = useState<number>(22.5); // 22.5%
  const [depositMonths, setDepositMonths] = useState<number>(12);
  const [showDepositSchedule, setShowDepositSchedule] = useState(false);

  // Loan State
  const [loanAmount, setLoanAmount] = useState<number>(200000000); // 200 million Tomans
  const [loanRate, setLoanRate] = useState<number>(23); // 23%
  const [loanMonths, setLoanMonths] = useState<number>(36); // 36 months
  const [showLoanSchedule, setShowLoanSchedule] = useState(false);

  // Calculate results
  const depositResult: DepositCalculationResult = calculateDepositInterest(
    depositAmount,
    depositRate,
    depositMonths
  );

  const loanResult: LoanCalculationResult = calculateLoanInstallments(
    loanAmount,
    loanRate,
    loanMonths
  );

  const quickDepositPresets = [
    { label: '۱۰ میلیون', value: 10000000 },
    { label: '۵۰ میلیون', value: 50000000 },
    { label: '۱۰۰ میلیون', value: 100000000 },
    { label: '۵۰۰ میلیون', value: 500000000 },
    { label: '۱ میلیارد', value: 1000000000 }
  ];

  const bankRates = [
    { label: '۲۲.۵٪ (سپرده ۱ ساله)', rate: 22.5 },
    { label: '۲۳٪ (سپرده خاص)', rate: 23 },
    { label: '۲۰.۵٪ (سپرده ۶ ماهه)', rate: 20.5 },
    { label: '۲۵٪ (اوراق گواهی)', rate: 25 }
  ];

  const quickLoanPresets = [
    { label: '۵۰ میلیون', value: 50000000 },
    { label: '۱۰۰ میلیون', value: 100000000 },
    { label: '۲۰۰ میلیون', value: 200000000 },
    { label: '۵۰۰ میلیون', value: 500000000 }
  ];

  const loanRates = [
    { label: '۲۳٪ (عقود مبادله‌ای/مشارکتی)', rate: 23 },
    { label: '۱۸٪ (تسهیلات مصوب)', rate: 18 },
    { label: '۴٪ (قرض‌الحسنه)', rate: 4 }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Mode Switcher */}
      <div className="flex items-center justify-center">
        <div className="bg-slate-200/80 dark:bg-slate-900 border border-transparent dark:border-slate-800 p-1.5 rounded-2xl flex items-center gap-2 transition-colors">
          <button
            onClick={() => setActiveMode('deposit')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeMode === 'deposit'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>محاسبه سود سپرده بانکی (سرمایه‌گذاری)</span>
          </button>

          <button
            onClick={() => setActiveMode('loan')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeMode === 'loan'
                ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>محاسبه اقساط و سود وام بانکی</span>
          </button>
        </div>
      </div>

      {/* MODE 1: DEPOSIT CALCULATOR */}
      {activeMode === 'deposit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Inputs Panel */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5 transition-colors">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-500" />
                <span>ورود اطلاعات سپرده بانکی</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                محاسبه بر مبنای فرمول رسمی ۳۰ روزه بانک مرکزی: (مبلغ × نرخ × ۳۰) ÷ ۳۶,۵۰۰
              </p>
            </div>

            {/* Principal Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">مبلغ سپرده (تومان)</label>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                  {formatToman(depositAmount)} تومان
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="1000000"
                value={depositAmount || ''}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono text-left"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                به حروف: {numberToPersianWords(depositAmount)}
              </p>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {quickDepositPresets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDepositAmount(p.value)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-700 dark:hover:text-emerald-300 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Annual Rate */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">نرخ سود سالانه (درصد عددی)</label>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{depositRate}٪</span>
              </div>
              <input
                type="number"
                min="1"
                max="100"
                step="0.5"
                value={depositRate || ''}
                onChange={(e) => setDepositRate(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono text-left"
              />

              {/* Bank Presets */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {bankRates.map((r, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDepositRate(r.rate)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      depositRate === r.rate
                        ? 'bg-emerald-600 text-white font-medium'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Deposit Period Months */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">مدت سپرده‌گذاری</label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { label: 'روزشمار (۱ ماه)', val: 1 },
                  { label: '۳ ماهه', val: 3 },
                  { label: '۶ ماهه', val: 6 },
                  { label: '۱ ساله (۱۲ ماه)', val: 12 },
                  { label: '۲ ساله (۲۴ ماه)', val: 24 }
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setDepositMonths(item.val)}
                    className={`py-2 px-1 text-center rounded-xl font-medium transition-colors cursor-pointer ${
                      depositMonths === item.val
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Results Panel */}
          <div className="lg:col-span-6 space-y-4">
            
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-md">
              <span className="text-xs font-medium text-emerald-100 block mb-1">سود ماهیانه دریافتی</span>
              <div className="text-3xl font-extrabold font-mono tabular-nums mb-1">
                {formatToman(depositResult.monthlyInterest)} <span className="text-sm font-normal text-emerald-200">تومان در ماه</span>
              </div>
              <p className="text-xs text-emerald-100">
                به حروف: {numberToPersianWords(depositResult.monthlyInterest)}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4 transition-colors">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2">
                جزئیات و خلاصه محاسبات دوره {depositMonths} ماهه
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>سود تخمینی هر روز:</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                    {formatToman(depositResult.dailyInterest)} تومان
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>مجموع سود کل در پایان {depositMonths} ماه:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums text-sm">
                    {formatToman(depositResult.totalInterest)} تومان
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>مجموع اصل سرمایه + سود کل:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums text-sm">
                    {formatToman(depositResult.finalBalance)} تومان
                  </span>
                </div>

                {/* Compound interest hint */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/30 border border-transparent dark:border-emerald-900/40 rounded-xl p-3">
                  <div className="flex items-center gap-1 text-emerald-800 dark:text-emerald-300 font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>سود مرکب (در صورت عدم برداشت و سرمایه‌گذاری مجدد سود):</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span>موجودی نهایی مرکب:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {formatToman(depositResult.compoundFinalBalance || 0)} تومان
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <span>سود مازاد از سود مرکب:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">
                      +{formatToman((depositResult.compoundTotalInterest || 0) - depositResult.totalInterest)} تومان
                    </span>
                  </div>
                </div>

              </div>

              {/* Toggle monthly breakdown */}
              <button
                type="button"
                onClick={() => setShowDepositSchedule(!showDepositSchedule)}
                className="w-full flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white pt-2 border-t border-slate-100 dark:border-slate-800 cursor-pointer"
              >
                <span>مشاهده جدول واریزی ماه به ماه</span>
                {showDepositSchedule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showDepositSchedule && (
                <div className="max-h-56 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-xs text-right border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-950 sticky top-0">
                      <tr className="text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
                        <th className="py-2 px-3 text-center">ماه</th>
                        <th className="py-2 px-3 text-left">سود ماهانه</th>
                        <th className="py-2 px-3 text-left">مجموع سود تا این ماه</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {Array.from({ length: depositMonths }).map((_, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                          <td className="py-2 px-3 text-center font-mono text-slate-600 dark:text-slate-400">ماه {idx + 1}</td>
                          <td className="py-2 px-3 text-left font-mono tabular-nums text-slate-800 dark:text-slate-200">
                            {formatToman(depositResult.monthlyInterest)}
                          </td>
                          <td className="py-2 px-3 text-left font-mono tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatToman(depositResult.monthlyInterest * (idx + 1))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* MODE 2: LOAN CALCULATOR */}
      {activeMode === 'loan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Inputs Panel */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5 transition-colors">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-blue-500" />
                <span>ورود اطلاعات وام و تسهیلات بانکی</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                محاسبه بر اساس فرمول استاندارد بانک مرکزی جمهوری اسلامی ایران برای اقساط مساوی
              </p>
            </div>

            {/* Loan Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">مبلغ کل وام دریافتی (تومان)</label>
                <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold tabular-nums">
                  {formatToman(loanAmount)} تومان
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="5000000"
                value={loanAmount || ''}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-mono text-left"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                به حروف: {numberToPersianWords(loanAmount)}
              </p>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {quickLoanPresets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLoanAmount(p.value)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-700 dark:hover:text-blue-300 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Loan Rate */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">نرخ سود تسهیلات (درصد سالانه)</label>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{loanRate}٪</span>
              </div>
              <input
                type="number"
                min="1"
                max="50"
                step="0.5"
                value={loanRate || ''}
                onChange={(e) => setLoanRate(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-mono text-left"
              />

              {/* Rate Presets */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {loanRates.map((r, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLoanRate(r.rate)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      loanRate === r.rate
                        ? 'bg-blue-600 text-white font-medium'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Loan Term (Months) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                تعداد اقساط ماهانه ({loanMonths} ماه = {(loanMonths / 12).toFixed(1)} سال)
              </label>
              <div className="grid grid-cols-5 gap-2 text-xs">
                {[12, 24, 36, 48, 60].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setLoanMonths(m)}
                    className={`py-2 px-1 text-center rounded-xl font-medium transition-colors cursor-pointer ${
                      loanMonths === m
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {m} قسط
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Loan Results Panel */}
          <div className="lg:col-span-6 space-y-4">
            
            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-2xl p-6 shadow-md">
              <span className="text-xs font-medium text-blue-200 block mb-1">مبلغ هر قسط ماهانه</span>
              <div className="text-3xl font-extrabold font-mono tabular-nums mb-1">
                {formatToman(loanResult.monthlyPayment)} <span className="text-sm font-normal text-blue-200">تومان</span>
              </div>
              <p className="text-xs text-blue-100">
                به حروف: {numberToPersianWords(loanResult.monthlyPayment)}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4 transition-colors">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2">
                خلاصه بازپرداخت وام
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>کل سود پرداختی به بانک:</span>
                  <span className="font-mono font-bold text-rose-500 tabular-nums text-sm">
                    {formatToman(loanResult.totalInterest)} تومان
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>کل بازپرداخت (اصل وام + سود):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums text-sm">
                    {formatToman(loanResult.totalRepayment)} تومان
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>نسبت سود به اصل وام:</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {loanAmount > 0 ? ((loanResult.totalInterest / loanAmount) * 100).toFixed(1) : 0}٪
                  </span>
                </div>
              </div>

              {/* Toggle Amortization Schedule */}
              <button
                type="button"
                onClick={() => setShowLoanSchedule(!showLoanSchedule)}
                className="w-full flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white pt-2 border-t border-slate-100 dark:border-slate-800 cursor-pointer"
              >
                <span>مشاهده جدول کامل استهلاک اقساط ({loanMonths} قسط)</span>
                {showLoanSchedule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showLoanSchedule && (
                <div className="max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-xs text-right border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-950 sticky top-0">
                      <tr className="text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
                        <th className="py-2 px-3 text-center">قسط</th>
                        <th className="py-2 px-3 text-left">مبلغ قسط</th>
                        <th className="py-2 px-3 text-left">سهم اصل</th>
                        <th className="py-2 px-3 text-left">سهم سود</th>
                        <th className="py-2 px-3 text-left">مانده وام</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {loanResult.schedule.map((row) => (
                        <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                          <td className="py-2 px-3 text-center font-mono text-slate-600 dark:text-slate-400">{row.month}</td>
                          <td className="py-2 px-3 text-left font-mono tabular-nums text-slate-800 dark:text-slate-200">{formatToman(row.monthlyPayment)}</td>
                          <td className="py-2 px-3 text-left font-mono tabular-nums text-slate-700 dark:text-slate-300">{formatToman(row.principalPayment)}</td>
                          <td className="py-2 px-3 text-left font-mono tabular-nums text-rose-500">{formatToman(row.interestPayment)}</td>
                          <td className="py-2 px-3 text-left font-mono tabular-nums text-slate-500 dark:text-slate-400">{formatToman(row.remainingBalance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
