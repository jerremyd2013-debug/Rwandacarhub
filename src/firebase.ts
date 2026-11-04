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
import { Vehicle, Booking, ContactMessage, UserAccount, PartnerAd } from './types';
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

// Seed initial vehicles if collection is empty
export async function seedInitialVehiclesIfEmpty(): Promise<void> {
  const path = 'vehicles';
  try {
    const snapshot = await getDocs(collection(db, path));
    if (snapshot.empty) {
      console.log('Seeding initial marketplace vehicles to Cloud Firestore...');
      for (const car of INITIAL_CARS) {
        await setDoc(doc(db, path, car.id), car);
      }
      console.log('Seeding completed successfully.');
    }
  } catch (error) {
    console.warn('Could not seed initial vehicles to Firestore:', error);
  }
}

// Real-time Vehicle Sync
export function subscribeToVehicles(
  onUpdate: (vehicles: Vehicle[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'vehicles';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        // If collection in cloud is empty, seed it
        seedInitialVehiclesIfEmpty();
        onUpdate(INITIAL_CARS);
        return;
      }
      const items: Vehicle[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Vehicle;
        items.push({ ...data, id: docSnap.id });
      });
      // Sort with newest first
      items.sort((a, b) => {
        const timeA = new Date(a.postedDate).getTime() || 0;
        const timeB = new Date(b.postedDate).getTime() || 0;
        return timeB - timeA;
      });
      onUpdate(items);
    },
    (error) => {
      console.error('Vehicle subscription error:', error);
      onError?.(error);
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
