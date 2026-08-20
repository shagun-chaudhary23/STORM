import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Routed Pages & Features
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Sense from './pages/Sense';
import Reason from './pages/Reason';
import Report from './pages/Report';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Roadmap from './pages/Roadmap';
import CoordinatorSimulator from './components/CoordinatorSimulator';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 font-sans selection:bg-[#FF6B1A]/30 selection:text-[#FF6B1A] relative flex flex-col justify-between">
      <ScrollToTop />

      {/* Sticky top nav on all pages */}
      <Navbar />

      {/* Main Routed Content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/sense" element={<Sense />} />
          <Route path="/reason" element={<Reason />} />
          <Route path="/report" element={<Report />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/simulator" element={<CoordinatorSimulator />} />
        </Routes>
      </main>

      {/* Shared Footer on all pages EXCEPT Dashboard */}
      {!isDashboard && <Footer />}
    </div>
  );
}
