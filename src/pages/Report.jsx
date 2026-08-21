import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Send, CheckCircle2, AlertTriangle, UploadCloud, 
  MapPin, ShieldAlert, Sparkles, Clock, Check, X, Image as ImageIcon, Search, User, Phone, LogOut, ChevronRight, Activity
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function Report() {
  const [reports, setReports] = useState([]);
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Flooding');
  const [description, setDescription] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [submittedMessage, setSubmittedMessage] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeReport, setActiveReport] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const fileInputRef = useRef(null);

  // Lightweight Reporter Identity (stored in localStorage)
  const [reporter, setReporter] = useState(() => {
    try {
      const saved = localStorage.getItem('storm_reporter');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [reporterNameInput, setReporterNameInput] = useState('');
  const [reporterPhoneInput, setReporterPhoneInput] = useState('');

  const handleReporterLogin = (e) => {
    e.preventDefault();
    if (!reporterNameInput.trim() || !reporterPhoneInput.trim()) return;

    const rep = {
      name: reporterNameInput.trim(),
      phone: reporterPhoneInput.trim()
    };
    localStorage.setItem('storm_reporter', JSON.stringify(rep));
    setReporter(rep);
  };

  const handleReporterLogout = () => {
    localStorage.removeItem('storm_reporter');
    setReporter(null);
  };

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
    const timeout = setTimeout(() => setIsTyping(false), 400);
    return () => clearTimeout(timeout);
  }, [description]);

  useEffect(() => {
    fetch(`${API_URL}/api/reports`)
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(err => console.error("Error fetching reports", err));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedFile({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      type: file.type
    });

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setFilePreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setAttachedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reporter) {
      setErrorMsg('Please register your observer credentials below before submitting.');
      return;
    }
    if (!location || !description) return;

    setErrorMsg(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          category,
          severity: aiSeverity ? aiSeverity.label.split(': ')[1] : 'Medium',
          description,
          reporterName: reporter.name,
          reporterPhone: reporter.phone
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
      setAttachedFile(null);
      setFilePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
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

          {/* Reporter Status Bar */}
          <div className="pt-2">
            {reporter ? (
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-300">Registered Reporter:</span>
                <strong className="text-emerald-400">{reporter.name}</strong>
                <span className="text-slate-500 font-normal">({reporter.phone})</span>
                <button
                  onClick={handleReporterLogout}
                  className="text-slate-400 hover:text-red-400 transition-colors ml-1 p-0.5 cursor-pointer"
                  title="Sign out reporter"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-xs font-mono text-amber-400">
                <User className="w-3.5 h-3.5" />
                <span>Reporter Identification Required to Submit Reports</span>
              </div>
            )}
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Incident Report Form */}
          <div className="lg:col-span-7 space-y-6">

            {/* Reporter Registration Box if Logged Out */}
            {!reporter && (
              <div className="p-6 rounded-2xl bg-[#141414] border border-amber-500/30 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#FF6B1A]" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Field Reporter Registration</h3>
                </div>
                <p className="text-xs text-[#9A9A9A]">
                  Enter your name and contact phone number. All submitted reports will be stamped with your field ID for SDMA auditability.
                </p>
                <form onSubmit={handleReporterLogin} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={reporterNameInput}
                      onChange={(e) => setReporterNameInput(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF6B1A]"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Contact Phone Number"
                      value={reporterPhoneInput}
                      onChange={(e) => setReporterPhoneInput(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF6B1A]"
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="py-2.5 px-5 text-xs font-bold text-white bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] rounded-full shadow cursor-pointer hover:opacity-90"
                    >
                      Confirm Reporter Identity
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className={`p-6 sm:p-8 rounded-2xl bg-[#141414] border border-white/10 shadow-2xl space-y-6 transition-opacity ${!reporter ? 'opacity-70' : ''}`}>
              
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
                    <strong className="block text-white text-sm">Report Successfully Ingested & Persisted</strong>
                    Incident saved to database and queued for spatial deduplication.
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-3 text-xs text-red-300 animate-in fade-in slide-in-from-top-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <strong className="block text-white text-sm">Submission Error</strong>
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
                      disabled={!reporter}
                      placeholder="e.g. Teesta Bridge Sector 4, Singtam"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#FF6B1A] transition-colors disabled:cursor-not-allowed"
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
                    disabled={!reporter}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF6B1A] transition-colors disabled:cursor-not-allowed"
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
                    disabled={!reporter}
                    placeholder="Describe water surge speed, trapped count, road blockage details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#FF6B1A] transition-colors disabled:cursor-not-allowed"
                  />
                </div>

                {/* Working Photo / Document Upload field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Attach Field Evidence (Optional)
                  </label>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div 
                    onClick={() => {
                      if (reporter && fileInputRef.current) fileInputRef.current.click();
                    }}
                    className={`border border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-300 ${
                      attachedFile 
                        ? 'border-emerald-500/50 bg-emerald-950/20' 
                        : 'border-white/10 hover:border-[#FF6B1A]/40 bg-[#0A0A0A]'
                    }`}
                  >
                    {attachedFile ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {filePreview ? (
                            <img src={filePreview} alt="Evidence Preview" className="w-12 h-12 object-cover rounded-lg border border-emerald-500/30" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-black/50 border border-emerald-500/30 flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-emerald-400" />
                            </div>
                          )}
                          <div className="text-left">
                            <span className="text-xs text-emerald-400 font-medium block truncate max-w-xs">{attachedFile.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{attachedFile.size}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                          title="Remove attached file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-6 h-6 mx-auto mb-2 text-[#9A9A9A]" />
                        <span className="text-xs text-slate-300 block font-medium">
                          Click to select and attach geotagged photograph / document
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block mt-1">
                          PNG, JPG, PDF up to 10MB (Local client preview)
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Submit Button - Fixed Width Pill */}
                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading || !reporter}
                    className="w-full sm:w-56 py-3.5 px-6 text-xs uppercase tracking-wider font-extrabold text-white bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] hover:opacity-95 rounded-full shadow-lg shadow-[#FF6B1A]/20 hover:scale-[1.02] transition-all cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Persisting...' : (reporter ? 'Submit Field Report' : 'Register to Submit')}</span>
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
                Live Incident Stream (SQLite Synced)
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
                      String(report.severity || '').toLowerCase().includes('high') ? 'text-red-400' : 
                      String(report.severity || '').toLowerCase().includes('medium') ? 'text-[#FF6B1A]' : 'text-emerald-400'
                    }`}>
                      Sev: {report.severity}
                    </span>
                  </div>

                  <p className="text-xs text-[#9A9A9A] leading-relaxed line-clamp-2">
                    "{report.description}"
                  </p>

                  <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {report.timestamp}</span>
                    <span className="flex items-center gap-1">
                      {report.reporter_name ? `By: ${report.reporter_name}` : 'Details'} <ChevronRight className="w-3 h-3" />
                    </span>
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
              <button onClick={() => setActiveReport(null)} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
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
                  {activeReport.reporter_name && (
                    <>
                      <span className="text-slate-600">•</span>
                      <span className="text-emerald-400 font-semibold">{activeReport.reporter_name}</span>
                    </>
                  )}
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
                      String(activeReport.severity || '').toLowerCase().includes('high') ? 'text-red-400' : 
                      String(activeReport.severity || '').toLowerCase().includes('medium') ? 'text-amber-400' : 'text-emerald-400'
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
                    className="flex-1 py-3 text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleVerify(activeReport.id)}
                    className="flex-1 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
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
