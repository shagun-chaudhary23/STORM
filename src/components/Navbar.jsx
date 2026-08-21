import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Zap, Menu, X, ArrowUpRight, UserCheck } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeOfficer, setActiveOfficer] = useState(null);
  const navigate = useNavigate();

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

  const navItems = [
    { name: 'HOME', path: '/' },
    { name: 'DASHBOARD', path: '/dashboard' },
    { name: 'RESOURCES', path: '/resources' },
    { name: 'SENSE', path: '/sense' },
    { name: 'REASON', path: '/reason' },
    { name: 'REPORT', path: '/report' },
    { name: 'HOW IT WORKS', path: '/how-it-works' },
    { name: 'ABOUT', path: '/about' },
  ];

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
          {activeOfficer && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
              <UserCheck className="w-3 h-3 text-[#FF6B1A]" />
              <span className="font-bold truncate max-w-[140px]">{activeOfficer.name}</span>
            </div>
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
          {activeOfficer && (
            <div className="mb-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#FF6B1A]" />
              <span>Signed in: <strong>{activeOfficer.name}</strong> ({activeOfficer.rank})</span>
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
