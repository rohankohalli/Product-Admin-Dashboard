import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 mb-4">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">404 - Page Not Found</h1>
      <p className="text-sm text-zinc-500 max-w-sm mt-2 mb-6">
        The dashboard route you requested does not exist or has been moved.
      </p>
      <Link to="/products">
        <Button variant="primary" size="md" icon={ArrowLeft}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}
