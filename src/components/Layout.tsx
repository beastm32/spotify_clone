import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Music2, Home, Search, Library, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export function Layout() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-64 glass p-6 m-2 rounded-xl">
        <div className="flex items-center gap-2 mb-8">
          <div className="relative">
            <Music2 className="h-8 w-8 text-green-500" />
            <div className="absolute inset-0 animate-pulse bg-green-500/20 rounded-full blur-xl -z-10" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Musicify
          </span>
        </div>
        
        <nav className="space-y-4">
          <Link to="/" className="flex items-center gap-3 hover:text-green-500 neon-glow p-2 rounded-lg group">
            <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>Home</span>
          </Link>
          <Link to="/search" className="flex items-center gap-3 hover:text-green-500 neon-glow p-2 rounded-lg group">
            <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>Search</span>
          </Link>
          <Link to="/library" className="flex items-center gap-3 hover:text-green-500 neon-glow p-2 rounded-lg group">
            <Library className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>Your Library</span>
          </Link>
        </nav>

        {user && (
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 hover:text-green-500 neon-glow mt-8 p-2 rounded-lg group w-full"
          >
            <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>Sign Out</span>
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-2">
        <div className="glass rounded-xl h-full overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}