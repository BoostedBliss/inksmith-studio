import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Lazy initializer for Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', hasKey: Boolean(process.env.GEMINI_API_KEY) });
});

// 2. Story / Script Breakdown into Structured Comic Panels with Automatic Dialogue Detection & Character Positioning
app.post('/api/comic/breakdown', async (req: Request, res: Response) => {
  try {
    const { story, panelCount = 4, styleId = 'classic-vintage', stylePrompt = '' } = req.body;

    if (!story || typeof story !== 'string') {
      return res.status(400).json({ error: 'Story text is required' });
    }

    const ai = getAI();

    const systemInstruction = `You are a master comic book writer, storyboard artist, letterer, and editor.
Your task is to take any story, script, idea, dialogue, or outline from the user and break it down into exactly ${panelCount} sequential, visually striking comic book panels.

CRITICAL INSTRUCTIONS FOR DIALOGUE DETECTION & SPEECH BUBBLES:
- Automatically detect all dialogues, character quotes, shouted lines, whispers, thoughts, and speaker interactions in the input.
- Assign each dialogue line to its correct speaker.
- Format text with basic styling tags or flags (e.g. bold for shouted/key words or hero lines, italic for thoughts/whispers/telepathy, uppercase for shouts/yells).
- POSITION SPEECH BUBBLES RELATIVE TO CHARACTERS IN THE SCENE:
  * For a character positioned on the LEFT side of the panel, place their bubble in the upper-left (x: 22 to 32, y: 16 to 24) with tailDirection: "bottom-left" pointing directly toward their head/mouth.
  * For a character positioned on the RIGHT side of the panel, place their bubble in the upper-right (x: 68 to 78, y: 24 to 38) with tailDirection: "bottom-right" pointing directly toward their head/mouth.
  * For center/hero close-ups, place bubble at x: 45 to 55, y: 16 to 22 with tailDirection: "bottom-left".
  * When two characters speak in the same panel, ALWAYS stagger their bubbles vertically and horizontally (Left speaker at x: 26, y: 18; Right speaker at x: 74, y: 34) so they NEVER overlap and follow standard Left-to-Right comic reading order.

For each panel, you must provide:
1. "panelNumber": index 1 to ${panelCount}
2. "title": Short punchy panel title (e.g. "The Midnight Discovery", "Hero's Entry")
3. "scenePrompt": A vivid, highly detailed visual art prompt describing character positions (e.g. "Detective Vance on the left, villain Chronos on the right"), actions, expressions, camera angle, lighting, background, and environment suitable for an AI image generator in the requested style (${stylePrompt || styleId}). Include character consistency guidelines.
4. "visualDetails": Object with "cameraAngle", "mood", "lighting", "timeOfDay".
5. "caption": Optional narrator voiceover box (e.g. "MEANWHILE IN THE SEWERS...", "A THOUSAND MILES AWAY..."). Use null or empty string if not needed.
6. "captionPosition": One of "top-left", "top-right", "bottom-left", "bottom-right", "top-full", "bottom-full".
7. "bubbles": Array of speech/thought/shout bubbles detected or scripted for this panel. Each bubble has:
   - "id": unique string (e.g. "b-1")
   - "speaker": Character name (e.g. "Captain Aegis")
   - "text": Authentic comic dialogue (1-2 sentences max)
   - "type": "speech" | "thought" | "shout" | "whisper" | "radio"
   - "x": percentage 15-80 (horizontal placement)
   - "y": percentage 15-75 (vertical placement)
   - "tailDirection": "bottom-left" | "bottom-right" | "top-left" | "top-right" | "left" | "right" | "none"
   - "bold": boolean (true for shouting, key emphasis, action commands)
   - "italic": boolean (true for thoughts, whispers, inner monologues)
   - "uppercase": boolean (true for loud shouting or aggressive speech)
   - "fontSize": "xs" | "sm" | "base" | "lg" | "xl"
   - "characterPosition": "left" | "right" | "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right"
8. "sfxList": Array of comic sound effects (onomatopoeia). Each has:
   - "id": unique string (e.g. "sfx-1")
   - "text": Sound effect string (e.g. "KABOOM!", "POW!", "WHAM!", "ZAP!", "CLICK!", "SWOOSH!", "GASP!", "THUD!")
   - "x": percentage 15-85
   - "y": percentage 15-85
   - "rotation": angle -30 to 30
   - "scale": number 0.8 to 1.6
   - "color": "yellow-red" | "cyan-purple" | "lime-yellow" | "orange-pink" | "white-black" | "red-orange"
   - "style": "burst" | "action" | "electric" | "speed" | "clean"

Also provide comic-level metadata:
- "title": Grand comic book title (e.g. "THE CHRONICLES OF NEON CITY")
- "subtitle": Short dramatic tagline or episode title
- "seriesTitle": Comic book series banner (e.g. "ACTION COMICS", "WEIRD TALES", "SUPERNOVA #1")
- "issueNumber": e.g. "#1" or "#42"
- "themeColor": "amber" | "cyan" | "red" | "purple" | "emerald" | "monochrome"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `Please convert this story into an authentic ${panelCount}-panel comic book script with automatically detected and formatted speech bubbles properly anchored to characters:\n\n"""\n${story}\n"""\n\nArt Style: ${styleId} (${stylePrompt})`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            seriesTitle: { type: Type.STRING },
            issueNumber: { type: Type.STRING },
            themeColor: { type: Type.STRING },
            panels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  panelNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  scenePrompt: { type: Type.STRING },
                  characterDescriptions: { type: Type.STRING },
                  visualDetails: {
                    type: Type.OBJECT,
                    properties: {
                      cameraAngle: { type: Type.STRING },
                      mood: { type: Type.STRING },
                      lighting: { type: Type.STRING },
                      timeOfDay: { type: Type.STRING },
                    },
                    required: ['cameraAngle', 'mood', 'lighting', 'timeOfDay'],
                  },
                  caption: { type: Type.STRING },
                  captionPosition: { type: Type.STRING },
                  bubbles: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        speaker: { type: Type.STRING },
                        text: { type: Type.STRING },
                        type: { type: Type.STRING },
                        x: { type: Type.NUMBER },
                        y: { type: Type.NUMBER },
                        tailDirection: { type: Type.STRING },
                        bold: { type: Type.BOOLEAN },
                        italic: { type: Type.BOOLEAN },
                        uppercase: { type: Type.BOOLEAN },
                        fontSize: { type: Type.STRING },
                        characterPosition: { type: Type.STRING },
                      },
                      required: ['id', 'speaker', 'text', 'type', 'x', 'y', 'tailDirection'],
                    },
                  },
                  sfxList: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        text: { type: Type.STRING },
                        x: { type: Type.NUMBER },
                        y: { type: Type.NUMBER },
                        rotation: { type: Type.NUMBER },
                        scale: { type: Type.NUMBER },
                        color: { type: Type.STRING },
                        style: { type: Type.STRING },
                      },
                      required: ['id', 'text', 'x', 'y', 'rotation', 'scale', 'color', 'style'],
                    },
                  },
                },
                required: ['panelNumber', 'title', 'scenePrompt', 'visualDetails', 'bubbles', 'sfxList'],
              },
            },
          },
          required: ['title', 'seriesTitle', 'panels'],
        },
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in /api/comic/breakdown:', error);
    return res.status(500).json({
      error: 'Failed to break down script',
    });
  }
});

// Dedicated Real-time Dialogue Detection Endpoint
app.post('/api/comic/detect-dialogue', async (req: Request, res: Response) => {
  try {
    const { text, panelCount = 4 } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const ai = getAI();
    const prompt = `Analyze this story or script text and extract all dialogue lines, thoughts, whispers, and radio speech.
For each dialogue line detected:
1. Identify the speaker name.
2. Extract the dialogue text.
3. Determine type: "speech" | "thought" | "shout" | "whisper" | "radio".
4. Determine suggested panel index (0 to ${panelCount - 1}).
5. Suggest character screen position ("left", "right", or "center").
6. Set appropriate coordinates (e.g. Left character at x: 26, y: 20, tailDirection: "bottom-left"; Right character at x: 74, y: 35, tailDirection: "bottom-right").
7. Set formatting flags: bold, italic, uppercase.

Text:
"""
${text}
"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dialogues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  speaker: { type: Type.STRING },
                  text: { type: Type.STRING },
                  type: { type: Type.STRING },
                  suggestedPanelIndex: { type: Type.INTEGER },
                  characterPosition: { type: Type.STRING },
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  tailDirection: { type: Type.STRING },
                  bold: { type: Type.BOOLEAN },
                  italic: { type: Type.BOOLEAN },
                  uppercase: { type: Type.BOOLEAN },
                },
                required: ['id', 'speaker', 'text', 'type', 'suggestedPanelIndex', 'x', 'y', 'tailDirection'],
              },
            },
          },
          required: ['dialogues'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{"dialogues":[]}');
    return res.json({ success: true, dialogues: parsed.dialogues || [] });
  } catch (error: any) {
    console.error('Error in /api/comic/detect-dialogue:', error);
    return res.status(500).json({ error: 'Dialogue detection failed' });
  }
});

// 3. Generate Panel Illustration Image
app.post('/api/comic/generate-panel', async (req: Request, res: Response) => {
  try {
    const { prompt, stylePrompt = '', aspectRatio = '1:1' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getAI();
    const fullPrompt = `${prompt}. Style guidelines: ${stylePrompt}. Masterpiece comic book panel illustration, crisp clear ink lines, dynamic composition, graphic novel artwork, high detail, no watermark, no text overlays in artwork.`;

    // Attempt generation with Gemini image model
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: fullPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio === '16:9' ? '16:9' : aspectRatio === '4:3' ? '4:3' : aspectRatio === '3:4' ? '3:4' : '1:1',
          },
        },
      });

      let imageUrl: string | null = null;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (imageUrl) {
        return res.json({ success: true, imageUrl, isAI: true });
      }
    } catch (imageErr: any) {
      console.warn('Gemini image model call returned error or requires specific paid quota:', imageErr?.message);
    }

    // Fallback: Return structured SVG or stylized comic generator
    return res.json({
      success: true,
      imageUrl: null,
      fallbackNeeded: true,
      message: 'Gemini image generation standard fallback activated',
    });
  } catch (error: any) {
    console.error('Error in /api/comic/generate-panel:', error);
    return res.status(500).json({ error: 'Image generation failed' });
  }
});

// 4. Enhance or Expand One-Line Story / Idea into Comic Script
app.post('/api/comic/enhance-script', async (req: Request, res: Response) => {
  try {
    const { idea, genre = 'Superhero', panelCount = 4 } = req.body;

    if (!idea) {
      return res.status(400).json({ error: 'Idea is required' });
    }

    const ai = getAI();
    const prompt = `You are an award-winning comic book writer.
Take this short idea/premise: "${idea}"
Genre: ${genre}
Expand it into an engaging, dramatic, or hilarious ${panelCount}-panel comic book script with vivid visual descriptions, punchy character dialogues, narrator captions, and dramatic sound effects. Format clearly with PANEL 1, PANEL 2, etc.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
    });

    return res.json({ success: true, script: response.text || '' });
  } catch (error: any) {
    console.error('Error in /api/comic/enhance-script:', error);
    return res.status(500).json({ error: 'Script enhancement failed' });
  }
});

// 5. Speech Audio Generation (TTS) for Panel Narration & Dialogue
app.post('/api/comic/tts', async (req: Request, res: Response) => {
  try {
    const { text, voiceName = 'Kore' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: `Say in dramatic comic book style: ${text}` }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ success: true, audioData: base64Audio });
    }
    return res.status(404).json({ error: 'Audio not generated' });
  } catch (error: any) {
    console.error('TTS error:', error);
    return res.status(500).json({ error: 'TTS generation failed' });
  }
});

// Vite middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Comic Strip Generator Server running on http://localhost:${PORT}`);
  });
}

startServer();
