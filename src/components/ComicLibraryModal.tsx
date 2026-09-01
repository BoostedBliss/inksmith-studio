import React, { useState } from 'react';
import { ComicStrip } from '../types';
import { COMIC_STYLES } from '../data/comicPresets';
import {
  X,
  Plus,
  Trash2,
  Copy,
  Download,
  Upload,
  BookOpen,
  Calendar,
  Layers,
} from 'lucide-react';

interface ComicLibraryModalProps {
  comics: ComicStrip[];
  currentComicId: string;
  onSelectComic: (id: string) => void;
  onNewComic: () => void;
  onDuplicateComic: (id: string) => void;
  onDeleteComic: (id: string) => void;
  onImportComic: (comic: ComicStrip) => void;
  onClose: () => void;
}

export const ComicLibraryModal: React.FC<ComicLibraryModalProps> = ({
  comics,
  currentComicId,
  onSelectComic,
  onNewComic,
  onDuplicateComic,
  onDeleteComic,
  onImportComic,
  onClose,
}) => {
  const [importError, setImportError] = useState<string | null>(null);

  const handleExportJSON = (comic: ComicStrip) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(comic, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${comic.title.replace(/\s+/g, '_')}_comic.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.panels && Array.isArray(parsed.panels)) {
          onImportComic(parsed);
          setImportError(null);
        } else {
          setImportError('Invalid comic strip JSON structure.');
        }
      } catch (err) {
        setImportError('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-black flex flex-col gap-4 my-auto max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-black text-white border border-black shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]">
              <BookOpen className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-black text-xl uppercase tracking-tighter italic text-black">
                COMIC ARCHIVE & REPOSITORY
              </h3>
              <p className="text-[10px] font-editorial-mono font-bold uppercase text-gray-500">
                Manage, duplicate, and export published issues
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-black hover:text-white text-black text-xs font-black uppercase tracking-wider border-2 border-black transition-colors">
              <Upload className="w-3.5 h-3.5 text-red-600" />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>

            <button
              type="button"
              onClick={onNewComic}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Issue</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-black hover:text-white border border-transparent hover:border-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {importError && (
          <div className="p-2.5 bg-red-600 text-white font-bold text-xs border border-black">
            {importError}
          </div>
        )}

        {/* Comics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto pr-1">
          {comics.map((c) => {
            const isCurrent = c.id === currentComicId;
            const styleDef = COMIC_STYLES.find((s) => s.id === c.styleId);
            return (
              <div
                key={c.id}
                onClick={() => {
                  onSelectComic(c.id);
                  onClose();
                }}
                className={`cursor-pointer p-4 border-2 border-black flex flex-col justify-between gap-3 transition-all ${
                  isCurrent
                    ? 'bg-[#fff9db] shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]'
                    : 'bg-[#f8f8f8] hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-editorial-mono px-2 py-0.5 bg-black text-white font-bold uppercase">
                      ISSUE {c.issueNumber || '#1'}
                    </span>
                    <span className="text-[10px] font-editorial-mono font-bold text-gray-500 uppercase">
                      {c.panels.length} PANELS
                    </span>
                  </div>

                  <h4 className="font-black text-base text-black tracking-tight uppercase line-clamp-1 italic">
                    {c.title || 'Untitled Comic'}
                  </h4>

                  <p className="font-serif-italic text-xs text-gray-700 line-clamp-2 leading-snug">
                    {c.originalStory || 'No story synopsis recorded.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t-2 border-black text-[10px] font-editorial-mono font-bold text-gray-500">
                  <span className="text-red-600 uppercase font-black">
                    {styleDef?.badge || c.styleId}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Download JSON"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportJSON(c);
                      }}
                      className="p-1 text-black hover:text-red-600 hover:bg-gray-200"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      title="Duplicate Comic"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateComic(c.id);
                      }}
                      className="p-1 text-black hover:text-red-600 hover:bg-gray-200"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {comics.length > 1 && (
                      <button
                        type="button"
                        title="Delete Comic"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteComic(c.id);
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
          })}
        </div>
      </div>
    </div>
  );
};
