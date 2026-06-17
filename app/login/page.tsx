'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        // In a real app, we would get the user role from the session
        // For demo, we'll assume the email determines the role
        // We'll redirect based on email for simplicity
        if (email.includes('admin') || email.includes('coordinator') || email.includes('pi')) {
          router.push('/admin');
        } else {
          router.push('/participant');
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Sign in to Mini CTMS Demo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className={`
                flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold
                text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:offset-2 focus-visible:outline-indigo-600
                ${loading ? 'opacity-50' : ''}
              `}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <p className="text-xs text-gray-500">
          Demo credentials:<br />
          Admin: admin@example.com / any password<br />
          Coordinator: coordinator@example.com / any password<br />
          PI: pi@example.com / any password<br />
          Participant: participant@example.com / any password<br />
          Demo kit code: KIT-SKIN-DEMO
        </p>
        <p className="text-xs text-gray-500">
          Note: This is a demo with mock authentication. Passwords are not hashed.
        </p>
      </div>
    </div>
  );
}