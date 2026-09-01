import React, { useState, useMemo } from 'react';
import { ComicStyleId, ComicLayoutId, DetectedDialogue } from '../types';
import { COMIC_STYLES, COMIC_LAYOUTS, STORY_PRESETS } from '../data/comicPresets';
import {
  Wand2,
  BookOpen,
  LayoutGrid,
  Palette,
  ArrowRight,
  Flame,
  Check,
  ChevronDown,
  RefreshCw,
  MessageSquare,
  VolumeX,
  Radio,
  Cloud,
  User,
  Bold,
  Italic,
  Sparkles,
} from 'lucide-react';
import { parseDialoguesFromText, parseFormattedInline } from '../utils/dialogueDetector';

interface StoryScriptInputProps {
  storyText: string;
  onChangeStoryText: (text: string) => void;
  selectedStyleId: ComicStyleId;
  onChangeStyleId: (id: ComicStyleId) => void;
  selectedLayoutId: ComicLayoutId;
  onChangeLayoutId: (id: ComicLayoutId) => void;
  panelCount: number;
  onChangePanelCount: (count: number) => void;
  onGenerateComic: () => void;
  onEnhanceScript: (idea: string) => Promise<void>;
  isGenerating: boolean;
  isEnhancing: boolean;
  generationStep: string;
}

export const StoryScriptInput: React.FC<StoryScriptInputProps> = ({
  storyText,
  onChangeStoryText,
  selectedStyleId,
  onChangeStyleId,
  selectedLayoutId,
  onChangeLayoutId,
  panelCount,
  onChangePanelCount,
  onGenerateComic,
  onEnhanceScript,
  isGenerating,
  isEnhancing,
  generationStep,
}) => {
  const [showPresetsDropdown, setShowPresetsDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'script' | 'dialogues' | 'style' | 'layout'>('script');

  // Real-time dialogue detection from current input text
  const detectedDialogues = useMemo(() => {
    return parseDialoguesFromText(storyText, panelCount);
  }, [storyText, panelCount]);

  const handleSelectPreset = (presetId: string) => {
    const preset = STORY_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      onChangeStoryText(preset.scriptText);
      onChangeStyleId(preset.styleId);
      onChangeLayoutId(preset.layoutId);
      setShowPresetsDropdown(false);
    }
  };

  const currentStyle = COMIC_STYLES.find((s) => s.id === selectedStyleId) || COMIC_STYLES[0];
  const currentLayout = COMIC_LAYOUTS.find((l) => l.id === selectedLayoutId) || COMIC_LAYOUTS[0];

  return (
    <div className="w-full bg-white border-2 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-[#1a1a1a] flex flex-col gap-4">
      {/* Header with Quick Presets & AI Enhance */}
      <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap border-b-2 border-black pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600 font-editorial-mono">
              EDITORIAL WORKBENCH // AUTOMATIC DIALOGUE DETECTION
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter italic text-black">
            Comic Script & Layout Generator
          </h2>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Turn any story into a multi-panel comic strip with auto-detected character speech bubbles and smart spatial layout.
          </p>
        </div>

        {/* Story Presets Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPresetsDropdown(!showPresetsDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f2f2f2] hover:bg-black hover:text-white text-black text-[10px] font-black uppercase tracking-widest border border-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <BookOpen className="w-3.5 h-3.5 text-red-600" />
            <span>Story Presets</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showPresetsDropdown && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-2 z-50 flex flex-col gap-1 max-h-96 overflow-y-auto">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2 py-1 border-b border-gray-200">
                Curated Story Templates
              </div>
              {STORY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id)}
                  className="w-full text-left p-2 hover:bg-black hover:text-white group transition-colors flex flex-col gap-0.5"
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="font-black tracking-tight">{preset.title}</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 group-hover:bg-red-600 text-black group-hover:text-white font-editorial-mono uppercase font-bold">
                      {preset.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 group-hover:text-gray-300 line-clamp-1">
                    {preset.summary}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Tab Navigation: Script vs Dialogues Inspector vs Style vs Layout */}
      <div className="flex items-center gap-1 bg-[#f2f2f2] p-1 border border-black text-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('script')}
          className={`flex-1 py-2 px-3 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            activeTab === 'script'
              ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              : 'text-gray-600 hover:text-black'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>1. Script & Premise</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dialogues')}
          className={`flex-1 py-2 px-3 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            activeTab === 'dialogues'
              ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              : 'text-gray-600 hover:text-black'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-red-500" />
          <span>2. Detected Bubbles ({detectedDialogues.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-2 px-3 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            activeTab === 'style'
              ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              : 'text-gray-600 hover:text-black'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>3. Art Style ({currentStyle.badge})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('layout')}
          className={`flex-1 py-2 px-3 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            activeTab === 'layout'
              ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              : 'text-gray-600 hover:text-black'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>4. Layout ({panelCount} Panels)</span>
        </button>
      </div>

      {/* TAB 1: STORY / SCRIPT INPUT */}
      {activeTab === 'script' && (
        <div className="flex flex-col gap-3">
          <div className="relative">
            <textarea
              value={storyText}
              onChange={(e) => onChangeStoryText(e.target.value)}
              placeholder={`Write or paste your comic script here. Examples:

DETECTIVE VANCE: "We need to secure the perimeter now!"
CHRONOS (shouting): "You cannot stop what is already written!"
MAYA (thought): *There must be another way out of this clocktower.*
[RADIO] DISPATCH: "Units en route to 5th Avenue."`}
              rows={5}
              className="w-full bg-[#fdfdfd] border-2 border-black p-3.5 text-sm sm:text-base text-black placeholder:text-gray-400 focus:outline-none focus:border-red-600 font-serif leading-relaxed resize-y shadow-xs"
            />

            {/* Quick Dialogue Detection Indicator Banner */}
            <div className="mt-2 p-2 bg-[#f4f4f4] border border-black flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-red-600" />
                <span className="font-editorial-mono text-[11px] font-bold">
                  Auto-detected <span className="font-black text-red-600">{detectedDialogues.length} dialogue lines</span> with character anchors
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('dialogues')}
                className="px-2.5 py-1 bg-black text-white text-[10px] font-black uppercase tracking-wider hover:bg-red-600"
              >
                Inspect Speech Bubbles →
              </button>
            </div>

            {/* AI Script Polish / Expand Button & Panel Count */}
            <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
              <div className="text-xs font-bold text-gray-700 flex items-center gap-2 font-editorial-mono">
                <span className="text-[10px] uppercase font-black tracking-widest text-black">Panels Count:</span>
                <div className="flex items-center gap-1">
                  {[3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => onChangePanelCount(num)}
                      className={`w-7 h-7 flex items-center justify-center text-xs font-black border transition-colors ${
                        panelCount === num
                          ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                          : 'bg-white text-black border-black hover:bg-gray-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onEnhanceScript(storyText)}
                disabled={isEnhancing || !storyText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-black hover:text-white text-black text-[10px] font-black uppercase tracking-widest border-2 border-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
              >
                <Wand2 className={`w-3.5 h-3.5 text-red-600 ${isEnhancing ? 'animate-spin' : ''}`} />
                <span>{isEnhancing ? 'Expanding with AI...' : 'AI Enhance & Expand Script'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DETECTED DIALOGUES & BUBBLES INSPECTOR */}
      {activeTab === 'dialogues' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-black pb-2">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-black">
                Detected Character Speech Bubbles ({detectedDialogues.length})
              </h3>
              <p className="text-[11px] text-gray-500 font-sans">
                Automatically extracted from your script with character positions, emotion types, and formatting tags.
              </p>
            </div>
          </div>

          {detectedDialogues.length === 0 ? (
            <div className="p-6 text-center border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center gap-2">
              <MessageSquare className="w-8 h-8 text-gray-400" />
              <p className="text-xs font-bold text-gray-600">No dialogue detected yet.</p>
              <p className="text-[11px] text-gray-500 max-w-md">
                Add dialogues using script format (e.g. <code className="bg-gray-200 px-1 py-0.5 font-editorial-mono">SPEAKER: "Line of speech"</code>) or quotes (<code className="bg-gray-200 px-1 py-0.5 font-editorial-mono">"Look out!", shouted Vance</code>).
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {detectedDialogues.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3 bg-[#fafafa] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 bg-black text-white font-editorial-mono font-bold">
                        Panel {item.suggestedPanelIndex + 1}
                      </span>
                      <span className="font-black text-xs uppercase text-red-600 tracking-wider">
                        {item.speaker}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Character Anchor Badge */}
                      <span className="text-[9px] px-1.5 py-0.5 bg-white border border-black font-editorial-mono font-bold uppercase flex items-center gap-0.5">
                        <User className="w-2.5 h-2.5 text-red-600" />
                        {item.characterPosition} ({item.tailDirection})
                      </span>

                      {/* Bubble Type Badge */}
                      <span className="text-[9px] px-1.5 py-0.5 bg-black text-white font-editorial-mono font-bold uppercase">
                        {item.type}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm font-comic-text bg-white p-2 border border-black leading-snug">
                    <span className={`${item.bold ? 'font-black' : ''} ${item.italic ? 'italic' : ''} ${item.uppercase ? 'uppercase' : ''}`}>
                      {parseFormattedInline(item.text)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-editorial-mono pt-1 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <span>Coordinates: x:{item.x}% y:{item.y}%</span>
                      {item.bold && <span className="font-black text-black">BOLD</span>}
                      {item.italic && <span className="italic text-black">ITALIC</span>}
                      {item.uppercase && <span className="text-black">CAPS</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ART STYLE SELECTOR */}
      {activeTab === 'style' && (
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {COMIC_STYLES.map((style) => {
              const isSelected = selectedStyleId === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onChangeStyleId(style.id)}
                  className={`text-left p-3 border-2 transition-all flex flex-col gap-1 relative ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]'
                      : 'bg-white text-black border-black hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-black text-xs uppercase tracking-wider">
                      {style.name}
                    </span>
                    {isSelected && (
                      <div className="w-4 h-4 bg-red-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <p className={`text-[11px] leading-snug line-clamp-2 ${isSelected ? 'text-gray-300' : 'text-gray-600'}`}>
                    {style.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: LAYOUT SELECTOR */}
      {activeTab === 'layout' && (
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {COMIC_LAYOUTS.map((layout) => {
              const isSelected = selectedLayoutId === layout.id;
              return (
                <button
                  key={layout.id}
                  type="button"
                  onClick={() => {
                    onChangeLayoutId(layout.id);
                    onChangePanelCount(layout.panelCount);
                  }}
                  className={`text-left p-3 border-2 transition-all flex flex-col gap-1 relative ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]'
                      : 'bg-white text-black border-black hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-black text-xs uppercase tracking-wider">
                      {layout.name}
                    </span>
                    {isSelected && (
                      <div className="w-4 h-4 bg-red-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] font-editorial-mono font-bold ${isSelected ? 'text-red-400' : 'text-red-600'}`}>
                    {layout.panelCount} Panels Grid
                  </span>
                  <p className={`text-[11px] leading-snug line-clamp-2 ${isSelected ? 'text-gray-300' : 'text-gray-600'}`}>
                    {layout.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* GENERATE FULL COMIC STRIP PRIMARY ACTION BUTTON */}
      <div className="pt-3 border-t-2 border-black flex items-center justify-between gap-3 flex-wrap">
        <div className="text-[11px] text-gray-600 font-editorial-mono">
          Specs: <span className="text-black font-black uppercase">{panelCount} Panels</span> •{' '}
          <span className="text-red-600 font-black uppercase">{currentStyle.badge}</span> •{' '}
          <span className="text-black font-black uppercase">{currentLayout.name}</span> •{' '}
          <span className="text-black font-bold font-editorial-mono">{detectedDialogues.length} Bubbles</span>
        </div>

        <button
          type="button"
          onClick={onGenerateComic}
          disabled={isGenerating || !storyText.trim()}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-7 py-3.5 bg-black hover:bg-red-600 text-white text-xs sm:text-sm font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{generationStep || 'COMPOSING COMIC STRIP...'}</span>
            </>
          ) : (
            <>
              <Flame className="w-4 h-4 text-red-500 fill-red-500" />
              <span>GENERATE COMIC STRIP</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
