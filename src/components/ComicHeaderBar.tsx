import React, { useState } from 'react';
import { ComicStrip, ComicStyleId, ComicLayoutId } from '../types';
import { COMIC_STYLES, COMIC_LAYOUTS } from '../data/comicPresets';
import {
  BookOpen,
  Eye,
  Download,
  Share2,
  Plus,
  Sparkles,
  Sliders,
  Maximize2,
  FileImage,
  Printer,
  ChevronDown,
  Layers,
  Zap,
} from 'lucide-react';

interface ComicHeaderBarProps {
  comic: ComicStrip;
  onUpdateComic: (updated: ComicStrip) => void;
  onOpenReader: () => void;
  onOpenLibrary: () => void;
  onExportPNG: () => void;
  onExportJSON: () => void;
  onPrint: () => void;
  onAddPanel: () => void;
  isExporting: boolean;
}

export const ComicHeaderBar: React.FC<ComicHeaderBarProps> = ({
  comic,
  onUpdateComic,
  onOpenReader,
  onOpenLibrary,
  onExportPNG,
  onExportJSON,
  onPrint,
  onAddPanel,
  isExporting,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const styleDef = COMIC_STYLES.find((s) => s.id === comic.styleId) || COMIC_STYLES[0];
  const layoutDef = COMIC_LAYOUTS.find((l) => l.id === comic.layoutId) || COMIC_LAYOUTS[0];

  return (
    <header className="w-full bg-white border-b-2 border-black px-4 sm:px-8 py-3 flex items-center justify-between gap-3 text-[#1a1a1a] sticky top-0 z-40 shadow-xs">
      {/* Left: Editorial Brand Identity */}
      <div className="flex items-baseline gap-3">
        <div className="flex items-baseline gap-2 cursor-pointer" onClick={onOpenLibrary}>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase italic text-black">
            Inksmith <span className="text-red-600">.Studio</span>
          </h1>
          <span className="hidden md:inline text-[10px] font-bold uppercase tracking-widest text-gray-400 font-editorial-mono">
            Engine v2.4 // Serial 8892
          </span>
        </div>

        {/* Comic Library Button */}
        <button
          type="button"
          onClick={onOpenLibrary}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#f2f2f2] hover:bg-black hover:text-white text-black text-[10px] font-black uppercase tracking-widest border border-black transition-colors"
        >
          <BookOpen className="w-3 h-3 text-red-600" />
          <span>Library ({comic.issueNumber || '#1'})</span>
        </button>
      </div>

      {/* Center: Comic Title & Issue Editor (Inline) */}
      <div className="hidden lg:flex items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Title:</span>
        <input
          type="text"
          value={comic.title}
          onChange={(e) => onUpdateComic({ ...comic, title: e.target.value })}
          placeholder="Comic Title"
          className="bg-white border-b border-black text-[#1a1a1a] font-serif-italic text-lg px-2 py-0.5 focus:outline-none focus:border-red-600 text-center max-w-xs transition-colors"
        />
        <input
          type="text"
          value={comic.issueNumber}
          onChange={(e) => onUpdateComic({ ...comic, issueNumber: e.target.value })}
          placeholder="#1"
          className="bg-[#f2f2f2] border border-black text-black font-editorial-mono text-[11px] font-bold px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-black text-center w-14"
        />
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2">
        {/* Add Panel */}
        <button
          type="button"
          onClick={onAddPanel}
          title="Add a new blank panel"
          className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-black hover:text-white text-black text-[10px] font-black uppercase tracking-widest border-2 border-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <Plus className="w-3.5 h-3.5 text-red-600" />
          <span className="hidden sm:inline">Add Panel</span>
        </button>

        {/* Visual Settings Dropdown (Gutter, Borders, Textures) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            title="Canvas & Style Settings"
            className="flex items-center gap-1 p-2 bg-white hover:bg-black hover:text-white text-black border-2 border-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {showSettingsMenu && (
            <div
              className="absolute right-0 mt-2 w-72 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 z-50 flex flex-col gap-3 text-xs text-[#1a1a1a]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-black uppercase tracking-widest text-[10px] text-red-600 border-b border-black pb-2">
                Editorial Layout & Gutter Specs
              </div>

              <label className="flex items-center justify-between cursor-pointer font-bold text-[11px] uppercase tracking-wider">
                <span>Issue Header Banner</span>
                <input
                  type="checkbox"
                  checked={comic.showIssueHeader}
                  onChange={(e) => onUpdateComic({ ...comic, showIssueHeader: e.target.checked })}
                  className="rounded border-2 border-black text-black accent-black w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer font-bold text-[11px] uppercase tracking-wider">
                <span>Vintage Paper Texture</span>
                <input
                  type="checkbox"
                  checked={comic.showPaperTexture}
                  onChange={(e) => onUpdateComic({ ...comic, showPaperTexture: e.target.checked })}
                  className="rounded border-2 border-black text-black accent-black w-4 h-4"
                />
              </label>

              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-600 mb-1">
                  <span>Gutter Spacing</span>
                  <span className="font-editorial-mono">{comic.gutterWidth}px</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="24"
                  value={comic.gutterWidth}
                  onChange={(e) => onUpdateComic({ ...comic, gutterWidth: Number(e.target.value) })}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-600 mb-1">
                  <span>Panel Border Width</span>
                  <span className="font-editorial-mono">{comic.borderWidth}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={comic.borderWidth}
                  onChange={(e) => onUpdateComic({ ...comic, borderWidth: Number(e.target.value) })}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-black flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowSettingsMenu(false)}
                  className="px-4 py-1.5 bg-black text-white hover:bg-red-600 text-[10px] font-black uppercase tracking-widest transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cinematic Reader Button */}
        <button
          type="button"
          onClick={onOpenReader}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-black text-white hover:bg-red-600 text-[10px] sm:text-xs font-black uppercase tracking-widest border-2 border-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Reader</span>
        </button>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-black text-white text-[10px] sm:text-xs font-black uppercase tracking-widest border-2 border-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Export'}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-2 z-50 flex flex-col gap-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowExportMenu(false);
                  onExportPNG();
                }}
                className="w-full text-left px-3 py-2 hover:bg-black hover:text-white flex items-center gap-2 text-black font-black uppercase text-[10px] tracking-wider transition-colors"
              >
                <FileImage className="w-3.5 h-3.5 text-red-600" />
                <span>Save as Image (PNG)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowExportMenu(false);
                  onPrint();
                }}
                className="w-full text-left px-3 py-2 hover:bg-black hover:text-white flex items-center gap-2 text-black font-black uppercase text-[10px] tracking-wider transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-red-600" />
                <span>Print / Proof Sheet</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowExportMenu(false);
                  onExportJSON();
                }}
                className="w-full text-left px-3 py-2 hover:bg-black hover:text-white flex items-center gap-2 text-black font-black uppercase text-[10px] tracking-wider transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-red-600" />
                <span>Export Script (JSON)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
