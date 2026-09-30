export type PaymentStatus = 'paid' | 'unpaid' | 'partial';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  nationalCode?: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  title: string;
  quantity: number;
  unit: string; // e.g. عدد، کیلوگرم، ساعت، متر، بسته
  unitPrice: number; // in Tomans
  discountPercent: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  dateJalali: string;
  dueDateJalali?: string;
  items: InvoiceItem[];
  subtotal: number;
  discountTotal: number;
  vatPercent: number; // e.g. 10 or 0
  vatAmount: number;
  grandTotal: number;
  status: PaymentStatus;
  paidAmount: number;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
}

export interface BusinessSettings {
  businessName: string;
  ownerName: string;
  phone: string;
  nationalId?: string;
  address?: string;
  cardNumber?: string;
  shabaNumber?: string;
  bankName?: string;
  defaultVatPercent: number;
  defaultTerms?: string;
}

export type ActiveTab = 'business' | 'bank' | 'percentage' | 'calendar';

export type BusinessSubTab = 'invoices' | 'customers' | 'items' | 'settings';
