import React from 'react';
import { Customer, Invoice } from '../../types';
import { formatToman } from '../../utils/dateConverter';
import { 
  X, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface CustomerPurchasesDrawerProps {
  customer: Customer | null;
  invoices: Invoice[];
  onClose: () => void;
  onOpenInvoice: (invoice: Invoice) => void;
}

export const CustomerPurchasesDrawer: React.FC<CustomerPurchasesDrawerProps> = ({
  customer,
  invoices,
  onClose,
  onOpenInvoice
}) => {
  if (!customer) return null;

  // Filter invoices belonging to this customer
  const customerInvoices = invoices.filter(
    (inv) => inv.customerId === customer.id || inv.customerName === customer.name
  );

  const totalSpent = customerInvoices.reduce((acc, inv) => acc + inv.grandTotal, 0);
  const totalPaid = customerInvoices.reduce((acc, inv) => acc + (inv.paidAmount || (inv.status === 'paid' ? inv.grandTotal : 0)), 0);
  const totalOutstanding = Math.max(0, totalSpent - totalPaid);

  // Extract all purchased items across all invoices of this customer
  const allPurchasedItems = customerInvoices.flatMap((inv) =>
    inv.items.map((item) => ({
      ...item,
      invoiceId: inv.id,
      invoiceNumber: inv.invoiceNumber,
      invoiceDate: inv.dateJalali,
      invoiceStatus: inv.status
    }))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/70 backdrop-blur-xs flex justify-end">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200 border-l border-slate-200 dark:border-slate-800 transition-colors">
        
        {/* Drawer Header */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-6 border-b border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-emerald-400 font-semibold tracking-wide">
              پرونده مشتری و تاریخچه خرید
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">{customer.name}</h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            {customer.phone && (
              <a
                href={`tel:${customer.phone}`}
                className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="font-mono">{customer.phone}</span>
              </a>
            )}
            {customer.address && (
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="line-clamp-1">{customer.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Financial KPI stats for this customer */}
        <div className="grid grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 text-center">
            <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">کل خریدهای ثبت شده</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {formatToman(totalSpent)} تومان
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 p-4 text-center">
            <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">مبالغ تسویه شده</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              {formatToman(totalPaid)} تومان
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 p-4 text-center">
            <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">بدهی / مانده معوق</span>
            <span className={`text-sm font-bold font-mono tabular-nums ${totalOutstanding > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`}>
              {formatToman(totalOutstanding)} تومان
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section: Exactly "چه کسی چی خریده" (Detailed purchased items list) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  اقلام و کالاهای خریداری شده توسط این مشتری ({allPurchasedItems.length} قلم)
                </h3>
              </div>
            </div>

            {allPurchasedItems.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs">
                هنوز کالایی برای این مشتری ثبت نشده است.
              </div>
            ) : (
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold">
                      <th className="py-2.5 px-3">کالا / خدمات</th>
                      <th className="py-2.5 px-3 text-center">تعداد</th>
                      <th className="py-2.5 px-3 text-left">مبلغ واحد</th>
                      <th className="py-2.5 px-3 text-left">مجموع</th>
                      <th className="py-2.5 px-3 text-center">تاریخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {allPurchasedItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">{item.title}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-800 dark:text-slate-200">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-2.5 px-3 text-left font-mono tabular-nums text-slate-600 dark:text-slate-400">
                          {formatToman(item.unitPrice)}
                        </td>
                        <td className="py-2.5 px-3 text-left font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                          {formatToman(item.total)}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-400 dark:text-slate-500">
                          {item.invoiceDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section: List of Invoices */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  فاکتورهای صادر شده ({customerInvoices.length})
                </h3>
              </div>
            </div>

            {customerInvoices.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs">
                فاکتوری برای این مشتری ثبت نشده است.
              </div>
            ) : (
              <div className="space-y-3">
                {customerInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => onOpenInvoice(inv)}
                    className="p-4 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-xl bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-800/80 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white font-mono">#{inv.invoiceNumber}</span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">{inv.dateJalali}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {inv.status === 'paid' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md font-medium">
                            <CheckCircle2 className="w-3 h-3" /> تسویه شده
                          </span>
                        )}
                        {inv.status === 'partial' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md font-medium">
                            <Clock className="w-3 h-3" /> بیعانه
                          </span>
                        )}
                        {inv.status === 'unpaid' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md font-medium">
                            <AlertCircle className="w-3 h-3" /> پرداخت نشده
                          </span>
                        )}
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        {inv.items.length} قلم کالا: {inv.items.map((i) => i.title).slice(0, 2).join('، ')}
                        {inv.items.length > 2 ? '...' : ''}
                      </span>
                      <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                        {formatToman(inv.grandTotal)} تومان
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
