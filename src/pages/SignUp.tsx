import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { GoogleSignInButton } from '../components/GoogleSignInButton';

export function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signUp } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      navigate('/');
    } catch (err) {
      setError('Error creating account');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-zinc-900 rounded-lg p-8">
        <div className="flex justify-center mb-8">
          <Music2 className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-8">Create your account</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white rounded-full py-2 px-4 hover:bg-green-600 transition-colors"
          >
            Sign Up
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-zinc-900 text-gray-400">Or continue with</span>
          </div>
        </div>

        <GoogleSignInButton />

        <p className="mt-4 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-green-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}