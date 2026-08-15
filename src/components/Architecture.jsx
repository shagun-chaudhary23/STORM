import React, { useState } from 'react';
import { ARCHITECTURE_CARDS } from '../data/stormData';
import { Radio, Cpu, ShieldAlert, Ambulance, MessageSquare, ChevronDown, ChevronUp, Check, Layers } from 'lucide-react';

export default function Architecture() {
  const [openCardId, setOpenCardId] = useState('arch-human'); // Default open to Human Review Gate

  const getArchIcon = (iconName) => {
    switch (iconName) {
      case 'Radio': return Radio;
      case 'Cpu': return Cpu;
      case 'ShieldAlert': return ShieldAlert;
      case 'Ambulance': return Ambulance;
      case 'MessageSquare': return MessageSquare;
      default: return Layers;
    }
  };

  const toggleCard = (id) => {
    setOpenCardId(openCardId === id ? null : id);
  };

  return (
    <section id="architecture" className="py-20 md:py-28 bg-[#080C14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B1A]/10 border border-[#FF6B1A]/30 text-xs font-semibold text-[#FF6B1A]">
            <Layers className="w-3.5 h-3.5" />
            <span>Technical Deep Dive</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Architecture Breakdown
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Explore the 5 modular components built for high-scale disaster decision support across Indian states. Click each stage to inspect technical capabilities.
          </p>
        </div>

        {/* Accordion List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {ARCHITECTURE_CARDS.map((card) => {
            const Icon = getArchIcon(card.icon);
            const isOpen = openCardId === card.id;
            const isHuman = card.id === 'arch-human';

            return (
              <div
                key={card.id}
                className={`rounded-2xl transition-all duration-300 overflow-hidden border ${
                  isHuman
                    ? 'border-[#FF6B1A]/60 bg-slate-900/90 shadow-lg shadow-[#FF6B1A]/10'
                    : 'glass-panel border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleCard(card.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      isHuman
                        ? 'bg-[#FF6B1A] text-slate-950 shadow-md shadow-[#FF6B1A]/30'
                        : 'bg-slate-800 text-[#FF6B1A]'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                          {card.title}
                        </h3>
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full ${
                          isHuman
                            ? 'bg-[#FF6B1A]/20 text-[#FF6B1A] border border-[#FF6B1A]/40 font-bold'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {card.badge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1">
                        {card.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-800/80 text-slate-400 flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Accordion Content */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-800/80 bg-slate-950/40">
                    <ul className="space-y-3 pt-2">
                      {card.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                          <div className="p-1 rounded bg-[#FF6B1A]/10 text-[#FF6B1A] flex-shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
