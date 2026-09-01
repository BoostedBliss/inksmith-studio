import React, { useRef, useState } from 'react';
import { ComicPanel, ComicStyleId, SpeechBubble, ComicSFX } from '../types';
import { SpeechBubbleItem } from './SpeechBubbleItem';
import { SFXStickerItem } from './SFXStickerItem';
import { generateThemedPanelArtwork } from '../utils/comicArtGenerator';
import {
  MessageSquarePlus,
  Zap,
  RefreshCw,
  Edit3,
  Upload,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Maximize2,
  Sliders,
} from 'lucide-react';

interface ComicPanelItemProps {
  panel: ComicPanel;
  styleId: ComicStyleId;
  index: number;
  totalPanels: number;
  onUpdatePanel: (updated: ComicPanel) => void;
  onRegenerateImage: (panelId: string) => void;
  onOpenInspector: (panelId: string) => void;
  onMovePanel: (fromIndex: number, toIndex: number) => void;
  onDeletePanel: (panelId: string) => void;
  borderWidth: number;
  spanClass?: string;
}

export const ComicPanelItem: React.FC<ComicPanelItemProps> = ({
  panel,
  styleId,
  index,
  totalPanels,
  onUpdatePanel,
  onRegenerateImage,
  onOpenInspector,
  onMovePanel,
  onDeletePanel,
  borderWidth = 4,
  spanClass = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedBubbleId, setSelectedBubbleId] = useState<string | null>(null);
  const [selectedSfxId, setSelectedSfxId] = useState<string | null>(null);
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [captionText, setCaptionText] = useState(panel.caption || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Artwork resolution
  const displayImage = panel.imageUrl || generateThemedPanelArtwork(panel, styleId, index, totalPanels);

  // Handle Speech Bubble actions with intelligent character positioning
  const handleAddBubble = (type: SpeechBubble['type'] = 'speech') => {
    const isSecondSpeaker = panel.bubbles.length % 2 === 1;
    const characterPos = isSecondSpeaker ? 'right' : 'left';
    const coords = isSecondSpeaker
      ? { x: 74, y: 32, tail: 'bottom-right' as const }
      : { x: 26, y: 20, tail: 'bottom-left' as const };

    const newBubble: SpeechBubble = {
      id: `bubble-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      speaker: isSecondSpeaker ? 'Speaker 2' : 'Speaker 1',
      text: type === 'shout' ? 'WHAT?!' : type === 'thought' ? 'Hmm...' : 'New dialogue here...',
      type,
      x: coords.x,
      y: coords.y,
      tailDirection: coords.tail,
      fontSize: 'base',
      bold: type === 'shout',
      italic: type === 'thought' || type === 'whisper',
      uppercase: type === 'shout',
      characterPosition: characterPos,
    };
    onUpdatePanel({
      ...panel,
      bubbles: [...panel.bubbles, newBubble],
    });
    setSelectedBubbleId(newBubble.id);
  };

  const handleUpdateBubble = (updated: SpeechBubble) => {
    onUpdatePanel({
      ...panel,
      bubbles: panel.bubbles.map((b) => (b.id === updated.id ? updated : b)),
    });
  };

  const handleDeleteBubble = (id: string) => {
    onUpdatePanel({
      ...panel,
      bubbles: panel.bubbles.filter((b) => b.id !== id),
    });
    if (selectedBubbleId === id) setSelectedBubbleId(null);
  };

  // Handle SFX actions
  const handleAddSFX = (text: string = 'POW!') => {
    const newSfx: ComicSFX = {
      id: `sfx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      text,
      x: 50 + ((panel.sfxList.length * 15) % 30),
      y: 50 + ((panel.sfxList.length * 10) % 30),
      rotation: ((panel.sfxList.length * 15) % 40) - 20,
      scale: 1.2,
      color: 'yellow-red',
      style: 'burst',
    };
    onUpdatePanel({
      ...panel,
      sfxList: [...panel.sfxList, newSfx],
    });
    setSelectedSfxId(newSfx.id);
  };

  const handleUpdateSFX = (updated: ComicSFX) => {
    onUpdatePanel({
      ...panel,
      sfxList: panel.sfxList.map((s) => (s.id === updated.id ? updated : s)),
    });
  };

  const handleDeleteSFX = (id: string) => {
    onUpdatePanel({
      ...panel,
      sfxList: panel.sfxList.filter((s) => s.id !== id),
    });
    if (selectedSfxId === id) setSelectedSfxId(null);
  };

  // Image Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onUpdatePanel({
            ...panel,
            imageUrl: result,
            imageStatus: 'done',
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Caption positioning classes
  const getCaptionPositionClasses = (pos = panel.captionPosition || 'top-left') => {
    switch (pos) {
      case 'top-right':
        return 'top-2 right-2 max-w-[80%]';
      case 'bottom-left':
        return 'bottom-2 left-2 max-w-[80%]';
      case 'bottom-right':
        return 'bottom-2 right-2 max-w-[80%]';
      case 'top-full':
        return 'top-0 inset-x-0 w-full rounded-none border-x-0 border-t-0';
      case 'bottom-full':
        return 'bottom-0 inset-x-0 w-full rounded-none border-x-0 border-b-0';
      case 'top-left':
      default:
        return 'top-2 left-2 max-w-[80%]';
    }
  };

  // Filter inline styles
  const filterStyle: React.CSSProperties = {
    filter: `contrast(${panel.filterSettings?.contrast || 100}%) saturate(${panel.filterSettings?.saturation || 100}%) brightness(${panel.filterSettings?.brightness || 100}%) sepia(${panel.filterSettings?.sepia || 0}%)`,
  };

  return (
    <div
      id={`comic-panel-${panel.id}`}
      ref={containerRef}
      style={{ borderWidth: `${borderWidth}px` }}
      className={`group relative bg-stone-950 border-black rounded-lg overflow-hidden flex flex-col justify-between select-none shadow-[4px_4px_0px_0px_#000000] min-h-[300px] sm:min-h-[360px] aspect-square transition-all duration-200 ${spanClass}`}
      onClick={() => {
        setSelectedBubbleId(null);
        setSelectedSfxId(null);
      }}
    >
      {/* 1. Panel Artwork Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-stone-900">
        <img
          src={displayImage}
          alt={panel.title || `Panel ${panel.panelNumber}`}
          referrerPolicy="no-referrer"
          style={filterStyle}
          className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 group-hover:scale-[1.02]"
        />

        {/* Halftone Layer */}
        {panel.filterSettings?.halftone && (
          <div className="absolute inset-0 pointer-events-none comic-halftone opacity-35 mix-blend-multiply" />
        )}

        {/* Vintage Paper Texture */}
        {panel.filterSettings?.grain && (
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px] opacity-20 mix-blend-overlay" />
        )}

        {/* Loading Spinner during Generation */}
        {panel.imageStatus === 'generating' && (
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-40">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mb-2" />
            <div className="font-comic-heading text-lg text-amber-300 tracking-wider">
              DRAWING PANEL {panel.panelNumber}...
            </div>
            <div className="text-xs text-stone-400 mt-1 max-w-[200px] text-center line-clamp-1 font-sans">
              {panel.title}
            </div>
          </div>
        )}
      </div>

      {/* 2. Top Badge: Panel Number & Camera Angle (Discreet Editorial) */}
      <div className="relative z-20 flex items-center justify-between p-2 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 bg-black text-white font-editorial-mono font-bold text-[11px] uppercase tracking-wider border border-white/20 shadow-xs">
            #{panel.panelNumber}
          </span>
          {panel.title && (
            <span className="hidden sm:inline-block px-2 py-0.5 bg-white/90 text-black text-[10px] font-black uppercase tracking-wider backdrop-blur-xs border border-black line-clamp-1 max-w-[140px]">
              {panel.title}
            </span>
          )}
        </div>

        {panel.visualDetails?.cameraAngle && (
          <span className="hidden md:inline-block px-2 py-0.5 bg-black/80 text-gray-200 text-[9px] font-editorial-mono uppercase font-bold tracking-wider backdrop-blur-xs border border-white/20">
            {panel.visualDetails.cameraAngle}
          </span>
        )}
      </div>

      {/* 3. Narrator Caption Box */}
      {(panel.caption || isEditingCaption) && (
        <div
          id={`caption-${panel.id}`}
          className={`absolute z-20 pointer-events-auto ${getCaptionPositionClasses()}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[#fff9db] text-black px-2.5 py-1 sm:px-3 sm:py-1.5 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-serif-italic font-bold text-xs sm:text-sm tracking-wide leading-tight group/caption relative">
            {isEditingCaption ? (
              <div className="flex flex-col gap-1">
                <textarea
                  autoFocus
                  value={captionText}
                  onChange={(e) => setCaptionText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      setIsEditingCaption(false);
                      onUpdatePanel({ ...panel, caption: captionText.trim() });
                    }
                  }}
                  className="w-full text-xs font-serif-italic bg-white text-black p-1.5 border border-black focus:outline-none"
                  rows={2}
                />
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingCaption(false);
                      onUpdatePanel({ ...panel, caption: captionText.trim() });
                    }}
                    className="px-2.5 py-0.5 bg-black text-white text-[10px] font-black uppercase tracking-wider"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="cursor-pointer"
                onDoubleClick={() => setIsEditingCaption(true)}
                title="Double click to edit narrator caption"
              >
                {panel.caption}
              </div>
            )}

            {/* Quick Caption Position Toggle */}
            <div className="hidden group-hover/caption:flex absolute -bottom-6 left-0 items-center gap-1 bg-black text-white text-[9px] font-black uppercase px-2 py-0.5 border border-black shadow-md">
              <button
                type="button"
                onClick={() => setIsEditingCaption(true)}
                className="hover:text-red-400 font-editorial-mono"
              >
                Edit
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => {
                  const positions: ComicPanel['captionPosition'][] = [
                    'top-left',
                    'top-right',
                    'bottom-left',
                    'bottom-right',
                    'top-full',
                    'bottom-full',
                  ];
                  const nextIdx = (positions.indexOf(panel.captionPosition || 'top-left') + 1) % positions.length;
                  onUpdatePanel({ ...panel, captionPosition: positions[nextIdx] });
                }}
                className="hover:text-red-400 font-editorial-mono"
              >
                Move
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => onUpdatePanel({ ...panel, caption: '' })}
                className="text-red-400 hover:text-white font-editorial-mono"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Speech Bubbles Layer */}
      {panel.bubbles.map((bubble) => (
        <SpeechBubbleItem
          key={bubble.id}
          bubble={bubble}
          onUpdate={handleUpdateBubble}
          onDelete={handleDeleteBubble}
          isSelected={selectedBubbleId === bubble.id}
          onSelect={() => {
            setSelectedBubbleId(bubble.id);
            setSelectedSfxId(null);
          }}
          containerRef={containerRef}
        />
      ))}

      {/* 5. Sound Effects (SFX) Layer */}
      {panel.sfxList.map((sfx) => (
        <SFXStickerItem
          key={sfx.id}
          sfx={sfx}
          onUpdate={handleUpdateSFX}
          onDelete={handleDeleteSFX}
          isSelected={selectedSfxId === sfx.id}
          onSelect={() => {
            setSelectedSfxId(sfx.id);
            setSelectedBubbleId(null);
          }}
          containerRef={containerRef}
        />
      ))}

      {/* 6. Hidden File Input for Custom Panel Art */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* 7. Hover / Active Action Menu */}
      <div className="absolute inset-x-2 bottom-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-between gap-1 pointer-events-auto">
        {/* Left tools: Add Speech, Add SFX, Caption */}
        <div className="flex items-center gap-1 bg-white/95 text-black p-1 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <button
            type="button"
            title="Add Speech Bubble"
            onClick={(e) => {
              e.stopPropagation();
              handleAddBubble('speech');
            }}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-black hover:bg-black hover:text-white transition-colors"
          >
            <MessageSquarePlus className="w-3 h-3 text-red-600" />
            <span className="hidden sm:inline">+ Bubble</span>
          </button>

          <button
            type="button"
            title="Add Sound Effect"
            onClick={(e) => {
              e.stopPropagation();
              handleAddSFX();
            }}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-black hover:bg-black hover:text-white transition-colors"
          >
            <Zap className="w-3 h-3 text-red-600" />
            <span className="hidden sm:inline">+ SFX</span>
          </button>

          {!panel.caption && (
            <button
              type="button"
              title="Add Narrator Caption"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingCaption(true);
                setCaptionText('MEANWHILE...');
                onUpdatePanel({ ...panel, caption: 'MEANWHILE...', captionPosition: 'top-left' });
              }}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-black hover:bg-black hover:text-white transition-colors"
            >
              <Edit3 className="w-3 h-3 text-red-600" />
              <span className="hidden sm:inline">+ Caption</span>
            </button>
          )}
        </div>

        {/* Right tools: Regenerate AI art, Upload image, Inspector, Reorder, Delete */}
        <div className="flex items-center gap-1 bg-white/95 text-black p-1 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <button
            type="button"
            title="Regenerate AI Artwork for this Panel"
            onClick={(e) => {
              e.stopPropagation();
              onRegenerateImage(panel.id);
            }}
            disabled={panel.imageStatus === 'generating'}
            className="p-1 hover:text-red-600 hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${panel.imageStatus === 'generating' ? 'animate-spin text-red-600' : ''}`} />
          </button>

          <button
            type="button"
            title="Upload Custom Image"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="p-1 hover:text-red-600 hover:bg-gray-100 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            title="Panel Filters & Details Inspector"
            onClick={(e) => {
              e.stopPropagation();
              onOpenInspector(panel.id);
            }}
            className="p-1 hover:text-red-600 hover:bg-gray-100 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {/* Move left */}
          {index > 0 && (
            <button
              type="button"
              title="Move Panel Left / Up"
              onClick={(e) => {
                e.stopPropagation();
                onMovePanel(index, index - 1);
              }}
              className="p-1 hover:text-red-600 hover:bg-gray-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Move right */}
          {index < totalPanels - 1 && (
            <button
              type="button"
              title="Move Panel Right / Down"
              onClick={(e) => {
                e.stopPropagation();
                onMovePanel(index, index + 1);
              }}
              className="p-1 hover:text-red-600 hover:bg-gray-100"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete panel */}
          {totalPanels > 1 && (
            <button
              type="button"
              title="Delete Panel"
              onClick={(e) => {
                e.stopPropagation();
                onDeletePanel(panel.id);
              }}
              className="p-1 text-red-600 hover:bg-black hover:text-white"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
