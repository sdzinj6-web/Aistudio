

import React, { useState, useCallback } from 'react';
// Fix: Changed 'import type' to a regular import for 'AppState' as it is an enum used as a value.
import { AppState, type StoryOption } from './types';
import { generateStoryAndImage, generateSpeech } from './services/geminiService';
import { CHARACTERS, WORLDS, QUESTS } from './constants';
import OptionCard from './components/OptionCard';
import StoryDisplay from './components/StoryDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SELECTION);
  const [selectedCharacter, setSelectedCharacter] = useState<StoryOption | null>(null);
  const [selectedWorld, setSelectedWorld] = useState<StoryOption | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<StoryOption | null>(null);
  
  const [generatedStory, setGeneratedStory] = useState<string>('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  
  const [error, setError] = useState<string>('');

  const handleCreateStory = useCallback(async () => {
    if (!selectedCharacter || !selectedWorld || !selectedQuest) {
      setError('Por favor, escolha um herói, um mundo e uma aventura!');
      return;
    }
    setError('');
    setAppState(AppState.LOADING);
    setGeneratedAudio(null); // Reset audio state

    try {
      const { story, imageUrl } = await generateStoryAndImage(selectedCharacter, selectedWorld, selectedQuest);
      setGeneratedStory(story);
      setGeneratedImageUrl(imageUrl);
      setAppState(AppState.RESULT);

      // Generate audio in the background
      const audioData = await generateSpeech(story);
      setGeneratedAudio(audioData);

    } catch (err) {
      console.error(err);
      setError('Oops! Algo deu errado ao criar a história. Tente novamente!');
      setAppState(AppState.SELECTION);
    }
  }, [selectedCharacter, selectedWorld, selectedQuest]);

  const handleReset = () => {
    setAppState(AppState.SELECTION);
    setSelectedCharacter(null);
    setSelectedWorld(null);
    setSelectedQuest(null);
    setGeneratedStory('');
    setGeneratedImageUrl('');
    setGeneratedAudio(null);
    setError('');
  };

  const renderSelection = () => (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-yellow-500 drop-shadow-lg">Criador de Histórias Mágicas</h1>
        <p className="text-xl md:text-2xl text-cyan-700 mt-2">Vamos criar uma aventura!</p>
      </div>

      {error && <p className="text-center text-red-500 font-bold mb-4">{error}</p>}

      <div className="space-y-8">
        <section className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-lg border-4 border-blue-300">
          <h2 className="text-3xl font-bold text-blue-600 mb-4 text-center">1. Escolha seu Herói</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {CHARACTERS.map(char => (
              <OptionCard key={char.id} option={char} isSelected={selectedCharacter?.id === char.id} onSelect={() => setSelectedCharacter(char)} />
            ))}
          </div>
        </section>

        <section className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-lg border-4 border-green-300">
          <h2 className="text-3xl font-bold text-green-600 mb-4 text-center">2. Escolha um Mundo</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {WORLDS.map(world => (
              <OptionCard key={world.id} option={world} isSelected={selectedWorld?.id === world.id} onSelect={() => setSelectedWorld(world)} />
            ))}
          </div>
        </section>

        <section className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-lg border-4 border-red-300">
          <h2 className="text-3xl font-bold text-red-600 mb-4 text-center">3. Escolha uma Aventura</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {QUESTS.map(quest => (
              <OptionCard key={quest.id} option={quest} isSelected={selectedQuest?.id === quest.id} onSelect={() => setSelectedQuest(quest)} />
            ))}
          </div>
        </section>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleCreateStory}
          disabled={!selectedCharacter || !selectedWorld || !selectedQuest}
          className="text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold rounded-full text-2xl px-12 py-4 transform hover:scale-105 transition-transform duration-300 shadow-xl"
        >
          Criar História!
        </button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-300 to-blue-400 p-4 flex items-center justify-center">
      {appState === AppState.SELECTION && renderSelection()}
      {appState === AppState.LOADING && <LoadingSpinner />}
      {appState === AppState.RESULT && (
        <StoryDisplay 
          story={generatedStory} 
          imageUrl={generatedImageUrl}
          audioData={generatedAudio}
          onReset={handleReset} 
        />
      )}
    </main>
  );
};

export default App;
