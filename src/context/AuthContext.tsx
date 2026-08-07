import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as updateFirebaseProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword as updateFirebasePassword,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import api from '../lib/api';

export type BDUser = {
  id: string;
  name: string;
  email: string;
  district: string;
  profilePicture: string;
  role: 'user' | 'admin';
  authProvider: 'local' | 'google';
};

interface AuthContextValue {
  user: BDUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, district?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (fields: { name?: string; district?: string; password?: string; currentPassword?: string }) => Promise<void>;
  updateProfilePicture: (file: File) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Turns the backend profile + the live Firebase user into the BDUser shape
// the rest of the app already expects (feature #3: auth is now fully backed
// by Firebase; MongoDB just stores the app-specific profile: district, role,
// profile picture).
function toBDUser(fbUser: FirebaseUser, profile: any): BDUser {
  const isGoogle = fbUser.providerData.some((p) => p.providerId === 'google.com');
  return {
    id: profile?.id || fbUser.uid,
    name: profile?.name || fbUser.displayName || '',
    email: profile?.email || fbUser.email || '',
    district: profile?.district || '',
    profilePicture: profile?.profilePicture || fbUser.photoURL || '',
    role: profile?.role || 'user',
    authProvider: isGoogle ? 'google' : 'local',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BDUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetches/creates the MongoDB profile for the currently signed-in Firebase
  // user (the backend verifies the Firebase ID token and upserts by uid).
  const syncProfile = async (fbUser: FirebaseUser, extra?: { name?: string; district?: string }) => {
    const data = await api.post('/auth/sync', extra || {});
    setUser(toBDUser(fbUser, data.user));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        await syncProfile(fbUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged above picks this up and syncs the profile.
  };

  const register = async (name: string, email: string, password: string, district = '') => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateFirebaseProfile(cred.user, { displayName: name });
    await syncProfile(cred.user, { name, district });
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
    // onAuthStateChanged picks this up and syncs the profile.
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateProfile: AuthContextValue['updateProfile'] = async ({ name, district, password, currentPassword }) => {
    const fbUser = auth.currentUser;
    if (!fbUser) throw new Error('You must be logged in');

    // Password changes go straight through Firebase, not our backend.
    if (password) {
      const isLocal = fbUser.providerData.some((p) => p.providerId === 'password');
      if (isLocal) {
        if (!currentPassword) throw new Error('Current password is required to set a new one');
        const credential = EmailAuthProvider.credential(fbUser.email || '', currentPassword);
        await reauthenticateWithCredential(fbUser, credential);
      }
      await updateFirebasePassword(fbUser, password);
    }

    if (name && name !== fbUser.displayName) {
      await updateFirebaseProfile(fbUser, { displayName: name });
    }

    const data = await api.put('/auth/me', { name, district });
    setUser(toBDUser(fbUser, data.user));
  };

  const updateProfilePicture = async (file: File) => {
    const fbUser = auth.currentUser;
    if (!fbUser) throw new Error('You must be logged in');
    const form = new FormData();
    form.append('picture', file);
    const data = await api.put('/auth/me/picture', form);
    if (data.user?.profilePicture) {
      await updateFirebaseProfile(fbUser, { photoURL: data.user.profilePicture });
    }
    setUser(toBDUser(fbUser, data.user));
  };

  const refreshUser = async () => {
    const fbUser = auth.currentUser;
    if (!fbUser) return;
    await syncProfile(fbUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        updateProfilePicture,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
