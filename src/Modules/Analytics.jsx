import React from 'react';

const Analytics = ({ ral, region }) => {
  // --- MOTORE DI CALCOLO UNIFICATO (Precisione Tecnica 1:1 con TaxDetails) ---
  const lordoAnnuo = parseFloat(ral) || 0;
  
  // 1. Contributi INPS (9.19%)
  const contributi = lordoAnnuo * 0.0919;
  const imponibileIrpef = lordoAnnuo - contributi;

  // 2. IRPEF Nazionale (Scaglioni 2024/2025)
  let irpefLorda = 0;
  if (imponibileIrpef <= 28000) {
    irpefLorda = imponibileIrpef * 0.23;
  } else if (imponibileIrpef <= 50000) {
    irpefLorda = (28000 * 0.23) + ((imponibileIrpef - 28000) * 0.35);
  } else {
    irpefLorda = (28000 * 0.23) + (22000 * 0.35) + ((imponibileIrpef - 50000) * 0.43);
  }

  // 3. Detrazioni lavoro dipendente (Il motivo per cui il netto saliva)
  let detrazione = 0;
  if (imponibileIrpef <= 15000) detrazione = 1955;
  else if (imponibileIrpef <= 28000) detrazione = 1910 + (1190 * (28000 - imponibileIrpef) / 13000);
  else if (imponibileIrpef <= 50000) detrazione = 1910 * (50000 - imponibileIrpef) / 22000;

  const irpefNettaNazionale = Math.max(0, irpefLorda - detrazione);

  // 4. Addizionale Regionale (Sincronizzata con database Home)
  const aliquoteRegionali = {
    'Lazio': 0.0333, 'Campania': 0.0203, 'Piemonte': 0.0213,
    'Lombardia': 0.0123, 'Veneto': 0.0123, 'Emilia-Romagna': 0.0133,
    'Toscana': 0.0142, 'default': 0.0123
  };
  const addizionaleRegionale = imponibileIrpef * (aliquoteRegionali[region] || aliquoteRegionali['default']);

  // 5. Risultati Finali Sincronizzati
  const tasseTotali = irpefNettaNazionale + addizionaleRegionale;
  const nettoAnnuo = imponibileIrpef - tasseTotali;
  const nettoMensile = nettoAnnuo / 12;
  const pagaOraria = nettoAnnuo / 1720; // Media ore lavorative annue
  const taxRatio = (lordoAnnuo - nettoAnnuo) / lordoAnnuo;

  // 6. Calcolo Dinamico Tax Freedom Day
  const giornoLiberta = Math.floor(365 * taxRatio);
  const dataLiberta = new Date(2024, 0, giornoLiberta);
  const opzioniData = { day: 'numeric', month: 'long' };
  const freedomDateStr = dataLiberta.toLocaleDateString('it-IT', opzioniData);

  // Indicatori Budget (50/30/20)
  const budget = {
    essentials: nettoMensile * 0.5,
    wants: nettoMensile * 0.3,
    savings: nettoMensile * 0.2
  };

  const formatEuro = (v) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="animate-fade-in space-y-6 pb-20">
      
      {/* 1. HEADER: STATO DI SALUTE GENERALE */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Netto Mensile (12m)</p>
          <p className="text-2xl font-black text-indigo-600">{formatEuro(nettoMensile)}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paga Oraria Reale</p>
          <p className="text-2xl font-black text-slate-800">€{pagaOraria.toFixed(2)}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pressione Fiscale</p>
          <p className="text-2xl font-black text-red-500">{(taxRatio * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-indigo-600 p-5 rounded-3xl shadow-lg shadow-indigo-100 text-white transition-all hover:scale-[1.02]">
          <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Tax Freedom Day</p>
          <p className="text-2xl font-black">{freedomDateStr}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. PANNELLO: ALLOCAZIONE INTELLIGENTE */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            🧭 Piano di Ripartizione (Regola 50/30/20)
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-slate-600">Necessità (Affitto, Cibo, Bollette) - 50%</span>
                <span className="text-sm font-black text-slate-800">{formatEuro(budget.essentials)}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-1/2" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-slate-600">Desideri (Svago, Hobby, Cene) - 30%</span>
                <span className="text-sm font-black text-slate-800">{formatEuro(budget.wants)}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-sky-400 w-[30%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-slate-600">Futuro (Risparmio, Investimenti) - 20%</span>
                <span className="text-sm font-black text-indigo-600">{formatEuro(budget.savings)}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-[20%]" />
              </div>
            </div>
          </div>
          <div className="mt-8 p-4 bg-indigo-50 rounded-2xl text-[11px] text-indigo-700 leading-relaxed border border-indigo-100">
            <strong>CONSIGLIO PRO ({region}):</strong> In base alla tua tassazione regionale, il tuo "punto di pareggio" è al {freedomDateStr}. Ogni euro guadagnato dopo questa data è interamente tuo.
          </div>
        </div>

        {/* 3. PANNELLO: COSTO DELLA VITA IN ORE */}
        <div className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white">
          <h3 className="text-lg font-black mb-6 flex items-center gap-2">
            ⌛ Il "Prezzo" in Tempo
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between group">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Affitto Medio (700€)</p>
                <p className="text-xl font-black">{(700 / pagaOraria).toFixed(0)} ore</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg group-hover:bg-indigo-500 transition-colors">🏠</div>
            </div>
            <div className="flex items-center justify-between group">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Spesa Settimanale (80€)</p>
                <p className="text-xl font-black">{(80 / pagaOraria).toFixed(1)} ore</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg group-hover:bg-indigo-500 transition-colors">🛒</div>
            </div>
            <div className="flex items-center justify-between group">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Uscita Serale (40€)</p>
                <p className="text-xl font-black">{(40 / pagaOraria).toFixed(1)} ore</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg group-hover:bg-indigo-500 transition-colors">🍕</div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Efficienza Lavorativa</p>
            <p className="text-sm text-slate-300 italic">"Con la tua RAL attuale, produci ricchezza netta per te stesso ogni { (1/pagaOraria * 100).toFixed(0) } minuti."</p>
          </div>
        </div>
      </div>

      {/* 4. SEZIONE: BENCHMARK E ANALISI PATRIMONIALE */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h3 className="text-lg font-black text-slate-800 italic">Financial Projections & Growth</h3>
          <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase">Strategia 20% Risparmio</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <p className="text-sm text-slate-500">Accumulo potenziale del risparmio mensile ({formatEuro(budget.savings)}):</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Dopo 1 Anno</p>
                <p className="text-xl font-black text-slate-800">{formatEuro(budget.savings * 12)}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 transition-all hover:bg-emerald-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Dopo 5 Anni</p>
                <p className="text-xl font-black text-slate-800">{formatEuro(budget.savings * 60)}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="p-6 bg-indigo-600 rounded-3xl text-white relative overflow-hidden shadow-lg">
               <div className="relative z-10">
                 <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Potenziale di Libertà</p>
                 <p className="text-2xl font-black mt-1">Sabbatico di 1 anno</p>
                 <p className="text-sm text-indigo-100 mt-2">Risparmiando costantemente il 20%, accumuli un intero anno di autonomia ogni 4 anni di lavoro.</p>
               </div>
               <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 rotate-12 select-none">🏖️</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Analytics;