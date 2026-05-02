export default function FilterBar({ filters, setFilters }: { filters: any, setFilters: any }) {
  return (
    <div className="w-full lg:w-64 flex-shrink-0 lg:pr-8">
      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Category</h3>
        <div className="space-y-3">
          {['Meals', 'Snacks', 'Bakery', 'Drinks'].map(cat => (
            <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.category === cat ? 'bg-green-700 border-green-700' : 'border-[#d4dec4] group-hover:border-green-500 bg-white'}`}>
                {filters.category === cat && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <span className={`text-sm font-semibold ${filters.category === cat ? 'text-gray-900' : 'text-gray-600'}`}>{cat}</span>
              <input type="checkbox" className="hidden" checked={filters.category === cat} onChange={() => setFilters({...filters, category: filters.category === cat ? '' : cat})} />
            </label>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Price Range</h3>
        <div className="px-2 mb-2">
          <input type="range" min="0" max="50" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})} className="w-full h-2 bg-[#d4dec4] rounded-lg appearance-none cursor-pointer accent-green-700" />
        </div>
        <div className="flex justify-between text-xs font-bold text-gray-500">
          <span>$0</span>
          <span>${filters.maxPrice}+</span>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Distance</h3>
        <div className="flex space-x-2">
          {[5, 10, 25].map(dist => (
            <button 
              key={dist} 
              onClick={() => setFilters({...filters, maxDistance: dist})}
              className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-colors ${filters.maxDistance === dist ? 'bg-green-800 text-white shadow-md' : 'bg-white border border-[#d4dec4] text-gray-600 hover:bg-green-50'}`}
            >
              {dist}km
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Condition</h3>
        <div className="space-y-3">
          {['Near expiry', 'Surplus stock', 'Imperfect food'].map(cond => (
            <label key={cond} className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${filters.condition === cond ? 'border-green-700' : 'border-[#d4dec4] group-hover:border-green-500 bg-white'}`}>
                {filters.condition === cond && <div className="w-2.5 h-2.5 bg-green-700 rounded-full"></div>}
              </div>
              <span className={`text-sm font-semibold ${filters.condition === cond ? 'text-gray-900' : 'text-gray-600'}`}>{cond}</span>
              <input type="radio" className="hidden" checked={filters.condition === cond} onChange={() => setFilters({...filters, condition: cond})} />
            </label>
          ))}
        </div>
      </div>

      <button className="w-full bg-green-800 hover:bg-green-900 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md">
        Apply Filters
      </button>
    </div>
  );
}
