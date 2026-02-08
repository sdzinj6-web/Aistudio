

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { PlayIcon, StopIcon, SparklesIcon, ArrowPathIcon } from './icons';

interface StoryDisplayProps {
  story: string;
  imageUrl: string;
  audioData: string | null;
  onReset: () => void;
}

// Helper functions for audio decoding
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(1, frameCount, 24000); // 1 channel, 24000 sampleRate
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}


const StoryDisplay: React.FC<StoryDisplayProps> = ({ story, imageUrl, audioData, onReset }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    // Initialize AudioContext on component mount
    if (!audioContextRef.current) {
        // Fix: Cast window to `any` to allow access to vendor-prefixed webkitAudioContext
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
            audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        } else {
            console.error("Web Audio API is not supported in this browser.");
        }
    }

    // Cleanup on unmount
    return () => {
        if (sourceNodeRef.current) {
            sourceNodeRef.current.stop();
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
    };
  }, []);

  const handlePlayAudio = useCallback(async () => {
    if (!audioData || !audioContextRef.current) return;
    
    if (isPlaying && sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        setIsPlaying(false);
        return;
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    try {
      const decodedBytes = decode(audioData);
      const audioBuffer = await decodeAudioData(decodedBytes, audioContextRef.current);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => {
        setIsPlaying(false);
        sourceNodeRef.current = null;
      };
      source.start();
      sourceNodeRef.current = source;
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  }, [audioData, isPlaying]);


  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8 max-w-3xl w-full border-4 border-yellow-300 animate-fade-in">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-purple-600 flex items-center justify-center gap-3">
        <SparklesIcon className="w-10 h-10" />
        Sua História Mágica!
      </h2>
      <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg mb-6 border-4 border-white">
        <img src={imageUrl} alt="Ilustração da história" className="w-full h-full object-cover" />
      </div>
      <div className="bg-orange-100/50 p-6 rounded-2xl">
        <p className="text-xl md:text-2xl text-gray-800 leading-relaxed whitespace-pre-wrap">{story}</p>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handlePlayAudio}
          disabled={!audioData}
          className="flex items-center justify-center gap-2 w-full sm:w-auto text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-400 font-bold rounded-full text-xl px-8 py-3 transform hover:scale-105 transition-transform duration-300 shadow-lg"
        >
          {isPlaying ? <StopIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6" />}
          {isPlaying ? 'Parar' : 'Ouvir História'}
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 w-full sm:w-auto text-white bg-blue-500 hover:bg-blue-600 font-bold rounded-full text-xl px-8 py-3 transform hover:scale-105 transition-transform duration-300 shadow-lg"
        >
          <ArrowPathIcon className="w-6 h-6" />
          Criar Outra
        </button>
      </div>
    </div>
  );
};

export default StoryDisplay;
