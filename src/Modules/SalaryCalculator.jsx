import React, { useState } from 'react';

const SalaryCalculator = ({ ral }) => {
  const [mesi, setMesi] = useState(13);

  const calcolaNetto = () => {
    const lordo = parseFloat(ral) || 0;
    let irpef = 0;
    
    // Aliquote IRPEF 2024/2026
    if (lordo <= 28000) {
      irpef = lordo * 0.23;
    } else if (lordo <= 50000) {
      irpef = (28000 * 0.23) + ((lordo - 28000) * 0.35);
    } else {
      irpef = (28000 * 0.23) + (22000 * 0.35) + ((lordo - 50000) * 0.43);
    }

    const contributi = lordo * 0.0919; 
    const nettoAnnuo = lordo - irpef - contributi;
    
    return {
      mensile: nettoAnnuo / mesi,
      annuo: nettoAnnuo
    };
  };

  const { mensile } = calcolaNetto();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center">
      <h2 className="text-xl font-bold text-slate-800 mb-4 text-left">💶 Stipendio Netto</h2>
      <div className="mb-4 text-left">
        <label className="text-xs font-bold text-slate-400 uppercase">Mensilità</label>
        <select value={mesi} onChange={(e) => setMesi(Number(e.target.value))} className="w-full mt-1 p-2 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-green-500">
          <option value={12}>12 Mesi</option>
          <option value={13}>13 Mesi</option>
          <option value={14}>14 Mesi</option>
        </select>
      </div>
      <div className="p-4 bg-green-50 rounded-xl">
        <span className="text-green-700 font-bold text-3xl">€{mensile.toFixed(0)}</span>
        <p className="text-green-600 text-xs font-medium uppercase mt-1">Al mese</p>
      </div>
    </div>
  );
};

export default SalaryCalculator;