import React, { useState, useEffect } from 'react';
import { Invoice, InvoiceItem, Customer, PaymentStatus } from '../../types';
import { getCurrentDates, addDaysToJalali, formatToman } from '../../utils/dateConverter';
import { sampleProductTemplates } from '../../data/initialData';
import { 
  X, 
  Plus, 
  Trash2, 
  Check, 
  UserPlus, 
  Calendar,
  Sparkles
} from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: Invoice) => void;
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  initialInvoice?: Invoice | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  customers,
  onAddCustomer,
  initialInvoice
}) => {
  const currentDates = getCurrentDates();

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [dateJalali, setDateJalali] = useState(currentDates.jalali.dateString);
  const [dueDateJalali, setDueDateJalali] = useState('');
  const [status, setStatus] = useState<PaymentStatus>('unpaid');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('کارت به کارت / واریز');
  const [notes, setNotes] = useState('');
  const [applyVat, setApplyVat] = useState(true);
  const [vatPercent, setVatPercent] = useState(10);

  // Items
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'item-' + Date.now(),
      title: '',
      quantity: 1,
      unit: 'عدد',
      unitPrice: 0,
      discountPercent: 0,
      total: 0
    }
  ]);

  // Inline Quick New Customer Modal State
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');

  // Reset or fill state on modal open
  useEffect(() => {
    if (!isOpen) return;

    if (initialInvoice) {
      setInvoiceNumber(initialInvoice.invoiceNumber);
      setSelectedCustomerId(initialInvoice.customerId);
      setDateJalali(initialInvoice.dateJalali);
      setDueDateJalali(initialInvoice.dueDateJalali || '');
      setStatus(initialInvoice.status);
      setPaidAmount(initialInvoice.paidAmount || 0);
      setPaymentMethod(initialInvoice.paymentMethod || 'کارت به کارت');
      setNotes(initialInvoice.notes || '');
      setApplyVat(initialInvoice.vatPercent > 0);
      setVatPercent(initialInvoice.vatPercent || 10);
      setItems(initialInvoice.items);
    } else {
      const randomNum = Math.floor(100 + Math.random() * 900);
      setInvoiceNumber(`۱۴۰۳-${randomNum}`);
      setSelectedCustomerId(customers[0]?.id || '');
      setDateJalali(currentDates.jalali.dateString);
      
      // Auto set due date to 15 days from today
      const due = addDaysToJalali(currentDates.jalali.jy, currentDates.jalali.jm, currentDates.jalali.jd, 15);
      setDueDateJalali(due.jalali.dateString);

      setStatus('unpaid');
      setPaidAmount(0);
      setPaymentMethod('کارت به کارت');
      setNotes('');
      setApplyVat(true);
      setVatPercent(10);
      setItems([
        {
          id: 'item-' + Date.now(),
          title: '',
          quantity: 1,
          unit: 'عدد',
          unitPrice: 0,
          discountPercent: 0,
          total: 0
        }
      ]);
    }
  }, [isOpen, initialInvoice, customers]);

  if (!isOpen) return null;

  // Item helpers
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };

    // Recalculate row total
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const discountPercent = Number(item.discountPercent) || 0;

    const rawTotal = quantity * unitPrice;
    const discountAmount = (rawTotal * discountPercent) / 100;
    item.total = Math.round(rawTotal - discountAmount);

    updated[index] = item;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        title: '',
        quantity: 1,
        unit: 'عدد',
        unitPrice: 0,
        discountPercent: 0,
        total: 0
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleApplyPreset = (index: number, template: { title: string; unit: string; defaultPrice: number }) => {
    const updated = [...items];
    const qty = updated[index].quantity || 1;
    const disc = updated[index].discountPercent || 0;
    const rawTotal = qty * template.defaultPrice;
    const discountAmount = (rawTotal * disc) / 100;

    updated[index] = {
      ...updated[index],
      title: template.title,
      unit: template.unit,
      unitPrice: template.defaultPrice,
      total: Math.round(rawTotal - discountAmount)
    };
    setItems(updated);
  };

  // Totals
  const subtotal = items.reduce((acc, it) => acc + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0);
  const totalAfterItemDiscounts = items.reduce((acc, it) => acc + (Number(it.total) || 0), 0);
  const discountTotal = subtotal - totalAfterItemDiscounts;
  const currentVatPercent = applyVat ? vatPercent : 0;
  const vatAmount = Math.round((totalAfterItemDiscounts * currentVatPercent) / 100);
  const grandTotal = totalAfterItemDiscounts + vatAmount;

  const handleSaveQuickCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;

    const newCust: Customer = {
      id: 'cust-' + Date.now(),
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      address: newCustAddress.trim(),
      createdAt: currentDates.jalali.dateString
    };

    onAddCustomer(newCust);
    setSelectedCustomerId(newCust.id);
    setShowNewCustomerModal(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find((c) => c.id === selectedCustomerId);
    if (!customer) {
      alert('لطفاً یک خریدار انتخاب کنید یا مشتری جدید اضافه نمایید.');
      return;
    }

    if (items.some((it) => !it.title.trim() || it.unitPrice <= 0)) {
      alert('لطفاً عنوان و مبلغ واحد معتبر برای تمام ردیف‌های فاکتور وارد کنید.');
      return;
    }

    const effectivePaid = status === 'paid' ? grandTotal : status === 'unpaid' ? 0 : paidAmount;

    const invoiceData: Invoice = {
      id: initialInvoice ? initialInvoice.id : 'inv-' + Date.now(),
      invoiceNumber: invoiceNumber.trim() || `۱۴۰۳-${Math.floor(100 + Math.random() * 900)}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: customer.address,
      dateJalali,
      dueDateJalali,
      items,
      subtotal,
      discountTotal,
      vatPercent: currentVatPercent,
      vatAmount,
      grandTotal,
      status,
      paidAmount: effectivePaid,
      paymentMethod,
      notes,
      createdAt: initialInvoice?.createdAt || dateJalali
    };

    onSave(invoiceData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-4 transition-colors">
        
        {/* Header */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold">
              {initialInvoice ? 'ویرایش صورت‌حساب' : 'صدور صورت‌حساب جدید'}
            </h2>
            <span className="text-xs text-slate-400">کسب‌وکار</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Top Row: Invoice Number, Dates, Customer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Invoice Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                شماره فاکتور
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono text-left"
              />
            </div>

            {/* Customer Select */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  خریدار (مشتری)
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewCustomerModal(true)}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ مشتری جدید</span>
                </button>
              </div>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.phone ? `(${c.phone})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Issue Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                تاریخ صدور (شمسی)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={dateJalali}
                  onChange={(e) => setDateJalali(e.target.value)}
                  placeholder="1403/07/04"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  تاریخ سررسید
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const due = addDaysToJalali(currentDates.jalali.jy, currentDates.jalali.jm, currentDates.jalali.jd, 30);
                    setDueDateJalali(due.jalali.dateString);
                  }}
                  className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-emerald-500 cursor-pointer"
                >
                  +۳۰ روز
                </button>
              </div>
              <input
                type="text"
                value={dueDateJalali}
                onChange={(e) => setDueDateJalali(e.target.value)}
                placeholder="1403/07/20"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono"
              />
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                وضعیت پرداخت
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PaymentStatus)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              >
                <option value="unpaid">پرداخت نشده (معوق)</option>
                <option value="paid">پرداخت شده (تسویه)</option>
                <option value="partial">پرداخت بیعانه (نیمه‌پرداخت)</option>
              </select>
            </div>

            {/* If Partial, paid amount */}
            {status === 'partial' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  مبلغ بیعانه دریافتی (تومان)
                </label>
                <input
                  type="number"
                  value={paidAmount || ''}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  placeholder="مبلغ پرداختی"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono"
                />
              </div>
            )}

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                نحوه تسویه
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              >
                <option value="کارت به کارت">کارت به کارت</option>
                <option value="پایا / شبا">پایا / ساتنا (شبا)</option>
                <option value="دستگاه پوز">دستگاه پوز فروشگاهی</option>
                <option value="چک صیادی">چک صیادی</option>
                <option value="نقدی">وجه نقدی</option>
              </select>
            </div>

          </div>

          {/* Items Section */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                اقلام و خدمات فاکتور ({items.length} قلم)
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن ردیف جدید</span>
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    
                    {/* Item Title */}
                    <div className="md:col-span-5">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          شرح کالا یا خدمات #{idx + 1}
                        </label>
                        {/* Preset quick templates dropdown */}
                        <div className="relative group">
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 cursor-pointer flex items-center gap-0.5">
                            <Sparkles className="w-3 h-3" />
                            <span>پیش‌فرض</span>
                          </span>
                          <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-1.5 w-56 text-right">
                            <p className="text-[10px] text-slate-400 px-2 py-1">انتخاب سریع از نمونه‌ها:</p>
                            {sampleProductTemplates.map((tpl, tplIdx) => (
                              <button
                                key={tplIdx}
                                type="button"
                                onClick={() => handleApplyPreset(idx, tpl)}
                                className="w-full text-right px-2 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded block transition-colors"
                              >
                                {tpl.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                        placeholder="نام یا توضیح کالا / خدمات"
                        required
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Quantity */}
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                        تعداد
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="any"
                        value={item.quantity || ''}
                        onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                        className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-emerald-500 font-mono text-center text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Unit */}
                    <div className="md:col-span-1">
                      <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                        واحد
                      </label>
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                        placeholder="عدد"
                        className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-center text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                        قیمت واحد (تومان)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice || ''}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                        placeholder="قیمت واحد"
                        className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-emerald-500 font-mono text-left text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Discount % */}
                    <div className="md:col-span-1">
                      <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                        تخفیف٪
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discountPercent || ''}
                        onChange={(e) => handleItemChange(idx, 'discountPercent', Number(e.target.value))}
                        placeholder="۰"
                        className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-center text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Total & Delete */}
                    <div className="md:col-span-1 flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-4">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        disabled={items.length <= 1}
                        className={`p-1.5 rounded-lg transition-colors ${
                          items.length <= 1
                            ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                            : 'text-rose-500 hover:text-rose-400 hover:bg-rose-900/20 cursor-pointer'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* Row Total Bar */}
                  <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>جمع این ردیف:</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {formatToman(item.total)} تومان
                    </span>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Tax, Notes, Totals Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Notes & Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  توضیحات و شرایط اختصاصی فاکتور
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: گارانتی یک‌ساله، تحویل درب محل، تسویه با چک ۲۰ روزه..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* VAT Switch */}
              <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    محاسبه مالیات بر ارزش افزوده (VAT)
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    افزودن نرخ قانونی {vatPercent}٪ به مبلغ کل
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={applyVat}
                  onChange={(e) => setApplyVat(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Calculations Box */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>جمع کل اقلام:</span>
                <span className="font-mono tabular-nums text-slate-900 dark:text-white font-semibold">{formatToman(subtotal)} تومان</span>
              </div>

              {discountTotal > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>مجموع تخفیف‌ها:</span>
                  <span className="font-mono tabular-nums font-semibold">-{formatToman(discountTotal)} تومان</span>
                </div>
              )}

              {applyVat && (
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>مالیات بر ارزش افزوده ({vatPercent}٪):</span>
                  <span className="font-mono tabular-nums text-slate-900 dark:text-white font-semibold">+{formatToman(vatAmount)} تومان</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-300 dark:border-slate-800 flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
                <span>مبلغ نهایی قابل پرداخت:</span>
                <span className="font-mono tabular-nums text-base text-emerald-600 dark:text-emerald-400 font-extrabold">
                  {formatToman(grandTotal)} تومان
                </span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{initialInvoice ? 'ذخیره تغییرات' : 'ثبت و صدور فاکتور'}</span>
            </button>
          </div>

        </form>

        {/* Quick Add Customer Sub-Modal */}
        {showNewCustomerModal && (
          <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-2xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">افزودن سریع مشتری جدید</h3>
                <button
                  type="button"
                  onClick={() => setShowNewCustomerModal(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    نام و نام خانوادگی / شرکت *
                  </label>
                  <input
                    type="text"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="مثال: شرکت بازرگانی آریا یا آقای محمدی"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    شماره تماس / همراه
                  </label>
                  <input
                    type="text"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="۰۹۱۲..."
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono text-left text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    نشانی / شهر
                  </label>
                  <input
                    type="text"
                    value={newCustAddress}
                    onChange={(e) => setNewCustAddress(e.target.value)}
                    placeholder="آدرس..."
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowNewCustomerModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    لغو
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveQuickCustomer}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg cursor-pointer"
                  >
                    ثبت مشتری
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
