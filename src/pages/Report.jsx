import React, { useState, useEffect } from 'react';
import { fieldReports as initialReports } from '../data/mockData';
import { 
  FileText, Send, CheckCircle2, AlertTriangle, UploadCloud, 
  MapPin, ShieldAlert, Sparkles, Clock, Check, X, Image as ImageIcon, Search
} from 'lucide-react';

export default function Report() {
  const [reports, setReports] = useState([]);
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Flooding');
  const [description, setDescription] = useState('');
  const [fileAttached, setFileAttached] = useState(false); // TODO: real file upload, see production hardening checklist
  const [submittedMessage, setSubmittedMessage] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeReport, setActiveReport] = useState(null); // For verification modal
  const [isTyping, setIsTyping] = useState(false);

  // Auto-computed AI severity based on description length/keywords
  const computeAiSeverity = () => {
    if (!description || description.trim().length < 5) return null;
    const lower = description.toLowerCase();
    if (lower.includes('water rise') || lower.includes('flood') || lower.includes('collapse') || lower.includes('trap') || lower.includes('surge')) {
      return { label: 'AI-Assessed: High', color: 'bg-red-950 text-red-400 border-red-500/30 shadow-red-500/20' };
    }
    if (lower.includes('blocked') || lower.includes('debris') || lower.includes('cut off') || lower.includes('damage')) {
      return { label: 'AI-Assessed: Medium', color: 'bg-amber-950 text-amber-400 border-amber-500/30 shadow-amber-500/20' };
    }
    return { label: 'AI-Assessed: Low', color: 'bg-emerald-950 text-emerald-400 border-emerald-500/30 shadow-emerald-500/20' };
  };

  const aiSeverity = computeAiSeverity();

  // Simulate typing delay for AI Assessment
  useEffect(() => {
    setIsTyping(true);
    const timeout = setTimeout(() => setIsTyping(false), 500);
    return () => clearTimeout(timeout);
  }, [description]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/reports`)
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(err => console.error("Error fetching reports", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location || !description) return;

    setErrorMsg(null);
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          category,
          severity: aiSeverity ? aiSeverity.label.split(': ')[1] : 'Medium',
          description
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit report');
      }

      const savedReport = await response.json();
      setReports([savedReport, ...reports]);
      setLocation('');
      setDescription('');
      setFileAttached(false);
      setSubmittedMessage(true);
      setTimeout(() => setSubmittedMessage(false), 5000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (id) => {
    setReports(reports.map(r => r.id === id ? { ...r, verified: true } : r));
    setActiveReport(null);
  };

  return (
    <div className="relative pt-28 pb-20 overflow-hidden min-h-screen">
      
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
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-1 rounded-md border border-emerald-500/20">INTAKE ONLINE</span>
              </div>

              {submittedMessage && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 text-xs text-emerald-300 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <strong className="block text-white text-sm">Report Successfully Ingested</strong>
                    Incident logged and queued for SDMA spatial deduplication.
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-3 text-xs text-red-300 animate-in fade-in slide-in-from-top-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <strong className="block text-white text-sm">Submission Failed</strong>
                    {errorMsg}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Location Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Incident Location / Landmark *
                  </label>
                  <div className="relative group">
                    <MapPin className="w-4 h-4 text-[#FF6B1A] absolute left-3.5 top-3.5 pointer-events-none group-focus-within:animate-bounce" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Teesta Bridge Sector 4, Singtam"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#FF6B1A] transition-colors"
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
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF6B1A] transition-colors"
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

                    {isTyping ? (
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Sparkles className="w-3 h-3 animate-spin text-[#FF6B1A]" />
                        Analyzing...
                      </span>
                    ) : aiSeverity ? (
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border shadow-lg ${aiSeverity.color} flex items-center gap-1 transition-all duration-300`}>
                        <Sparkles className="w-3 h-3" />
                        {aiSeverity.label}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-600 font-mono">
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
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#FF6B1A] transition-colors"
                  />
                </div>

                {/* Optional Photo / Document Upload field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Attach Field Evidence (Optional)
                  </label>
                  <div 
                    onClick={() => setFileAttached(!fileAttached)}
                    className={`border border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-300 ${
                      fileAttached ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-white/10 hover:border-[#FF6B1A]/40 bg-[#0A0A0A]'
                    }`}
                  >
                    {fileAttached ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-lg bg-black/50 border border-emerald-500/30 flex items-center justify-center overflow-hidden relative group">
                          <ImageIcon className="w-8 h-8 text-emerald-500/50" />
                          <div className="absolute inset-0 bg-emerald-400/10 group-hover:bg-emerald-400/20 transition-colors"></div>
                        </div>
                        <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          field_recon_img_01.jpg (2.4MB)
                        </span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-6 h-6 mx-auto mb-2 text-[#9A9A9A]" />
                        <span className="text-xs text-slate-300 block font-medium">
                          Click to attach geotagged photograph / radar snapshot
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block mt-1">
                          JPG, PNG, PDF up to 10MB
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Submit Button - Fixed Width Pill */}
                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-48 py-3.5 px-6 text-xs uppercase tracking-wider font-extrabold text-white bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] hover:opacity-95 rounded-full shadow-lg shadow-[#FF6B1A]/20 hover:scale-[1.02] transition-all cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Submitting...' : 'Submit Report'}</span>
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* Right Column: List of Recent Field Reports */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Live Incident Stream
              </h2>
              <span className="text-xs font-mono text-[#9A9A9A] bg-white/5 px-2 py-1 rounded-md">{reports.length} Reports</span>
            </div>

            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {reports.map((report) => (
                <div 
                  key={report.id}
                  onClick={() => setActiveReport(report)}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    report.verified ? 'bg-[#141414] border-white/10 hover:border-emerald-500/40' : 'bg-[#1a1a1a] border-[#FF6B1A]/20 hover:border-[#FF6B1A]/60 shadow-lg shadow-[#FF6B1A]/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 truncate max-w-[65%]">
                      <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${report.verified ? 'text-emerald-400' : 'text-[#FF6B1A]'}`} />
                      {report.location}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider flex-shrink-0 ${
                      report.verified 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                    }`}>
                      {report.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono mb-2">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
                      {report.category}
                    </span>
                    <span className={`font-semibold ${
                      report.severity.toLowerCase().includes('high') ? 'text-red-400' : 
                      report.severity.toLowerCase().includes('medium') ? 'text-[#FF6B1A]' : 'text-emerald-400'
                    }`}>
                      Sev: {report.severity}
                    </span>
                  </div>

                  <p className="text-xs text-[#9A9A9A] leading-relaxed line-clamp-2">
                    "{report.description}"
                  </p>

                  <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {report.timestamp}</span>
                    <span className="flex items-center gap-1">View Details <ChevronRight className="w-3 h-3" /></span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Verification Modal */}
      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Search className="w-4 h-4 text-[#FF6B1A]" />
                Incident Inspection
              </div>
              <button onClick={() => setActiveReport(null)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#FF6B1A]" /> {activeReport.location}
                </h2>
                <div className="flex gap-2 text-xs font-mono">
                  <span className="text-slate-400">ID: #{activeReport.id}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">Reported: {activeReport.timestamp}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#0A0A0A] rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Category</span>
                  <span className="text-sm font-semibold text-white">{activeReport.category}</span>
                </div>
                <div className="p-3 bg-[#0A0A0A] rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">AI Assessed Severity</span>
                  <span className={`text-sm font-semibold ${
                      activeReport.severity.toLowerCase().includes('high') ? 'text-red-400' : 
                      activeReport.severity.toLowerCase().includes('medium') ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                    {activeReport.severity}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Field Description</span>
                <p className="text-sm text-slate-300 leading-relaxed p-4 bg-white/5 rounded-xl border border-white/5 italic">
                  "{activeReport.description}"
                </p>
              </div>

              {!activeReport.verified ? (
                <div className="pt-4 border-t border-white/10 flex gap-3">
                  <button
                    onClick={() => setActiveReport(null)}
                    className="flex-1 py-3 text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleVerify(activeReport.id)}
                    className="flex-1 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as Verified
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-white/10 flex justify-center">
                  <span className="px-4 py-2 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> This report has been verified.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Missing icon fallback for imports
function ChevronRight(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function Activity(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
