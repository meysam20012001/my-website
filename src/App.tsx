/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BusinessDashboard } from './components/business/BusinessDashboard';
import { InvoiceModal } from './components/business/InvoiceModal';
import { InvoiceViewModal } from './components/business/InvoiceViewModal';
import { CustomerModal } from './components/business/CustomerModal';
import { BankInterestCalculator } from './components/calculator/BankInterestCalculator';
import { PercentageCalculator } from './components/calculator/PercentageCalculator';
import { DateConverter } from './components/converter/DateConverter';
import { 
  Customer, 
  Invoice, 
  BusinessSettings, 
  ActiveTab, 
  PaymentStatus 
} from './types';
import { 
  initialCustomers, 
  initialInvoices, 
  initialBusinessSettings 
} from './data/initialData';
import {
  subscribeToInvoices,
  subscribeToCustomers,
  subscribeToSettings,
  saveInvoiceCloud,
  deleteInvoiceCloud,
  saveCustomerCloud,
  deleteCustomerCloud,
  saveSettingsCloud,
  seedCloudDataIfEmpty
} from './services/dbService';

const LOCAL_STORAGE_KEY_INVOICES = 'hesabyar_invoices_v1';
const LOCAL_STORAGE_KEY_CUSTOMERS = 'hesabyar_customers_v1';
const LOCAL_STORAGE_KEY_SETTINGS = 'hesabyar_settings_v1';
const LOCAL_STORAGE_KEY_THEME = 'hesabyar_theme_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('business');
  const [cloudConnected, setCloudConnected] = useState(true);

  // Dark / Light Theme (default dark)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_THEME);
      return (saved as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem(LOCAL_STORAGE_KEY_THEME, theme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Load state from localStorage with fallbacks
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_INVOICES);
      return saved ? JSON.parse(saved) : initialInvoices;
    } catch {
      return initialInvoices;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOMERS);
      return saved ? JSON.parse(saved) : initialCustomers;
    } catch {
      return initialCustomers;
    }
  });

  const [settings, setSettings] = useState<BusinessSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
      return saved ? JSON.parse(saved) : initialBusinessSettings;
    } catch {
      return initialBusinessSettings;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_INVOICES, JSON.stringify(invoices));
    } catch (e) {
      console.error('Failed to save invoices to localStorage', e);
    }
  }, [invoices]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOMERS, JSON.stringify(customers));
    } catch (e) {
      console.error('Failed to save customers to localStorage', e);
    }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  // Real-time Cloud Database (Firestore) Sync
  useEffect(() => {
    // Seed initial data if cloud database is brand new
    seedCloudDataIfEmpty(initialInvoices, initialCustomers, initialBusinessSettings);

    const unsubInvoices = subscribeToInvoices(
      (cloudInvoices) => {
        if (cloudInvoices.length > 0) {
          setInvoices(cloudInvoices);
        }
        setCloudConnected(true);
      },
      () => setCloudConnected(false)
    );

    const unsubCustomers = subscribeToCustomers(
      (cloudCustomers) => {
        if (cloudCustomers.length > 0) {
          setCustomers(cloudCustomers);
        }
        setCloudConnected(true);
      },
      () => setCloudConnected(false)
    );

    const unsubSettings = subscribeToSettings(
      (cloudSettings) => {
        if (cloudSettings) {
          setSettings(cloudSettings);
        }
        setCloudConnected(true);
      },
      () => setCloudConnected(false)
    );

    return () => {
      unsubInvoices();
      unsubCustomers();
      unsubSettings();
    };
  }, []);

  // Modal States
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Invoices Handlers
  const handleSaveInvoice = (invoice: Invoice) => {
    setInvoices((prev) => {
      const index = prev.findIndex((i) => i.id === invoice.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = invoice;
        return updated;
      }
      return [invoice, ...prev];
    });

    if (viewingInvoice?.id === invoice.id) {
      setViewingInvoice(invoice);
    }

    // Persist to Cloud Firestore
    saveInvoiceCloud(invoice).catch((err) =>
      console.warn('Could not save invoice to cloud, saved locally:', err)
    );
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    setInvoices((prev) => prev.filter((i) => i.id !== invoiceId));
    if (viewingInvoice?.id === invoiceId) {
      setViewingInvoice(null);
    }

    // Delete from Cloud Firestore
    deleteInvoiceCloud(invoiceId).catch((err) =>
      console.warn('Could not delete invoice from cloud, deleted locally:', err)
    );
  };

  const handleUpdateInvoiceStatus = (invoiceId: string, status: PaymentStatus, paidAmount?: number) => {
    let updatedInvoiceToSave: Invoice | null = null;

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const newPaidAmount =
          paidAmount !== undefined
            ? paidAmount
            : status === 'paid'
            ? inv.grandTotal
            : status === 'unpaid'
            ? 0
            : inv.paidAmount;
        const updated = {
          ...inv,
          status,
          paidAmount: newPaidAmount
        };
        updatedInvoiceToSave = updated;
        return updated;
      })
    );

    if (viewingInvoice?.id === invoiceId) {
      setViewingInvoice((prev) =>
        prev
          ? {
              ...prev,
              status,
              paidAmount:
                paidAmount !== undefined
                  ? paidAmount
                  : status === 'paid'
                  ? prev.grandTotal
                  : status === 'unpaid'
                  ? 0
                  : prev.paidAmount
            }
          : null
      );
    }

    if (updatedInvoiceToSave) {
      saveInvoiceCloud(updatedInvoiceToSave).catch((err) =>
        console.warn('Could not update status to cloud:', err)
      );
    }
  };

  // Customers Handlers
  const handleSaveCustomer = (customer: Customer) => {
    setCustomers((prev) => {
      const index = prev.findIndex((c) => c.id === customer.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = customer;
        return updated;
      }
      return [customer, ...prev];
    });

    // Persist to Cloud Firestore
    saveCustomerCloud(customer).catch((err) =>
      console.warn('Could not save customer to cloud:', err)
    );
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));

    // Delete from Cloud Firestore
    deleteCustomerCloud(customerId).catch((err) =>
      console.warn('Could not delete customer from cloud:', err)
    );
  };

  const handleSaveSettings = (newSettings: BusinessSettings) => {
    setSettings(newSettings);
    saveSettingsCloud(newSettings).catch((err) =>
      console.warn('Could not save settings to cloud:', err)
    );
  };

  // Reset demo data
  const handleResetData = () => {
    setInvoices(initialInvoices);
    setCustomers(initialCustomers);
    setSettings(initialBusinessSettings);
    localStorage.removeItem(LOCAL_STORAGE_KEY_INVOICES);
    localStorage.removeItem(LOCAL_STORAGE_KEY_CUSTOMERS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_SETTINGS);
    seedCloudDataIfEmpty(initialInvoices, initialCustomers, initialBusinessSettings);
  };

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col selection:bg-emerald-500 selection:text-white transition-colors`}>
      
      {/* Subtle Ambient Backing Glows (Zero JavaScript overhead, GPU hardware accelerated) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewInvoiceClick={() => {
          setEditingInvoice(null);
          setIsInvoiceModalOpen(true);
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
        cloudConnected={cloudConnected}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'business' && (
          <BusinessDashboard
            invoices={invoices}
            customers={customers}
            settings={settings}
            onOpenNewInvoice={() => {
              setEditingInvoice(null);
              setIsInvoiceModalOpen(true);
            }}
            onViewInvoice={(inv) => setViewingInvoice(inv)}
            onEditInvoice={(inv) => {
              setEditingInvoice(inv);
              setIsInvoiceModalOpen(true);
            }}
            onDeleteInvoice={handleDeleteInvoice}
            onUpdateStatus={handleUpdateInvoiceStatus}
            onOpenNewCustomer={() => {
              setEditingCustomer(null);
              setIsCustomerModalOpen(true);
            }}
            onEditCustomer={(cust) => {
              setEditingCustomer(cust);
              setIsCustomerModalOpen(true);
            }}
            onDeleteCustomer={handleDeleteCustomer}
            onUpdateSettings={setSettings}
            onResetData={handleResetData}
          />
        )}

        {activeTab === 'bank' && <BankInterestCalculator />}

        {activeTab === 'percentage' && <PercentageCalculator />}

        {activeTab === 'calendar' && <DateConverter />}
      </main>

      {/* Modals */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          setEditingInvoice(null);
        }}
        onSave={handleSaveInvoice}
        customers={customers}
        onAddCustomer={handleSaveCustomer}
        initialInvoice={editingInvoice}
      />

      <InvoiceViewModal
        invoice={viewingInvoice}
        settings={settings}
        onClose={() => setViewingInvoice(null)}
        onEdit={(inv) => {
          setViewingInvoice(null);
          setEditingInvoice(inv);
          setIsInvoiceModalOpen(true);
        }}
        onStatusChange={handleUpdateInvoiceStatus}
      />

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => {
          setIsCustomerModalOpen(false);
          setEditingCustomer(null);
        }}
        onSave={handleSaveCustomer}
        customer={editingCustomer}
      />

      {/* Clean Footer (No-print, no fake tickers) */}
      <footer className="no-print border-t border-slate-800 bg-slate-900/90 text-slate-400 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-semibold text-slate-200">حساب‌یار</span> — دستیار جامع مدیریت فاکتور، محاسبات مالی و تقویم
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('business')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              کسب‌وکار
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              سود بانکی و وام
            </button>
            <button
              onClick={() => setActiveTab('percentage')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              ماشین‌حساب درصد
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              تبدیل تاریخ
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
