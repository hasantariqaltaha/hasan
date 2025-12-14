import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { AnalysisResult, RiskLevel } from '../types';
import { TRANSLATIONS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  results: AnalysisResult[];
}

export const AnalysisResultsView: React.FC<Props> = ({ results }) => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  // Helper to get color based on risk
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case RiskLevel.HIGH: return 'bg-red-100 text-red-800 border-red-200';
      case RiskLevel.MEDIUM: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case RiskLevel.LOW: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };
  
  const getChartColor = (risk: string) => {
    switch (risk) {
        case RiskLevel.HIGH: return '#ef4444';
        case RiskLevel.MEDIUM: return '#eab308';
        case RiskLevel.LOW: return '#22c55e';
        default: return '#94a3b8';
    }
  }

  // Pre-process data for charting
  const chartData = results.flatMap(r => r.riskFactors.map(rf => ({
    name: rf.condition,
    riskValue: rf.riskAssessment === RiskLevel.HIGH ? 3 : rf.riskAssessment === RiskLevel.MEDIUM ? 2 : 1,
    riskLabel: rf.riskAssessment
  })));

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Aggregate Chart if multiple results */}
      {results.length > 0 && (
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Risk Overview</h3>
           <div className="h-48 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData} layout="vertical">
                 <XAxis type="number" hide domain={[0, 3]} />
                 <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 12}} />
                 <Tooltip />
                 <Bar dataKey="riskValue" radius={[0, 4, 4, 0]} barSize={20}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getChartColor(entry.riskLabel)} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
         </div>
      )}

      {results.map((res, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800">
                Patient: <span className="text-teal-700 font-mono">{res.patientId}</span>
            </h3>
            {res.dataQualityIssue && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-bold">Data Quality Issue</span>
            )}
          </div>

          <div className="p-6 space-y-6">
            
            {/* Summary Section */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t.summary}</h4>
              <p className="text-slate-700 leading-relaxed text-sm">
                {language === 'ar' ? res.summaryAr : res.summaryEn}
              </p>
            </div>

            {/* Risk Factors Table */}
            <div>
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{t.risk}</h4>
               {res.riskFactors.length === 0 ? (
                 <p className="text-sm text-slate-500 italic">No significant risk factors identified.</p>
               ) : (
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-lg">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Condition</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Relative</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Risk</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {res.riskFactors.map((rf, rIdx) => (
                                <tr key={rIdx}>
                                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{rf.condition}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{rf.relative}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(rf.riskAssessment)}`}>
                                            {rf.riskAssessment}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
               )}
            </div>

            {/* Recommendations */}
            <div className="bg-teal-50 rounded-lg p-5 border border-teal-100">
               <h4 className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">{t.rec}</h4>
               <ul className="list-disc list-inside space-y-1 text-sm text-teal-900">
                 {(language === 'ar' ? res.recommendationsAr : res.recommendationsEn).map((rec, i) => (
                    <li key={i}>{rec}</li>
                 ))}
               </ul>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};