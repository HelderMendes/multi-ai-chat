import { useAuth } from '@/hooks/useAuth';
import React, { FormEvent, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { FaGoogle } from 'react-icons/fa6';
import { Mail, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onSwitchMode: () => void;
}

const AuthModal = ({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } =
    useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.log(error);
      setError(
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message: unknown }).message)
          : 'Google sign-in failed – An error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      console.log(err);
      setError(
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to send reset email'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      onClose();
    } catch (e) {
      console.log(e);
      setError(
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: unknown }).message) // The object message is the Faribase credentials
          : 'Authentication failed – An error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-center">
          <VisuallyHidden>
            {resetMode
              ? 'Reset Password'
              : mode === 'signin'
                ? 'Sign In'
                : 'Sign Up'}
          </VisuallyHidden>
        </DialogTitle>
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-4 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
              <Sparkles className="size-6 text-white" />
            </div>
            <CardTitle className="text-2xl">
              {!resetMode
                ? 'Reset Password'
                : mode === 'signin'
                  ? 'Welcome Back'
                  : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {resetSent
                ? 'Enter your email to reset your password'
                : mode === 'signin'
                  ? 'Sign in to your account and access your chat history'
                  : 'Create an account and join the Multi AI chat community!'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resetSent ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Check Your Email</h3>
                  <p className="text-muted-foreground">
                    We&apos;ve sent a password reset link to {email}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setResetMode(false);
                    setResetSent(false);
                    setEmail('');
                  }}
                >
                  Back to Sign In
                </Button>
              </div>
            ) : (
              <>
                <form
                  className="space-y-4"
                  onSubmit={resetMode ? handlePasswordReset : handleSubmit}
                >
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter you email"
                    />
                  </div>
                  {!resetMode && (
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={7}
                      />
                    </div>
                  )}
                  {error && (
                    <Card className="border-destructive">
                      <CardContent className="">
                        <p className="text-destructive text-sm">😥💥 {error}</p>
                      </CardContent>
                    </Card>
                  )}
                  <Button className="w-full" type="submit">
                    {loading
                      ? 'Loading...'
                      : resetMode
                        ? 'Send Reset Link'
                        : mode === 'signin'
                          ? 'Sign In'
                          : 'Create Account'}
                  </Button>
                </form>
                {!resetMode && (
                  <>
                    <div className="relative mt-6">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background text-muted-foreground px-2">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant={'outline'}
                      className="mt-6 w-full"
                      disabled={loading}
                      onClick={handleGoogleSignIn}
                    >
                      <FaGoogle className="mr-2 size-4" />
                      Google
                    </Button>
                    <div className="space-y-2 text-center text-sm">
                      {mode === 'signin' && (
                        <Button
                          variant="link"
                          type="button"
                          onClick={() => setResetMode(true)}
                          className="mt-2 h-auto p-0"
                        >
                          Forgot your password?
                        </Button>
                      )}
                      <div className="">
                        <span className="text-muted-foreground">
                          {mode === 'signin'
                            ? "Don't have an account? "
                            : 'Already have an account? '}
                        </span>
                        <Button
                          variant="link"
                          type="button"
                          onClick={onSwitchMode}
                          className="mt-2 h-auto p-0"
                        >
                          {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
