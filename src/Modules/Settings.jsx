import React from 'react';

const Settings = ({ region, setRegion, municipality, setMunicipality }) => {
  const regioni = [
    "Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna", 
    "Friuli-Venezia Giulia", "Lazio", "Liguria", "Lombardia", "Marche", 
    "Molise", "Piemonte", "Puglia", "Sardegna", "Sicilia", "Toscana", 
    "Trentino-Alto Adige", "Umbria", "Valle d'Aosta", "Veneto"
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
          <span>⚙️</span> Localizzazione Fiscale
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Selettore Regione */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Regione di Residenza
            </label>
            <select 
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
            >
              {regioni.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <p className="text-[10px] text-slate-400 font-medium italic">
              L'aliquota IRPEF regionale varia in base alla tua zona.
            </p>
          </div>

          {/* Input Comune (Simulato) */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Comune
            </label>
            <input 
              type="text"
              value={municipality}
              onChange={(e) => setMunicipality(e.target.value)}
              placeholder="Es. Milano"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
            <p className="text-[10px] text-slate-400 font-medium italic">
              Le addizionali comunali vengono applicate in base al Comune.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-200">
        <h3 className="font-black text-lg">💡 Perché è importante?</h3>
        <p className="text-indigo-100 text-sm mt-2 leading-relaxed">
          In Italia, oltre all'IRPEF nazionale, paghiamo addizionali che dipendono da dove viviamo. 
          Ad esempio, il Lazio ha aliquote regionali più alte rispetto alla Lombardia per redditi medio-alti.
        </p>
      </div>
    </div>
  );
};

export default Settings;