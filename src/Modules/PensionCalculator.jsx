import React, { useState } from 'react';

const PensionCalculator = ({ ral }) => {
  const [versamento, setVersamento] = useState(100);

  const calcolaRisparmio = () => {
    const totaleAnnuo = versamento * 12;
    const deducibile = Math.min(totaleAnnuo, 5164.57);
    
    let aliquota = 0.23;
    if (ral > 28000) aliquota = 0.35;
    if (ral > 50000) aliquota = 0.43;

    return {
      risparmio: deducibile * aliquota,
      eccedenza: totaleAnnuo > 5164.57
    };
  };

  const { risparmio, eccedenza } = calcolaRisparmio();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-4">🛡️ Fondo Pensione</h2>
      <div className="mb-4">
        <label className="text-xs font-bold text-slate-400 uppercase">Versamento Mensile (€)</label>
        <input 
          type="number" 
          value={versamento} 
          onChange={(e) => setVersamento(Number(e.target.value))} 
          className="w-full mt-1 p-2 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-blue-500 font-bold"
        />
      </div>
      <div className="p-4 bg-blue-50 rounded-xl text-center">
        <span className="text-blue-700 font-bold text-3xl">€{risparmio.toFixed(0)}</span>
        <p className="text-blue-600 text-xs font-medium uppercase mt-1 text-center">Tasse recuperate / anno</p>
      </div>
      {eccedenza && <p className="text-[10px] text-amber-600 mt-2 text-center">⚠️ Oltre la soglia di deducibilità (5.164€)</p>}
    </div>
  );
};

export default PensionCalculator;