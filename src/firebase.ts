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

// Connectivity test
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'vehicles', '_connection_check_'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or database is provisioning.');
      return false;
    }
    // Any other response (like document not found) confirms reachable server
    return true;
  }
}

// Seed or sync initial vehicles so the complete verified showroom inventory is always present
export async function seedInitialVehiclesIfEmpty(): Promise<void> {
  const path = 'vehicles';
  try {
    const snapshot = await getDocs(collection(db, path));
    const existingIds = new Set<string>();
    snapshot.forEach((docSnap) => existingIds.add(docSnap.id));

    // Identify any showroom cars missing from Firestore
    const missingCars = INITIAL_CARS.filter((car) => !existingIds.has(car.id));
    if (missingCars.length > 0) {
      console.log(`Syncing ${missingCars.length} missing verified showroom cars to Cloud Firestore...`);
      for (const car of missingCars) {
        await setDoc(doc(db, path, car.id), car);
      }
      console.log('Showroom vehicles sync complete.');
    }
  } catch (error) {
    console.warn('Could not sync initial vehicles to Firestore:', error);
  }
}

// Real-time Vehicle Sync with Core Catalog Guarantee
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

        // Trigger background sync if any showroom cars are missing in cloud
        if (cloudMap.size < INITIAL_CARS.length) {
          seedInitialVehiclesIfEmpty().catch(console.warn);
        }

        // Start with complete INITIAL_CARS catalog to guarantee cars NEVER disappear
        const mergedMap = new Map<string, Vehicle>();
        for (const car of INITIAL_CARS) {
          mergedMap.set(car.id, car);
        }

        // Overlay cloud documents (status updates, edits, new user-posted cars)
        for (const [id, car] of cloudMap.entries()) {
          mergedMap.set(id, car);
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

        onUpdate(items);
      } catch (err) {
        console.error('Error processing vehicle snapshot, using fallback catalog:', err);
        onUpdate(INITIAL_CARS);
      }
    },
    (error) => {
      console.error('Vehicle subscription error:', error);
      onError?.(error);
      // Guarantee fallback inventory is always displayed
      onUpdate(INITIAL_CARS);
    }
  );
}

// Cloud Vehicle Operations
export async function saveVehicleToCloud(vehicle: Vehicle): Promise<void> {
  const path = 'vehicles';
  try {
    await setDoc(doc(db, path, vehicle.id), vehicle);
  } catch (error) {
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
  const path = 'vehicles';
  try {
    await deleteDoc(doc(db, path, vehicleId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${vehicleId}`);
  }
}

// Bookings Cloud Operations
export function subscribeToBookings(onUpdate: (bookings: Booking[]) => void): () => void {
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
      console.error('Bookings subscription error:', error);
    }
  );
}

export async function saveBookingToCloud(booking: Booking): Promise<void> {
  const path = 'bookings';
  try {
    await setDoc(doc(db, path, booking.id), booking);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${booking.id}`);
  }
}

// Messages Cloud Operations
export function subscribeToMessages(onUpdate: (messages: ContactMessage[]) => void): () => void {
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
      console.error('Messages subscription error:', error);
    }
  );
}

export async function saveMessageToCloud(message: ContactMessage): Promise<void> {
  const path = 'messages';
  try {
    await setDoc(doc(db, path, message.id), message);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${message.id}`);
  }
}

// Partner Ads Cloud Operations
export function subscribeToPartnerAds(onUpdate: (ads: PartnerAd[]) => void): () => void {
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
      console.error('Partner ads subscription error:', error);
    }
  );
}

export async function savePartnerAdToCloud(ad: PartnerAd): Promise<void> {
  const path = 'partnerAds';
  try {
    await setDoc(doc(db, path, ad.id), ad);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${ad.id}`);
  }
}

export async function deletePartnerAdFromCloud(adId: string): Promise<void> {
  const path = 'partnerAds';
  try {
    await deleteDoc(doc(db, path, adId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${adId}`);
  }
}

// Accounts Cloud Operations
export function subscribeToAccounts(onUpdate: (accounts: UserAccount[]) => void): () => void {
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
      console.error('Accounts subscription error:', error);
    }
  );
}

export async function saveAccountToCloud(account: UserAccount): Promise<void> {
  const path = 'accounts';
  try {
    await setDoc(doc(db, path, account.id), account);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${account.id}`);
  }
}

// Activity Logs Cloud Operations
export function subscribeToActivityLogs(onUpdate: (logs: ActivityLog[]) => void): () => void {
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
      console.error('Activity logs subscription error:', error);
    }
  );
}

export async function saveActivityLogToCloud(log: ActivityLog): Promise<void> {
  const path = 'activityLogs';
  try {
    await setDoc(doc(db, path, log.id), log);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${log.id}`);
  }
}

