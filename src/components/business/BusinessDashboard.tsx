import React, { useState } from 'react';
import { Customer, Invoice, BusinessSettings, BusinessSubTab, PaymentStatus } from '../../types';
import { formatToman } from '../../utils/dateConverter';
import { CustomerPurchasesDrawer } from './CustomerPurchasesDrawer';
import { 
  FileText, 
  Users, 
  PackageSearch, 
  Settings, 
  Plus, 
  Search, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Phone, 
  ArrowUpRight,
  TrendingUp,
  Download,
  Upload,
  RefreshCw,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

interface BusinessDashboardProps {
  invoices: Invoice[];
  customers: Customer[];
  settings: BusinessSettings;
  onOpenNewInvoice: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onEditInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (invoiceId: string) => void;
  onUpdateStatus: (invoiceId: string, status: PaymentStatus, paidAmount?: number) => void;
  onOpenNewCustomer: () => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
  onUpdateSettings: (newSettings: BusinessSettings) => void;
  onResetData: () => void;
}

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  invoices,
  customers,
  settings,
  onOpenNewInvoice,
  onViewInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onUpdateStatus,
  onOpenNewCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onUpdateSettings,
  onResetData
}) => {
  const [subTab, setSubTab] = useState<BusinessSubTab>('invoices');
  
  // Invoices filter
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all');

  // Customer filter
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomerForHistory, setSelectedCustomerForHistory] = useState<Customer | null>(null);

  // Settings form state
  const [localSettings, setLocalSettings] = useState<BusinessSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // KPI Calculations
  const totalSales = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalPaid = invoices.reduce(
    (sum, inv) => sum + (inv.paidAmount || (inv.status === 'paid' ? inv.grandTotal : 0)),
    0
  );
  const totalPending = Math.max(0, totalSales - totalPaid);
  const unpaidCount = invoices.filter((i) => i.status !== 'paid').length;

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      (inv.customerPhone && inv.customerPhone.includes(invoiceSearch));
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered customers
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      (c.phone && c.phone.includes(customerSearch)) ||
      (c.address && c.address.toLowerCase().includes(customerSearch.toLowerCase()))
  );

  // Aggregated Items (All purchased items across business)
  const aggregatedItemsMap = new Map<string, { title: string; unit: string; totalQty: number; totalRevenue: number; buyers: Set<string>; lastDate: string }>();
  invoices.forEach((inv) => {
    inv.items.forEach((item) => {
      const existing = aggregatedItemsMap.get(item.title) || {
        title: item.title,
        unit: item.unit,
        totalQty: 0,
        totalRevenue: 0,
        buyers: new Set<string>(),
        lastDate: inv.dateJalali
      };
      existing.totalQty += Number(item.quantity) || 0;
      existing.totalRevenue += Number(item.total) || 0;
      existing.buyers.add(inv.customerName);
      if (inv.dateJalali > existing.lastDate) existing.lastDate = inv.dateJalali;
      aggregatedItemsMap.set(item.title, existing);
    });
  });
  const aggregatedItemsList = Array.from(aggregatedItemsMap.values()).sort(
    (a, b) => b.totalRevenue - a.totalRevenue
  );

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({ invoices, customers, settings }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `hesabyar_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Sales */}
        <div className="relative overflow-hidden before:absolute before:top-0 before:inset-x-0 before:h-1 before:bg-gradient-to-r before:from-emerald-500 before:to-teal-400 bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-emerald-950/20 hover:-translate-y-1 hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">مجموع فروش ناخالص</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums block tracking-tight">
              {formatToman(totalSales)}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">تومان (کل فاکتورهای ثبت شده)</span>
          </div>
        </div>

        {/* Card 2: Paid Amount */}
        <div className="relative overflow-hidden before:absolute before:top-0 before:inset-x-0 before:h-1 before:bg-gradient-to-r before:from-teal-500 before:to-cyan-400 bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-teal-950/20 hover:-translate-y-1 hover:border-teal-500/40 transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">وصول شده (دریافتی نقد)</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-teal-600 dark:text-teal-400 font-mono tabular-nums block tracking-tight">
              {formatToman(totalPaid)}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">تومان واریزی به حساب</span>
          </div>
        </div>

        {/* Card 3: Pending Receivables */}
        <div className="relative overflow-hidden before:absolute before:top-0 before:inset-x-0 before:h-1 before:bg-gradient-to-r before:from-rose-500 before:to-pink-500 bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-rose-950/20 hover:-translate-y-1 hover:border-rose-500/40 transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">مطالبات و طلب‌های معوق</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center shadow-xs">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 font-mono tabular-nums block tracking-tight">
              {formatToman(totalPending)}
            </span>
            <span className="text-xs text-rose-500 mt-1 block font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {unpaidCount} فاکتور نیازمند پیگیری تسویه
            </span>
          </div>
        </div>

        {/* Card 4: Customers Count */}
        <div className="relative overflow-hidden before:absolute before:top-0 before:inset-x-0 before:h-1 before:bg-gradient-to-r before:from-blue-500 before:to-indigo-500 bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-blue-950/20 hover:-translate-y-1 hover:border-blue-500/40 transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">تعداد مشتریان ثبت شده</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shadow-xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums block tracking-tight">
              {customers.length}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">شخص و شرکت خریدار</span>
          </div>
        </div>

      </div>

      {/* Sub-navigation Tabs */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-2xl p-2 shadow-xs transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950/90 rounded-xl overflow-x-auto">
            <button
              onClick={() => setSubTab('invoices')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                subTab === 'invoices'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>فاکتورها ({invoices.length})</span>
            </button>

            <button
              onClick={() => setSubTab('customers')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                subTab === 'customers'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-blue-500" />
              <span>چه کسی چی خریده؟ (مشتریان)</span>
            </button>

            <button
              onClick={() => setSubTab('items')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                subTab === 'items'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <PackageSearch className="w-4 h-4 text-purple-500" />
              <span>گزارش اقلام فروخته شده</span>
            </button>

            <button
              onClick={() => setSubTab('settings')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                subTab === 'settings'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>پروفایل کسب‌وکار</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {subTab === 'invoices' && (
              <button
                onClick={onOpenNewInvoice}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-95 rounded-xl shadow-md shadow-emerald-950/30 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>صدور فاکتور جدید</span>
              </button>
            )}

            {subTab === 'customers' && (
              <button
                onClick={onOpenNewCustomer}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 active:scale-95 rounded-xl shadow-md shadow-blue-950/30 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>ثبت مشتری جدید</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* SUB-TAB 1: INVOICES LIST */}
      {subTab === 'invoices' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-colors">
          
          {/* Filters Bar */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                placeholder="جستجوی شماره فاکتور یا مشتری..."
                className="w-full pr-9 pl-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            {/* Status Segmented Filter */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800 rounded-lg text-xs w-full sm:w-auto justify-center">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  statusFilter === 'all' 
                    ? 'bg-slate-900 dark:bg-slate-800 text-white font-medium' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                همه ({invoices.length})
              </button>
              <button
                onClick={() => setStatusFilter('paid')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  statusFilter === 'paid' 
                    ? 'bg-emerald-600 text-white font-medium' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-500'
                }`}
              >
                تسویه شده ({invoices.filter((i) => i.status === 'paid').length})
              </button>
              <button
                onClick={() => setStatusFilter('partial')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  statusFilter === 'partial' 
                    ? 'bg-amber-600 text-white font-medium' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-amber-500'
                }`}
              >
                بیعانه ({invoices.filter((i) => i.status === 'partial').length})
              </button>
              <button
                onClick={() => setStatusFilter('unpaid')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  statusFilter === 'unpaid' 
                    ? 'bg-rose-600 text-white font-medium' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-500'
                }`}
              >
                معوق ({invoices.filter((i) => i.status === 'unpaid').length})
              </button>
            </div>

          </div>

          {/* Table */}
          {filteredInvoices.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-3 stroke-1 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">فاکتوری با این مشخصات یافت نشد</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">با کلیک روی دکمه «صدور فاکتور جدید» اولین فاکتور را صادر کنید.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold">
                    <th className="py-3 px-4">شماره فاکتور</th>
                    <th className="py-3 px-4">خریدار (مشتری)</th>
                    <th className="py-3 px-4 text-center">تاریخ صدور</th>
                    <th className="py-3 px-4 text-center">سررسید</th>
                    <th className="py-3 px-4 text-left">مبلغ کل فاکتور</th>
                    <th className="py-3 px-4 text-center">وضعیت تسویه</th>
                    <th className="py-3 px-4 text-left">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{inv.customerName}</div>
                        {inv.customerPhone && (
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">{inv.customerPhone}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-600 dark:text-slate-300">
                        {inv.dateJalali}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-600 dark:text-slate-300">
                        {inv.dueDateJalali || '-'}
                      </td>
                      <td className="py-3 px-4 text-left font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                        {formatToman(inv.grandTotal)} <span className="text-[10px] text-slate-500 font-normal">تومان</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <select
                          value={inv.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as PaymentStatus;
                            onUpdateStatus(
                              inv.id,
                              newStatus,
                              newStatus === 'paid' ? inv.grandTotal : newStatus === 'unpaid' ? 0 : inv.paidAmount
                            );
                          }}
                          className={`text-xs px-2.5 py-1 rounded-md font-semibold border-0 cursor-pointer ${
                            inv.status === 'paid'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800'
                              : inv.status === 'partial'
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800'
                              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 ring-1 ring-rose-200 dark:ring-rose-800'
                          }`}
                        >
                          <option value="paid" className="bg-slate-900 text-white">تسویه شده</option>
                          <option value="partial" className="bg-slate-900 text-white">بیعانه</option>
                          <option value="unpaid" className="bg-slate-900 text-white">پرداخت نشده</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-left">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewInvoice(inv)}
                            title="مشاهده و چاپ فاکتور"
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditInvoice(inv)}
                            title="ویرایش فاکتور"
                            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`آیا از حذف فاکتور ${inv.invoiceNumber} اطمینان دارید؟`)) {
                                onDeleteInvoice(inv.id);
                              }
                            }}
                            title="حذف فاکتور"
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-900/30 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* SUB-TAB 2: "چه کسی چی خریده؟" (CUSTOMERS & PURCHASES) */}
      {subTab === 'customers' && (
        <div className="space-y-4">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="جستجوی نام مشتری، تلفن، آدرس..."
                className="w-full pr-9 pl-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              روی هر مشتری کلیک کنید تا تمام اقلام خریداری شده و سوابق مالی آن را مشاهده فرمایید.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((cust) => {
              const custInvoices = invoices.filter(
                (inv) => inv.customerId === cust.id || inv.customerName === cust.name
              );
              const custTotal = custInvoices.reduce((acc, inv) => acc + inv.grandTotal, 0);
              const custPaid = custInvoices.reduce(
                (acc, inv) => acc + (inv.paidAmount || (inv.status === 'paid' ? inv.grandTotal : 0)),
                0
              );
              const custDebt = Math.max(0, custTotal - custPaid);
              const totalItemsCount = custInvoices.reduce((acc, inv) => acc + inv.items.length, 0);

              return (
                <div
                  key={cust.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{cust.name}</h4>
                        {cust.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-mono">{cust.phone}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditCustomer(cust)}
                          title="ویرایش مشتری"
                          className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`آیا از حذف اطلاعات مشتری "${cust.name}" مطمئنید؟`)) {
                              onDeleteCustomer(cust.id);
                            }
                          }}
                          title="حذف مشتری"
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-900/30 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {cust.address && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-4">
                        {cust.address}
                      </p>
                    )}

                    {/* Financial summary for this customer */}
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-xs space-y-1.5 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">تعداد فاکتورها:</span>
                        <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{custInvoices.length} فاکتور ({totalItemsCount} ردیف کالا)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">کل خرید تا امروز:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{formatToman(custTotal)} تومان</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">مانده بدهی:</span>
                        <span className={`font-mono font-bold ${custDebt > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {custDebt > 0 ? `${formatToman(custDebt)} تومان` : 'تسویه شده'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCustomerForHistory(cust)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-xl transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>مشاهده تمام اقلام خریداری شده</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* SUB-TAB 3: AGGREGATED ITEMS SALES */}
      {subTab === 'items' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-colors">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">گزارش تجمیعی فروش کالاها و خدمات</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">آمار کامل میزان فروش و مشتریان هر محصول</p>
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              {aggregatedItemsList.length} نوع کالا / خدمت فروخته شده
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold">
                  <th className="py-3 px-4">شرح کالا / خدمات</th>
                  <th className="py-3 px-4 text-center">مجموع تعداد فروخته شده</th>
                  <th className="py-3 px-4 text-left">درآمد کل از این قلم</th>
                  <th className="py-3 px-4">خریداران این کالا</th>
                  <th className="py-3 px-4 text-center">آخرین تاریخ فروش</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {aggregatedItemsList.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{item.title}</td>
                    <td className="py-3 px-4 text-center font-mono font-medium text-slate-800 dark:text-slate-200">
                      {item.totalQty} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-left font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                      {formatToman(item.totalRevenue)} تومان
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                        {Array.from(item.buyers).map((buyer, bIdx) => (
                          <span key={bIdx} className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                            {buyer}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-500 dark:text-slate-400">
                      {item.lastDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: BUSINESS PROFILE & SETTINGS */}
      {subTab === 'settings' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs p-6 max-w-3xl mx-auto space-y-6 transition-colors">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">مشخصات و تنظیمات کسب‌وکار</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              این اطلاعات در سربرگ فاکتورهای رسمی و پیش‌فاکتورها جهت ارائه به مشتریان درج می‌شود.
            </p>
          </div>

          <form onSubmit={handleSettingsSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">نام فروشگاه / شرکت</label>
                <input
                  type="text"
                  value={localSettings.businessName}
                  onChange={(e) => setLocalSettings({ ...localSettings, businessName: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">نام مدیر / صادرکننده</label>
                <input
                  type="text"
                  value={localSettings.ownerName}
                  onChange={(e) => setLocalSettings({ ...localSettings, ownerName: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">شماره تماس ثابت / همراه</label>
                <input
                  type="text"
                  value={localSettings.phone}
                  onChange={(e) => setLocalSettings({ ...localSettings, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono text-left"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">شناسه ملی یا کد اقتصادی</label>
                <input
                  type="text"
                  value={localSettings.nationalId || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, nationalId: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono text-left"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">نشانی و آدرس کسب‌وکار</label>
              <input
                type="text"
                value={localSettings.address || ''}
                onChange={(e) => setLocalSettings({ ...localSettings, address: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">نام بانک</label>
                <input
                  type="text"
                  value={localSettings.bankName || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, bankName: e.target.value })}
                  placeholder="مثال: بانک ملی، ملت، سامان"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">شماره کارت جهت واریز</label>
                <input
                  type="text"
                  value={localSettings.cardNumber || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, cardNumber: e.target.value })}
                  placeholder="۶۰۳۷-..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono text-left"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">شماره شبا</label>
                <input
                  type="text"
                  value={localSettings.shabaNumber || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, shabaNumber: e.target.value })}
                  placeholder="IR..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono text-left"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">شرایط و قوانین پیش‌فرض فاکتور</label>
              <textarea
                rows={3}
                value={localSettings.defaultTerms || ''}
                onChange={(e) => setLocalSettings({ ...localSettings, defaultTerms: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              {settingsSaved ? (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> تنظیمات با موفقیت ذخیره شد.
                </span>
              ) : <div />}

              <button
                type="submit"
                className="px-6 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                ذخیره تنظیمات
              </button>
            </div>
          </form>

          {/* Backup & Restore Bar */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">پشتیبان‌گیری و بازیابی داده‌ها</h4>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportData}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>دانلود فایل پشتیبان (Backup)</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  if (confirm('آیا مایلید تمام داده‌ها را به مقادیر اولیه نمونه بازگردانید؟')) {
                    onResetData();
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-rose-400 bg-rose-950/40 border border-rose-900/50 hover:bg-rose-900/60 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>بازنشانی به داده‌های نمونه اولیه</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Customer Purchases Drawer */}
      <CustomerPurchasesDrawer
        customer={selectedCustomerForHistory}
        invoices={invoices}
        onClose={() => setSelectedCustomerForHistory(null)}
        onOpenInvoice={(inv: Invoice) => {
          setSelectedCustomerForHistory(null);
          onViewInvoice(inv);
        }}
      />

    </div>
  );
};
