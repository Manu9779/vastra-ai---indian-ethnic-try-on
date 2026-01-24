
import { GoogleGenAI, Type } from "@google/genai";
import { BodyAnalysis, Gender, CameraAngle } from "../types";

const parseImageData = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(image\/[a-z]+);base64,(.+)$/);
  if (!match) return { mimeType: 'image/jpeg', data: dataUrl };
  return { mimeType: match[1], data: match[2] };
};

export const analyzeUserImage = async (base64Image: string): Promise<BodyAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const { data, mimeType } = parseImageData(base64Image.includes('base64,') ? base64Image : `data:image/jpeg;base64,${base64Image}`);

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data, mimeType } },
        { text: "Analyze this professional portrait for fashion metadata. Return JSON with: 1. gender (Male/Female). 2. skinTone (descriptive). 3. bodyShape (Hourglass, Pear, Rectangle, Inverted Triangle, Apple, Athletic). 4. detectedFeatures (array of strings like 'broad shoulders', 'slender')." }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          gender: { type: Type.STRING, enum: ['Male', 'Female', 'Unspecified'] },
          skinTone: { type: Type.STRING },
          bodyShape: { type: Type.STRING },
          detectedFeatures: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['gender', 'skinTone', 'bodyShape', 'detectedFeatures']
      }
    }
  });

  const analysis = JSON.parse(response.text || '{}');
  return { ...analysis, gender: (analysis.gender || 'Unspecified') as Gender };
};

export const generateClothingImage = async (prompt: string, colorPrompt?: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `Commercial high-end fashion catalog photography. A premium ${colorPrompt || ''} ${prompt} on a minimalist neutral studio background. 8k resolution, sharp focus on luxury textile weave.` },
      ],
    },
    config: { imageConfig: { aspectRatio: "3:4" } }
  });

  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (!part?.inlineData) throw new Error("Our design studio restricted this prompt.");
  return `data:image/png;base64,${part.inlineData.data}`;
};

export const generateTryOnImage = async (
  userBase64: string, 
  items: string[], 
  angle: CameraAngle = 'Front',
  analysis: BodyAnalysis | null = null,
  colorPrompt?: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const { data, mimeType } = parseImageData(userBase64.includes('base64,') ? userBase64 : `data:image/jpeg;base64,${userBase64}`);
  
  const angleDetails: Record<CameraAngle, string> = {
    'Front': 'Symmetrical frontal editorial pose.',
    'Side': 'Refined 90-degree profile fashion view.',
    'Back': 'Rear architectural perspective of the garment.',
    'Close-up Detail': 'Macro focus on embroidery, fabric texture, and lighting highlights.',
    '360 View': 'A high-fashion quad-composite layout showing four different model angles.'
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data, mimeType } },
        {
          text: `HIGH-FIDELITY VIRTUAL TRY-ON INSTRUCTION:
          MISSION: Photorealistically integrate the following premium ethnic attire onto the human subject in the provided photo: ${colorPrompt || ''} ${items.join(" and ")}.
          
          CORE CONSTRAINTS:
          1. EXACT SKIN TONE: You MUST retain the subject's precise original skin tone, complexion, and subsurface scattering characteristics. Do not lighten, darken, or alter their natural ethnicity.
          2. LIGHTING HARMONIZATION: Match the directional lighting, shadows, and color temperature of the source photo perfectly. The garment must appear to be lit by the same light sources as the person's face.
          3. SEAMLESS BLENDING: Ensure soft, natural shadows where fabric meets skin (necklines, sleeves, hem).
          4. SILHOUETTE CALIBRATION: Drape the fabric to naturally follow the subject's ${analysis?.bodyShape || 'detected'} body shape and current pose.
          
          STYLE: Professional fashion editorial. High identity retention. 8k resolution.
          PERSPECTIVE: ${angleDetails[angle]}`,
        },
      ],
    },
    config: { 
      imageConfig: { 
        aspectRatio: angle === '360 View' ? "16:9" : "3:4" 
      } 
    }
  });

  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (!part?.inlineData) throw new Error("AI Drape Refinement failed. Please ensure your portrait is well-lit and unobstructed.");
  return `data:image/png;base64,${part.inlineData.data}`;
};
