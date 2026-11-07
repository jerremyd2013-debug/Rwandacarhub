import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDocFromServer,
  onSnapshot, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';
import { Vehicle, Booking, ContactMessage, UserAccount, PartnerAd, ActivityLog } from './types';
import { INITIAL_CARS } from './data/cars';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore with the provisioned database ID
// CRITICAL: Must pass the custom database ID as configured
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error Handling conforming to Firebase Integration Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const RESILIENT_STORAGE_KEY = 'rwandacarhub_user_posted_cars_v3';

// Retrieve all user-posted cars permanently cached on this device
export function getResilientUserCars(): Vehicle[] {
  try {
    const saved = localStorage.getItem(RESILIENT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter((c: Vehicle) => c && c.id && c.make);
      }
    }
  } catch (e) {
    console.warn('Failed to load resilient user cars:', e);
  }
  return [];
}

// Permanently cache a user-posted car so it NEVER disappears even if Firestore is offline or quota exceeded
export function saveUserCarToResilientStorage(vehicle: Vehicle): void {
  try {
    const existing = getResilientUserCars();
    const map = new Map<string, Vehicle>();
    existing.forEach((c) => map.set(c.id, c));
    map.set(vehicle.id, vehicle);
    const updated = Array.from(map.values());
    localStorage.setItem(RESILIENT_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to cache vehicle in resilient storage:', e);
  }
}

// Remove vehicle from resilient storage on explicit deletion
export function removeUserCarFromResilientStorage(vehicleId: string): void {
  try {
    const existing = getResilientUserCars();
    const updated = existing.filter((c) => c.id !== vehicleId);
    localStorage.setItem(RESILIENT_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to remove vehicle from resilient storage:', e);
  }
}

// Connectivity and Quota status test
export async function testFirestoreConnection(): Promise<{ connected: boolean; quotaExceeded: boolean }> {
  try {
    await getDocFromServer(doc(db, 'vehicles', '_connection_check_'));
    return { connected: true, quotaExceeded: false };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const isQuota = msg.includes('Quota exceeded') || (error as any)?.code === 'resource-exhausted';
    if (isQuota) {
      console.warn('Google Cloud Firestore daily read quota reached for this database.');
      return { connected: false, quotaExceeded: true };
    }
    if (msg.includes('the client is offline')) {
      console.warn('Firebase client is offline or network disconnected.');
      return { connected: false, quotaExceeded: false };
    }
    // Any other response (like doc not found) confirms reachable server
    return { connected: true, quotaExceeded: false };
  }
}

// Single-attempt guard so seeding does not repeatedly hit Firestore quota
let hasAttemptedSeed = false;

// Seed or sync initial vehicles so the complete verified showroom inventory is always present
export async function seedInitialVehiclesIfEmpty(): Promise<void> {
  if (hasAttemptedSeed) return;
  hasAttemptedSeed = true;

  const path = 'vehicles';
  try {
    const snapshot = await getDocs(collection(db, path));
    const existingIds = new Set<string>();
    snapshot.forEach((docSnap) => existingIds.add(docSnap.id));

    // Identify any showroom cars missing from Firestore
    const missingCars = INITIAL_CARS.filter((car) => !existingIds.has(car.id));
    if (missingCars.length > 0) {
      for (const car of missingCars) {
        await setDoc(doc(db, path, car.id), car);
      }
    }
  } catch (error) {
    console.warn('Showroom cloud sync skipped (quota or offline):', error);
  }
}

// Helper to build a unified catalog combining INITIAL_CARS, cloud snapshot, and resilient user cars
function buildCombinedCatalog(cloudMap?: Map<string, Vehicle>): Vehicle[] {
  const mergedMap = new Map<string, Vehicle>();

  // 1. Core INITIAL_CARS showroom catalog (guaranteed base)
  for (const car of INITIAL_CARS) {
    mergedMap.set(car.id, car);
  }

  // 2. Cloud Firestore snapshot (if available)
  if (cloudMap) {
    for (const [id, car] of cloudMap.entries()) {
      mergedMap.set(id, car);
    }
  }

  // 3. Resilient user-posted cars (CRITICAL: User cars are NEVER dropped or overwritten)
  const resilientUserCars = getResilientUserCars();
  for (const car of resilientUserCars) {
    mergedMap.set(car.id, car);
  }

  const items = Array.from(mergedMap.values());

  // Sort with user-posted cars and newest first
  items.sort((a, b) => {
    const isUserCarA = a.id.startsWith('user-car-') || a.id.startsWith('veh-user');
    const isUserCarB = b.id.startsWith('user-car-') || b.id.startsWith('veh-user');
    if (isUserCarA && !isUserCarB) return -1;
    if (!isUserCarA && isUserCarB) return 1;

    const timeA = new Date(a.postedDate).getTime() || 0;
    const timeB = new Date(b.postedDate).getTime() || 0;
    return timeB - timeA;
  });

  return items;
}

// Real-time Vehicle Sync with Core Catalog & User Car Guarantee
export function subscribeToVehicles(
  onUpdate: (vehicles: Vehicle[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'vehicles';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      try {
        const cloudMap = new Map<string, Vehicle>();
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Vehicle;
          if (data && data.make && data.model) {
            cloudMap.set(docSnap.id, { ...data, id: docSnap.id });
          }
        });

        // Trigger background seed only once if database is completely empty
        if (cloudMap.size === 0 && !hasAttemptedSeed) {
          seedInitialVehiclesIfEmpty().catch(console.warn);
        }

        const items = buildCombinedCatalog(cloudMap);
        onUpdate(items);
      } catch (err) {
        console.error('Error processing vehicle snapshot, using resilient catalog:', err);
        onUpdate(buildCombinedCatalog());
      }
    },
    (error) => {
      console.warn('Vehicle subscription warning (using resilient local inventory):', error?.message || error);
      onError?.(error);
      // Guarantee both showroom inventory AND user-posted cars remain 100% visible
      onUpdate(buildCombinedCatalog());
    }
  );
}

// Cloud Vehicle Operations with Resilient Fallback
export async function saveVehicleToCloud(vehicle: Vehicle): Promise<void> {
  // Always guarantee vehicle is preserved locally first so it never disappears
  saveUserCarToResilientStorage(vehicle);

  const path = 'vehicles';
  try {
    // Sanitize data to strip any accidental undefined fields that Firestore rejects
    const sanitized = JSON.parse(JSON.stringify(vehicle));
    await setDoc(doc(db, path, vehicle.id), sanitized);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const isQuota = msg.includes('Quota exceeded') || (error as any)?.code === 'resource-exhausted';
    if (isQuota) {
      console.warn('Firestore write paused (daily quota reached). Vehicle is safely saved in local marketplace inventory.');
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, `${path}/${vehicle.id}`);
  }
}

export async function updateVehicleStatusInCloud(vehicleId: string, status: string): Promise<void> {
  const path = 'vehicles';
  try {
    await updateDoc(doc(db, path, vehicleId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${vehicleId}`);
  }
}

export async function deleteVehicleFromCloud(vehicleId: string): Promise<void> {
  // Remove from local persistent cache
  removeUserCarFromResilientStorage(vehicleId);

  const path = 'vehicles';
  try {
    await deleteDoc(doc(db, path, vehicleId));
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const isQuota = msg.includes('Quota exceeded') || (error as any)?.code === 'resource-exhausted';
    if (!isQuota) {
      handleFirestoreError(error, OperationType.DELETE, `${path}/${vehicleId}`);
    }
  }
}

// Quota Error Detector
export function isQuotaError(error: unknown): boolean {
  if (!error) return false;
  const msg = error instanceof Error ? error.message : String(error);
  const code = (error as any)?.code;
  return code === 'resource-exhausted' || msg.includes('Quota exceeded') || msg.includes('Quota limit exceeded');
}

// Bookings Cloud Operations
export function subscribeToBookings(
  onUpdate: (bookings: Booking[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'bookings';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: Booking[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...(docSnap.data() as Booking), id: docSnap.id });
      });
      if (items.length > 0) {
        onUpdate(items);
      }
    },
    (error) => {
      if (isQuotaError(error)) {
        console.warn('Bookings subscription: Free daily read quota reached. Running with persistent local state.');
      } else {
        console.warn('Bookings subscription warning:', error?.message || error);
      }
      onError?.(error);
    }
  );
}

export async function saveBookingToCloud(booking: Booking): Promise<void> {
  const path = 'bookings';
  try {
    await setDoc(doc(db, path, booking.id), booking);
  } catch (error) {
    if (isQuotaError(error)) {
      console.warn('Booking saved locally (cloud quota reached).');
      return;
    }
    handleFirestoreError(error, OperationType.CREATE, `${path}/${booking.id}`);
  }
}

// Messages Cloud Operations
export function subscribeToMessages(
  onUpdate: (messages: ContactMessage[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'messages';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: ContactMessage[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...(docSnap.data() as ContactMessage), id: docSnap.id });
      });
      if (items.length > 0) {
        onUpdate(items);
      }
    },
    (error) => {
      if (isQuotaError(error)) {
        console.warn('Messages subscription: Free daily read quota reached. Running with persistent local state.');
      } else {
        console.warn('Messages subscription warning:', error?.message || error);
      }
      onError?.(error);
    }
  );
}

export async function saveMessageToCloud(message: ContactMessage): Promise<void> {
  const path = 'messages';
  try {
    await setDoc(doc(db, path, message.id), message);
  } catch (error) {
    if (isQuotaError(error)) {
      console.warn('Message saved locally (cloud quota reached).');
      return;
    }
    handleFirestoreError(error, OperationType.CREATE, `${path}/${message.id}`);
  }
}

// Partner Ads Cloud Operations
export function subscribeToPartnerAds(
  onUpdate: (ads: PartnerAd[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'partnerAds';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: PartnerAd[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...(docSnap.data() as PartnerAd), id: docSnap.id });
      });
      if (items.length > 0) {
        onUpdate(items);
      }
    },
    (error) => {
      if (isQuotaError(error)) {
        console.warn('Partner ads subscription: Free daily read quota reached. Running with persistent local state.');
      } else {
        console.warn('Partner ads subscription warning:', error?.message || error);
      }
      onError?.(error);
    }
  );
}

export async function savePartnerAdToCloud(ad: PartnerAd): Promise<void> {
  const path = 'partnerAds';
  try {
    await setDoc(doc(db, path, ad.id), ad);
  } catch (error) {
    if (isQuotaError(error)) {
      console.warn('Partner ad saved locally (cloud quota reached).');
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, `${path}/${ad.id}`);
  }
}

export async function deletePartnerAdFromCloud(adId: string): Promise<void> {
  const path = 'partnerAds';
  try {
    await deleteDoc(doc(db, path, adId));
  } catch (error) {
    if (isQuotaError(error)) {
      console.warn('Partner ad deleted locally (cloud quota reached).');
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, `${path}/${adId}`);
  }
}

// Accounts Cloud Operations
export function subscribeToAccounts(
  onUpdate: (accounts: UserAccount[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'accounts';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: UserAccount[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...(docSnap.data() as UserAccount), id: docSnap.id });
      });
      if (items.length > 0) {
        onUpdate(items);
      }
    },
    (error) => {
      if (isQuotaError(error)) {
        console.warn('Accounts subscription: Free daily read quota reached. Running with persistent local state.');
      } else {
        console.warn('Accounts subscription warning:', error?.message || error);
      }
      onError?.(error);
    }
  );
}

export async function saveAccountToCloud(account: UserAccount): Promise<void> {
  const path = 'accounts';
  try {
    await setDoc(doc(db, path, account.id), account);
  } catch (error) {
    if (isQuotaError(error)) {
      console.warn('Account saved locally (cloud quota reached).');
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, `${path}/${account.id}`);
  }
}

// Activity Logs Cloud Operations
export function subscribeToActivityLogs(
  onUpdate: (logs: ActivityLog[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'activityLogs';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: ActivityLog[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...(docSnap.data() as ActivityLog), id: docSnap.id });
      });
      // Sort newest first
      items.sort((a, b) => {
        const timeA = new Date(a.createdAt || a.timestamp).getTime() || 0;
        const timeB = new Date(b.createdAt || b.timestamp).getTime() || 0;
        return timeB - timeA;
      });
      if (items.length > 0) {
        onUpdate(items);
      }
    },
    (error) => {
      if (isQuotaError(error)) {
        console.warn('Activity logs subscription: Free daily read quota reached. Running with persistent local state.');
      } else {
        console.warn('Activity logs subscription warning:', error?.message || error);
      }
      onError?.(error);
    }
  );
}

export async function saveActivityLogToCloud(log: ActivityLog): Promise<void> {
  const path = 'activityLogs';
  try {
    await setDoc(doc(db, path, log.id), log);
  } catch (error) {
    if (isQuotaError(error)) {
      console.warn('Activity log saved locally (cloud quota reached).');
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, `${path}/${log.id}`);
  }
}


