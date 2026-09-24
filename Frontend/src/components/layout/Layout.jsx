import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-zinc-900 selection:bg-zinc-200">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children || <Outlet />}
      </main>
      <footer className="border-t border-zinc-200/80 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p>
            Product Admin Dashboard
          </p>
          <p className="flex items-center gap-2">
            <span>Data provided by</span>
            <a
              href="https://dummyjson.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-zinc-700 hover:text-zinc-900 underline underline-offset-2"
            >
              DummyJSON API
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
