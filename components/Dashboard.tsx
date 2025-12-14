import React, { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { TRANSLATIONS, SAMPLE_PATIENTS } from '../constants';
import { AnalysisResult, PatientRecord } from '../types';
import { analyzePatientData } from '../services/geminiService';
import { AudioRecorder } from './AudioRecorder';
import { AnalysisResultsView } from './AnalysisResultsView';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const { language, toggleLanguage, dir } = useLanguage();
  const t = TRANSLATIONS[language];
  
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to convert Blob to Base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleAnalyze = async (textData?: string) => {
    const dataToAnalyze = textData || inputText;
    if (!dataToAnalyze.trim()) return;

    setIsProcessing(true);
    setResults(null);
    try {
      const response = await analyzePatientData(dataToAnalyze, textData ? true : false);
      setResults(response.results);
    } catch (error) {
      alert("Analysis failed. See console.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAudioAnalyze = async (blob: Blob) => {
    setIsProcessing(true);
    setResults(null);
    try {
      const base64Data = await blobToBase64(blob);
      const response = await analyzePatientData({
        mimeType: blob.type,
        data: base64Data
      });
      setResults(response.results);
    } catch (error) {
       alert("Audio analysis failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text); // Load into text area for review
      handleAnalyze(text); // Auto trigger analysis for bulk
    };
    reader.readAsText(file);
  };

  const exportResults = () => {
    if (!results) return;
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(results, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `analysis_export_${new Date().toISOString()}.json`;
    link.click();
  };

  const loadExample = (key: string) => {
    const p = SAMPLE_PATIENTS[key];
    const text = `ID: ${p.id}\nName: ${p.name}\nAge: ${p.age}\nGender: ${p.gender}\nHistory: ${p.familyHistoryText}`;
    setInputText(text);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-md flex items-center justify-center text-white font-bold">Rx</div>
            <h1 className="text-xl font-semibold text-slate-800 hidden sm:block">{t.title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
             <button onClick={toggleLanguage} className="text-sm font-medium text-slate-600 hover:text-teal-600 px-3 py-1 rounded border border-slate-200">
               {language === 'en' ? 'العربية' : 'English'}
             </button>
             <button onClick={onLogout} className="text-sm font-medium text-red-600 hover:text-red-700">
               {t.logout}
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Column */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Controls */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => loadExample('cardiac')} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors">{t.example1}</button>
              <button onClick={() => loadExample('diabetes')} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors">{t.example2}</button>
              <button onClick={() => loadExample('complex')} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors">{t.example3}</button>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-48 p-4 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none font-mono"
              placeholder={t.waiting}
              dir="ltr" 
            />

            <div className="mt-4 flex flex-col gap-3">
              <button
                onClick={() => handleAnalyze()}
                disabled={isProcessing || !inputText}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.analyzing}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    {t.analyze}
                  </>
                )}
              </button>

              <div className="flex gap-2">
                 <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                 >
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                   {t.import}
                 </button>
                 <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".json,.csv,.txt" />

                 <button 
                   onClick={() => setInputText('')}
                   className="px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium"
                   aria-label={t.clear}
                 >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Audio Input (NLP)</h3>
             <AudioRecorder onAudioCaptured={handleAudioAnalyze} />
          </div>

        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-6">
           {results ? (
             <>
               <div className="flex justify-between items-center mb-2">
                 <h2 className="text-xl font-bold text-slate-800">{t.results}</h2>
                 <button onClick={exportResults} className="text-teal-600 hover:underline text-sm font-medium flex items-center gap-1">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                   {t.export}
                 </button>
               </div>
               <AnalysisResultsView results={results} />
             </>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[400px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>{t.waiting}</p>
             </div>
           )}
        </div>
      </main>
    </div>
  );
};