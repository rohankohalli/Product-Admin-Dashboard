import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Package,
  Lock,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  // Target path to redirect after successful login
  const from = location.state?.from?.pathname || '/products';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(username.trim(), password.trim());
      toast.success(`Welcome back, ${username.trim()}!`);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.friendlyMessage || err.response?.data?.message || err.message || 'Invalid credentials. Please verify your login details.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('emilys');
    setPassword('emilyspass');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50/80">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center mx-auto shadow-md">
          <Package className="w-6 h-6" />
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900">
          Sign in to ApexStore
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          Product & Inventory Management Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-zinc-200/90 rounded-2xl sm:px-10 space-y-6">
          {/* Quick Demo Fill Pill */}
          <div className="bg-indigo-50/70 border border-indigo-200/70 rounded-xl p-3 flex items-center justify-between text-xs text-indigo-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <p className="font-semibold">Demo Credentials</p>
                <p className="text-[11px] text-indigo-700 font-mono mt-0.5">
                  emilys / emilyspass
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 px-2.5 py-1 rounded-md hover:bg-indigo-50 active:bg-indigo-100 transition-colors cursor-pointer shadow-2xs shrink-0"
            >
              Fill Demo
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-lg flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">Authentication Failed</span>
                <span className="text-rose-700">{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  disabled={isSubmitting}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-500 disabled:opacity-50 transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  disabled={isSubmitting}
                  className="w-full pl-9 pr-10 py-2 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-500 disabled:opacity-50 transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button with Multiple Clicks Guard */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="w-full"
                icon={ArrowRight}
              >
                {isSubmitting ? 'Verifying...' : 'Sign In'}
              </Button>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-zinc-400 mt-6">
          ApexStore Admin Dashboard • Protected Route Authentication
        </p>
      </div>
    </div>
  );
}
