import React, { useState, useEffect, useRef } from 'react';
import { ComicStrip, ComicPanel, ComicStyleId, ComicLayoutId } from './types';
import { SAMPLE_INITIAL_COMIC, COMIC_STYLES, COMIC_LAYOUTS } from './data/comicPresets';
import { ComicCanvas } from './components/ComicCanvas';
import { ComicHeaderBar } from './components/ComicHeaderBar';
import { StoryScriptInput } from './components/StoryScriptInput';
import { PanelInspector } from './components/PanelInspector';
import { CinematicReaderModal } from './components/CinematicReaderModal';
import { ComicLibraryModal } from './components/ComicLibraryModal';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { Sparkles, AlertCircle, RefreshCw, Layers, Sliders } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'text_to_comic_strips_v1';

export default function App() {
  const [comics, setComics] = useState<ComicStrip[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [SAMPLE_INITIAL_COMIC];
  });

  const [currentComicId, setCurrentComicId] = useState<string>(SAMPLE_INITIAL_COMIC.id);

  // Story script form state
  const [storyText, setStoryText] = useState(
    'A brave cyber-detective confronts a rogue AI hologram inside the neon clocktower at midnight.'
  );
  const [selectedStyleId, setSelectedStyleId] = useState<ComicStyleId>('classic-vintage');
  const [selectedLayoutId, setSelectedLayoutId] = useState<ComicLayoutId>('dynamic-4');
  const [panelCount, setPanelCount] = useState<number>(4);

  // UI Modals & State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inspectingPanelId, setInspectingPanelId] = useState<string | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Current active comic
  const currentComic = comics.find((c) => c.id === currentComicId) || comics[0] || SAMPLE_INITIAL_COMIC;

  // Persist to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(comics));
      } catch (e) {
        console.warn('Failed to save comics to localStorage', e);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [comics]);

  // Update current comic helper
  const handleUpdateComic = (updated: ComicStrip) => {
    setComics((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  // Update single panel in current comic
  const handleUpdatePanel = (updatedPanel: ComicPanel) => {
    const updatedPanels = currentComic.panels.map((p) => (p.id === updatedPanel.id ? updatedPanel : p));
    handleUpdateComic({
      ...currentComic,
      panels: updatedPanels,
      updatedAt: Date.now(),
    });
  };

  // Move panel order
  const handleMovePanel = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= currentComic.panels.length) return;
    const newPanels = [...currentComic.panels];
    const [moved] = newPanels.splice(fromIndex, 1);
    newPanels.splice(toIndex, 0, moved);
    // Renumber
    const renumbered = newPanels.map((p, i) => ({ ...p, panelNumber: i + 1 }));
    handleUpdateComic({ ...currentComic, panels: renumbered });
  };

  // Delete panel
  const handleDeletePanel = (panelId: string) => {
    if (currentComic.panels.length <= 1) return;
    const newPanels = currentComic.panels
      .filter((p) => p.id !== panelId)
      .map((p, i) => ({ ...p, panelNumber: i + 1 }));
    handleUpdateComic({ ...currentComic, panels: newPanels });
  };

  // Add blank panel
  const handleAddPanel = () => {
    const newPanelNumber = currentComic.panels.length + 1;
    const newPanel: ComicPanel = {
      id: `panel-${Date.now()}`,
      panelNumber: newPanelNumber,
      title: `Panel ${newPanelNumber}`,
      scenePrompt: `Comic panel showing continued action for panel ${newPanelNumber}`,
      visualDetails: {
        cameraAngle: 'Medium Angle',
        mood: 'Dramatic',
        lighting: 'Dynamic',
        timeOfDay: 'Day',
      },
      bubbles: [
        {
          id: `bubble-${Date.now()}`,
          speaker: '',
          text: 'What happens next?!',
          type: 'speech',
          x: 40,
          y: 25,
          tailDirection: 'bottom-left',
        },
      ],
      sfxList: [],
      imageUrl: '',
      imageStatus: 'idle',
      filterSettings: {
        halftone: true,
        contrast: 100,
        saturation: 100,
        brightness: 100,
        sepia: 0,
        grain: true,
      },
    };
    handleUpdateComic({
      ...currentComic,
      panels: [...currentComic.panels, newPanel],
    });
  };

  // Regenerate single panel image using server API
  const handleRegenerateImage = async (panelId: string) => {
    const panel = currentComic.panels.find((p) => p.id === panelId);
    if (!panel) return;

    // Mark as generating
    handleUpdatePanel({ ...panel, imageStatus: 'generating' });

    try {
      const styleDef = COMIC_STYLES.find((s) => s.id === currentComic.styleId);
      const res = await fetch('/api/comic/generate-panel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: panel.scenePrompt,
          stylePrompt: styleDef?.promptModifier || '',
          aspectRatio: '1:1',
        }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        handleUpdatePanel({
          ...panel,
          imageUrl: data.imageUrl,
          imageStatus: 'done',
        });
      } else {
        // Procedural vector fallback
        handleUpdatePanel({
          ...panel,
          imageUrl: '',
          imageStatus: 'done',
        });
      }
    } catch (err: any) {
      console.error('Error generating image:', err);
      handleUpdatePanel({
        ...panel,
        imageStatus: 'done',
      });
    }
  };

  // AI Script Enhancement / Expansion
  const handleEnhanceScript = async (idea: string) => {
    if (!idea.trim()) return;
    setIsEnhancing(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/comic/enhance-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          panelCount,
          genre: selectedStyleId,
        }),
      });
      const data = await res.json();
      if (data.script) {
        setStoryText(data.script);
      }
    } catch (err: any) {
      console.error('Enhance script error:', err);
      setErrorMessage(err.message || 'Failed to enhance script');
    } finally {
      setIsEnhancing(false);
    }
  };

  // Master Comic Generation Flow
  const handleGenerateComic = async () => {
    if (!storyText.trim()) return;
    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationStep('Analyzing story & scripting panels...');

    try {
      const styleDef = COMIC_STYLES.find((s) => s.id === selectedStyleId) || COMIC_STYLES[0];

      // Step 1: Server-side Gemini Breakdown into structured comic panels
      const breakdownRes = await fetch('/api/comic/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          story: storyText,
          panelCount,
          styleId: selectedStyleId,
          stylePrompt: styleDef.promptModifier,
        }),
      });

      if (!breakdownRes.ok) {
        throw new Error('Failed to parse story into comic panels');
      }

      const breakdownJson = await breakdownRes.json();
      const parsedData = breakdownJson.data;

      if (!parsedData || !parsedData.panels || !Array.isArray(parsedData.panels)) {
        throw new Error('Invalid comic structure received from AI');
      }

      // Step 2: Build new comic strip object
      const newComicId = `comic-${Date.now()}`;
      const newPanels: ComicPanel[] = parsedData.panels.map((p: any, idx: number) => ({
        id: `p-${Date.now()}-${idx}`,
        panelNumber: p.panelNumber || idx + 1,
        title: p.title || `Panel ${idx + 1}`,
        scenePrompt: p.scenePrompt || '',
        characterDescriptions: p.characterDescriptions || '',
        visualDetails: p.visualDetails || {
          cameraAngle: 'Medium Angle',
          mood: 'Dramatic',
          lighting: 'Dynamic',
          timeOfDay: 'Day',
        },
        caption: p.caption || undefined,
        captionPosition: p.captionPosition || 'top-left',
        bubbles: (p.bubbles || []).map((b: any, bIdx: number) => ({
          id: b.id || `b-${Date.now()}-${idx}-${bIdx}`,
          speaker: b.speaker || '',
          text: b.text || '...',
          type: b.type || 'speech',
          x: typeof b.x === 'number' ? b.x : 40,
          y: typeof b.y === 'number' ? b.y : 25,
          tailDirection: b.tailDirection || 'bottom-left',
          fontSize: 'base',
        })),
        sfxList: (p.sfxList || []).map((s: any, sIdx: number) => ({
          id: s.id || `sfx-${Date.now()}-${idx}-${sIdx}`,
          text: s.text || 'POW!',
          x: typeof s.x === 'number' ? s.x : 50,
          y: typeof s.y === 'number' ? s.y : 50,
          rotation: typeof s.rotation === 'number' ? s.rotation : 0,
          scale: typeof s.scale === 'number' ? s.scale : 1.2,
          color: s.color || 'yellow-red',
          style: s.style || 'burst',
        })),
        imageUrl: '',
        imageStatus: 'idle',
        filterSettings: {
          halftone: selectedStyleId === 'classic-vintage',
          contrast: 105,
          saturation: 105,
          brightness: 100,
          sepia: selectedStyleId === 'classic-vintage' ? 10 : 0,
          grain: true,
        },
      }));

      const newComic: ComicStrip = {
        id: newComicId,
        title: parsedData.title || 'UNTITLED CHRONICLE',
        subtitle: parsedData.subtitle || '',
        seriesTitle: parsedData.seriesTitle || 'COMIC CHRONICLES #1',
        issueNumber: parsedData.issueNumber || '#1',
        author: 'Comic Studio AI',
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase(),
        styleId: selectedStyleId,
        layoutId: selectedLayoutId,
        aspectRatio: '1:1',
        themeColor: parsedData.themeColor || styleDef.defaultThemeColor,
        showIssueHeader: true,
        showHalftoneOverlay: selectedStyleId === 'classic-vintage',
        showPaperTexture: true,
        gutterWidth: 12,
        borderWidth: 4,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        originalStory: storyText,
        panels: newPanels,
      };

      // Put new comic into state
      setComics((prev) => [newComic, ...prev]);
      setCurrentComicId(newComicId);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#dc2626', '#38bdf8', '#4ade80'],
        });
      } catch {}

      // Step 3: Asynchronously initiate image generation for panels
      setGenerationStep('Composing comic illustrations...');
      for (const panel of newPanels) {
        handleRegenerateImage(panel.id);
      }
    } catch (err: any) {
      console.error('Error generating comic:', err);
      setErrorMessage(err.message || 'Comic generation encountered an issue');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Export Comic Canvas as PNG Image
  const handleExportPNG = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(canvasRef.current, {
        cacheBust: true,
        pixelRatio: 2, // High resolution
        quality: 0.95,
      });
      const link = document.createElement('a');
      link.download = `${currentComic.title.replace(/[^a-zA-Z0-9]/g, '_')}_comic.png`;
      link.href = dataUrl;
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export PNG failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Export Screenplay Script as JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentComic, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${currentComic.title.replace(/\s+/g, '_')}_comic.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Print comic
  const handlePrint = () => {
    window.print();
  };

  // Library actions
  const handleNewComic = () => {
    const freshId = `comic-${Date.now()}`;
    const freshComic: ComicStrip = {
      ...SAMPLE_INITIAL_COMIC,
      id: freshId,
      title: 'NEW COMIC STRIP',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      panels: SAMPLE_INITIAL_COMIC.panels.map((p, i) => ({
        ...p,
        id: `p-${Date.now()}-${i}`,
      })),
    };
    setComics((prev) => [freshComic, ...prev]);
    setCurrentComicId(freshId);
  };

  const handleDuplicateComic = (id: string) => {
    const target = comics.find((c) => c.id === id);
    if (!target) return;
    const dupId = `comic-${Date.now()}`;
    const duplicate: ComicStrip = {
      ...target,
      id: dupId,
      title: `${target.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      panels: target.panels.map((p, i) => ({
        ...p,
        id: `p-${Date.now()}-${i}`,
      })),
    };
    setComics((prev) => [duplicate, ...prev]);
    setCurrentComicId(dupId);
  };

  const handleDeleteComic = (id: string) => {
    if (comics.length <= 1) return;
    const remaining = comics.filter((c) => c.id !== id);
    setComics(remaining);
    if (currentComicId === id) {
      setCurrentComicId(remaining[0].id);
    }
  };

  const handleImportComic = (imported: ComicStrip) => {
    const importedId = `comic-${Date.now()}`;
    const sanitized: ComicStrip = {
      ...imported,
      id: importedId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setComics((prev) => [sanitized, ...prev]);
    setCurrentComicId(importedId);
  };

  const inspectingPanel = currentComic.panels.find((p) => p.id === inspectingPanelId) || null;

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#1a1a1a] flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Header Bar */}
      <ComicHeaderBar
        comic={currentComic}
        onUpdateComic={handleUpdateComic}
        onOpenReader={() => setIsReaderOpen(true)}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onExportPNG={handleExportPNG}
        onExportJSON={handleExportJSON}
        onPrint={handlePrint}
        onAddPanel={handleAddPanel}
        isExporting={isExporting}
      />

      {/* Error notification banner */}
      {errorMessage && (
        <div className="bg-red-600 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-white" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-white hover:underline uppercase font-black tracking-wider text-[10px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* 1. Generator Input & Control Studio */}
        <section className="w-full">
          <StoryScriptInput
            storyText={storyText}
            onChangeStoryText={setStoryText}
            selectedStyleId={selectedStyleId}
            onChangeStyleId={setSelectedStyleId}
            selectedLayoutId={selectedLayoutId}
            onChangeLayoutId={setSelectedLayoutId}
            panelCount={panelCount}
            onChangePanelCount={setPanelCount}
            onGenerateComic={handleGenerateComic}
            onEnhanceScript={handleEnhanceScript}
            isGenerating={isGenerating}
            isEnhancing={isEnhancing}
            generationStep={generationStep}
          />
        </section>

        {/* 2. Comic Strip Visual Canvas */}
        <section className="w-full flex flex-col items-center">
          <div className="w-full flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] font-editorial-mono font-black tracking-widest uppercase text-gray-600 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-red-600" />
              <span>Interactive Canvas // Double click text to edit • Drag speech bubbles & SFX</span>
            </span>

            <button
              type="button"
              onClick={() => setIsReaderOpen(true)}
              className="text-[10px] font-black uppercase tracking-widest text-black hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <span>Fullscreen Reader Mode</span>
              <span>→</span>
            </button>
          </div>

          <ComicCanvas
            ref={canvasRef}
            comic={currentComic}
            onUpdatePanel={handleUpdatePanel}
            onRegenerateImage={handleRegenerateImage}
            onOpenInspector={(panelId) => setInspectingPanelId(panelId)}
            onMovePanel={handleMovePanel}
            onDeletePanel={handleDeletePanel}
          />
        </section>
      </main>

      {/* Editorial System Status Footer */}
      <footer className="h-10 bg-white border-t-2 border-black flex items-center justify-between px-4 sm:px-8 text-[9px] font-editorial-mono font-bold uppercase tracking-widest text-gray-500 mt-auto">
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-black font-black">INKSMITH STUDIO v2.4</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">STATE: READY</span>
          <span>•</span>
          <span className="text-red-600">{currentComic.panels.length} PANELS COMPILED</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline">PRESS DENSITY: 300 DPI EQUIV</span>
          <span className="hidden sm:inline">•</span>
          <span>LAYOUT: {selectedLayoutId.toUpperCase()}</span>
        </div>
      </footer>

      {/* Modals */}
      {inspectingPanel && (
        <PanelInspector
          panel={inspectingPanel}
          styleId={currentComic.styleId}
          onClose={() => setInspectingPanelId(null)}
          onUpdatePanel={handleUpdatePanel}
          onRegenerateImage={handleRegenerateImage}
        />
      )}

      {isReaderOpen && (
        <CinematicReaderModal
          comic={currentComic}
          onClose={() => setIsReaderOpen(false)}
        />
      )}

      {isLibraryOpen && (
        <ComicLibraryModal
          comics={comics}
          currentComicId={currentComicId}
          onSelectComic={setCurrentComicId}
          onNewComic={handleNewComic}
          onDuplicateComic={handleDuplicateComic}
          onDeleteComic={handleDeleteComic}
          onImportComic={handleImportComic}
          onClose={() => setIsLibraryOpen(false)}
        />
      )}
    </div>
  );
}
