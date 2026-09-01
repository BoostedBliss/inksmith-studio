import React, { useState, useRef, useEffect } from 'react';
import { SpeechBubble, CharacterPositionAnchor } from '../types';
import {
  MessageSquare,
  Cloud,
  Flame,
  Radio,
  VolumeX,
  Trash2,
  Type,
  ArrowUpRight,
  Bold,
  Italic,
  Underline,
  Palette,
  User,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import { parseFormattedInline, getAnchorCoordinates } from '../utils/dialogueDetector';

interface SpeechBubbleItemProps {
  bubble: SpeechBubble;
  onUpdate: (updated: SpeechBubble) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const SpeechBubbleItem: React.FC<SpeechBubbleItemProps> = ({
  bubble,
  onUpdate,
  onDelete,
  isSelected,
  onSelect,
  containerRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(bubble.text);
  const [showControls, setShowControls] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [showPositionMenu, setShowPositionMenu] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startBubbleX: number; startBubbleY: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setEditText(bubble.text);
  }, [bubble.text]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isEditing) return;
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startBubbleX: bubble.x,
      startBubbleY: bubble.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragRef.current.startX) / rect.width) * 100;
    const deltaY = ((e.clientY - dragRef.current.startY) / rect.height) * 100;

    let newX = Math.min(Math.max(dragRef.current.startBubbleX + deltaX, 8), 92);
    let newY = Math.min(Math.max(dragRef.current.startBubbleY + deltaY, 8), 92);

    onUpdate({
      ...bubble,
      x: Math.round(newX),
      y: Math.round(newY),
      characterPosition: 'custom',
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

  const handleSaveText = () => {
    setIsEditing(false);
    if (editText.trim() !== bubble.text) {
      onUpdate({ ...bubble, text: editText.trim() || '...' });
    }
  };

  // Toggle formatting options
  const toggleBold = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ ...bubble, bold: !bubble.bold });
  };

  const toggleItalic = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ ...bubble, italic: !bubble.italic });
  };

  const toggleUnderline = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ ...bubble, underline: !bubble.underline });
  };

  const toggleUppercase = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ ...bubble, uppercase: !bubble.uppercase });
  };

  const cycleFontSize = (e: React.MouseEvent) => {
    e.stopPropagation();
    const sizes: ('xs' | 'sm' | 'base' | 'lg' | 'xl')[] = ['xs', 'sm', 'base', 'lg', 'xl'];
    const currentSize = bubble.fontSize || 'base';
    const nextIdx = (sizes.indexOf(currentSize) + 1) % sizes.length;
    onUpdate({ ...bubble, fontSize: sizes[nextIdx] });
  };

  const cycleType = (e: React.MouseEvent) => {
    e.stopPropagation();
    const types: SpeechBubble['type'][] = ['speech', 'shout', 'thought', 'whisper', 'radio'];
    const nextIdx = (types.indexOf(bubble.type) + 1) % types.length;
    const newType = types[nextIdx];
    onUpdate({
      ...bubble,
      type: newType,
      bold: newType === 'shout' ? true : bubble.bold,
      italic: newType === 'thought' || newType === 'whisper' ? true : bubble.italic,
      uppercase: newType === 'shout' ? true : bubble.uppercase,
    });
  };

  const cycleTail = (e: React.MouseEvent) => {
    e.stopPropagation();
    const tails: SpeechBubble['tailDirection'][] = [
      'bottom-left',
      'bottom-right',
      'top-left',
      'top-right',
      'left',
      'right',
      'none',
    ];
    const nextIdx = (tails.indexOf(bubble.tailDirection) + 1) % tails.length;
    onUpdate({ ...bubble, tailDirection: tails[nextIdx] });
  };

  // Anchor relative to Character Position
  const handleSnapToCharacter = (pos: CharacterPositionAnchor) => {
    const coords = getAnchorCoordinates(pos);
    onUpdate({
      ...bubble,
      characterPosition: pos,
      x: coords.x,
      y: coords.y,
      tailDirection: coords.tailDirection,
    });
    setShowPositionMenu(false);
  };

  // Quick insertion of formatting tag into textarea
  const handleInsertTag = (tagType: 'bold' | 'italic' | 'underline' | 'caps') => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = editText.substring(start, end) || 'dialogue';

    let formatted = '';
    if (tagType === 'bold') formatted = `**${selected}**`;
    else if (tagType === 'italic') formatted = `*${selected}*`;
    else if (tagType === 'underline') formatted = `__${selected}__`;
    else if (tagType === 'caps') formatted = selected.toUpperCase();

    const newText = editText.substring(0, start) + formatted + editText.substring(end);
    setEditText(newText);
  };

  // Font size class mapping
  let fontSizeClass = 'text-xs sm:text-sm';
  if (bubble.fontSize === 'xs') fontSizeClass = 'text-[11px] sm:text-xs';
  if (bubble.fontSize === 'base') fontSizeClass = 'text-xs sm:text-sm';
  if (bubble.fontSize === 'lg') fontSizeClass = 'text-sm sm:text-base';
  if (bubble.fontSize === 'xl') fontSizeClass = 'text-base sm:text-lg font-black';

  // Shape classes based on bubble type and colors
  let bubbleShape = 'bg-white text-black border-2 sm:border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-2xl';
  let fontStyle = 'font-comic-text';

  if (bubble.type === 'shout') {
    bubbleShape = 'bg-[#fff4bd] text-black border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_#dc2626] rounded-none';
    fontStyle = 'font-comic-punch uppercase tracking-tight';
  } else if (bubble.type === 'thought') {
    bubbleShape = 'bg-[#f0f9ff] text-black border-2 sm:border-3 border-sky-900 shadow-[3px_3px_0px_0px_rgba(14,165,233,0.6)] rounded-[30px]';
    fontStyle = 'font-comic-text italic';
  } else if (bubble.type === 'whisper') {
    bubbleShape = 'bg-[#fafafa] text-gray-700 border-2 border-dashed border-gray-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] rounded-xl';
    fontStyle = 'font-comic-text italic';
  } else if (bubble.type === 'radio') {
    bubbleShape = 'bg-[#fde047] text-black border-2 sm:border-3 border-black shadow-[3px_3px_0px_0px_#000000] rounded-xs';
    fontStyle = 'font-editorial-mono text-xs sm:text-sm font-black uppercase tracking-wider';
  }

  // Custom colors if applied
  if (bubble.bgColor) {
    bubbleShape = `${bubble.bgColor} border-2 sm:border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-2xl`;
  }

  // Pointer Tail rendering
  const renderTail = () => {
    if (bubble.tailDirection === 'none') return null;

    if (bubble.type === 'thought') {
      return (
        <div className="absolute -bottom-3 left-4 flex gap-0.5 items-center pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#f0f9ff] border-2 border-sky-900" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#f0f9ff] border border-sky-900" />
        </div>
      );
    }

    if (bubble.type === 'shout') {
      return (
        <div className="absolute -bottom-3 left-1/3 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-black pointer-events-none">
          <div className="absolute -top-[13px] -left-[6px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-[#fff4bd]" />
        </div>
      );
    }

    // Classic speech pointers
    if (bubble.tailDirection === 'bottom-left') {
      return (
        <div className="absolute -bottom-2.5 left-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-black pointer-events-none">
          <div className="absolute -top-[11px] -left-[4px] w-0 h-0 border-l-[4px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
        </div>
      );
    }

    if (bubble.tailDirection === 'bottom-right') {
      return (
        <div className="absolute -bottom-2.5 right-4 w-0 h-0 border-l-[10px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-black pointer-events-none">
          <div className="absolute -top-[11px] -left-[8px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[4px] border-r-transparent border-t-[8px] border-t-white" />
        </div>
      );
    }

    if (bubble.tailDirection === 'top-left') {
      return (
        <div className="absolute -top-2.5 left-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-black pointer-events-none">
          <div className="absolute top-[2px] -left-[4px] w-0 h-0 border-l-[4px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white" />
        </div>
      );
    }

    if (bubble.tailDirection === 'top-right') {
      return (
        <div className="absolute -top-2.5 right-4 w-0 h-0 border-l-[10px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-black pointer-events-none">
          <div className="absolute top-[2px] -left-[8px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-white" />
        </div>
      );
    }

    return null;
  };

  return (
    <div
      id={`bubble-${bubble.id}`}
      style={{
        left: `${bubble.x}%`,
        top: `${bubble.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      className={`absolute z-30 max-w-[85%] sm:max-w-[72%] cursor-move select-none transition-shadow ${
        isSelected ? 'ring-2 ring-red-600 ring-offset-2 ring-offset-black/70' : ''
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        setShowControls(false);
        setShowFormatMenu(false);
        setShowPositionMenu(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
    >
      <div className={`relative px-3 py-1.5 sm:px-4 sm:py-2.5 ${bubbleShape}`}>
        {/* Speaker Name Tag (optional) */}
        {bubble.speaker && bubble.speaker !== 'Unknown' && (
          <div className="flex items-center justify-between gap-1 text-[9px] sm:text-[10px] font-black uppercase text-red-600 tracking-wider mb-0.5 leading-none font-editorial-mono">
            <span>{bubble.speaker}</span>
            {bubble.characterPosition && bubble.characterPosition !== 'custom' && (
              <span className="text-[8px] text-gray-500 font-bold">
                [{bubble.characterPosition.toUpperCase()}]
              </span>
            )}
          </div>
        )}

        {/* Bubble Text or Inline Formatter Editor */}
        {isEditing ? (
          <div className="flex flex-col gap-2 min-w-[190px] sm:min-w-[220px]" onClick={(e) => e.stopPropagation()}>
            {/* Quick Inline Format Insertion Chips */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 border border-black text-[9px] font-black uppercase">
              <button
                type="button"
                onClick={() => handleInsertTag('bold')}
                className="px-1.5 py-0.5 bg-white hover:bg-black hover:text-white border border-black font-black"
                title="Format Bold (**text**)"
              >
                <b>B</b>
              </button>
              <button
                type="button"
                onClick={() => handleInsertTag('italic')}
                className="px-1.5 py-0.5 bg-white hover:bg-black hover:text-white border border-black italic"
                title="Format Italic (*text*)"
              >
                <i>I</i>
              </button>
              <button
                type="button"
                onClick={() => handleInsertTag('underline')}
                className="px-1.5 py-0.5 bg-white hover:bg-black hover:text-white border border-black underline"
                title="Format Underline (__text__)"
              >
                <u>U</u>
              </button>
              <button
                type="button"
                onClick={() => handleInsertTag('caps')}
                className="px-1.5 py-0.5 bg-white hover:bg-black hover:text-white border border-black"
                title="Uppercase SHOUT"
              >
                AA
              </button>
            </div>

            <textarea
              ref={textareaRef}
              autoFocus
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveText();
                }
              }}
              className="w-full text-xs sm:text-sm font-comic-text p-1.5 border-2 border-black rounded-none bg-white text-black focus:outline-none focus:border-red-600 resize-none shadow-xs"
              rows={2}
            />
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px] text-gray-500 font-editorial-mono">Press Enter to save</span>
              <button
                type="button"
                onClick={handleSaveText}
                className="px-3 py-1 text-[10px] bg-black text-white font-black uppercase border border-black hover:bg-red-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`leading-snug text-center ${fontStyle} ${fontSizeClass} ${
              bubble.bold ? 'font-black' : 'font-bold'
            } ${bubble.italic ? 'italic' : ''} ${bubble.underline ? 'underline underline-offset-2' : ''} ${
              bubble.uppercase ? 'uppercase' : ''
            } ${bubble.textColor || 'text-black'}`}
          >
            {parseFormattedInline(bubble.text)}
          </div>
        )}

        {/* Tail */}
        {renderTail()}

        {/* Floating Quick Action & Formatting Mini-Bar */}
        {(showControls || isSelected) && !isEditing && (
          <div
            className="absolute -top-9 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black text-white px-2 py-1 border-2 border-black shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] text-[10px] z-40 whitespace-nowrap"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. Bubble Type */}
            <button
              type="button"
              title={`Bubble Type: ${bubble.type}`}
              onClick={cycleType}
              className="p-1 hover:text-red-500 flex items-center gap-1 font-black uppercase tracking-wider"
            >
              {bubble.type === 'speech' && <MessageSquare className="w-3 h-3 text-white" />}
              {bubble.type === 'shout' && <Flame className="w-3 h-3 text-red-500" />}
              {bubble.type === 'thought' && <Cloud className="w-3 h-3 text-sky-400" />}
              {bubble.type === 'whisper' && <VolumeX className="w-3 h-3 text-gray-400" />}
              {bubble.type === 'radio' && <Radio className="w-3 h-3 text-yellow-400" />}
              <span className="hidden sm:inline">{bubble.type}</span>
            </button>

            <span className="text-gray-700">|</span>

            {/* 2. Text Formatting Quick Toggles */}
            <button
              type="button"
              title="Toggle Bold"
              onClick={toggleBold}
              className={`p-1 hover:bg-gray-800 ${bubble.bold ? 'text-red-500 font-black' : 'text-gray-300'}`}
            >
              <Bold className="w-3 h-3" />
            </button>

            <button
              type="button"
              title="Toggle Italic"
              onClick={toggleItalic}
              className={`p-1 hover:bg-gray-800 ${bubble.italic ? 'text-red-500 font-black' : 'text-gray-300'}`}
            >
              <Italic className="w-3 h-3" />
            </button>

            <button
              type="button"
              title="Toggle Underline"
              onClick={toggleUnderline}
              className={`p-1 hover:bg-gray-800 ${bubble.underline ? 'text-red-500 font-black' : 'text-gray-300'}`}
            >
              <Underline className="w-3 h-3" />
            </button>

            <button
              type="button"
              title="Toggle All Caps"
              onClick={toggleUppercase}
              className={`p-1 hover:bg-gray-800 font-editorial-mono font-black text-[9px] ${
                bubble.uppercase ? 'text-red-500' : 'text-gray-300'
              }`}
            >
              AA
            </button>

            <button
              type="button"
              title="Cycle Font Size"
              onClick={cycleFontSize}
              className="p-1 hover:text-red-500 font-editorial-mono font-black text-[9px] uppercase"
            >
              {bubble.fontSize || 'base'}
            </button>

            <span className="text-gray-700">|</span>

            {/* 3. Character-Relative Position Menu */}
            <div className="relative">
              <button
                type="button"
                title="Position Relative to Character"
                onClick={() => setShowPositionMenu(!showPositionMenu)}
                className="p-1 hover:text-red-500 flex items-center gap-1 font-black uppercase text-[9px]"
              >
                <User className="w-3 h-3 text-red-500" />
                <span className="hidden sm:inline">Anchor</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </button>

              {showPositionMenu && (
                <div className="absolute left-0 top-full mt-1 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-1.5 z-50 text-black flex flex-col gap-1 min-w-[150px]">
                  <div className="text-[8px] font-black uppercase text-gray-500 px-1 py-0.5 border-b border-gray-200">
                    Snap to Character Position
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSnapToCharacter('left')}
                    className="text-left px-2 py-1 text-[10px] font-black uppercase hover:bg-black hover:text-white flex items-center justify-between"
                  >
                    <span>Left Character (Top-L)</span>
                    <span className="text-[8px] text-gray-400">x:26 y:20</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSnapToCharacter('right')}
                    className="text-left px-2 py-1 text-[10px] font-black uppercase hover:bg-black hover:text-white flex items-center justify-between"
                  >
                    <span>Right Character (Top-R)</span>
                    <span className="text-[8px] text-gray-400">x:74 y:24</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSnapToCharacter('center')}
                    className="text-left px-2 py-1 text-[10px] font-black uppercase hover:bg-black hover:text-white flex items-center justify-between"
                  >
                    <span>Center Hero</span>
                    <span className="text-[8px] text-gray-400">x:50 y:20</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSnapToCharacter('bottom-left')}
                    className="text-left px-2 py-1 text-[10px] font-black uppercase hover:bg-black hover:text-white flex items-center justify-between"
                  >
                    <span>Bottom-Left (Low Angle)</span>
                    <span className="text-[8px] text-gray-400">x:26 y:75</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSnapToCharacter('bottom-right')}
                    className="text-left px-2 py-1 text-[10px] font-black uppercase hover:bg-black hover:text-white flex items-center justify-between"
                  >
                    <span>Bottom-Right</span>
                    <span className="text-[8px] text-gray-400">x:74 y:75</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4. Tail Direction */}
            <button
              type="button"
              title={`Tail: ${bubble.tailDirection}`}
              onClick={cycleTail}
              className="p-1 hover:text-red-500 flex items-center gap-0.5"
            >
              <ArrowUpRight className="w-3 h-3" />
              <span className="hidden sm:inline">Tail</span>
            </button>

            <span className="text-gray-700">|</span>

            {/* 5. Edit text */}
            <button
              type="button"
              title="Edit dialogue text"
              onClick={() => setIsEditing(true)}
              className="p-1 hover:text-red-500 flex items-center gap-0.5"
            >
              <Type className="w-3 h-3" />
              <span>Edit</span>
            </button>

            {/* 6. Delete bubble */}
            <button
              type="button"
              title="Delete bubble"
              onClick={() => onDelete(bubble.id)}
              className="p-1 text-red-500 hover:bg-red-600 hover:text-white"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

