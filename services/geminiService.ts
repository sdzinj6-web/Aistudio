
import { GoogleGenAI, Modality } from "@google/genai";
import type { StoryOption } from './types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateStoryAndImage = async (
  character: StoryOption,
  world: StoryOption,
  quest: StoryOption
): Promise<{ story: string; imageUrl: string }> => {

  const textModel = 'gemini-3-flash-preview';
  const imageModel = 'gemini-2.5-flash-image';
  
  // 1. Generate Story Text
  const storyPrompt = `Escreva uma história infantil muito curta, simples e alegre para uma criança de 5 anos. O herói é ${character.prompt}. A história acontece ${world.prompt}. A aventura do herói é ${quest.prompt}. A história deve ser mágica e divertida, com um final feliz. Mantenha o texto com menos de 150 palavras.`;

  const storyResponsePromise = ai.models.generateContent({
    model: textModel,
    contents: storyPrompt
  });

  // 2. Generate Story Image
  const imagePrompt = `Uma ilustração de desenho animado fofa e vibrante para um livro de histórias infantil. ${character.prompt} ${world.prompt} em uma missão para ${quest.prompt}. Estilo de arte simples, colorido e chapado, como um adesivo.`;
  
  const imageResponsePromise = ai.models.generateContent({
      model: imageModel,
      contents: {
          parts: [{ text: imagePrompt }],
      },
  });

  // Await both promises
  const [storyResponse, imageResponse] = await Promise.all([storyResponsePromise, imageResponsePromise]);

  const story = storyResponse.text;
  if (!story) {
    throw new Error("Falha ao gerar o texto da história.");
  }

  let imageUrl = '';
  if (imageResponse.candidates && imageResponse.candidates[0].content.parts) {
      for (const part of imageResponse.candidates[0].content.parts) {
          if (part.inlineData) {
              const base64EncodeString = part.inlineData.data;
              imageUrl = `data:image/png;base64,${base64EncodeString}`;
              break; 
          }
      }
  }

  if (!imageUrl) {
    throw new Error("Falha ao gerar a imagem da história.");
  }
  
  return { story, imageUrl };
};

export const generateSpeech = async (text: string): Promise<string> => {
    const ttsModel = "gemini-2.5-flash-preview-tts";

    const response = await ai.models.generateContent({
        model: ttsModel,
        contents: [{ parts: [{ text: `Diga com uma voz amigável e animada: ${text}` }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Puck' },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
        throw new Error("Falha ao gerar o áudio.");
    }

    return base64Audio;
};
