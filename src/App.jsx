import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
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
import Login from './pages/Login';
import Respond from './pages/Respond';
import ProtectedRoute from './components/ProtectedRoute';

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

function MainLayout() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const isRespond = location.pathname.startsWith('/respond/');

  return (
    <div className="min-h-screen font-sans selection:bg-[#FF6B1A]/30 selection:text-[#FF6B1A] relative flex flex-col justify-between transition-colors duration-200">
      <ScrollToTop />

      {/* Sticky top nav with Theme toggle and Official Login (hidden on respond page for distraction-free briefing) */}
      {!isRespond && <Navbar />}

      {/* Main Routed Content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/respond/:token" element={<Respond />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/sense" element={<Sense />} />
            <Route path="/reason" element={<Reason />} />
            <Route path="/report" element={<Report />} />
          </Route>
        </Routes>
      </main>

      {/* Shared Footer on all pages EXCEPT Dashboard and Respond */}
      {!isDashboard && !isRespond && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
