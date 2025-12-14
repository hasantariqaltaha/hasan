import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { TRANSLATIONS } from '../constants';

interface AuthScreenProps {
  onLogin: () => void;
  disabled: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, disabled }) => {
  const { language, toggleLanguage } = useLanguage();
  const t = TRANSLATIONS[language];

  const SocialButton = ({ name, color, icon }: { name: string; color: string; icon: string }) => (
    <button
      onClick={onLogin}
      disabled={disabled}
      className={`${color} text-white w-full py-3 px-4 rounded-lg font-medium shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mb-3`}
    >
      <img src={icon} alt="" className="w-5 h-5 bg-white rounded-full p-0.5" />
      <span>Sign in with {name}</span>
    </button>
  );

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 bg-gradient-to-br from-teal-50 to-blue-100">
      <div className="absolute top-4 right-4">
        <button onClick={toggleLanguage} className="text-sm font-semibold text-slate-600 hover:text-teal-600">
          {language === 'en' ? 'العربية' : 'English'}
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
           <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
             Rx
           </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{t.title}</h1>
        <p className="text-slate-500 mb-8">{t.loginDesc}</p>

        <SocialButton name="Microsoft" color="bg-slate-800" icon="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" />
        <SocialButton name="Google" color="bg-blue-600" icon="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" />
        <SocialButton name="Facebook" color="bg-blue-800" icon="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" />
        
        <div className="mt-6 pt-6 border-t border-slate-100">
           <p className="text-xs text-slate-400">By signing in, you agree to the Terms of Service and Privacy Policy regarding Synthetic Data usage.</p>
        </div>
      </div>
    </div>
  );
};