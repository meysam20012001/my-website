import React, { useState } from 'react';
import { PercentageTools } from '../../utils/financialCalculations';
import { formatToman } from '../../utils/dateConverter';
import { 
  Percent, 
  TrendingUp, 
  Tag, 
  Receipt, 
  PieChart, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';

export const PercentageCalculator: React.FC = () => {
  // Tool 1: X% of Y
  const [percent1, setPercent1] = useState<number>(15);
  const [base1, setBase1] = useState<number>(2500000);
  const result1 = PercentageTools.percentOfNumber(percent1, base1);

  // Tool 2: X is what % of Y
  const [part2, setPart2] = useState<number>(750000);
  const [whole2, setWhole2] = useState<number>(3000000);
  const result2 = PercentageTools.whatPercentIs(part2, whole2);

  // Tool 3: Increase by X%
  const [base3, setBase3] = useState<number>(1800000);
  const [percent3, setPercent3] = useState<number>(20);
  const result3 = PercentageTools.increaseByPercent(base3, percent3);

  // Tool 4: Discount by X%
  const [base4, setBase4] = useState<number>(4500000);
  const [percent4, setPercent4] = useState<number>(25);
  const result4 = PercentageTools.discountByPercent(base4, percent4);

  // Tool 5: VAT Calculation (10%)
  const [base5, setBase5] = useState<number>(10000000);
  const [vatRate5, setVatRate5] = useState<number>(10);
  const result5 = PercentageTools.calculateVat(base5, vatRate5);

  // Tool 6: Extract Base from Total (Reverse VAT)
  const [total6, setTotal6] = useState<number>(11000000);
  const [vatRate6, setVatRate6] = useState<number>(10);
  const result6 = PercentageTools.extractBaseFromVat(total6, vatRate6);

  // Tool 7: Profit Margin & Markup
  const [costPrice, setCostPrice] = useState<number>(1500000);
  const [sellPrice, setSellPrice] = useState<number>(2250000);
  const marginResult = PercentageTools.calculateProfitMargin(costPrice, sellPrice);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Title */}
      <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-purple-500 before:via-pink-500 before:to-indigo-500 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center shadow-xs">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              ماشین‌حساب جامع درصد و محاسبات مالی کسب‌وکار
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              مجموعه ابزارهای کاربردی برای محاسبه انواع درصدها، تخفیف‌ها، مالیات و حاشیه سود
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 6 percentage calculators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tool 1: X% of Y */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">۱. محاسبه X درصد از یک عدد</span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">(X% × Y)</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">درصد (٪)</label>
                <input
                  type="number"
                  step="any"
                  value={percent1}
                  onChange={(e) => setPercent1(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-center text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">عدد پایه (تومان)</label>
                <input
                  type="number"
                  step="any"
                  value={base1}
                  onChange={(e) => setBase1(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-left text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 rounded-xl p-3 flex items-center justify-between">
            <span className="text-xs text-purple-900 dark:text-purple-300">
              {percent1}٪ از {formatToman(base1)} می‌شود:
            </span>
            <span className="text-sm font-bold text-purple-700 dark:text-purple-400 font-mono tabular-nums">
              {formatToman(result1)} تومان
            </span>
          </div>
        </div>

        {/* Tool 2: X is what percent of Y */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">۲. سهم درصدی (عدد X چند درصد از Y است؟)</span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">(X ÷ Y × 100)</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">مقدار جزئی (X)</label>
                <input
                  type="number"
                  step="any"
                  value={part2}
                  onChange={(e) => setPart2(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-left text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">کل مقدار (Y)</label>
                <input
                  type="number"
                  step="any"
                  value={whole2}
                  onChange={(e) => setWhole2(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-left text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl p-3 flex items-center justify-between">
            <span className="text-xs text-blue-900 dark:text-blue-300">
              {formatToman(part2)} از {formatToman(whole2)}:
            </span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono tabular-nums">
              {result2.toFixed(2)}٪
            </span>
          </div>
        </div>

        {/* Tool 3: Increase by X% */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">۳. افزایش درصدی (قیمت‌گذاری با تورم / سود)</span>
              <span className="text-[11px] text-emerald-500 font-medium">+افزایش</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">قیمت اولیه (تومان)</label>
                <input
                  type="number"
                  step="any"
                  value={base3}
                  onChange={(e) => setBase3(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-left text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">درصد افزایش (٪)</label>
                <input
                  type="number"
                  step="any"
                  value={percent3}
                  onChange={(e) => setPercent3(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-center text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-3 flex items-center justify-between">
            <div className="text-xs text-emerald-900 dark:text-emerald-300">
              <span>قیمت جدید:</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block">
                (+{formatToman(result3.addedAmount)} تومان افزایش)
              </span>
            </div>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              {formatToman(result3.result)} تومان
            </span>
          </div>
        </div>

        {/* Tool 4: Discount by X% */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">۴. تخفیف درصدی (قیمت حراج و تخفیف)</span>
              <span className="text-[11px] text-rose-500 font-medium">-تخفیف</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">قیمت قبل تخفیف (تومان)</label>
                <input
                  type="number"
                  step="any"
                  value={base4}
                  onChange={(e) => setBase4(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-left text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">درصد تخفیف (٪)</label>
                <input
                  type="number"
                  step="any"
                  value={percent4}
                  onChange={(e) => setPercent4(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-center text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-rose-50/60 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 rounded-xl p-3 flex items-center justify-between">
            <div className="text-xs text-rose-900 dark:text-rose-300">
              <span>قیمت پس از تخفیف:</span>
              <span className="text-[11px] text-rose-600 dark:text-rose-400 block">
                (سود خریدار: {formatToman(result4.discountAmount)} تومان)
              </span>
            </div>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400 font-mono tabular-nums">
              {formatToman(result4.result)} تومان
            </span>
          </div>
        </div>

        {/* Tool 5: VAT Calculator */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">۵. محاسبه مالیات بر ارزش افزوده (VAT)</span>
              <span className="text-[11px] text-amber-500 font-medium">ارزش افزوده</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">مبلغ پایه فاکتور</label>
                <input
                  type="number"
                  step="any"
                  value={base5}
                  onChange={(e) => setBase5(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-left text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">نرخ مالیات (٪)</label>
                <input
                  type="number"
                  step="any"
                  value={vatRate5}
                  onChange={(e) => setVatRate5(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-center text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50 rounded-xl p-3 flex items-center justify-between">
            <div className="text-xs text-amber-900 dark:text-amber-300">
              <span>مبلغ مالیات: {formatToman(result5.vatAmount)} تومان</span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 block font-semibold">مبلغ کل پرداختی:</span>
            </div>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
              {formatToman(result5.totalWithVat)} تومان
            </span>
          </div>
        </div>

        {/* Tool 6: Reverse VAT */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">۶. استخراج قیمت خالص قبل از مالیات (معکوس VAT)</span>
              <span className="text-[11px] text-teal-500 font-medium">تفکیک مالیات</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">کل مبلغ واریزی با مالیات</label>
                <input
                  type="number"
                  step="any"
                  value={total6}
                  onChange={(e) => setTotal6(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-left text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">نرخ ارزش افزوده (٪)</label>
                <input
                  type="number"
                  step="any"
                  value={vatRate6}
                  onChange={(e) => setVatRate6(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-center text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-teal-50/60 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/50 rounded-xl p-3 flex items-center justify-between">
            <div className="text-xs text-teal-900 dark:text-teal-300">
              <span>قیمت اصل کالا (خالص):</span>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 block">
                (سهم مالیات: {formatToman(result6.vatAmount)} تومان)
              </span>
            </div>
            <span className="text-sm font-bold text-teal-600 dark:text-teal-400 font-mono tabular-nums">
              {formatToman(result6.baseAmount)} تومان
            </span>
          </div>
        </div>

      </div>

      {/* Tool 7: Full Width Profit Margin Calculator */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-500" />
              <span>محاسبه حاشیه سود (Profit Margin) و نشاندار کردن قیمت (Markup)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              مقایسه درصد سود حاصله نسبت به قیمت تمام شده خرید و قیمت فروش به مشتری
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                بهای تمام شده خرید (Cost)
              </label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-left text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                قیمت فروش به مشتری (Selling Price)
              </label>
              <input
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-left text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block mb-1">سود خالص نقدی</span>
              <span className={`text-sm font-bold font-mono tabular-nums ${marginResult.isProfitable ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                {formatToman(marginResult.profit)} تومان
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block mb-1">حاشیه سود (Margin)</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono tabular-nums">
                {marginResult.marginPercent.toFixed(1)}٪
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block mb-1">مارک‌آپ (Markup)</span>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400 font-mono tabular-nums">
                {marginResult.markupPercent.toFixed(1)}٪
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
