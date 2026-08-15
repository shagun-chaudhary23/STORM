import React, { useState } from 'react';
import { fieldReports } from '../data/mockData';
import { 
  FileText, Send, CheckCircle2, AlertTriangle, UploadCloud, 
  MapPin, ShieldAlert, Sparkles, Clock, Check, X 
} from 'lucide-react';

export default function Report() {
  const [reports, setReports] = useState(fieldReports);
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Flooding');
  const [description, setDescription] = useState('');
  const [fileAttached, setFileAttached] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Auto-computed AI severity based on description length/keywords
  const computeAiSeverity = () => {
    if (!description || description.trim().length < 5) return null;
    const lower = description.toLowerCase();
    if (lower.includes('water rise') || lower.includes('flood') || lower.includes('collapse') || lower.includes('trap') || lower.includes('surge')) {
      return { label: 'AI-Assessed: High', color: 'bg-red-950 text-red-400 border-red-500/30' };
    }
    if (lower.includes('blocked') || lower.includes('debris') || lower.includes('cut off')) {
      return { label: 'AI-Assessed: Medium', color: 'bg-amber-950 text-amber-400 border-amber-500/30' };
    }
    return { label: 'AI-Assessed: Low', color: 'bg-emerald-950 text-emerald-400 border-emerald-500/30' };
  };

  const aiSeverity = computeAiSeverity();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location || !description) return;

    const newReport = {
      id: Date.now(),
      location,
      category,
      severity: aiSeverity ? aiSeverity.label : 'AI-Assessed: Medium',
      description,
      timestamp: 'Just now',
      verified: false
    };

    setReports([newReport, ...reports]);
    setLocation('');
    setDescription('');
    setFileAttached(false);
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 5000);
  };

  return (
    <div className="relative pt-28 pb-20 overflow-hidden">
      
      {/* Glow Arc */}
      <div className="hero-glow-arc-subtle"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-wider text-[#FF6B1A]">
            <FileText className="w-3.5 h-3.5" />
            <span>Field Observer & Officer Incident Intake</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Hazard Incident Reporting
          </h1>

          <p className="text-sm sm:text-base text-[#9A9A9A] leading-relaxed">
            Submit on-ground observations for automated NLP verification and zone severity recalibration by the Reason Layer.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Incident Report Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#141414] border border-white/10 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#FF6B1A]" />
                  <h2 className="text-lg font-bold text-white">Submit New Field Hazard Report</h2>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">INTAKE ONLINE</span>
              </div>

              {submittedMessage && (
                <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center gap-3 text-xs text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <strong className="block text-white">Report Successfully Ingested</strong>
                    Incident logged and queued for SDMA spatial deduplication.
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Location Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Incident Location / Landmark *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#FF6B1A] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Teesta Bridge Sector 4, Singtam"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#FF6B1A]"
                    />
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Hazard Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF6B1A]"
                  >
                    <option value="Flooding">Flash Flooding / Inundation</option>
                    <option value="Blocked Access">Landslide / Blocked Access Route</option>
                    <option value="Bridge Damage">Bridge / Infrastructure Failure</option>
                    <option value="Medical Emergency">Trapped Citizens / Medical Urgency</option>
                    <option value="Supply Shortage">Drinking Water / Ration Depletion</option>
                  </select>
                </div>

                {/* Description Textarea + AI Severity Badge */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-300">
                      Description & Ground Details *
                    </label>

                    {aiSeverity ? (
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${aiSeverity.color} flex items-center gap-1`}>
                        <Sparkles className="w-3 h-3" />
                        {aiSeverity.label}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">
                        Type description for instant AI rating
                      </span>
                    )}
                  </div>

                  <textarea
                    rows={4}
                    required
                    placeholder="Describe water surge speed, trapped count, road blockage details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#FF6B1A]"
                  />
                </div>

                {/* Optional Photo / Document Upload field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Attach Field Evidence (Optional)
                  </label>
                  <div 
                    onClick={() => setFileAttached(!fileAttached)}
                    className={`border border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                      fileAttached ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-white/10 hover:border-[#FF6B1A]/40 bg-[#0A0A0A]'
                    }`}
                  >
                    <UploadCloud className={`w-6 h-6 mx-auto mb-1 ${fileAttached ? 'text-emerald-400' : 'text-[#9A9A9A]'}`} />
                    <span className="text-xs text-slate-300 block font-medium">
                      {fileAttached ? '✓ Photo Attached: field_recon_img_01.jpg' : 'Click to attach geotagged photograph / radar snapshot'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                      JPG, PNG, PDF up to 10MB
                    </span>
                  </div>
                </div>

                {/* Submit Button - Fixed Width Pill */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-48 py-3.5 px-6 text-xs uppercase tracking-wider font-extrabold text-white bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] hover:opacity-95 rounded-full shadow-lg shadow-[#FF6B1A]/20 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Report</span>
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* Right Column: List of Recent Field Reports */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Recent Field Incident Stream</h2>
              <span className="text-xs font-mono text-[#9A9A9A]">{reports.length} Reports</span>
            </div>

            <div className="space-y-4">
              {reports.map((report) => (
                <div 
                  key={report.id}
                  className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FF6B1A]" />
                      {report.location}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                      report.verified 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                    }`}>
                      {report.verified ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
                      {report.category}
                    </span>
                    <span className="text-[#FF6B1A] font-semibold">{report.severity}</span>
                  </div>

                  <p className="text-xs text-[#9A9A9A] leading-relaxed">
                    "{report.description}"
                  </p>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Logged: {report.timestamp}</span>
                    <span>Observer ID: #{report.id.toString().slice(-4)}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
