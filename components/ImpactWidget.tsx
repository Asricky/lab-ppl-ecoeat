import React from 'react';
import { Leaf, History } from 'lucide-react';

export default function ImpactWidget() {
  const completions = [
    { title: 'Daily Greens Supply', time: '10:45 AM', pts: '+25 pts' },
    { title: 'Pastry Surplus Pack', time: '09:20 AM', pts: '+12 pts' },
    { title: 'Local Farm Box', time: '08:15 AM', pts: '+30 pts' }
  ];

  return (
    <div className="space-y-4">
      {/* Daily Impact Box */}
      <div className="bg-[#f0e6e6] rounded-[24px] p-6 relative overflow-hidden flex items-center gap-4">
        <div className="absolute top-0 bottom-0 left-0 w-2 bg-[#1e8932]"></div>
        <div className="w-12 h-12 bg-[#1e8932] rounded-full flex items-center justify-center shrink-0 shadow-md">
          <Leaf size={24} className="text-white" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#8a5a5a] uppercase tracking-widest mb-1">YOUR DAILY IMPACT</p>
          <p className="font-extrabold text-[#2a1a1a] text-2xl leading-tight">18.5 kg CO2 <br/> Saved</p>
        </div>
      </div>

      {/* Recent Completions Box */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/5">
        <div className="flex items-center gap-2 mb-6">
          <History size={18} className="text-[#388e3c]" />
          <h3 className="font-bold text-ecoeat-text text-lg">Recent Completions</h3>
        </div>

        <div className="space-y-5 relative">
          {/* Vertical timeline line */}
          <div className="absolute left-1 top-2 bottom-2 w-0.5 bg-gray-200"></div>

          {completions.map((comp, i) => (
            <div key={i} className="flex justify-between items-start relative pl-6">
              <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-[#1e8932] ring-4 ring-white"></div>
              <div>
                <p className="font-bold text-ecoeat-text text-sm">{comp.title}</p>
                <p className="text-[10px] font-semibold text-ecoeat-muted uppercase mt-0.5">DELIVERED • {comp.time}</p>
              </div>
              <span className="font-bold text-[#1e8932] text-sm">{comp.pts}</span>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 bg-[#f2f6ef] text-ecoeat-muted font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm">
          View Detailed History
        </button>
      </div>
    </div>
  );
}
