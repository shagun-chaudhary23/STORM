import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, ArrowRight, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 pt-16 pb-12 text-[#9A9A9A] text-xs relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B1A] to-[#E8391A] p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#0A0A0A] rounded-[10px] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#FF6B1A]" />
                </div>
              </div>
              <span className="text-xl font-black text-white tracking-wider font-display">STORM</span>
            </Link>
            <p className="text-[#9A9A9A] leading-relaxed max-w-sm">
              Self-Triggered Operations for Real-time Relief Management — India's AI-assisted decision support platform for disaster response coordinators.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF6B1A]" />
              <span>AI-Speed Detection • Human-Approved Action</span>
            </div>
          </div>

          {/* Nav Links Column */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-white font-bold text-xs uppercase tracking-wider">Platform Routing</div>
            <ul className="space-y-2 font-medium">
              <li><Link to="/" className="hover:text-white transition-colors">Home Overview</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Coordinator Dashboard</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Resource Logistics</Link></li>
              <li><Link to="/sense" className="hover:text-white transition-colors">Sense Layer (Telemetry)</Link></li>
              <li><Link to="/reason" className="hover:text-white transition-colors">Reason Layer (AI Planning)</Link></li>
              <li><Link to="/report" className="hover:text-white transition-colors">Field Hazard Intake</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works & Safety</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About & Pilot Roadmap</Link></li>
            </ul>
          </div>

          {/* Operational Tagline & Governance */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-white font-bold text-xs uppercase tracking-wider">Institutional Alignment</div>
            <p className="text-[11px] leading-relaxed text-[#9A9A9A]">
              Built for SDMAs, NDMA & NGO networks across India. Engineered strictly as a decision-support copilot under Disaster Management Authority supervision.
            </p>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] text-slate-400 font-mono">
              Contact Command Desk: contact@storm-relief.in
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <span>© {new Date().getFullYear()} STORM Platform. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link to="/how-it-works" className="hover:text-slate-300 transition-colors">Governance Charter</Link>
            <Link to="/about#contact" className="hover:text-slate-300 transition-colors">Pilot Program</Link>
            <Link to="/about" className="hover:text-slate-300 transition-colors">Privacy & Data Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
