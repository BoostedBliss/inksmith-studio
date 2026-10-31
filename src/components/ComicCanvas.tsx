import React, { forwardRef } from 'react';
import { ComicStrip, ComicPanel } from '../types';
import { ComicPanelItem } from './ComicPanelItem';
import { COMIC_LAYOUTS, COMIC_STYLES } from '../data/comicPresets';
import { Sparkles, Shield, Bookmark, Calendar, Award } from 'lucide-react';

interface ComicCanvasProps {
  comic: ComicStrip;
  onUpdatePanel: (updated: ComicPanel) => void;
  onRegenerateImage: (panelId: string) => void;
  onOpenInspector: (panelId: string) => void;
  onMovePanel: (fromIndex: number, toIndex: number) => void;
  onDeletePanel: (panelId: string) => void;
}

export const ComicCanvas = React.memo(forwardRef<HTMLDivElement, ComicCanvasProps>(
  ({ comic, onUpdatePanel, onRegenerateImage, onOpenInspector, onMovePanel, onDeletePanel }, ref) => {
    const layoutDef = COMIC_LAYOUTS.find((l) => l.id === comic.layoutId) || COMIC_LAYOUTS[0];
    const styleDef = COMIC_STYLES.find((s) => s.id === comic.styleId) || COMIC_STYLES[0];

    // Grid layout class
    const gridClass = layoutDef.gridClass;

    return (
      <div className="w-full flex justify-center py-4 px-2 sm:px-4">
        {/* The Comic Canvas Container */}
        <div
          ref={ref}
          id="comic-strip-canvas"
          className={`w-full max-w-5xl p-5 sm:p-8 md:p-10 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-[#1a1a1a] relative overflow-hidden transition-colors ${
            comic.showPaperTexture ? 'comic-paper-texture' : 'bg-white'
          }`}
        >
          {/* Authentic Comic Page Header Banner */}
          {comic.showIssueHeader && (
            <div className="mb-6 pb-4 border-b-4 border-black flex flex-col gap-3 relative">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                {/* Left: Vintage Series Badge & Issue # */}
                <div className="flex items-center gap-2">
                  <div className="bg-black text-white px-3 py-1 font-black text-xs tracking-widest uppercase border border-black shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                    <span>{comic.seriesTitle || 'INKSMITH EDITORIAL'}</span>
                  </div>

                  <div className="bg-red-600 text-white px-2.5 py-1 font-editorial-mono font-bold text-xs tracking-wider border border-black">
                    ISSUE {comic.issueNumber || '#1'}
                  </div>
                </div>

                {/* Center / Right: Date, Approval Seal & Author */}
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-editorial-mono font-bold tracking-tight text-gray-600 flex-wrap">
                  <div className="flex items-center gap-1 bg-[#f2f2f2] px-2 py-0.5 border border-black">
                    <Calendar className="w-3 h-3 text-red-600" />
                    <span>{comic.date || 'VOL. 1'}</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1 bg-black text-white px-2 py-0.5 border border-black">
                    <Award className="w-3 h-3 text-red-500" />
                    <span className="tracking-widest">APPROVED PRESS CODE</span>
                  </div>

                  <div className="font-sans font-bold text-gray-800">
                    By {comic.author || 'Inksmith Studio'}
                  </div>
                </div>
              </div>

              {/* Grand Editorial Graphic Title */}
              <div className="text-center pt-2">
                <h1 className="font-black text-3xl sm:text-5xl md:text-6xl tracking-tighter uppercase italic leading-none text-black drop-shadow-xs">
                  {comic.title || 'UNTITLED GRAPHIC CHRONICLE'}
                </h1>
                {comic.subtitle && (
                  <p className="font-serif-italic text-sm sm:text-base md:text-lg font-bold tracking-wide mt-1.5 text-gray-700">
                    — {comic.subtitle} —
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Panels Grid Layout */}
          <div
            className={gridClass}
            style={{
              gap: `${comic.gutterWidth}px`,
            }}
          >
            {comic.panels.map((panel, idx) => {
              const spanClass = layoutDef.panelSpans?.[idx] || '';
              return (
                <ComicPanelItem
                  key={panel.id}
                  panel={panel}
                  styleId={comic.styleId}
                  index={idx}
                  totalPanels={comic.panels.length}
                  onUpdatePanel={onUpdatePanel}
                  onRegenerateImage={onRegenerateImage}
                  onOpenInspector={onOpenInspector}
                  onMovePanel={onMovePanel}
                  onDeletePanel={onDeletePanel}
                  borderWidth={comic.borderWidth}
                  spanClass={spanClass}
                />
              );
            })}
          </div>

          {/* Authentic Editorial Comic Page Footer Imprint */}
          <div className="mt-6 pt-3 border-t-2 border-black flex items-center justify-between text-[10px] font-editorial-mono font-bold text-gray-500">
            <div className="flex items-center gap-1.5">
              <span className="font-black uppercase tracking-widest text-black">
                {styleDef.name}
              </span>
              <span>•</span>
              <span className="text-red-600">{comic.panels.length} PANELS</span>
            </div>

            <div className="tracking-widest uppercase">
              PAGE 01 // PRESS COMPOSITE • INKSMITH STUDIO
            </div>
          </div>
        </div>
      </div>
    );
  }
));

ComicCanvas.displayName = 'ComicCanvas';
