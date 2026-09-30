import React, { useState } from 'react';
import { Customer } from '../../types';
import { getCurrentDates } from '../../utils/dateConverter';
import { X, Check } from 'lucide-react';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  customer?: Customer | null;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  customer
}) => {
  const currentDates = getCurrentDates();
  const [name, setName] = useState(customer?.name || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [nationalCode, setNationalCode] = useState(customer?.nationalCode || '');
  const [address, setAddress] = useState(customer?.address || '');
  const [notes, setNotes] = useState(customer?.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data: Customer = {
      id: customer ? customer.id : 'cust-' + Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      nationalCode: nationalCode.trim(),
      address: address.trim(),
      notes: notes.trim(),
      createdAt: customer ? customer.createdAt : currentDates.jalali.dateString
    };

    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors">
        
        <div className="bg-slate-900 dark:bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <h3 className="text-sm font-bold">
            {customer ? 'ویرایش مشخصات مشتری' : 'ثبت مشتری جدید'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              نام و نام خانوادگی / شرکت و موسسه *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: شرکت تجارت گستران یا آقای محمدی"
              required
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                شماره تماس یا همراه
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="۰۹۱۲..."
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono text-left text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                شناسه ملی / کد اقتصادی
              </label>
              <input
                type="text"
                value={nationalCode}
                onChange={(e) => setNationalCode(e.target.value)}
                placeholder="کد ملی یا شناسه ثبت"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono text-left text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              نشانی و آدرس
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="شهر، خیابان، پلاک..."
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              یادداشت درباره مشتری
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="توضیحات و شرایط همکاری..."
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>ذخیره مشخصات</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
