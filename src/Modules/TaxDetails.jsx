import React, { useState } from 'react';

const TaxDetails = ({ ral, region }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  // Helper per formattazione
  const formatEuro = (valore) => 
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(valore);
  
  const formatPercent = (valore) => 
    new Intl.NumberFormat('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(valore) + '%';

  // Mini-database aliquote regionali medie (semplificato per l'esercizio)
  const getAddizionaleRegionale = (imponibile, reg) => {
    const aliquoteRegionali = {
      'Lazio': 0.0333,
      'Campania': 0.0203,
      'Piemonte': 0.0213,
      'Lombardia': 0.0123,
      'Veneto': 0.0123,
      'Emilia-Romagna': 0.0133,
      'Toscana': 0.0142,
      // Default per le altre regioni (media approssimativa)
      'default': 0.0123
    };
    
    const aliquota = aliquoteRegionali[reg] || aliquoteRegionali['default'];
    return imponibile * aliquota;
  };

  const calcolaTasse = () => {
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

    // 3. Detrazioni da lavoro dipendente
    let detrazione = 0;
    if (imponibileIrpef <= 15000) detrazione = 1955;
    else if (imponibileIrpef <= 28000) detrazione = 1910 + (1190 * (28000 - imponibileIrpef) / 13000);
    else if (imponibileIrpef <= 50000) detrazione = 1910 * (50000 - imponibileIrpef) / 22000;

    const irpefNettaNazionale = Math.max(0, irpefLorda - detrazione);

    // 4. NUOVO: Addizionale Regionale
    const addizionaleRegionale = getAddizionaleRegionale(imponibileIrpef, region);

    // 5. Totale Tasse e Netto
    const totaleTasse = irpefNettaNazionale + addizionaleRegionale;
    const nettoAnnuo = imponibileIrpef - totaleTasse;

    return { contributi, irpefNetta: totaleTasse, nettoAnnuo, addizionaleRegionale };
  };

  const { contributi, irpefNetta, nettoAnnuo, addizionaleRegionale } = calcolaTasse();

  const dati = [
    { label: 'Contributi INPS', valore: contributi, colore: 'bg-amber-500' },
    { label: 'Tasse (IRPEF + Reg.)', valore: irpefNetta, colore: 'bg-red-500' },
    { label: 'Stipendio Netto', valore: nettoAnnuo, colore: 'bg-green-500' },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 col-span-1 md:col-span-2">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            📊 Ripartizione Lordo Annuo
          </h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            Basato su residenza in: <span className="text-indigo-600">{region}</span>
          </p>
        </div>
      </div>
      
      <div className="relative pt-10 pb-4">
        {/* Progress Bar Multicolore */}
        <div className="w-full h-12 flex rounded-2xl overflow-visible border border-slate-100 bg-slate-50 shadow-inner">
          {dati.map((item, index) => {
            const percVal = (item.valore / ral) * 100;
            const isHovered = activeIndex === index;

            return (
              <div 
                key={index}
                style={{ width: `${percVal}%` }}
                className={`${item.colore} h-full relative cursor-pointer transition-all duration-300 first:rounded-l-2xl last:rounded-r-2xl hover:brightness-110`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {isHovered && (
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-20 bg-slate-900 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-2xl whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      <span className="text-slate-400 uppercase text-[9px]">{item.label}</span>
                      <span className="text-sm">{formatEuro(item.valore)}</span>
                      <span className="text-indigo-400">{formatPercent(percVal)}</span>
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legenda Dettagliata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {dati.map((item, index) => (
          <div key={index} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${item.colore}`} />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{item.label}</p>
            </div>
            <p className="text-xl font-black text-slate-800">{formatEuro(item.valore)}</p>
            {item.label.includes('Tasse') && (
              <p className="text-[9px] text-slate-400 mt-1 font-medium">
                Inc. addizionale regionale: {formatEuro(addizionaleRegionale)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaxDetails;