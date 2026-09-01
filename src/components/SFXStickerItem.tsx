import React, { useState, useRef } from 'react';
import { ComicSFX, SFXColor, SFXStyle } from '../types';
import { Trash2, RotateCw, Palette, Sparkles } from 'lucide-react';

interface SFXStickerItemProps {
  sfx: ComicSFX;
  onUpdate: (updated: ComicSFX) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const SFXStickerItem: React.FC<SFXStickerItemProps> = ({
  sfx,
  onUpdate,
  onDelete,
  isSelected,
  onSelect,
  containerRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startSfxX: number; startSfxY: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startSfxX: sfx.x,
      startSfxY: sfx.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragRef.current.startX) / rect.width) * 100;
    const deltaY = ((e.clientY - dragRef.current.startY) / rect.height) * 100;

    let newX = Math.min(Math.max(dragRef.current.startSfxX + deltaX, 5), 95);
    let newY = Math.min(Math.max(dragRef.current.startSfxY + deltaY, 5), 95);

    onUpdate({
      ...sfx,
      x: Math.round(newX),
      y: Math.round(newY),
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      dragRef.current = null;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const rotateMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextRot = ((sfx.rotation + 15 + 45) % 90) - 45;
    onUpdate({ ...sfx, rotation: nextRot });
  };

  const cycleColor = (e: React.MouseEvent) => {
    e.stopPropagation();
    const colors: SFXColor[] = [
      'yellow-red',
      'cyan-purple',
      'lime-yellow',
      'orange-pink',
      'white-black',
      'red-orange',
    ];
    const nextIdx = (colors.indexOf(sfx.color) + 1) % colors.length;
    onUpdate({ ...sfx, color: colors[nextIdx] });
  };

  // Color text & shadow styles
  let textColorClass = 'text-amber-300 drop-shadow-[0_4px_0_#b91c1c] stroke-black';
  let burstColor = '#f59e0b';
  let burstOutline = '#dc2626';

  if (sfx.color === 'cyan-purple') {
    textColorClass = 'text-cyan-300 drop-shadow-[0_4px_0_#7e22ce]';
    burstColor = '#06b6d4';
    burstOutline = '#7e22ce';
  } else if (sfx.color === 'lime-yellow') {
    textColorClass = 'text-lime-300 drop-shadow-[0_4px_0_#15803d]';
    burstColor = '#84cc16';
    burstOutline = '#15803d';
  } else if (sfx.color === 'orange-pink') {
    textColorClass = 'text-amber-400 drop-shadow-[0_4px_0_#db2777]';
    burstColor = '#f97316';
    burstOutline = '#db2777';
  } else if (sfx.color === 'white-black') {
    textColorClass = 'text-white drop-shadow-[0_4px_0_#000000]';
    burstColor = '#ffffff';
    burstOutline = '#000000';
  } else if (sfx.color === 'red-orange') {
    textColorClass = 'text-red-500 drop-shadow-[0_4px_0_#7c2d12]';
    burstColor = '#ef4444';
    burstOutline = '#7c2d12';
  }

  return (
    <div
      id={`sfx-${sfx.id}`}
      style={{
        left: `${sfx.x}%`,
        top: `${sfx.y}%`,
        transform: `translate(-50%, -50%) rotate(${sfx.rotation}deg) scale(${sfx.scale})`,
      }}
      className={`absolute z-30 cursor-move select-none transition-transform ${
        isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black/50' : ''
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className="relative flex items-center justify-center p-2">
        {/* Burst Background for 'burst' or 'action' style */}
        {(sfx.style === 'burst' || sfx.style === 'action') && (
          <div className="absolute inset-0 -m-3 pointer-events-none opacity-90 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full min-w-[90px] min-h-[55px] max-w-[150px]">
              <polygon
                points="50,0 62,28 95,15 78,44 100,60 70,68 76,100 48,82 22,96 30,68 0,55 25,40 10,12 40,24"
                fill={burstColor}
                stroke={burstOutline}
                strokeWidth="4"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* SFX Text */}
        <span
          className={`relative z-10 font-comic-heading text-2xl sm:text-3xl md:text-4xl tracking-wider uppercase font-black select-none ${textColorClass}`}
          style={{
            WebkitTextStroke: '2px #000000',
            paintOrder: 'stroke fill',
          }}
        >
          {sfx.text}
        </span>

        {/* Hover / Selection Toolbar */}
        {(showControls || isSelected) && (
          <div
            className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-stone-950/90 text-white px-2 py-0.5 rounded-full border border-stone-700 shadow-md backdrop-blur-xs text-[10px] font-sans z-40 whitespace-nowrap"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              title="Rotate SFX"
              onClick={rotateMore}
              className="p-0.5 hover:text-amber-400 flex items-center gap-0.5"
            >
              <RotateCw className="w-3 h-3" />
            </button>

            <span className="text-stone-600">|</span>

            <button
              type="button"
              title="Cycle Color Palette"
              onClick={cycleColor}
              className="p-0.5 hover:text-amber-400 flex items-center gap-0.5"
            >
              <Palette className="w-3 h-3" />
            </button>

            <span className="text-stone-600">|</span>

            <button
              type="button"
              title="Delete SFX"
              onClick={() => onDelete(sfx.id)}
              className="p-0.5 text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
