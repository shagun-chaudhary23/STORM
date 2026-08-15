import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Zap, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/10 py-3.5 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Wordmark */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B1A] to-[#E8391A] p-0.5 flex items-center justify-center shadow-lg shadow-[#FF6B1A]/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0A0A0A] rounded-[10px] flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#FF6B1A]" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-wider text-white font-display">STORM</span>
              <span className="border border-[#FF6B1A]/30 bg-[#FF6B1A]/10 text-[#FF6B1A] text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                INDIA
              </span>
            </div>
            <span className="text-[10px] text-[#9A9A9A] font-medium tracking-tight -mt-0.5">
              Decision Support Platform
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#141414] border border-white/10 p-1.5 rounded-full shadow-inner">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `text-[11px] uppercase tracking-wider font-bold px-3.5 py-1.5 rounded-full transition-all duration-200 ${
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

        {/* CTA Button - Fixed Width Pill */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => navigate('/about#contact')}
            className="w-40 py-2.5 px-4 text-xs uppercase tracking-wider font-extrabold text-white bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] hover:opacity-95 rounded-full shadow-lg shadow-[#FF6B1A]/20 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <span>Request Pilot</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-[#9A9A9A] hover:text-white focus:outline-none"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden mt-3 bg-[#141414] border border-white/10 p-4 rounded-2xl space-y-2 animate-fade-in">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block text-xs uppercase tracking-widest font-bold px-4 py-2.5 rounded-xl ${
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
            className="w-full mt-2 py-3 text-xs uppercase tracking-wider font-extrabold text-white bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] rounded-full text-center"
          >
            Request a Pilot
          </button>
        </div>
      )}
    </header>
  );
}
