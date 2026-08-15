import React, { useState } from 'react';
import { Send, CheckCircle2, Zap, Mail, Building, User, MessageSquare, MapPin } from 'lucide-react';

export default function ContactFooter({ onOpenPrivacy, pilotFormRef }) {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    role: 'SDMA / State Official',
    state: 'Assam',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <footer id="contact" ref={pilotFormRef} className="bg-[#05080E] border-t border-slate-800 text-slate-400 pt-20 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main CTA Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 pb-16 border-b border-slate-800/80">
          
          {/* Left Column: CTA Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B1A]/10 border border-[#FF6B1A]/30 text-xs font-semibold text-[#FF6B1A]">
              <Mail className="w-3.5 h-3.5" />
              <span>Partner With Us</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Request a Pilot for Your State or NGO Network
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              We are actively onboarding SDMA officers, District Relief Commissioners, NDRF/SDRF commanders, and vetted disaster response NGO leaders for trial co-pilot deployments.
            </p>

            <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3 text-xs text-slate-300">
              <div className="font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF6B1A]" />
                What Pilot Deployment Includes:
              </div>
              <ul className="space-y-1.5 pl-5 list-disc text-slate-400">
                <li>Integration with local IMD radar & CWC river monitoring feeds</li>
                <li>Customized district Gram Panchayat risk-scoring maps</li>
                <li>Officer training & WhatsApp emergency broadcast gateway setup</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl relative">
              {submitted ? (
                <div className="p-8 text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Pilot Request Received</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Thank you, <strong>{formData.name}</strong> ({formData.organization}). Our disaster technology deployment team will reach out within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', organization: '', role: 'SDMA / State Official', state: 'Assam', message: '' });
                    }}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-xl transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#FF6B1A]" />
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-[#FF6B1A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-[#FF6B1A]" />
                        Organization / Department *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Assam SDMA / NDRF 1st Bn"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-[#FF6B1A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Role / Position</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-[#FF6B1A] focus:outline-none"
                      >
                        <option value="SDMA / State Official">SDMA / State Official</option>
                        <option value="District Collector / DM">District Collector / DM</option>
                        <option value="NDRF / SDRF Officer">NDRF / SDRF Officer</option>
                        <option value="Vetted NGO Director">Vetted NGO Director</option>
                        <option value="Researcher / Technologist">Researcher / Technologist</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#FF6B1A]" />
                        Target State / Region
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-[#FF6B1A] focus:outline-none"
                      >
                        <option value="Assam">Assam</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Other Indian State">Other Indian State</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#FF6B1A]" />
                      Message / Pilot Requirements
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe your district risk priorities, existing data feeds, or trial goals..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-[#FF6B1A] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-gradient-to-r from-[#FF6B1A] to-amber-600 hover:from-amber-600 hover:to-[#FF6B1A] text-white font-bold rounded-xl shadow-lg shadow-[#FF6B1A]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Pilot Request
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Footer Bottom Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-[#FF6B1A]" />
            <span className="text-slate-300 font-bold">STORM Platform</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">AI-Speed Detection, Human-Approved Action</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#solution" className="hover:text-[#FF6B1A] transition-colors">About</a>
            <a href="#roadmap" className="hover:text-[#FF6B1A] transition-colors">Roadmap</a>
            <a href="#contact" className="hover:text-[#FF6B1A] transition-colors">Contact</a>
            <button
              onClick={onOpenPrivacy}
              className="hover:text-[#FF6B1A] transition-colors text-slate-400 cursor-pointer"
            >
              Privacy Policy
            </button>
          </div>

        </div>

        <div className="mt-8 text-center text-[11px] text-slate-600 border-t border-slate-900 pt-6">
          © {new Date().getFullYear()} STORM (Self-Triggered Operations for Real-time Relief Management). Built for SDMAs, NDMA, and vetted relief agencies across India.
        </div>

      </div>
    </footer>
  );
}
