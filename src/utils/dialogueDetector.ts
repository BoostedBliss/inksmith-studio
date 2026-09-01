import React from 'react';
import { SpeechBubble, BubbleType, TailDirection, CharacterPositionAnchor, DetectedDialogue } from '../types';

/**
 * Intelligent regex and heuristic parser to detect dialogues, speakers,
 * emotions, and character spatial positioning from user story/script text.
 */

// Common dialogue speech attribution verbs
const SPEECH_VERBS = [
  'said', 'says', 'yelled', 'yells', 'shouted', 'shouts', 'screamed', 'screams',
  'whispered', 'whispers', 'muttered', 'mutters', 'asked', 'asks', 'replied', 'replies',
  'exclaimed', 'exclaims', 'called', 'calls', 'growled', 'growls', 'laughed', 'laughs',
  'gasped', 'gasps', 'warned', 'warns', 'commanded', 'commands', 'roared', 'roars',
  'snapped', 'snaps', 'cried', 'cries', 'barked', 'barks', 'ordered', 'orders'
];

const THOUGHT_VERBS = ['thought', 'thinks', 'wondered', 'wonders', 'pondered', 'ponders', 'reflected', 'realized'];

/**
 * Parses freeform stories, comic scripts, dialogue lines, and narrative quotes
 * into structured dialogues categorized by suggested panel.
 */
export function parseDialoguesFromText(text: string, targetPanelCount: number = 4): DetectedDialogue[] {
  if (!text || !text.trim()) return [];

  const rawLines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const detected: DetectedDialogue[] = [];

  // Check if text uses explicit panel markers (e.g. PANEL 1, PANEL 2)
  let currentPanelIndex = 0;
  let panelExplicitlyDefined = false;

  // First pass: check for PANEL X headers
  const panelRegex = /^(?:PANEL|SCENE|PAGE)\s*(\d+)[:\s-]*/i;

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];

    // Check if line indicates a new panel
    const panelMatch = line.match(panelRegex);
    if (panelMatch) {
      panelExplicitlyDefined = true;
      const pNum = parseInt(panelMatch[1], 10);
      currentPanelIndex = Math.max(0, Math.min(targetPanelCount - 1, pNum - 1));
      continue;
    }

    // Pattern 1: Script format -> SPEAKER (optional cue/type): "Dialogue" or SPEAKER: Dialogue
    // e.g. "DETECTIVE VANCE (shouting): Stop right there!"
    // e.g. "CHRONOS: Time belongs to me."
    // e.g. "[RADIO] MAYA: We have arrived."
    // e.g. "Dialogue (Lord Chronos - Shout): Once the bell strikes twelve..."
    const scriptFormatRegex = /^(?:Dialogue\s*\(([^)]+)\)\s*:|\[([^\]]+)\]\s*([^:]+):|([A-Z0-9\s._'-]{2,25})\s*(?:\(([^)]+)\))?\s*:)\s*(.+)$/i;
    const scriptMatch = line.match(scriptFormatRegex);

    if (scriptMatch) {
      let speaker = '';
      let cue = '';
      let dialogText = '';

      if (scriptMatch[1]) {
        // Format: Dialogue (Speaker - Type): Text
        const parts = scriptMatch[1].split(/[-–—,]/).map((s) => s.trim());
        speaker = parts[0] || 'Speaker';
        cue = parts[1] || '';
        dialogText = scriptMatch[6] || '';
      } else if (scriptMatch[2]) {
        // Format: [RADIO] SPEAKER: Text
        cue = scriptMatch[2];
        speaker = scriptMatch[3] || 'Radio';
        dialogText = scriptMatch[6] || '';
      } else {
        // Format: SPEAKER (cue): Text
        speaker = scriptMatch[4] || 'Character';
        cue = scriptMatch[5] || '';
        dialogText = scriptMatch[6] || '';
      }

      // Clean dialogue text of outer quotes
      dialogText = cleanQuotes(dialogText);

      if (dialogText.length > 0 && !isNarratorOrScene(speaker)) {
        const { type, bold, italic, uppercase } = classifyDialogueType(dialogText, cue);
        detected.push({
          id: `det-${Date.now()}-${detected.length}`,
          speaker: cleanSpeakerName(speaker),
          text: dialogText,
          type,
          rawLine: line,
          suggestedPanelIndex: currentPanelIndex,
          characterPosition: 'left',
          x: 25,
          y: 20,
          tailDirection: 'bottom-left',
          bold,
          italic,
          uppercase,
        });
        continue;
      }
    }

    // Pattern 2: Narrative quote format with attribution
    // e.g. "We don't have much time," yelled Alex.
    // e.g. Sarah whispered, "Look over there."
    // e.g. "Where did everyone go?" thought Marcus.
    const quoteRegexes = [
      // "Quote text," said Speaker.
      /^[“"']([^”"']{2,200})[”"']\s*[,.-]?\s*([a-zA-Z0-9\s._'-]{2,30})\s+([a-zA-Z]+)(?:\s+.*)?$/i,
      // Speaker said, "Quote text."
      /^([A-Z][a-zA-Z0-9\s._'-]{1,30})\s+([a-zA-Z]+)\s*[,:]\s*[“"']([^”"']{2,200})[”"']$/i,
      // Standalone quoted text: "Quote text!"
      /^[“"']([^”"']{2,200})[”"']$/i,
    ];

    let foundQuote = false;
    for (const qRegex of quoteRegexes) {
      const qMatch = line.match(qRegex);
      if (qMatch) {
        let speaker = 'Character';
        let verb = 'said';
        let dialogText = '';

        if (qMatch.length === 4) {
          if (SPEECH_VERBS.includes(qMatch[3].toLowerCase()) || THOUGHT_VERBS.includes(qMatch[3].toLowerCase())) {
            // Pattern: "Quote", said Speaker
            dialogText = qMatch[1];
            speaker = qMatch[2];
            verb = qMatch[3];
          } else if (SPEECH_VERBS.includes(qMatch[2].toLowerCase()) || THOUGHT_VERBS.includes(qMatch[2].toLowerCase())) {
            // Pattern: Speaker said, "Quote"
            speaker = qMatch[1];
            verb = qMatch[2];
            dialogText = qMatch[3];
          }
        } else if (qMatch.length === 2) {
          // Standalone quote
          dialogText = qMatch[1];
          speaker = 'Speaker';
        }

        if (dialogText) {
          const { type, bold, italic, uppercase } = classifyDialogueType(dialogText, verb);
          detected.push({
            id: `det-${Date.now()}-${detected.length}`,
            speaker: cleanSpeakerName(speaker),
            text: dialogText.trim(),
            type,
            rawLine: line,
            suggestedPanelIndex: currentPanelIndex,
            characterPosition: 'left',
            x: 25,
            y: 20,
            tailDirection: 'bottom-left',
            bold,
            italic,
            uppercase,
          });
          foundQuote = true;
          break;
        }
      }
    }

    if (foundQuote) continue;

    // Pattern 3: Thought in parentheses or asterisks: (I need to find the key...)
    const thoughtMatch = line.match(/^\(([^)]{3,150})\)$/) || line.match(/^\*([^*]{3,150})\*$/);
    if (thoughtMatch) {
      const thoughtText = thoughtMatch[1].trim();
      detected.push({
        id: `det-${Date.now()}-${detected.length}`,
        speaker: 'Inner Thought',
        text: thoughtText,
        type: 'thought',
        rawLine: line,
        suggestedPanelIndex: currentPanelIndex,
        characterPosition: 'center',
        x: 50,
        y: 20,
        tailDirection: 'bottom-left',
        italic: true,
      });
    }
  }

  // If panels were not explicitly defined, distribute detected dialogues across targetPanelCount
  if (!panelExplicitlyDefined && detected.length > 0) {
    const dialoguesPerPanel = Math.max(1, Math.ceil(detected.length / targetPanelCount));
    detected.forEach((d, idx) => {
      d.suggestedPanelIndex = Math.min(targetPanelCount - 1, Math.floor(idx / dialoguesPerPanel));
    });
  }

  // Second pass: Calculate intelligent non-overlapping coordinates relative to characters
  // Group by suggestedPanelIndex and assign alternating Left vs Right positions with matching tails
  assignIntelligentCharacterPositions(detected);

  return detected;
}

/**
 * Assigns smart non-overlapping screen positions and tail directions
 * based on conversation flow and speaker tracking in each panel.
 */
export function assignIntelligentCharacterPositions(dialogues: DetectedDialogue[]) {
  // Group dialogues by panel
  const panelGroups = new Map<number, DetectedDialogue[]>();
  for (const d of dialogues) {
    const list = panelGroups.get(d.suggestedPanelIndex) || [];
    list.push(d);
    panelGroups.set(d.suggestedPanelIndex, list);
  }

  // For each panel, assign character positions and coordinates
  panelGroups.forEach((items) => {
    if (items.length === 1) {
      // Single speaker in panel
      const item = items[0];
      if (item.type === 'thought') {
        item.characterPosition = 'center';
        item.x = 50;
        item.y = 20;
        item.tailDirection = 'bottom-left';
      } else if (item.type === 'shout') {
        item.characterPosition = 'center';
        item.x = 48;
        item.y = 22;
        item.tailDirection = 'bottom-left';
      } else {
        item.characterPosition = 'left';
        item.x = 30;
        item.y = 22;
        item.tailDirection = 'bottom-left';
      }
    } else if (items.length === 2) {
      // 2-Speaker Dialogue: Classic Comic Left-to-Right Conversation Flow
      // Speaker 1 (Left character) -> Upper Left, tail points down-left
      items[0].characterPosition = 'left';
      items[0].x = 26;
      items[0].y = 20;
      items[0].tailDirection = 'bottom-left';

      // Speaker 2 (Right character) -> Upper Right, staggered down, tail points down-right
      items[1].characterPosition = 'right';
      items[1].x = 74;
      items[1].y = 36;
      items[1].tailDirection = 'bottom-right';
    } else if (items.length === 3) {
      // 3-Speaker Dialogue: 3-tier staggered layout
      items[0].characterPosition = 'left';
      items[0].x = 24;
      items[0].y = 16;
      items[0].tailDirection = 'bottom-left';

      items[1].characterPosition = 'right';
      items[1].x = 76;
      items[1].y = 28;
      items[1].tailDirection = 'bottom-right';

      items[2].characterPosition = 'left';
      items[2].x = 32;
      items[2].y = 48;
      items[2].tailDirection = 'bottom-left';
    } else {
      // 4+ speakers: alternate sides and stagger Y coordinates evenly
      items.forEach((item, i) => {
        const isLeft = i % 2 === 0;
        item.characterPosition = isLeft ? 'left' : 'right';
        item.x = isLeft ? 25 : 75;
        item.y = Math.min(80, 14 + i * 18);
        item.tailDirection = isLeft ? 'bottom-left' : 'bottom-right';
      });
    }
  });
}

/**
 * Returns preset coordinates and tail vector for a given character position anchor.
 */
export function getAnchorCoordinates(
  anchor: CharacterPositionAnchor,
  bubbleIndex: number = 0,
  _totalBubbles: number = 1
): { x: number; y: number; tailDirection: TailDirection } {
  const yOffset = bubbleIndex * 15;

  switch (anchor) {
    case 'left':
    case 'top-left':
      return { x: 26, y: Math.min(75, 20 + yOffset), tailDirection: 'bottom-left' };
    case 'right':
    case 'top-right':
      return { x: 74, y: Math.min(75, 24 + yOffset), tailDirection: 'bottom-right' };
    case 'center':
      return { x: 50, y: Math.min(75, 20 + yOffset), tailDirection: 'bottom-left' };
    case 'bottom-left':
      return { x: 26, y: Math.max(25, 75 - yOffset), tailDirection: 'top-left' };
    case 'bottom-right':
      return { x: 74, y: Math.max(25, 75 - yOffset), tailDirection: 'top-right' };
    default:
      return { x: 40, y: 25, tailDirection: 'bottom-left' };
  }
}

/**
 * Convert detected dialogues directly into SpeechBubble objects for a panel.
 */
export function convertDetectedToSpeechBubbles(dialogues: DetectedDialogue[]): SpeechBubble[] {
  return dialogues.map((d) => ({
    id: `b-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    speaker: d.speaker,
    text: d.text,
    type: d.type,
    x: d.x,
    y: d.y,
    tailDirection: d.tailDirection,
    bold: d.bold,
    italic: d.italic,
    uppercase: d.uppercase,
    characterPosition: d.characterPosition,
    fontSize: d.text.length > 80 ? 'sm' : 'base',
  }));
}

// Helpers
function cleanQuotes(str: string): string {
  return str.replace(/^[“"']+|[”"']+$/g, '').trim();
}

function cleanSpeakerName(name: string): string {
  let cleaned = name.replace(/^Dialogue\s*\(|\)$/gi, '').trim();
  cleaned = cleaned.replace(/^(?:speaker|character)\s*[:\-]?\s*/i, '').trim();
  // Capitalize nicely if all caps
  if (cleaned === cleaned.toUpperCase() && cleaned.length > 3) {
    cleaned = cleaned
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }
  return cleaned || 'Character';
}

function isNarratorOrScene(speaker: string): boolean {
  const s = speaker.trim().toLowerCase();
  return (
    s === 'caption' ||
    s === 'narrator' ||
    s === 'scene' ||
    s === 'panel' ||
    s === 'sfx' ||
    s === 'sound' ||
    s === 'description'
  );
}

function classifyDialogueType(
  text: string,
  cue: string = ''
): { type: BubbleType; bold?: boolean; italic?: boolean; uppercase?: boolean } {
  const lowerCue = cue.toLowerCase();
  const lowerText = text.toLowerCase();

  // Radio / Comms check
  if (
    lowerCue.includes('radio') ||
    lowerCue.includes('comms') ||
    lowerCue.includes('intercom') ||
    lowerCue.includes('broadcast') ||
    lowerCue.includes('phone')
  ) {
    return { type: 'radio', bold: true };
  }

  // Thought check
  if (
    lowerCue.includes('thought') ||
    lowerCue.includes('think') ||
    lowerCue.includes('wonder') ||
    lowerCue.includes('internal') ||
    lowerCue.includes('mind')
  ) {
    return { type: 'thought', italic: true };
  }

  // Whisper check
  if (
    lowerCue.includes('whisper') ||
    lowerCue.includes('softly') ||
    lowerCue.includes('quiet') ||
    lowerCue.includes('hushed')
  ) {
    return { type: 'whisper', italic: true };
  }

  // Shout / Scream check
  const isAllUpper = text.length > 4 && text === text.toUpperCase() && /[A-Z]/.test(text);
  const hasExclamations = text.includes('!!') || (text.endsWith('!') && text.length > 20);
  if (
    lowerCue.includes('shout') ||
    lowerCue.includes('scream') ||
    lowerCue.includes('yell') ||
    lowerCue.includes('bellow') ||
    lowerCue.includes('roar') ||
    isAllUpper ||
    hasExclamations
  ) {
    return { type: 'shout', bold: true, uppercase: true };
  }

  return { type: 'speech' };
}

/**
 * Lightweight formatter to render inline markdown-like text inside speech bubbles
 * (**bold**, *italic*, __underline__, ~~strikethrough~~).
 */
export function parseFormattedInline(text: string): React.ReactNode {
  if (!text) return null;

  // Split by inline tags
  // Regex to match **bold**, *italic*, __underline__, ~~strikethrough~~
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|~~[^~]+~~)/g);

  return tokens.map((token, idx) => {
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      return React.createElement(
        'strong',
        { key: idx, className: 'font-black text-black' },
        token.slice(2, -2)
      );
    }
    if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
      return React.createElement(
        'em',
        { key: idx, className: 'italic font-bold' },
        token.slice(1, -1)
      );
    }
    if (token.startsWith('__') && token.endsWith('__') && token.length > 4) {
      return React.createElement(
        'span',
        { key: idx, className: 'underline underline-offset-2 decoration-2' },
        token.slice(2, -2)
      );
    }
    if (token.startsWith('~~') && token.endsWith('~~') && token.length > 4) {
      return React.createElement(
        'span',
        { key: idx, className: 'line-through opacity-80' },
        token.slice(2, -2)
      );
    }
    return token;
  });
}
