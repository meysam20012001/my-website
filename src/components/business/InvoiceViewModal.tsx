import React from 'react';
import { Invoice, BusinessSettings, PaymentStatus } from '../../types';
import { formatToman } from '../../utils/dateConverter';
import { numberToPersianWords } from '../../utils/numberToPersianWords';
import { 
  Printer, 
  X, 
  Copy, 
  Check, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  CreditCard,
  Edit3
} from 'lucide-react';

interface InvoiceViewModalProps {
  invoice: Invoice | null;
  settings: BusinessSettings;
  onClose: () => void;
  onEdit: (invoice: Invoice) => void;
  onStatusChange: (invoiceId: string, newStatus: PaymentStatus, paidAmount?: number) => void;
}

export const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({
  invoice,
  settings,
  onClose,
  onEdit,
  onStatusChange
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `
صورت‌حساب شماره: ${invoice.invoiceNumber}
فروشنده: ${settings.businessName}
خریدار: ${invoice.customerName}
تاریخ: ${invoice.dateJalali}
${invoice.dueDateJalali ? `سررسید: ${invoice.dueDateJalali}\n` : ''}
اقلام:
${invoice.items.map((it, idx) => `${idx + 1}. ${it.title} - ${it.quantity} ${it.unit} به قیمت ${formatToman(it.unitPrice)} تومان (مجموع: ${formatToman(it.total)} تومان)`).join('\n')}

جمع کل فاکتور: ${formatToman(invoice.grandTotal)} تومان
وضعیت پرداخت: ${
  invoice.status === 'paid' ? 'تسویه شده' : invoice.status === 'partial' ? `بیعانه (${formatToman(invoice.paidAmount)} تومان پرداخت شد)` : 'پرداخت نشده (معوق)'
}
${settings.cardNumber ? `شماره کارت جهت واریز: ${settings.cardNumber}` : ''}
${settings.shabaNumber ? `شماره شبا: ${settings.shabaNumber}` : ''}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const remainingBalance = Math.max(0, invoice.grandTotal - (invoice.paidAmount || 0));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden my-4 print:my-0 print:shadow-none print:border-none print:max-w-none print:rounded-none transition-colors">
        
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="no-print bg-slate-900 dark:bg-slate-950 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="font-bold text-base">پیش‌نمایش فاکتور</span>
            <span className="text-xs text-slate-400 font-mono">#{invoice.invoiceNumber}</span>
            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700">
              {invoice.status === 'paid' && (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">تسویه شده</span>
                </>
              )}
              {invoice.status === 'partial' && (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-400 font-medium">نیمه‌پرداخت (بیعانه)</span>
                </>
              )}
              {invoice.status === 'unpaid' && (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-rose-400 font-medium">پرداخت نشده</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Status Buttons */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-1 text-xs">
              <button
                onClick={() => onStatusChange(invoice.id, 'paid', invoice.grandTotal)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  invoice.status === 'paid' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-300 hover:text-white'
                }`}
              >
                تسویه شد
              </button>
              <button
                onClick={() => onStatusChange(invoice.id, 'unpaid', 0)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  invoice.status === 'unpaid' ? 'bg-rose-600 text-white font-medium' : 'text-slate-300 hover:text-white'
                }`}
              >
                معوق
              </button>
            </div>

            <button
              onClick={() => onEdit(invoice)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>ویرایش</span>
            </button>

            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'کپی شد' : 'کپی متن'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ فاکتور</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE INVOICE BODY */}
        <div className="p-6 sm:p-10 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 print:bg-white print:text-black">
          
          {/* Header row */}
          <div className="border-b-2 border-slate-900 dark:border-slate-700 print:border-black pb-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 print:text-slate-600 block mb-1">صورت‌حساب فروش کالا و خدمات</span>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white print:text-black">{settings.businessName}</h1>
                <p className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-600 mt-1">مدیریت: {settings.ownerName}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 print:bg-slate-50 border border-slate-200 dark:border-slate-800 print:border-slate-300 rounded-xl p-3 text-xs min-w-[200px] text-right space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 print:text-slate-600">شماره فاکتور:</span>
                  <span className="font-bold text-slate-900 dark:text-white print:text-black font-mono">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 print:text-slate-600">تاریخ صدور:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 print:text-black font-mono">{invoice.dateJalali}</span>
                </div>
                {invoice.dueDateJalali && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 print:text-slate-600">تاریخ سررسید:</span>
                    <span className="font-medium text-rose-600 dark:text-rose-400 print:text-rose-700 font-mono">{invoice.dueDateJalali}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Parties Info Grid: Seller & Buyer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Seller Info */}
            <div className="border border-slate-200 dark:border-slate-800 print:border-slate-300 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/60 print:bg-white">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 print:text-emerald-800 block mb-2 border-b border-slate-200 dark:border-slate-800 print:border-slate-200 pb-1">
                مشخصات فروشنده
              </span>
              <div className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300 print:text-slate-700">
                <p><strong className="text-slate-900 dark:text-white print:text-black font-medium">نام واحد / شخص:</strong> {settings.businessName}</p>
                {settings.nationalId && (
                  <p><strong className="text-slate-900 dark:text-white print:text-black font-medium">شناسه ملی / ثبت:</strong> <span className="font-mono">{settings.nationalId}</span></p>
                )}
                <p><strong className="text-slate-900 dark:text-white print:text-black font-medium">شماره تماس:</strong> <span className="font-mono">{settings.phone}</span></p>
                {settings.address && (
                  <p className="line-clamp-2"><strong className="text-slate-900 dark:text-white print:text-black font-medium">نشانی:</strong> {settings.address}</p>
                )}
              </div>
            </div>

            {/* Buyer Info */}
            <div className="border border-slate-200 dark:border-slate-800 print:border-slate-300 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/60 print:bg-white">
              <span className="text-xs font-bold text-blue-800 dark:text-blue-400 print:text-blue-800 block mb-2 border-b border-slate-200 dark:border-slate-800 print:border-slate-200 pb-1">
                مشخصات خریدار
              </span>
              <div className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300 print:text-slate-700">
                <p><strong className="text-slate-900 dark:text-white print:text-black font-medium">نام خریدار:</strong> {invoice.customerName}</p>
                {invoice.customerPhone && (
                  <p><strong className="text-slate-900 dark:text-white print:text-black font-medium">شماره تماس:</strong> <span className="font-mono">{invoice.customerPhone}</span></p>
                )}
                {invoice.customerAddress && (
                  <p className="line-clamp-2"><strong className="text-slate-900 dark:text-white print:text-black font-medium">نشانی:</strong> {invoice.customerAddress}</p>
                )}
                <p>
                  <strong className="text-slate-900 dark:text-white print:text-black font-medium">وضعیت تسویه:</strong>{' '}
                  <span className={`font-semibold ${
                    invoice.status === 'paid' ? 'text-emerald-600 dark:text-emerald-400' : invoice.status === 'partial' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {invoice.status === 'paid' ? 'تسویه کامل' : invoice.status === 'partial' ? 'بیعانه' : 'بدهکار'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-300 dark:border-slate-700 print:border-slate-300 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-950 print:bg-slate-100 text-slate-700 dark:text-slate-300 print:text-slate-800 border-b border-slate-300 dark:border-slate-700 print:border-slate-300 font-semibold">
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3">شرح کالا یا خدمات</th>
                  <th className="py-2.5 px-3 w-16 text-center">تعداد</th>
                  <th className="py-2.5 px-3 w-16 text-center">واحد</th>
                  <th className="py-2.5 px-3 text-left">مبلغ واحد (تومان)</th>
                  <th className="py-2.5 px-3 text-center w-20">تخفیف</th>
                  <th className="py-2.5 px-3 text-left">مبلغ کل (تومان)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 print:divide-slate-200">
                {invoice.items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 print:hover:bg-transparent">
                    <td className="py-2.5 px-3 text-center text-slate-500 dark:text-slate-400 print:text-slate-500 font-mono">{index + 1}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white print:text-black">{item.title}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-800 dark:text-slate-200 print:text-black">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600 dark:text-slate-400 print:text-slate-600">{item.unit}</td>
                    <td className="py-2.5 px-3 text-left font-mono tabular-nums text-slate-800 dark:text-slate-200 print:text-black">{formatToman(item.unitPrice)}</td>
                    <td className="py-2.5 px-3 text-center text-slate-500 dark:text-slate-400 print:text-slate-500 font-mono">
                      {item.discountPercent > 0 ? `${item.discountPercent}٪` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-left font-mono font-semibold tabular-nums text-slate-900 dark:text-white print:text-black">
                      {formatToman(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invoice Summary and Verbal Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* Left: Notes, verbal amount, bank info */}
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-950 print:bg-slate-50 border border-slate-200 dark:border-slate-800 print:border-slate-200 rounded-xl p-3 text-xs">
                <span className="text-slate-500 dark:text-slate-400 print:text-slate-500 font-medium block mb-1">مبلغ به حروف:</span>
                <p className="font-bold text-slate-900 dark:text-white print:text-black leading-relaxed">
                  {numberToPersianWords(invoice.grandTotal)}
                </p>
              </div>

              {(settings.cardNumber || settings.shabaNumber) && (
                <div className="border border-slate-200 dark:border-slate-800 print:border-slate-200 rounded-xl p-3 text-xs bg-slate-50 dark:bg-slate-950 print:bg-slate-50">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 print:text-slate-800 mb-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>اطلاعات واریز وجه ({settings.bankName || 'بانک'})</span>
                  </div>
                  {settings.cardNumber && (
                    <p className="text-slate-700 dark:text-slate-300 print:text-slate-700">
                      شماره کارت: <span className="font-mono font-bold text-slate-900 dark:text-white print:text-black tracking-wider">{settings.cardNumber}</span>
                    </p>
                  )}
                  {settings.shabaNumber && (
                    <p className="text-slate-700 dark:text-slate-300 print:text-slate-700 mt-1">
                      شماره شبا: <span className="font-mono text-slate-900 dark:text-white print:text-black">{settings.shabaNumber}</span>
                    </p>
                  )}
                </div>
              )}

              {invoice.notes && (
                <div className="text-xs text-slate-600 dark:text-slate-300 print:text-slate-600 border-l-2 border-emerald-500 pl-3">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 print:text-slate-800 block mb-0.5">یادداشت فاکتور:</span>
                  <p>{invoice.notes}</p>
                </div>
              )}
            </div>

            {/* Right: Totals Breakdown */}
            <div className="bg-slate-50 dark:bg-slate-950 print:bg-slate-50 border border-slate-200 dark:border-slate-800 print:border-slate-200 rounded-xl p-4 text-xs space-y-2.5">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 print:text-slate-600">
                <span>جمع اقلام:</span>
                <span className="font-mono tabular-nums text-slate-900 dark:text-white print:text-black font-medium">{formatToman(invoice.subtotal)} تومان</span>
              </div>

              {invoice.discountTotal > 0 && (
                <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 print:text-emerald-700">
                  <span>تخفیف کل:</span>
                  <span className="font-mono tabular-nums font-medium">-{formatToman(invoice.discountTotal)} تومان</span>
                </div>
              )}

              {invoice.vatAmount > 0 && (
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 print:text-slate-600">
                  <span>مالیات بر ارزش افزوده ({invoice.vatPercent}٪):</span>
                  <span className="font-mono tabular-nums text-slate-900 dark:text-white print:text-black font-medium">+{formatToman(invoice.vatAmount)} تومان</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-300 dark:border-slate-800 print:border-slate-300 flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white print:text-black">
                <span>مبلغ نهایی قابل پرداخت:</span>
                <span className="font-mono tabular-nums text-base text-emerald-600 dark:text-emerald-400 print:text-emerald-700 font-extrabold">{formatToman(invoice.grandTotal)} تومان</span>
              </div>

              {invoice.paidAmount > 0 && invoice.status !== 'paid' && (
                <div className="pt-1 border-t border-dashed border-slate-200 dark:border-slate-800 print:border-slate-200 flex justify-between items-center text-xs text-slate-600 dark:text-slate-400 print:text-slate-600">
                  <span>مبلغ پرداختی (بیعانه):</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">{formatToman(invoice.paidAmount)} تومان</span>
                </div>
              )}

              {remainingBalance > 0 && invoice.status !== 'paid' && (
                <div className="flex justify-between items-center text-xs font-semibold text-rose-600 dark:text-rose-400 print:text-rose-700">
                  <span>مانده قابل تسویه:</span>
                  <span className="font-mono">{formatToman(remainingBalance)} تومان</span>
                </div>
              )}
            </div>

          </div>

          {/* Terms & Signatures */}
          <div className="border-t border-slate-200 dark:border-slate-800 print:border-slate-200 pt-6">
            {settings.defaultTerms && (
              <div className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600 mb-8 whitespace-pre-line leading-relaxed">
                <span className="font-bold text-slate-700 dark:text-slate-300 print:text-slate-800 block mb-1">شرایط و قوانین:</span>
                {settings.defaultTerms}
              </div>
            )}

            <div className="flex justify-between items-end pt-4 px-8 text-xs text-slate-700 dark:text-slate-300 print:text-slate-700">
              <div className="text-center w-40">
                <div className="border-b border-dashed border-slate-400 dark:border-slate-600 print:border-slate-400 pb-16 mb-2"></div>
                <span>مهر و امضای فروشنده</span>
              </div>
              <div className="text-center w-40">
                <div className="border-b border-dashed border-slate-400 dark:border-slate-600 print:border-slate-400 pb-16 mb-2"></div>
                <span>امضا و تایید خریدار</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
