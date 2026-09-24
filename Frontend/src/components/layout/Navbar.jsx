import { Link, useNavigate } from 'react-router-dom';
import { Package, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-6">
            <Link
              to="/products"
              className="flex items-center gap-2.5 text-zinc-900 group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-zinc-900 text-white flex items-center justify-center shadow-xs group-hover:bg-zinc-800 transition-colors">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-base tracking-tight text-zinc-900">
                  AlphaStore
                </span>

              </div>
            </Link>
          </div>

          {/* Right section: User info & Logout */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 pl-2">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.firstName || user.username}
                      className="w-8 h-8 rounded-full border border-zinc-200 object-cover bg-zinc-100"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 text-xs font-semibold">
                      {user.firstName ? user.firstName[0] : 'U'}
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-medium text-zinc-900 leading-tight">
                      {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.username}
                    </p>
                    <p className="text-[11px] text-zinc-500 leading-tight">
                      @{user.username}
                    </p>
                  </div>
                </div>

                <div className="h-5 w-px bg-zinc-200 mx-1 hidden sm:block" />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  icon={LogOut}
                  className="text-zinc-600 hover:text-rose-600 hover:bg-rose-50"
                  title="Sign out of dashboard"
                >
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="secondary" size="sm" icon={User}>
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
