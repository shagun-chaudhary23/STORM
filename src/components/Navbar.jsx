import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import OfficialLoginModal from './OfficialLoginModal';
import { 
  Zap, Menu, X, ArrowUpRight, UserCheck, 
  Sun, Moon, KeyRound, LogOut 
} from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { 
    theme, 
    toggleTheme, 
    activeOfficer, 
    logoutOfficer, 
    openLoginModal,
    activeTeamLeader,
    logoutTeamLeader
  } = useApp();

  const handleOfficerLogout = () => {
    logoutOfficer();
    navigate('/login');
  };

  const handleTeamLogout = () => {
    logoutTeamLeader();
    navigate('/team-login');
  };

  const allNavItems = [
    { name: 'HOME', path: '/', public: true },
    { name: 'DASHBOARD', path: '/dashboard', forOfficer: true },
    { name: 'RESOURCES', path: '/resources', forOfficer: true },
    { name: 'SENSE', path: '/sense', forOfficer: true },
    { name: 'REASON', path: '/reason', forOfficer: true },
    { name: 'REPORT', path: '/report', forOfficer: true },
    { name: 'UNIT DASHBOARD', path: '/team-dashboard', forTeamLead: true },
    { name: 'HOW IT WORKS', path: '/how-it-works', public: true },
    { name: 'ABOUT', path: '/about', public: true },
  ];

  const navItems = allNavItems.filter(item => {
    if (item.public) return true;
    if (item.forOfficer && activeOfficer) return true;
    if (item.forTeamLead && activeTeamLeader) return true;
    return false;
  });

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/10 py-2.5 px-3 sm:px-6 transition-all duration-200">
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
                <span className="text-base font-black tracking-wider text-white font-display">
                  STORM
                </span>
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
          <nav className="nav-pill-container hidden xl:flex items-center gap-0.5 bg-[#141414] border border-white/10 p-1 rounded-full shadow-inner">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `text-[10px] uppercase tracking-wider font-bold px-2.5 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] text-white shadow-md shadow-[#FF6B1A]/25'
                      : 'nav-link-inactive text-[#9A9A9A] hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-2">
            
            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Light and Dark Theme"
              className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:scale-105 transition-all cursor-pointer shadow-sm hover:border-[#FF6B1A]/40"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Officer Session Badge */}
            {activeOfficer && (
              <div className="relative group">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 hover:bg-emerald-950 transition-colors">
                  <UserCheck className="w-3.5 h-3.5 text-[#FF6B1A]" />
                  <span className="font-bold truncate max-w-[120px]">{activeOfficer.name}</span>
                </button>

                <div className="absolute right-0 top-full mt-2 w-48 bg-[#141414] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3 border-b border-white/5">
                    <div className="text-xs font-bold text-white truncate">{activeOfficer.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{activeOfficer.rank || activeOfficer.id}</div>
                  </div>
                  <div className="p-1.5">
                    <button 
                      onClick={handleOfficerLogout}
                      className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-white/5 hover:text-red-300 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Team Leader Session Badge */}
            {activeTeamLeader && (
              <div className="relative group">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-950/60 border border-teal-500/30 text-[10px] font-mono text-teal-300 hover:bg-teal-950 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-bold truncate max-w-[120px]">{activeTeamLeader.name}</span>
                </button>

                <div className="absolute right-0 top-full mt-2 w-52 bg-[#141414] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3 border-b border-white/5">
                    <div className="text-xs font-bold text-white truncate">{activeTeamLeader.name}</div>
                    <div className="text-[10px] text-emerald-400 font-mono truncate">{activeTeamLeader.team_name}</div>
                    <div className="text-[9px] text-slate-500 font-mono mt-0.5">{activeTeamLeader.id}</div>
                  </div>
                  <div className="p-1.5 space-y-1">
                    <Link
                      to="/team-dashboard"
                      className="block px-3 py-1.5 text-xs text-slate-200 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      Unit Dashboard
                    </Link>
                    <button 
                      onClick={handleTeamLogout}
                      className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-white/5 hover:text-red-300 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Logged-out buttons */}
            {!activeOfficer && !activeTeamLeader && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-extrabold text-white bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 rounded-full shadow transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <KeyRound className="w-3 h-3 text-[#FF6B1A]" />
                  <span>Officer Login</span>
                </button>
                <button
                  onClick={() => navigate('/team-login')}
                  className="py-1.5 px-3 text-[10px] uppercase tracking-wider font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/70 rounded-full border border-emerald-500/30 transition-all cursor-pointer"
                >
                  Team Lead
                </button>
              </div>
            )}

            {/* Request Pilot Button */}
            <button
              onClick={() => navigate('/about#contact')}
              className="py-1.5 px-3 text-[10px] uppercase tracking-wider font-extrabold text-white bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] hover:opacity-95 rounded-full shadow-lg shadow-[#FF6B1A]/20 transition-all cursor-pointer inline-flex items-center justify-center gap-1 flex-shrink-0"
            >
              <span>Request Pilot</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          {/* Mobile Actions (Theme + Menu) */}
          <div className="xl:hidden flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="w-7 h-7 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xs"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 text-[#9A9A9A] hover:text-white focus:outline-none"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Drawer Menu */}
        {mobileOpen && (
          <div className="xl:hidden mt-3 bg-[#141414] border border-white/10 p-4 rounded-2xl space-y-2 animate-fade-in max-h-[80vh] overflow-y-auto shadow-2xl">
            {activeOfficer ? (
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#FF6B1A]" />
                  <span className="truncate">Officer: <strong>{activeOfficer.name}</strong></span>
                </div>
                <button onClick={handleOfficerLogout} className="text-slate-400 hover:text-red-400 p-1">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : activeTeamLeader ? (
              <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-500/30 text-xs font-mono text-teal-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="truncate">Lead: <strong>{activeTeamLeader.name}</strong></span>
                </div>
                <button onClick={handleTeamLogout} className="text-slate-400 hover:text-red-400 p-1">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setMobileOpen(false); navigate('/login'); }}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 text-xs font-bold text-white flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#FF6B1A]" />
                  <span>Officer Login</span>
                </button>
                <button
                  onClick={() => { setMobileOpen(false); navigate('/team-login'); }}
                  className="py-2.5 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/30 text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5"
                >
                  <span>Team Lead</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-1 pt-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block text-xs uppercase tracking-wider font-bold px-3 py-2 rounded-xl text-center ${
                      isActive ? 'bg-[#FF6B1A] text-white' : 'text-[#9A9A9A] hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            <button
              onClick={() => { setMobileOpen(false); navigate('/about#contact'); }}
              className="w-full mt-2 py-2.5 text-xs uppercase tracking-wider font-extrabold text-white bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] rounded-full text-center cursor-pointer shadow-lg shadow-[#FF6B1A]/20"
            >
              Request Pilot
            </button>
          </div>
        )}
      </header>

      {/* Official Login Modal */}
      <OfficialLoginModal />
    </>
  );
}
