import { Customer, Invoice, BusinessSettings } from '../types';

export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'شرکت فناوری نوین پرداز',
    phone: '۰۹۱۲۱۱۱۴۴۵۵',
    nationalCode: '۱۰۱۰۲۳۴۵۶۷۸',
    address: 'تهران، خیابان آزادی، تقاطع نواب، برج تجارت، طبقه ۴',
    notes: 'مشتری حقوقی معتبر، پرداخت‌ها معمولاً سر موعد',
    createdAt: '1403/05/10'
  },
  {
    id: 'cust-2',
    name: 'فروشگاه الکترونیک مهر (آقای مرادی)',
    phone: '۰۹۳۵۲۲۲۳۳۴۴',
    nationalCode: '۰۰۷۶۵۴۳۲۱۰',
    address: 'اصفهان، خیابان فردوسی، پاساژ پایتخت، پلاک ۱۲',
    notes: 'همکار صنف و خریدار عمده لوازم جانبی',
    createdAt: '1403/06/01'
  },
  {
    id: 'cust-3',
    name: 'خانم مهندس سارا صادقی',
    phone: '۰۹۱۹۷۷۷۸۸۹۹',
    nationalCode: '۰۴۴۱۲۳۴۵۶۷',
    address: 'شیراز، خیابان زند، کوچه حافظ، ساختمان بهار',
    notes: 'پروژه‌های طراحی و مشاوره شبکه‌های محلی',
    createdAt: '1403/06/15'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: '۱۴۰۳-۱۰۱',
    customerId: 'cust-1',
    customerName: 'شرکت فناوری نوین پرداز',
    customerPhone: '۰۹۱۲۱۱۱۴۴۵۵',
    customerAddress: 'تهران، خیابان آزادی، تقاطع نواب، برج تجارت',
    dateJalali: '1403/06/20',
    dueDateJalali: '1403/07/05',
    items: [
      {
        id: 'item-1',
        title: 'طراحی رابط کاربری و سامانه داشبورد مدیریتی',
        quantity: 1,
        unit: 'پروژه',
        unitPrice: 18500000,
        discountPercent: 5,
        total: 17575000
      },
      {
        id: 'item-2',
        title: 'پشتیبانی فنی و نگهداری سرور ۳ ماهه',
        quantity: 3,
        unit: 'ماه',
        unitPrice: 3000000,
        discountPercent: 0,
        total: 9000000
      }
    ],
    subtotal: 27500000,
    discountTotal: 925000,
    vatPercent: 10,
    vatAmount: 2657500,
    grandTotal: 29232500,
    status: 'paid',
    paidAmount: 29232500,
    paymentMethod: 'پایا / شبا',
    notes: 'مبلغ به طور کامل تسویه گردید.',
    createdAt: '1403/06/20'
  },
  {
    id: 'inv-102',
    invoiceNumber: '۱۴۰۳-۱۰۲',
    customerId: 'cust-2',
    customerName: 'فروشگاه الکترونیک مهر (آقای مرادی)',
    customerPhone: '۰۹۳۵۲۲۲۳۳۴۴',
    customerAddress: 'اصفهان، خیابان فردوسی، پاساژ پایتخت',
    dateJalali: '1403/06/28',
    dueDateJalali: '1403/07/15',
    items: [
      {
        id: 'item-3',
        title: 'مودم روتر بی‌سیم دو بانده گیگابیتی',
        quantity: 8,
        unit: 'دستگاه',
        unitPrice: 2850000,
        discountPercent: 0,
        total: 22800000
      },
      {
        id: 'item-4',
        title: 'کابل شبکه Cat6 تمام مس لگراند (حلقه ۳۰۵ متری)',
        quantity: 2,
        unit: 'حلقه',
        unitPrice: 4200000,
        discountPercent: 5,
        total: 7980000
      }
    ],
    subtotal: 31200000,
    discountTotal: 420000,
    vatPercent: 0,
    vatAmount: 0,
    grandTotal: 30780000,
    status: 'paid',
    paidAmount: 30780000,
    paymentMethod: 'کارت‌خوان فروشگاهی',
    notes: 'تحویل داده شد به باربری وطن.',
    createdAt: '1403/06/28'
  },
  {
    id: 'inv-103',
    invoiceNumber: '۱۴۰۳-۱۰۳',
    customerId: 'cust-3',
    customerName: 'خانم مهندس سارا صادقی',
    customerPhone: '۰۹۱۹۷۷۷۸۸۹۹',
    customerAddress: 'شیراز، خیابان زند، کوچه حافظ',
    dateJalali: '1403/07/01',
    dueDateJalali: '1403/07/20',
    items: [
      {
        id: 'item-5',
        title: 'لایسنس نرم‌افزار یکپارچه حسابداری و مدیریت مالی',
        quantity: 1,
        unit: 'کاربر',
        unitPrice: 16000000,
        discountPercent: 10,
        total: 14400000
      },
      {
        id: 'item-6',
        title: 'نصب، راه‌اندازی و آموزش حضوری پرسنل',
        quantity: 6,
        unit: 'ساعت',
        unitPrice: 1200000,
        discountPercent: 0,
        total: 7200000
      }
    ],
    subtotal: 23200000,
    discountTotal: 1600000,
    vatPercent: 10,
    vatAmount: 2160000,
    grandTotal: 23760000,
    status: 'unpaid',
    paidAmount: 0,
    paymentMethod: 'چک صیادی ۲۰ روزه',
    notes: 'موعد وصول چک در تاریخ ۲۰ مهرماه می‌باشد.',
    createdAt: '1403/07/01'
  },
  {
    id: 'inv-104',
    invoiceNumber: '۱۴۰۳-۱۰۴',
    customerId: 'cust-1',
    customerName: 'شرکت فناوری نوین پرداز',
    customerPhone: '۰۹۱۲۱۱۱۴۴۵۵',
    customerAddress: 'تهران، برج تجارت',
    dateJalali: '1403/07/03',
    dueDateJalali: '1403/07/25',
    items: [
      {
        id: 'item-7',
        title: 'سرور اختصاصی رک‌مونت HP با رم ۶۴ گیگابایت',
        quantity: 1,
        unit: 'دستگاه',
        unitPrice: 78000000,
        discountPercent: 0,
        total: 78000000
      }
    ],
    subtotal: 78000000,
    discountTotal: 0,
    vatPercent: 10,
    vatAmount: 7800000,
    grandTotal: 85800000,
    status: 'partial',
    paidAmount: 40000000,
    paymentMethod: 'واریز بانکی / کارت به کارت',
    notes: '۴۰ میلیون تومان بیعانه واریز شد؛ الباقی پس از تحویل و تست.',
    createdAt: '1403/07/03'
  }
];

export const initialBusinessSettings: BusinessSettings = {
  businessName: 'فناوری و خدمات بازرگانی آریا',
  ownerName: 'مهندس میثم قدوسی',
  phone: '۰۲۱-۸۸۹۹۲۲۳۳',
  nationalId: '۱۰۱۰۹۸۷۶۵۴۳',
  address: 'تهران، خیابان ولیعصر، نرسیده به میدان ونک، مجتمع پارسیان، پلاک ۴۲',
  cardNumber: '۶۰۳۷-۹۹۷۵-۱۲۳۴-۵۶۷۸',
  shabaNumber: 'IR120170000000123456789012',
  bankName: 'بانک ملی ایران',
  defaultVatPercent: 10,
  defaultTerms: '۱. کلیه اقلام دارای گارانتی اصالت و سلامت فیزیکی می‌باشند.\n۲. مهلت تست و مرجوعی کالا تا ۴۸ ساعت پس از تحویل امکان‌پذیر است.\n۳. تسویه فاکتور تا قبل از موعد سررسید الزامی است.'
};

export const sampleProductTemplates = [
  { title: 'طراحی وب‌سایت شرکتی و بهینه‌سازی', unit: 'پروژه', defaultPrice: 22000000 },
  { title: 'سرور اختصاصی مجازی (ماهانه)', unit: 'ماه', defaultPrice: 1800000 },
  { title: 'مودم روتر سیم‌کارتی 5G', unit: 'دستگاه', defaultPrice: 8500000 },
  { title: 'کابل شبکه Cat6 تمام مس لگراند', unit: 'حلقه', defaultPrice: 4200000 },
  { title: 'پشتیبانی فنی و امنیت شبکه', unit: 'ماه', defaultPrice: 4500000 },
  { title: 'مانیتور اداری ۲۴ اینچ IPS', unit: 'دستگاه', defaultPrice: 6800000 },
  { title: 'مشاوره سئو و دیجیتال مارکتینگ', unit: 'ساعت', defaultPrice: 1500000 }
];
