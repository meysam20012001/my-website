import React from 'react';
import { ActiveTab } from '../types';
import { getCurrentDates } from '../utils/dateConverter';
import { 
  Building2, 
  Calculator, 
  Percent, 
  CalendarDays, 
  Plus,
  Moon,
  Sun
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onNewInvoiceClick: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  cloudConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onNewInvoiceClick,
  theme,
  onToggleTheme,
  cloudConnected = true
}) => {
  const dates = getCurrentDates();

  const navItems = [
    {
      id: 'business' as ActiveTab,
      label: 'مدیریت و فاکتورها',
      shortLabel: 'فاکتورها',
      icon: Building2
    },
    {
      id: 'bank' as ActiveTab,
      label: 'سود بانکی و وام',
      shortLabel: 'سود و وام',
      icon: Calculator
    },
    {
      id: 'percentage' as ActiveTab,
      label: 'ماشین‌حساب درصد',
      shortLabel: 'درصدها',
      icon: Percent
    },
    {
      id: 'calendar' as ActiveTab,
      label: 'تبدیل تاریخ',
      shortLabel: 'تقویم',
      icon: CalendarDays
    }
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/20 no-print transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-16 py-2 gap-2 sm:gap-4">
          
          {/* Zone 1: Wordmark / Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-xs opacity-50 group-hover:opacity-80 transition duration-300 pointer-events-none" />
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md ring-1 ring-emerald-400/40 shrink-0 transform group-hover:scale-105 transition-transform duration-200">
                <img
                  src="/src/assets/images/dragon_app_logo_1790765277563.jpg"
                  alt="لوگوی اژدها"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5 whitespace-nowrap">
                حساب‌یار
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">PRO</span>
              </span>
              <span className="text-[11px] text-slate-400 hidden 2xl:block whitespace-nowrap">
                سامانه هوشمند مالی و فاکتور
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none min-w-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="hidden lg:inline">{item.label}</span>
                  <span className="inline lg:hidden">{item.shortLabel}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions, Theme Toggle & Date */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {cloudConnected && (
              <div 
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium shrink-0" 
                title="دیتابیس ابری متصل و همگام است"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden md:inline">دیتابیس ابری</span>
              </div>
            )}

            {/* Date Badge: Only show on very wide screens to prevent overflow */}
            <div className="hidden 2xl:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/60 border border-slate-800/80 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="flex flex-col text-left items-end">
                <span className="text-xs font-semibold text-slate-200">
                  {dates.jalali.weekday}، {dates.jalali.jd} {dates.jalali.monthName}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {dates.gregorian.dateString}
                </span>
              </div>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'تغییر به تم روشن' : 'تغییر به تم تاریک'}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 rounded-xl transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shrink-0"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-300" />
              )}
            </button>

            <button
              onClick={onNewInvoiceClick}
              className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-95 rounded-xl shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400/30 transition-all duration-200 whitespace-nowrap cursor-pointer hover:-translate-y-0.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>فاکتور جدید</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
