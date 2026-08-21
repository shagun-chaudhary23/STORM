import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Zap, Menu, X, ArrowUpRight, UserCheck, LogOut } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeOfficer, setActiveOfficer] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('storm_officer');
    localStorage.removeItem('storm_officer_token');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  useEffect(() => {
    const checkOfficer = () => {
      try {
        const saved = localStorage.getItem('storm_officer');
        if (saved) {
          setActiveOfficer(JSON.parse(saved));
        } else {
          setActiveOfficer(null);
        }
      } catch {
        setActiveOfficer(null);
      }
    };

    checkOfficer();
    window.addEventListener('storage', checkOfficer);
    const interval = setInterval(checkOfficer, 2000);
    return () => {
      window.removeEventListener('storage', checkOfficer);
      clearInterval(interval);
    };
  }, []);

  const allNavItems = [
    { name: 'HOME', path: '/', public: true },
    { name: 'DASHBOARD', path: '/dashboard', public: false },
    { name: 'RESOURCES', path: '/resources', public: false },
    { name: 'SENSE', path: '/sense', public: false },
    { name: 'REASON', path: '/reason', public: false },
    { name: 'REPORT', path: '/report', public: false },
    { name: 'HOW IT WORKS', path: '/how-it-works', public: true },
    { name: 'ABOUT', path: '/about', public: true },
  ];

  const navItems = allNavItems.filter(item => item.public || activeOfficer);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/10 py-3 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Brand Logo & Wordmark */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B1A] to-[#E8391A] p-0.5 flex items-center justify-center shadow-lg shadow-[#FF6B1A]/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0A0A0A] rounded-[10px] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-[#FF6B1A]" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-wider text-white font-display">STORM</span>
              <span className="border border-[#FF6B1A]/30 bg-[#FF6B1A]/10 text-[#FF6B1A] text-[8px] font-mono font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                INDIA
              </span>
            </div>
            <span className="text-[9px] text-[#9A9A9A] font-medium tracking-tight -mt-0.5 hidden sm:inline">
              Decision Support Platform
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden xl:flex items-center gap-0.5 bg-[#141414] border border-white/10 p-1 rounded-full shadow-inner overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] text-white shadow-md shadow-[#FF6B1A]/25'
                    : 'text-[#9A9A9A] hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Action: Officer status & Request Pilot Button */}
        <div className="hidden sm:flex items-center gap-2.5">
          {activeOfficer ? (
            <div className="relative group hidden lg:block">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 hover:bg-emerald-950 transition-colors">
                <UserCheck className="w-3 h-3 text-[#FF6B1A]" />
                <span className="font-bold truncate max-w-[140px]">{activeOfficer.name}</span>
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#141414] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-3 border-b border-white/5">
                  <div className="text-xs font-bold text-white truncate">{activeOfficer.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{activeOfficer.rank}</div>
                </div>
                <div className="p-1.5">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-white/5 hover:text-red-300 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="hidden lg:block py-1.5 px-4 text-[10px] uppercase tracking-wider font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all cursor-pointer"
            >
              Sign In
            </button>
          )}

          <button
            onClick={() => navigate('/about#contact')}
            className="py-2 px-3.5 text-[11px] uppercase tracking-wider font-extrabold text-white bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] hover:opacity-95 rounded-full shadow-lg shadow-[#FF6B1A]/20 transition-all cursor-pointer inline-flex items-center justify-center gap-1 flex-shrink-0"
          >
            <span>Request Pilot</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="xl:hidden p-2 text-[#9A9A9A] hover:text-white focus:outline-none"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="xl:hidden mt-3 bg-[#141414] border border-white/10 p-4 rounded-2xl space-y-1.5 animate-fade-in max-h-[80vh] overflow-y-auto">
          {activeOfficer ? (
            <div className="mb-2 space-y-2">
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#FF6B1A]" />
                <span className="truncate">Signed in: <strong>{activeOfficer.name}</strong> ({activeOfficer.rank})</span>
              </div>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold text-red-400 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="mb-2">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate('/login');
                }}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all text-center uppercase tracking-wider"
              >
                Sign In to Console
              </button>
            </div>
          )}

          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-xl ${
                  isActive ? 'bg-[#FF6B1A] text-white' : 'text-[#9A9A9A] hover:text-white'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
          <button
            onClick={() => {
              setMobileOpen(false);
              navigate('/about#contact');
            }}
            className="w-full mt-2 py-2.5 text-xs uppercase tracking-wider font-extrabold text-white bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] rounded-full text-center"
          >
            Request a Pilot
          </button>
        </div>
      )}
    </header>
  );
}
