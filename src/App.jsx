import React, { useState, useEffect } from 'react';
import Sidebar from './Modules/Sidebar';
import SalaryCalculator from './Modules/SalaryCalculator';
import PensionCalculator from './Modules/PensionCalculator';
import TaxDetails from './Modules/TaxDetails';
import Settings from './Modules/Settings';
import Analytics from './Modules/Analytics';

function App() {
  // 1. STATO RAL (Persistenza)
  const [ral, setRal] = useState(() => {
    const savedRal = localStorage.getItem('user-ral');
    return savedRal ? Number(savedRal) : 30000;
  });

  // 2. STATO LOCALIZZAZIONE
  const [region, setRegion] = useState(() => {
    return localStorage.getItem('user-region') || 'Lombardia';
  });
  const [municipality, setMunicipality] = useState(() => {
    return localStorage.getItem('user-municipality') || '';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('home'); 

  // 3. EFFETTI: Salva i dati quando cambiano
  useEffect(() => {
    localStorage.setItem('user-ral', ral);
    localStorage.setItem('user-region', region);
    localStorage.setItem('user-municipality', municipality);
  }, [ral, region, municipality]);

  // Calcolo della percentuale per l'effetto riempimento dello slider
  const sliderPercentage = ((ral - 15000) / (100000 - 15000)) * 100;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* SIDEBAR: Sempre fissa su desktop (md:translate-x-0) */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        activePage={activePage}
        setActivePage={setActivePage} 
      />

      {/* OVERLAY MOBILE: Visibile solo quando la sidebar è aperta su piccoli schermi */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* MAIN CONTENT: md:ml-64 sposta il contenuto a destra per far posto alla sidebar fissa */}
      <main className="flex-1 p-4 md:p-10 md:ml-64 transition-all duration-300">
        
        <header className="mb-10 flex items-center gap-4">
          {/* Burger Menu: Visibile SOLO su mobile (md:hidden) */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 text-indigo-600 transition-all md:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
              Financial<span className="text-indigo-600">SwissKnife</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
              {activePage === 'home' ? 'Dashboard Principale' : activePage}
            </p>
          </div>
        </header>

        {activePage === 'home' && (
          <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
             <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 transition-all hover:border-indigo-100">
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">
                 Reddito Annuo Lordo (<span className="text-indigo-600">{region}</span>)
               </label>
               
               <div className="text-center mb-8 text-5xl font-black text-slate-800 tracking-tight">
                 €{ral.toLocaleString('it-IT')}
               </div>
               
               {/* CONTAINER SLIDER CON EFFETTO RIEMPIMENTO */}
               <div className="relative px-2">
                 <input 
                   type="range" 
                   min="15000" 
                   max="100000" 
                   step="1000"
                   value={ral} 
                   onChange={(e) => setRal(Number(e.target.value))} 
                   style={{
                     '--progress': `${sliderPercentage}%`
                   }}
                   className="custom-slider w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer transition-all" 
                 />
                 
                 <div className="flex justify-between mt-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                   <span>Min 15k</span>
                   <span className="text-slate-400">Target 100k</span>
                 </div>
               </div>
             </div>

             <TaxDetails ral={ral} region={region} />
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <SalaryCalculator ral={ral} />
               <PensionCalculator ral={ral} />
             </div>
          </div>
        )}

        {activePage === 'analytics' && (
          <div className="animate-fade-in max-w-5xl mx-auto">
            <Analytics ral={ral} region={region} />
          </div>
        )}

        {activePage === 'settings' && (
          <div className="animate-fade-in max-w-5xl mx-auto">
            <Settings 
              region={region} 
              setRegion={setRegion} 
              municipality={municipality} 
              setMunicipality={setMunicipality} 
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;