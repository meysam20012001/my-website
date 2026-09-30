import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs 
} from 'firebase/firestore';
import { db, initAuth } from '../firebase';
import { Customer, Invoice, BusinessSettings } from '../types';

const INVOICES_COLLECTION = 'invoices';
const CUSTOMERS_COLLECTION = 'customers';
const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'main_business_profile';

// Clean object helper to avoid Firestore rejecting `undefined` values
function sanitizeForFirestore<T extends Record<string, unknown>>(data: T): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        clean[key] = value.map((item) => 
          typeof item === 'object' && item !== null ? sanitizeForFirestore(item as Record<string, unknown>) : item
        );
      } else if (typeof value === 'object' && value !== null) {
        clean[key] = sanitizeForFirestore(value as Record<string, unknown>);
      } else {
        clean[key] = value;
      }
    }
  }
  return clean;
}

/**
 * Real-time subscription to Invoices collection
 */
export function subscribeToInvoices(
  onData: (invoices: Invoice[]) => void,
  onError?: (err: Error) => void
) {
  initAuth();
  const colRef = collection(db, INVOICES_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: Invoice[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        items.push({
          ...data,
          id: d.id,
          // ensure items array is restored properly
          items: Array.isArray(data.items) ? data.items : []
        } as Invoice);
      });
      // Sort newest first
      items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      onData(items);
    },
    (err) => {
      console.warn('Firestore invoices subscription error (fallback to local):', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Real-time subscription to Customers collection
 */
export function subscribeToCustomers(
  onData: (customers: Customer[]) => void,
  onError?: (err: Error) => void
) {
  initAuth();
  const colRef = collection(db, CUSTOMERS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: Customer[] = [];
      snapshot.forEach((d) => {
        items.push({ ...d.data(), id: d.id } as Customer);
      });
      items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      onData(items);
    },
    (err) => {
      console.warn('Firestore customers subscription error (fallback to local):', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Real-time subscription to Business Settings
 */
export function subscribeToSettings(
  onData: (settings: BusinessSettings) => void,
  onError?: (err: Error) => void
) {
  initAuth();
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data() as BusinessSettings);
      }
    },
    (err) => {
      console.warn('Firestore settings subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Save / Update an Invoice in Firestore
 */
export async function saveInvoiceCloud(invoice: Invoice): Promise<void> {
  await initAuth();
  const docRef = doc(db, INVOICES_COLLECTION, invoice.id);
  const clean = sanitizeForFirestore(invoice as unknown as Record<string, unknown>);
  await setDoc(docRef, clean, { merge: true });
}

/**
 * Delete an Invoice from Firestore
 */
export async function deleteInvoiceCloud(invoiceId: string): Promise<void> {
  await initAuth();
  const docRef = doc(db, INVOICES_COLLECTION, invoiceId);
  await deleteDoc(docRef);
}

/**
 * Save / Update a Customer in Firestore
 */
export async function saveCustomerCloud(customer: Customer): Promise<void> {
  await initAuth();
  const docRef = doc(db, CUSTOMERS_COLLECTION, customer.id);
  const clean = sanitizeForFirestore(customer as unknown as Record<string, unknown>);
  await setDoc(docRef, clean, { merge: true });
}

/**
 * Delete a Customer from Firestore
 */
export async function deleteCustomerCloud(customerId: string): Promise<void> {
  await initAuth();
  const docRef = doc(db, CUSTOMERS_COLLECTION, customerId);
  await deleteDoc(docRef);
}

/**
 * Save Business Profile & Settings in Firestore
 */
export async function saveSettingsCloud(settings: BusinessSettings): Promise<void> {
  await initAuth();
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  const clean = sanitizeForFirestore(settings as unknown as Record<string, unknown>);
  await setDoc(docRef, clean, { merge: true });
}

/**
 * Seeds initial demo data to Firestore if the cloud collections are empty
 */
export async function seedCloudDataIfEmpty(
  initialInvoices: Invoice[],
  initialCustomers: Customer[],
  initialSettings: BusinessSettings
): Promise<void> {
  try {
    await initAuth();
    const invoicesSnap = await getDocs(collection(db, INVOICES_COLLECTION));
    if (invoicesSnap.empty) {
      // Seed invoices
      for (const inv of initialInvoices) {
        await setDoc(doc(db, INVOICES_COLLECTION, inv.id), sanitizeForFirestore(inv as unknown as Record<string, unknown>));
      }
      // Seed customers
      for (const cust of initialCustomers) {
        await setDoc(doc(db, CUSTOMERS_COLLECTION, cust.id), sanitizeForFirestore(cust as unknown as Record<string, unknown>));
      }
      // Seed settings
      await setDoc(doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID), sanitizeForFirestore(initialSettings as unknown as Record<string, unknown>));
    }
  } catch (err) {
    console.warn('Could not seed cloud database automatically (running in offline/local mode):', err);
  }
}
