import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey:            'AIzaSyCM_MFB_oe_PSlK8xdmOxoVOZcFWNHwdYE',
  authDomain:        'cspp-2a134-f66d4.firebaseapp.com',
  projectId:         'cspp-2a134-f66d4',
  storageBucket:     'cspp-2a134-f66d4.firebasestorage.app',
  messagingSenderId: '80639183490',
  appId:             '1:80639183490:web:a70f285740abd93ca6029b',
  measurementId:     'G-W8BVR7ZB31',
};

// Primary app — used by normal users
const app = initializeApp(firebaseConfig);
export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
export default app;

// Secondary app — used ONLY by admin auth (separate session)
const adminApp = getApps().find(a => a.name === 'admin')
  ?? initializeApp(firebaseConfig, 'admin');
export const adminAuth = getAuth(adminApp);
