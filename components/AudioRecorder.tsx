import React, { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { TRANSLATIONS } from '../constants';

interface AudioRecorderProps {
  onAudioCaptured: (blob: Blob) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioCaptured }) => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onAudioCaptured(blob);
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-teal-200 rounded-lg bg-teal-50">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all ${
          isRecording ? 'bg-red-500 animate-pulse' : 'bg-teal-500 hover:bg-teal-600'
        } text-white shadow-lg focus:outline-none`}
      >
        {isRecording ? (
          <div className="w-6 h-6 bg-white rounded-sm" />
        ) : (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>
      <p className="mt-2 text-sm font-medium text-teal-800">
        {isRecording ? t.stopRec : t.audioRec}
      </p>
      {isRecording && <span className="text-xs text-red-500 mt-1">Recording...</span>}
    </div>
  );
};