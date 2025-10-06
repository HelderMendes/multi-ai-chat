'use client';

import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
  FC,
} from 'react';
import {
  signInWithPopup,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInAnonymously,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { transferAnonymousChats } from '@/lib/firestore';
import type { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize auth state listener
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (!isMounted) return;
        if (firebaseUser) {
          const userData: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || undefined,
            displayName: firebaseUser.displayName || undefined,
            isAnonymous: firebaseUser.isAnonymous,
            photoURL: firebaseUser.photoURL || undefined,
            emailVerified: firebaseUser.emailVerified,
          };
          setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
        if (!initialized) setInitialized(true);
      },
      () => {
        isMounted = false;
        unsubscribe();
      }
    );
  }, [initialized]);

  // Auto sign-in anonymously if no user is signed in after initialization
  useEffect(() => {
    if (initialized && !user && !loading) {
      console.log('No user signed in, signing in anonymously');

      signInAnonymously(auth).catch((error) => {
        console.error('Error signing in anonymously:', error);
        setLoading(false);
      });
    }
  }, [initialized, user, loading]);

  // Sign in with email and password
  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      const previousUserId = user?.uid;
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Transfer anonymous chats if user was previously anonymous
      if (previousUserId && user?.isAnonymous && result.user) {
        console.log('Transferring anonymous chats to signed-in user...');
        await transferAnonymousChats(previousUserId, result.user.uid);
      }
    } catch (error) {
      console.error('Error signing in with email:', error);
      if (error instanceof Error) {
        throw new Error(error.message || 'Error: Failed to sign in with email');
      } else {
        throw new Error('Error: Failed to sign in with email');
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign Up with email and password
  const signUpWithEmail = async (
    email: string,
    password: string
    // displayName?: string
  ) => {
    try {
      setLoading(true);
      const previousUserId = user?.uid;

      console.log('Signing up with email:', email);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update display name to use part of email if
      const displayName = email.split('@')[0];
      await updateProfile(result.user, { displayName });

      // Transfer anonymous chats if user was previously anonymous
      if (previousUserId && user?.isAnonymous && result.user) {
        console.log('Transferring anonymous chats to signed-up user...');
        await transferAnonymousChats(previousUserId, result.user.uid);
      }
      console.log('Sign up successful:', result.user);
    } catch (error) {
      console.error('Error signing up with email:', error);
      if (error instanceof Error) {
        throw new Error(
          error.message || 'Error: Failed to create account with email'
        );
      } else {
        throw new Error(
          'Error: Failed to sign up with email to create an account'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign In with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const previousUserId = user?.uid;

      console.log('Signing in with Google');
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');

      const result = await signInWithPopup(auth, provider);

      // Transfer anonymous chats if user was previously anonymous
      if (previousUserId && user?.isAnonymous && result.user) {
        console.log('Transferring anonymous chats to Google signed-in user...');
        await transferAnonymousChats(previousUserId, result.user.uid);
      }

      console.log('Google sign-in successful:', result.user);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      if (error instanceof Error) {
        throw new Error(
          error.message || 'Error: Failed to sign in with Google'
        );
      } else {
        throw new Error('Error: Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign Anonymous
  const signInAnonymous = async () => {
    try {
      setLoading(true);

      console.log('Signing in anonymously');
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      if (error instanceof Error) {
        throw new Error(
          error.message || 'Error: Failed to sign in anonymously'
        );
      } else {
        throw new Error('Error: Failed to sign in anonymously');
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      setLoading(true);

      console.log('Signing out');
      await firebaseSignOut(auth);

      // Optional: Automatically sign in anonymously after sign out
      // Comment out these lines if you want complete logout
      console.log('Signing in anonymously after sign out');
      setTimeout(() => {
        signInAnonymous();
      }, 100);
    } catch (error) {
      console.error('Error signing out:', error);
      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to sign out');
      } else {
        throw new Error('Failed to sign out');
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const resetPassword = async (email: string) => {
    try {
      console.log('Sending password reset email to:', email);
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to send password reset email');
      } else {
        throw new Error('Failed to send password reset email');
      }
    }
  };

  return {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInAnonymously: signInAnonymous,
    signOut,
    resetPassword,
  };
};

// AUTH PROVIDER COMPONENT
interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
