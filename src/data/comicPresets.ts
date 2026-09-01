import { ComicStyleDefinition, ComicLayoutDefinition, StoryPreset, ComicStrip } from '../types';

export const COMIC_STYLES: ComicStyleDefinition[] = [
  {
    id: 'classic-vintage',
    name: 'Classic Vintage (1960s Golden/Silver Age)',
    badge: 'Vintage 1960s',
    description: 'Authentic retro comic print with Ben-Day halftone dots, bold inking, primary color inks, and aged paper texture.',
    promptModifier: 'Vintage 1960s comic book illustration style, bold black ink outlines, visible Ben-Day halftone dot printing patterns, classic four-color CMYK process print aesthetic, dynamic comic panel composition, pulp comic texture, authentic retro graphic novel artwork',
    negativePrompt: 'photorealistic, 3D render, digital airbrush, modern CGI, blurry, low resolution',
    bgTexture: 'halftone',
    borderStyle: 'border-4 border-black',
    fontHeading: 'font-comic-heading',
    defaultThemeColor: 'amber',
    iconName: 'Zap',
  },
  {
    id: 'japanese-manga',
    name: 'Manga & Shonen Anime',
    badge: 'Manga / Anime',
    description: 'Dynamic speed lines, intense screentone shading, expressive character eyes, high contrast black & white with selective vibrant color accents.',
    promptModifier: 'Japanese manga and anime graphic novel style, dynamic action speed lines, screentone shading, high contrast expressive comic ink, dramatic cinematic angle, clean bold anime line art, crisp studio animation cel aesthetic',
    negativePrompt: 'blurry, realistic photography, Western vintage pulp, western newspaper cartoon',
    bgTexture: 'clean',
    borderStyle: 'border-4 border-stone-900',
    fontHeading: 'font-comic-punch',
    defaultThemeColor: 'red',
    iconName: 'Sparkles',
  },
  {
    id: 'dark-noir',
    name: 'Dark Noir Graphic Novel',
    badge: 'Gritty Noir',
    description: 'Heavy shadow contrast, chiaroscuro lighting, rain-soaked streets, Venetian blind shadows, dramatic monochromatic inking.',
    promptModifier: 'Frank Miller gritty crime noir graphic novel art style, dramatic chiaroscuro high contrast black and white inking, deep deep heavy shadows, moody atmospheric rain, single accent amber/red lighting, hardboiled detective comic illustration',
    negativePrompt: 'bright sunny day, cartoonish, colorful pastel, soft watercolor',
    bgTexture: 'dark',
    borderStyle: 'border-4 border-zinc-950',
    fontHeading: 'font-cinzel',
    defaultThemeColor: 'monochrome',
    iconName: 'Eye',
  },
  {
    id: 'american-superhero',
    name: 'Modern American Superhero',
    badge: 'Modern Superhero',
    description: 'High-octane comic action with vibrant cinematic lighting, punchy muscular heroes, explosive particle effects, and polished digital inking.',
    promptModifier: 'Modern Marvel/DC high budget superhero comic book splash panel, Jim Lee / Alex Ross inspired dynamic action lighting, crisp digital ink, intense power glow effects, cinematic perspective, vibrant bold saturated colors, hyper-detailed heroic anatomy and costumes',
    negativePrompt: 'flat sketch, amateur doodle, low detail, muted colors',
    bgTexture: 'clean',
    borderStyle: 'border-4 border-black',
    fontHeading: 'font-comic-heading',
    defaultThemeColor: 'cyan',
    iconName: 'Flame',
  },
  {
    id: 'sunday-newspaper',
    name: 'Sunday Newspaper Cartoon Strip',
    badge: 'Sunday Strip',
    description: 'Lighthearted whimsical humor, clean flat cartoon fills, soft pastel tones, expressive cartoon characters like Calvin & Hobbes or Peanuts.',
    promptModifier: 'Classic Sunday newspaper syndicated funny comic strip illustration style, charming hand-drawn cartoon line art, warm soft flat color palette, whimsical expressive humorous characters, crisp clean line work, timeless Sunday comics look',
    negativePrompt: 'dark gritty realism, scary, photorealistic, complex 3D render',
    bgTexture: 'paper',
    borderStyle: 'border-3 border-stone-800',
    fontHeading: 'font-comic-text',
    defaultThemeColor: 'emerald',
    iconName: 'Smile',
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon Future',
    badge: 'Cyberpunk Sci-Fi',
    description: 'Dystopian futuristic graphic novel with neon magenta & cyan rim lights, holographic HUD interfaces, chrome reflections, and rain-slicked skyscrapers.',
    promptModifier: 'Cyberpunk graphic novel illustration, neon glowing magenta and electric cyan lighting, rain-drenched futuristic megacity, cybernetic implants, holographic HUD interfaces, high-tech dystopian comic art style, rich atmospheric reflections',
    negativePrompt: 'medieval, pastoral, vintage paper, black and white',
    bgTexture: 'dark',
    borderStyle: 'border-4 border-cyan-500',
    fontHeading: 'font-comic-punch',
    defaultThemeColor: 'purple',
    iconName: 'Cpu',
  },
  {
    id: 'ligne-claire',
    name: 'Franco-Belgian Ligne Claire',
    badge: 'Ligne Claire',
    description: 'Clear line style made famous by Hergé (Tintin) and Moebius: constant line width, crisp architectural details, and rich flat colors.',
    promptModifier: 'Franco-Belgian bande dessinée Ligne Claire art style by Hergé and Moebius, uniform crisp clear black ink lines, flat elegant color fills, meticulous architectural and environment details, vintage European adventure comic book illustration',
    negativePrompt: 'heavy messy hatching, photographic, gradient glow, blurry',
    bgTexture: 'paper',
    borderStyle: 'border-3 border-stone-900',
    fontHeading: 'font-comic-text',
    defaultThemeColor: 'amber',
    iconName: 'Compass',
  },
  {
    id: 'watercolor-novel',
    name: 'Watercolor Graphic Novel',
    badge: 'Artistic Watercolor',
    description: 'Dreamy hand-painted watercolor textures, organic expressive brushstrokes, poetic atmosphere, and gentle narrative illustration.',
    promptModifier: 'Award-winning indie watercolor graphic novel illustration, luminous translucent watercolor washes, delicate ink outlines, poetic atmospheric lighting, beautiful artistic paper grain texture, expressive emotional character illustration',
    negativePrompt: 'harsh neon, vector art, harsh 3D render, glossy plastic',
    bgTexture: 'paper',
    borderStyle: 'border-3 border-stone-700',
    fontHeading: 'font-cinzel',
    defaultThemeColor: 'purple',
    iconName: 'Palette',
  },
  {
    id: 'retro-pixel',
    name: 'Retro 16-Bit Pixel Comic',
    badge: '16-Bit Pixel',
    description: 'Nostalgic 1990s arcade & SNES pixel art style with vibrant limited color palettes and sprite-based comic drama.',
    promptModifier: '16-bit retro pixel art comic panel, detailed pixel art graphic novel, rich vibrant palette, nostalgic 90s SNES arcade aesthetic, crisp sharp pixel outlines, clean dithered shading, dynamic retro gaming comic strip',
    negativePrompt: 'vector, smooth gradients, high resolution photo, realistic paint',
    bgTexture: 'clean',
    borderStyle: 'border-4 border-black',
    fontHeading: 'font-comic-punch',
    defaultThemeColor: 'cyan',
    iconName: 'Gamepad2',
  },
];

export const COMIC_LAYOUTS: ComicLayoutDefinition[] = [
  {
    id: 'strip-4',
    name: 'Classic 4-Panel Strip',
    panelCount: 4,
    description: 'Standard horizontal comic strip with 4 sequential panels. Ideal for quick story arcs, comedy setups, and punchlines.',
    iconName: 'LayoutGrid',
    gridClass: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3',
  },
  {
    id: 'grid-4',
    name: '2x2 Square Grid',
    panelCount: 4,
    description: 'Balanced 2x2 grid layout. Perfect for square comic book formats and social media posts.',
    iconName: 'Grid2x2',
    gridClass: 'grid grid-cols-1 sm:grid-cols-2 gap-3.5',
  },
  {
    id: 'dynamic-4',
    name: 'Dynamic Comic Page (Hero Banner + 3)',
    panelCount: 4,
    description: '1 wide cinematic banner at the top followed by 3 dynamic panels below. Adds visual drama.',
    iconName: 'Columns3',
    gridClass: 'grid grid-cols-1 md:grid-cols-3 gap-3.5',
    panelSpans: ['md:col-span-3', 'md:col-span-1', 'md:col-span-1', 'md:col-span-1'],
  },
  {
    id: 'page-6',
    name: '6-Panel Comic Book Page',
    panelCount: 6,
    description: 'Traditional 2x3 full-page graphic novel layout. Ideal for longer story pacing and multi-character dialogue.',
    iconName: 'FileText',
    gridClass: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3',
  },
  {
    id: 'strip-3',
    name: '3-Panel Sunday Strip',
    panelCount: 3,
    description: 'Setup -> Escalation -> Punchline. The timeless golden ratio of newspaper comic storytelling.',
    iconName: 'Columns2',
    gridClass: 'grid grid-cols-1 md:grid-cols-3 gap-3.5',
  },
  {
    id: 'hero-splash-3',
    name: 'Splash Climax (2 Setup + 1 Giant Splash)',
    panelCount: 3,
    description: '2 vertical setup panels on the left with a massive dramatic splash panel on the right.',
    iconName: 'Maximize2',
    gridClass: 'grid grid-cols-1 md:grid-cols-3 gap-3.5',
    panelSpans: ['md:col-span-1', 'md:col-span-1', 'md:col-span-1 md:row-span-1'],
  },
  {
    id: 'dynamic-5',
    name: '5-Panel Action Flow',
    panelCount: 5,
    description: '1 top wide establishing shot, 2 middle dialogue panels, and 2 bottom action resolution panels.',
    iconName: 'Layers',
    gridClass: 'grid grid-cols-1 md:grid-cols-2 gap-3.5',
    panelSpans: ['md:col-span-2', 'md:col-span-1', 'md:col-span-1', 'md:col-span-1', 'md:col-span-1'],
  },
  {
    id: 'webtoon-vertical',
    name: 'Vertical Webtoon Scroll',
    panelCount: 4,
    description: 'Seamless vertical continuous scrolling panel stack for mobile and web reading.',
    iconName: 'AlignVerticalSpaceAround',
    gridClass: 'flex flex-col gap-4 max-w-xl mx-auto',
  },
];

export const STORY_PRESETS: StoryPreset[] = [
  {
    id: 'superhero-clocktower',
    title: 'Titan vs. Chronos: Midnight Heist',
    category: 'Superhero',
    styleId: 'american-superhero',
    layoutId: 'dynamic-4',
    summary: 'A golden superhero races across the city skyline to stop a time-bending villain atop Big Ben.',
    scriptText: `PANEL 1:
Scene: Wide aerial view of the metropolis at midnight with lightning piercing the dark storm clouds. The massive gothic clock tower glows with sinister green temporal energy.
Caption: "MIDNIGHT. THE TIME IS RUNNING OUT FOR METROPOLIS..."
SFX: "KRA-KABOOM!"

PANEL 2:
Scene: Close-up of Lord Chronos inside the clock gear chamber, wearing a bronze steampunk monocle and holding the glowing Temporal Core.
Dialogue (Chronos - Shout): "At last! Once the bell strikes twelve, time itself bows to me!"

PANEL 3:
Scene: Dynamic action angle: Captain Aegis punches through the stained glass window in a shower of colorful crystalline shards, energy shield blazing.
Dialogue (Captain Aegis - Speech): "Not on my watch, Chronos!"
SFX: "SHATTERRR!"

PANEL 4:
Scene: Epic showdown: Aegis unleashes a shockwave pulse knocking the core from Chronos' hands as the clock gears freeze.
Dialogue (Captain Aegis - Speech): "Looks like your time's up."
SFX: "WHAMMM!"`,
  },
  {
    id: 'scifi-deepspace',
    title: 'The Void Beacon: First Contact',
    category: 'Sci-Fi',
    styleId: 'cyberpunk-neon',
    layoutId: 'strip-4',
    summary: 'Deep space exploration vessel investigates a mysterious alien geometric relic glowing inside an asteroid nebula.',
    scriptText: `PANEL 1:
Scene: The scout starship USS Odyssey cruising near a glowing purple and turquoise cosmic nebula filled with crystalline asteroids.
Caption: "DEEP SECTOR 9. 40,000 LIGHT YEARS BEYOND THE FRONTIER."
Dialogue (Commander Vance - Speech): "Sensors are picking up an anomalous energy signature ahead."

PANEL 2:
Scene: Cockpit view. Holographic blue telemetry screens illuminating the determined face of pilot Dr. Maya Lin.
Dialogue (Dr. Maya Lin - Speech): "It's not natural, Commander... It's repeating prime numbers!"
SFX: "BEEP-BEEP-BEEP"

PANEL 3:
Scene: Dramatic reveal of an enormous obsidian alien monolith floating in the asteroid field, pulsing with golden runic light.
Dialogue (Commander Vance - Thought): "By the stars... We are not alone."
SFX: "HUMMMMM"

PANEL 4:
Scene: Close-up on the relic splitting open with blinding celestial light, revealing a star map of Earth.
Caption: "THE MESSAGE WAS AN INVITATION."
Dialogue (Dr. Maya Lin - Shout): "It knows where we come from!"
SFX: "FLASH!"`,
  },
  {
    id: 'noir-alleyway',
    title: 'Rain on 4th Street: The Golden Key',
    category: 'Noir & Mystery',
    styleId: 'dark-noir',
    layoutId: 'grid-4',
    summary: 'A weary private eye in a trench coat finds an unexpected clue in a damp back-alley in 1947.',
    scriptText: `PANEL 1:
Scene: Detective Jack Malone standing under a flickering streetlamp in a dark rain-slicked alleyway, wearing a fedora and trenchcoat, cigarette smoke drifting in the air.
Caption: "THE RAIN IN THIS CITY NEVER WASHES AWAY THE DIRTY SECRETS."

PANEL 2:
Scene: Over-the-shoulder view looking down at a discarded wet wooden crate with a glowing antique brass key resting inside a silver lockbox.
Dialogue (Malone - Thought): "The dame said she lost her luggage. She didn't mention it was locked with the King's seal."

PANEL 3:
Scene: Sudden sound: A sharp shadow with a revolver emerges against the brick wall behind him.
Dialogue (Mysterious Shadow - Whisper): "Drop the key, Detective. If you value your pulse."
SFX: "CLICK!"

PANEL 4:
Scene: Extreme close-up of Malone's confident grin as he flips the brass key into the air with one hand.
Dialogue (Malone - Speech): "Sorry pal. Finders keepers in this precinct."
SFX: "CLINK!"`,
  },
  {
    id: 'comedy-cat-robot',
    title: "Barnaby's Catnip Conundrum",
    category: 'Humor & Comic Strip',
    styleId: 'sunday-newspaper',
    layoutId: 'strip-4',
    summary: 'A mischievous tuxedo cat engages in psychological warfare against the new robotic vacuum cleaner.',
    scriptText: `PANEL 1:
Scene: Barnaby the chubby tuxedo cat sitting on the couch armrest, glaring suspiciously down at the sleek round robot vacuum humming on the carpet.
Caption: "TUESDAY MORNING: THE INVASION BEGINS."
Dialogue (Barnaby - Thought): "That round metallic beast thinks it owns my carpet."

PANEL 2:
Scene: Barnaby crouches low in attack position, eyes wide with pupils dilated, tail twitching menacingly behind him.
Dialogue (Barnaby - Whisper): "Engaging tactical stealth protocol..."
SFX: "WIGGLE WIGGLE"

PANEL 3:
Scene: Barnaby heroically pounces directly on top of the robot vacuum, riding it like a chariot with paws raised in victory!
Dialogue (Barnaby - Shout): "FORWARD, MY MECHANICAL STEED! TO THE TREAT CABINET!"
SFX: "POUNCE!"

PANEL 4:
Scene: The vacuum quietly reverses under the low coffee table, gently bumping Barnaby's head into the plush rug.
Dialogue (Barnaby - Speech): "I meant to do that."
SFX: "BUMP"`,
  },
  {
    id: 'anime-wind-dragon',
    title: 'Blade of the Azure Gale',
    category: 'Anime & Manga',
    styleId: 'japanese-manga',
    layoutId: 'dynamic-4',
    summary: 'A young samurai apprentice unleashes his ancestral wind spirit sword technique against a shadow beast.',
    scriptText: `PANEL 1:
Scene: Vast cinematic shot of a ruined mountain temple courtyard beneath cherry blossom petals swirling in a fierce storm. A towering shadow demon with red eyes looms.
Caption: "THE SACRED TEMPLE OF GALE PEAK."
SFX: "ROAAARRR!"

PANEL 2:
Scene: Low angle close-up of young warrior Ren drawing his katana, brilliant blue aura flames erupting from the steel blade.
Dialogue (Ren - Shout): "Ancestral wind dragon... Hear my call and guide my strike!"
SFX: "SHINGGG!"

PANEL 3:
Scene: Dramatic anime speed lines: Ren flashes forward at hypersonic speed, slicing through the air with a spiral dragon silhouette.
Dialogue (Ren - Shout): "SECRET ART: EIGHTFOLD CYCLONE SLASH!"
SFX: "SWOOOOOSH!"

PANEL 4:
Scene: Ren calmly sheathes his sword as the shadow beast dissolves into sparkling cherry blossom stardust behind him.
Dialogue (Ren - Speech): "Rest now in the eternal wind."
SFX: "CLICK"`,
  },
  {
    id: 'fantasy-apprentice-dragon',
    title: 'The Whisper in the Crypt',
    category: 'Fantasy',
    styleId: 'watercolor-novel',
    layoutId: 'grid-4',
    summary: 'A clumsy wizard apprentice tries a high-level summoning spell and gets an unexpected tiny companion.',
    scriptText: `PANEL 1:
Scene: Cozy stone library filled with towering bookshelves, glowing potion vials, and floating candlelight. Young wizard Elora reads an oversized leather spellbook.
Dialogue (Elora - Speech): "Okay... Just a simple ancient fire guardian summon. What could go wrong?"

PANEL 2:
Scene: Elora waves her wooden wand. Swirling purple and gold magical runes erupt from the floor in a dazzling spiral.
Dialogue (Elora - Shout): "Ignis Draconis Manifestum!"
SFX: "FZZZZT! BOOM!"

PANEL 3:
Scene: The smoke clears to reveal a tiny, palm-sized emerald dragon with oversized cute eyes, sneezing out a tiny puff of harmless glitter.
SFX: "POOF... *sneeze*"
Dialogue (Tiny Dragon - Speech): "*Pip!*"

PANEL 4:
Scene: Elora beaming with delight as the tiny dragon curls up comfortably on top of her wizard hat.
Dialogue (Elora - Speech): "Well... You're definitely not a 20-foot war beast, but you're hired!"`,
  },
];

export const POPULAR_SFX = [
  { text: 'POW!', color: 'yellow-red', style: 'burst' },
  { text: 'BAM!', color: 'orange-pink', style: 'burst' },
  { text: 'WHAM!', color: 'red-orange', style: 'action' },
  { text: 'KABOOM!', color: 'yellow-red', style: 'burst' },
  { text: 'ZAP!', color: 'cyan-purple', style: 'electric' },
  { text: 'SWOOSH!', color: 'cyan-purple', style: 'speed' },
  { text: 'SLASH!', color: 'red-orange', style: 'action' },
  { text: 'GASP!', color: 'lime-yellow', style: 'clean' },
  { text: 'THUD!', color: 'white-black', style: 'action' },
  { text: 'CRACK!', color: 'yellow-red', style: 'burst' },
  { text: 'BOOM!', color: 'orange-pink', style: 'burst' },
  { text: 'SHING!', color: 'cyan-purple', style: 'speed' },
];

export const SAMPLE_INITIAL_COMIC: ComicStrip = {
  id: 'sample-comic-1',
  title: 'TITAN VS. CHRONOS',
  subtitle: 'THE MIDNIGHT CLOCKWORK CRISIS',
  seriesTitle: 'ACTION CHRONICLES #1',
  issueNumber: '#1',
  author: 'Comic Studio AI',
  date: 'SEPTEMBER 2026',
  styleId: 'classic-vintage',
  layoutId: 'dynamic-4',
  aspectRatio: '1:1',
  themeColor: 'amber',
  showIssueHeader: true,
  showHalftoneOverlay: true,
  showPaperTexture: true,
  gutterWidth: 12,
  borderWidth: 4,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  originalStory: 'A golden superhero races to stop a time-bending villain atop the city clocktower.',
  panels: [
    {
      id: 'panel-1',
      panelNumber: 1,
      title: 'Midnight Over Gotham',
      scenePrompt: 'Wide aerial view of a dark art deco metropolis at midnight with lightning piercing dark storm clouds, a gothic clock tower glowing with emerald temporal energy, vintage 1960s comic book art style, bold ink lines, Ben-Day dots',
      visualDetails: {
        cameraAngle: 'Wide Establishing Shot',
        mood: 'Ominous & Tense',
        lighting: 'Emerald Temporal Glow & Lightning',
        timeOfDay: 'Midnight',
      },
      caption: 'MIDNIGHT. TIME IS RUNNING OUT FOR THE SLEEPING CITY...',
      captionPosition: 'top-left',
      bubbles: [],
      sfxList: [
        {
          id: 'sfx-1',
          text: 'KRA-BOOM!',
          x: 75,
          y: 20,
          rotation: -12,
          scale: 1.2,
          color: 'yellow-red',
          style: 'burst',
        },
      ],
      imageUrl: '',
      imageStatus: 'idle',
      filterSettings: {
        halftone: true,
        contrast: 110,
        saturation: 110,
        brightness: 100,
        sepia: 10,
        grain: true,
      },
    },
    {
      id: 'panel-2',
      panelNumber: 2,
      title: 'Chronos Schemes',
      scenePrompt: 'Close up of Lord Chronos inside the clock gear room, monocle glowing with brass gears, holding the temporal energy cube with a villainous smile, 1960s vintage comic illustration',
      visualDetails: {
        cameraAngle: 'Dramatic Low Angle Close-up',
        mood: 'Villainous Triumph',
        lighting: 'Warm Brass & Green Reflections',
        timeOfDay: 'Midnight',
      },
      caption: undefined,
      bubbles: [
        {
          id: 'b-1',
          speaker: 'Lord Chronos',
          text: 'Once the clock strikes 12, **TIME ITSELF** will bow to me!',
          type: 'shout',
          x: 74,
          y: 24,
          tailDirection: 'bottom-right',
          fontSize: 'base',
          bold: true,
          uppercase: true,
          characterPosition: 'right',
        },
      ],
      sfxList: [
        {
          id: 'sfx-2',
          text: 'TICK-TOCK',
          x: 80,
          y: 75,
          rotation: 8,
          scale: 0.9,
          color: 'lime-yellow',
          style: 'speed',
        },
      ],
      imageUrl: '',
      imageStatus: 'idle',
      filterSettings: {
        halftone: true,
        contrast: 110,
        saturation: 110,
        brightness: 100,
        sepia: 10,
        grain: true,
      },
    },
    {
      id: 'panel-3',
      panelNumber: 3,
      title: 'Heroic Entry',
      scenePrompt: 'Dynamic comic action angle: Superhero Captain Aegis bursting through the stained glass window with energy shield, colorful glass shards scattering, vintage comic book inking',
      visualDetails: {
        cameraAngle: 'Dynamic Diagonal Action Shot',
        mood: 'High Energy Heroic',
        lighting: 'Blue Plasma Shield Glow',
        timeOfDay: 'Midnight',
      },
      caption: undefined,
      bubbles: [
        {
          id: 'b-2',
          speaker: 'Captain Aegis',
          text: 'Not on *my* watch, **CHRONOS**!',
          type: 'speech',
          x: 26,
          y: 20,
          tailDirection: 'bottom-left',
          fontSize: 'base',
          bold: true,
          characterPosition: 'left',
        },
      ],
      sfxList: [
        {
          id: 'sfx-3',
          text: 'CRASHHH!',
          x: 20,
          y: 75,
          rotation: -15,
          scale: 1.3,
          color: 'orange-pink',
          style: 'burst',
        },
      ],
      imageUrl: '',
      imageStatus: 'idle',
      filterSettings: {
        halftone: true,
        contrast: 115,
        saturation: 115,
        brightness: 100,
        sepia: 5,
        grain: true,
      },
    },
    {
      id: 'panel-4',
      panelNumber: 4,
      title: 'The Showdown',
      scenePrompt: 'Superhero delivers a sonic shield punch knocking the temporal device away from Chronos as the gears shatter into frozen sparks, classic vintage comic book climax panel',
      visualDetails: {
        cameraAngle: 'Climactic Heroic Shot',
        mood: 'Triumphant Climax',
        lighting: 'Explosive Golden Shockwave',
        timeOfDay: 'Midnight',
      },
      caption: 'AND SO THE CITY WAS SAVED ONCE MORE!',
      captionPosition: 'bottom-full',
      bubbles: [
        {
          id: 'b-3',
          speaker: 'Captain Aegis',
          text: "Looks like your time's up!",
          type: 'speech',
          x: 45,
          y: 25,
          tailDirection: 'bottom-left',
          fontSize: 'base',
        },
      ],
      sfxList: [
        {
          id: 'sfx-4',
          text: 'WHAMMM!',
          x: 50,
          y: 50,
          rotation: 0,
          scale: 1.5,
          color: 'yellow-red',
          style: 'burst',
        },
      ],
      imageUrl: '',
      imageStatus: 'idle',
      filterSettings: {
        halftone: true,
        contrast: 120,
        saturation: 120,
        brightness: 100,
        sepia: 10,
        grain: true,
      },
    },
  ],
};
