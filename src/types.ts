export type ComicStyleId =
  | 'classic-vintage'
  | 'japanese-manga'
  | 'dark-noir'
  | 'american-superhero'
  | 'sunday-newspaper'
  | 'cyberpunk-neon'
  | 'ligne-claire'
  | 'retro-pixel'
  | 'watercolor-novel';

export type ComicLayoutId =
  | 'strip-4'
  | 'grid-4'
  | 'strip-3'
  | 'page-6'
  | 'dynamic-4'
  | 'dynamic-5'
  | 'hero-splash-3'
  | 'webtoon-vertical';

export type BubbleType = 'speech' | 'thought' | 'shout' | 'whisper' | 'radio';

export type TailDirection =
  | 'bottom-left'
  | 'bottom-right'
  | 'top-left'
  | 'top-right'
  | 'left'
  | 'right'
  | 'none';

export type CharacterPositionAnchor = 'left' | 'right' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'custom';

export interface SpeechBubble {
  id: string;
  speaker: string;
  text: string;
  type: BubbleType;
  x: number; // percentage 0-100 within panel
  y: number; // percentage 0-100 within panel
  tailDirection: TailDirection;
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  textColor?: string;
  bgColor?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  uppercase?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  characterPosition?: CharacterPositionAnchor;
}

export interface DetectedDialogue {
  id: string;
  speaker: string;
  text: string;
  type: BubbleType;
  rawLine: string;
  suggestedPanelIndex: number;
  characterPosition: CharacterPositionAnchor;
  x: number;
  y: number;
  tailDirection: TailDirection;
  bold?: boolean;
  italic?: boolean;
  uppercase?: boolean;
}

export type SFXColor =
  | 'yellow-red'
  | 'cyan-purple'
  | 'lime-yellow'
  | 'orange-pink'
  | 'white-black'
  | 'red-orange';

export type SFXStyle = 'burst' | 'action' | 'electric' | 'speed' | 'clean';

export interface ComicSFX {
  id: string;
  text: string;
  x: number; // percentage 0-100 within panel
  y: number; // percentage 0-100 within panel
  rotation: number; // -45 to 45
  scale: number; // 0.6 to 2.0
  color: SFXColor;
  style: SFXStyle;
}

export interface PanelVisualDetails {
  cameraAngle: string; // e.g. "Low Angle Dramatic Close-up", "Wide Establishing Shot", "Over-the-shoulder"
  mood: string; // e.g. "Tense, High-stakes", "Warm & Humorous", "Eerie & Mysterious"
  lighting: string; // e.g. "Harsh Chiaroscuro", "Neon Magenta Rim Light", "Bright Sunny Day"
  timeOfDay: string; // e.g. "Midnight", "Golden Hour", "Dusk"
}

export interface PanelFilters {
  halftone: boolean;
  contrast: number; // 50 to 150 (100 is default)
  saturation: number; // 0 to 200 (100 is default)
  brightness: number; // 50 to 150 (100 is default)
  sepia: number; // 0 to 100
  grain: boolean;
}

export interface ComicPanel {
  id: string;
  panelNumber: number;
  title: string;
  scenePrompt: string;
  characterDescriptions?: string;
  visualDetails: PanelVisualDetails;
  caption?: string;
  captionPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-full' | 'bottom-full';
  bubbles: SpeechBubble[];
  sfxList: ComicSFX[];
  imageUrl?: string;
  imageStatus: 'idle' | 'generating' | 'done' | 'error';
  filterSettings: PanelFilters;
  customWidthPercent?: number;
  customHeightPercent?: number;
}

export interface ComicStrip {
  id: string;
  title: string;
  subtitle?: string;
  seriesTitle?: string;
  issueNumber: string;
  author: string;
  date: string;
  styleId: ComicStyleId;
  layoutId: ComicLayoutId;
  aspectRatio: '1:1' | '4:3' | '16:9' | '3:4';
  panels: ComicPanel[];
  themeColor: string; // e.g. 'amber', 'cyan', 'red', 'purple', 'emerald', 'monochrome'
  showIssueHeader: boolean;
  showHalftoneOverlay: boolean;
  showPaperTexture: boolean;
  gutterWidth: number; // 4 to 24px
  borderWidth: number; // 1 to 8px
  createdAt: number;
  updatedAt: number;
  originalStory: string;
}

export interface ComicStyleDefinition {
  id: ComicStyleId;
  name: string;
  badge: string;
  description: string;
  promptModifier: string;
  negativePrompt: string;
  bgTexture: 'paper' | 'dark' | 'halftone' | 'clean';
  borderStyle: string;
  fontHeading: string;
  defaultThemeColor: string;
  iconName: string;
}

export interface ComicLayoutDefinition {
  id: ComicLayoutId;
  name: string;
  panelCount: number;
  description: string;
  iconName: string;
  gridClass: string;
  panelSpans?: string[]; // CSS classes per panel index
}

export interface StoryPreset {
  id: string;
  title: string;
  category: 'Sci-Fi' | 'Superhero' | 'Noir & Mystery' | 'Humor & Comic Strip' | 'Anime & Manga' | 'Cyberpunk' | 'Fantasy' | 'Slice of Life';
  styleId: ComicStyleId;
  layoutId: ComicLayoutId;
  summary: string;
  scriptText: string;
}
