import React, { useState, useEffect } from 'react';
import { ComicStrip, ComicPanel } from '../types';
import { ComicPanelItem } from './ComicPanelItem';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Sparkles,
} from 'lucide-react';

interface CinematicReaderModalProps {
  comic: ComicStrip;
  onClose: () => void;
}

export const CinematicReaderModal: React.FC<CinematicReaderModalProps> = ({ comic, onClose }) => {
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState(5000);

  const panels = comic.panels;
  const currentPanel = panels[currentPanelIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextPanel();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevPanel();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPanelIndex, panels.length]);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentPanelIndex((prev) => {
        if (prev < panels.length - 1) return prev + 1;
        setIsAutoPlay(false);
        return prev;
      });
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isAutoPlay, autoPlayInterval, panels.length]);

  // Speech Narration via Web Speech API
  const speakPanel = (panel: ComicPanel) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const narrateQueue: string[] = [];
    if (panel.caption) narrateQueue.push(`Narrator: ${panel.caption}`);
    panel.bubbles.forEach((b) => {
      narrateQueue.push(`${b.speaker ? b.speaker + ': ' : ''}${b.text}`);
    });

    if (narrateQueue.length === 0) return;

    const fullText = narrateQueue.join('. ');
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const nextPanel = () => {
    if (currentPanelIndex < panels.length - 1) {
      setCurrentPanelIndex(currentPanelIndex + 1);
    }
  };

  const prevPanel = () => {
    if (currentPanelIndex > 0) {
      setCurrentPanelIndex(currentPanelIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 text-white select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between z-10 border-b border-stone-800 pb-3">
        <div className="flex items-center gap-3">
          <span className="font-black text-2xl text-white tracking-tighter uppercase italic">
            {comic.title || 'GRAPHIC CHRONICLE'}
          </span>
          <span className="text-[10px] font-editorial-mono font-bold text-black bg-white px-2 py-0.5 uppercase border border-white">
            Panel {currentPanelIndex + 1} of {panels.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio narration button */}
          <button
            type="button"
            onClick={() => {
              if (isPlayingAudio) {
                window.speechSynthesis?.cancel();
                setIsPlayingAudio(false);
              } else {
                speakPanel(currentPanel);
              }
            }}
            className={`px-3 py-1.5 border-2 border-black transition-colors flex items-center gap-1.5 text-xs font-black uppercase tracking-wider ${
              isPlayingAudio
                ? 'bg-red-600 text-white border-red-600 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]'
                : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
          >
            {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-600" />}
            <span className="hidden sm:inline">{isPlayingAudio ? 'Speaking...' : 'Read Aloud'}</span>
          </button>

          {/* Auto-play slideshow */}
          <button
            type="button"
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`px-3 py-1.5 border-2 border-black transition-colors flex items-center gap-1.5 text-xs font-black uppercase tracking-wider ${
              isAutoPlay
                ? 'bg-red-600 text-white border-red-600 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]'
                : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
          >
            {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-red-600" />}
            <span className="hidden sm:inline">{isAutoPlay ? 'Pause' : 'Auto Play'}</span>
          </button>

          {/* Close button */}
          <button
            type="button"
            aria-label="Close Reader Modal"
            onClick={() => {
              window.speechSynthesis?.cancel();
              onClose();
            }}
            className="p-1.5 bg-white hover:bg-black text-black hover:text-white border-2 border-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Single-Panel Stage */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden relative">
        {/* Left Arrow */}
        <button
          type="button"
          aria-label="Previous Panel"
          onClick={prevPanel}
          disabled={currentPanelIndex === 0}
          className="absolute left-2 sm:left-6 z-30 p-3 bg-white text-black hover:bg-red-600 hover:text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* The Big Focused Panel */}
        <div className="w-full max-w-2xl max-h-[75vh] aspect-square flex items-center justify-center relative animate-in fade-in zoom-in-95 duration-200">
          <div className="w-full h-full shadow-[8px_8px_0px_0px_rgba(220,38,38,1)]">
            <ComicPanelItem
              panel={currentPanel}
              styleId={comic.styleId}
              index={currentPanelIndex}
              totalPanels={panels.length}
              onUpdatePanel={() => {}}
              onRegenerateImage={() => {}}
              onOpenInspector={() => {}}
              onMovePanel={() => {}}
              onDeletePanel={() => {}}
              borderWidth={comic.borderWidth}
            />
          </div>
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          aria-label="Next Panel"
          onClick={nextPanel}
          disabled={currentPanelIndex === panels.length - 1}
          className="absolute right-2 sm:right-6 z-30 p-3 bg-white text-black hover:bg-red-600 hover:text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Panel Navigation Dots */}
      <div className="flex items-center justify-center gap-2 z-10 pb-2">
        {panels.map((p, idx) => (
          <button
            key={p.id}
            type="button"
            aria-label={`Go to panel ${idx + 1}`}
            onClick={() => setCurrentPanelIndex(idx)}
            className={`transition-all ${
              idx === currentPanelIndex
                ? 'w-8 h-2 bg-red-600 border border-white'
                : 'w-2 h-2 bg-stone-700 hover:bg-stone-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
