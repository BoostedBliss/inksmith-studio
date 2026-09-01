import React, { useState } from 'react';
import { ComicPanel, ComicStyleId, SpeechBubble, ComicSFX } from '../types';
import {
  X,
  Sliders,
  Sparkles,
  RefreshCw,
  MessageSquare,
  Zap,
  Check,
  Type,
  Sun,
  Contrast,
  CircleDot,
  Upload,
} from 'lucide-react';

interface PanelInspectorProps {
  panel: ComicPanel | null;
  styleId: ComicStyleId;
  onClose: () => void;
  onUpdatePanel: (updated: ComicPanel) => void;
  onRegenerateImage: (panelId: string) => void;
}

export const PanelInspector: React.FC<PanelInspectorProps> = ({
  panel,
  styleId,
  onClose,
  onUpdatePanel,
  onRegenerateImage,
}) => {
  if (!panel) return null;

  const [prompt, setPrompt] = useState(panel.scenePrompt);
  const [caption, setCaption] = useState(panel.caption || '');
  const [cameraAngle, setCameraAngle] = useState(panel.visualDetails?.cameraAngle || 'Medium Shot');
  const [mood, setMood] = useState(panel.visualDetails?.mood || 'Dramatic');
  const [lighting, setLighting] = useState(panel.visualDetails?.lighting || 'Dynamic');

  const handleSaveTextChanges = () => {
    onUpdatePanel({
      ...panel,
      scenePrompt: prompt,
      caption: caption.trim() || undefined,
      visualDetails: {
        ...panel.visualDetails,
        cameraAngle,
        mood,
        lighting,
      },
    });
  };

  const handleFilterChange = (key: keyof ComicPanel['filterSettings'], val: any) => {
    onUpdatePanel({
      ...panel,
      filterSettings: {
        ...panel.filterSettings,
        [key]: val,
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-black flex flex-col gap-5 my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-black text-white font-editorial-mono font-bold text-xs uppercase tracking-wider">
              PANEL #{panel.panelNumber}
            </span>
            <h3 className="font-black text-xl uppercase tracking-tighter italic text-black">
              {panel.title || 'PANEL INSPECTOR & CONTROLS'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-black hover:text-white border border-transparent hover:border-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scene Visual Prompt */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-black flex items-center justify-between">
            <span>Visual Scene Prompt</span>
            <span className="text-[10px] font-editorial-mono text-gray-500 uppercase font-bold">Art Direction</span>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full bg-[#f2f2f2] border-2 border-black p-3 text-xs sm:text-sm text-black focus:outline-none focus:bg-white font-serif-italic"
          />
        </div>

        {/* Camera Angle & Composition */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-editorial-mono font-bold uppercase text-gray-600">Camera Angle</label>
            <input
              type="text"
              value={cameraAngle}
              onChange={(e) => setCameraAngle(e.target.value)}
              className="bg-[#f2f2f2] border-2 border-black px-2.5 py-1.5 text-xs text-black focus:outline-none focus:bg-white font-bold"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-editorial-mono font-bold uppercase text-gray-600">Mood / Tone</label>
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="bg-[#f2f2f2] border-2 border-black px-2.5 py-1.5 text-xs text-black focus:outline-none focus:bg-white font-bold"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-editorial-mono font-bold uppercase text-gray-600">Lighting</label>
            <input
              type="text"
              value={lighting}
              onChange={(e) => setLighting(e.target.value)}
              className="bg-[#f2f2f2] border-2 border-black px-2.5 py-1.5 text-xs text-black focus:outline-none focus:bg-white font-bold"
            />
          </div>
        </div>

        {/* Narrator Caption & Position */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-black">
            Narrator Caption Box
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. MEANWHILE IN THE HEART OF DOWNTOWN..."
            className="bg-[#f2f2f2] border-2 border-black px-3 py-2 text-xs sm:text-sm text-black focus:outline-none focus:bg-white font-serif-italic font-bold"
          />
        </div>

        {/* Speech Bubbles Lettering & Character Anchoring Manager */}
        <div className="flex flex-col gap-2.5 bg-[#f8f8f8] p-4 border-2 border-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black">
              <MessageSquare className="w-4 h-4 text-red-600" />
              <span>Dialogue Lettering & Speech Bubbles ({panel.bubbles.length})</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const isSecond = panel.bubbles.length % 2 === 1;
                const newB: SpeechBubble = {
                  id: `bubble-${Date.now()}`,
                  speaker: isSecond ? 'Speaker 2' : 'Speaker 1',
                  text: 'New dialogue...',
                  type: 'speech',
                  x: isSecond ? 74 : 26,
                  y: isSecond ? 32 : 20,
                  tailDirection: isSecond ? 'bottom-right' : 'bottom-left',
                  characterPosition: isSecond ? 'right' : 'left',
                  fontSize: 'base',
                };
                onUpdatePanel({ ...panel, bubbles: [...panel.bubbles, newB] });
              }}
              className="px-2 py-1 bg-black text-white text-[10px] font-black uppercase tracking-wider hover:bg-red-600 shadow-xs"
            >
              + Add Dialogue Bubble
            </button>
          </div>

          {panel.bubbles.length === 0 ? (
            <p className="text-[11px] text-gray-500 italic py-1">No speech bubbles in this panel yet.</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {panel.bubbles.map((b, bIdx) => (
                <div key={b.id || bIdx} className="bg-white p-2.5 border border-black flex flex-col gap-1.5 shadow-xs">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={b.speaker}
                      onChange={(e) => {
                        const updated = panel.bubbles.map((item) =>
                          item.id === b.id ? { ...item, speaker: e.target.value } : item
                        );
                        onUpdatePanel({ ...panel, bubbles: updated });
                      }}
                      placeholder="Speaker Name"
                      className="text-[11px] font-black uppercase tracking-wider text-red-600 border-b border-gray-300 focus:outline-none focus:border-red-600 bg-transparent max-w-[140px]"
                    />

                    <div className="flex items-center gap-1">
                      {/* Character Anchor Dropdown */}
                      <select
                        value={b.characterPosition || 'custom'}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          let coords = { x: b.x, y: b.y, tail: b.tailDirection };
                          if (val === 'left') coords = { x: 26, y: 20, tail: 'bottom-left' };
                          if (val === 'right') coords = { x: 74, y: 28, tail: 'bottom-right' };
                          if (val === 'center') coords = { x: 50, y: 20, tail: 'bottom-left' };
                          if (val === 'bottom-left') coords = { x: 26, y: 75, tail: 'top-left' };
                          if (val === 'bottom-right') coords = { x: 74, y: 75, tail: 'top-right' };

                          const updated = panel.bubbles.map((item) =>
                            item.id === b.id
                              ? {
                                  ...item,
                                  characterPosition: val,
                                  x: coords.x,
                                  y: coords.y,
                                  tailDirection: coords.tail,
                                }
                              : item
                          );
                          onUpdatePanel({ ...panel, bubbles: updated });
                        }}
                        className="text-[10px] font-editorial-mono font-bold uppercase bg-gray-100 border border-black px-1.5 py-0.5"
                      >
                        <option value="left">Anchor: Left Character</option>
                        <option value="right">Anchor: Right Character</option>
                        <option value="center">Anchor: Center Hero</option>
                        <option value="bottom-left">Anchor: Bottom Left</option>
                        <option value="bottom-right">Anchor: Bottom Right</option>
                        <option value="custom">Custom Drag</option>
                      </select>

                      {/* Formatting Toggles */}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = panel.bubbles.map((item) =>
                            item.id === b.id ? { ...item, bold: !item.bold } : item
                          );
                          onUpdatePanel({ ...panel, bubbles: updated });
                        }}
                        className={`px-1.5 py-0.5 text-[10px] border border-black font-black ${
                          b.bold ? 'bg-black text-white' : 'bg-gray-100 text-black'
                        }`}
                        title="Toggle Bold"
                      >
                        B
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = panel.bubbles.map((item) =>
                            item.id === b.id ? { ...item, italic: !item.italic } : item
                          );
                          onUpdatePanel({ ...panel, bubbles: updated });
                        }}
                        className={`px-1.5 py-0.5 text-[10px] border border-black italic font-bold ${
                          b.italic ? 'bg-black text-white' : 'bg-gray-100 text-black'
                        }`}
                        title="Toggle Italic"
                      >
                        I
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = panel.bubbles.map((item) =>
                            item.id === b.id ? { ...item, uppercase: !item.uppercase } : item
                          );
                          onUpdatePanel({ ...panel, bubbles: updated });
                        }}
                        className={`px-1.5 py-0.5 text-[9px] border border-black font-black ${
                          b.uppercase ? 'bg-black text-white' : 'bg-gray-100 text-black'
                        }`}
                        title="Toggle All-Caps Shout"
                      >
                        AA
                      </button>

                      {/* Delete Bubble */}
                      <button
                        type="button"
                        onClick={() => {
                          onUpdatePanel({
                            ...panel,
                            bubbles: panel.bubbles.filter((item) => item.id !== b.id),
                          });
                        }}
                        className="px-1.5 py-0.5 text-[10px] text-red-600 hover:bg-red-600 hover:text-white border border-red-600"
                        title="Delete Bubble"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={b.text}
                    onChange={(e) => {
                      const updated = panel.bubbles.map((item) =>
                        item.id === b.id ? { ...item, text: e.target.value } : item
                      );
                      onUpdatePanel({ ...panel, bubbles: updated });
                    }}
                    className="w-full bg-[#fdfdfd] border border-black px-2 py-1 text-xs font-comic-text focus:outline-none focus:border-red-600"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Image Style Filters */}
        <div className="flex flex-col gap-3 bg-[#f8f8f8] p-4 border-2 border-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black">
              <Sliders className="w-4 h-4 text-red-600" />
              <span>Halftone Dots & Paper Aging</span>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs font-bold text-black cursor-pointer">
                <input
                  type="checkbox"
                  checked={panel.filterSettings?.halftone || false}
                  onChange={(e) => handleFilterChange('halftone', e.target.checked)}
                  className="rounded-none border-2 border-black text-black focus:ring-0"
                />
                <span>Halftone Dots</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs font-bold text-black cursor-pointer">
                <input
                  type="checkbox"
                  checked={panel.filterSettings?.grain || false}
                  onChange={(e) => handleFilterChange('grain', e.target.checked)}
                  className="rounded-none border-2 border-black text-black focus:ring-0"
                />
                <span>Paper Grain</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <div className="flex justify-between text-[10px] font-editorial-mono font-bold uppercase text-gray-600 mb-1">
                <span>Contrast</span>
                <span>{panel.filterSettings?.contrast || 100}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="160"
                value={panel.filterSettings?.contrast || 100}
                onChange={(e) => handleFilterChange('contrast', Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-editorial-mono font-bold uppercase text-gray-600 mb-1">
                <span>Saturation</span>
                <span>{panel.filterSettings?.saturation || 100}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                value={panel.filterSettings?.saturation || 100}
                onChange={(e) => handleFilterChange('saturation', Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-editorial-mono font-bold uppercase text-gray-600 mb-1">
                <span>Sepia / Vintage</span>
                <span>{panel.filterSettings?.sepia || 0}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={panel.filterSettings?.sepia || 0}
                onChange={(e) => handleFilterChange('sepia', Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t-2 border-black">
          <button
            type="button"
            onClick={() => onRegenerateImage(panel.id)}
            disabled={panel.imageStatus === 'generating'}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-black hover:text-white text-black text-xs font-black uppercase tracking-wider border-2 border-black transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${panel.imageStatus === 'generating' ? 'animate-spin text-red-600' : 'text-red-600'}`} />
            <span>Regenerate Art</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-black hover:bg-gray-200 text-xs font-black uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                handleSaveTextChanges();
                onClose();
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
