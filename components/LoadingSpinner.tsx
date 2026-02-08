
import React from 'react';
import { SparklesIcon } from './icons';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-white text-center">
        <SparklesIcon className="w-24 h-24 text-yellow-300 animate-spin-slow mb-4" />
        <h2 className="text-3xl font-bold drop-shadow-lg">A mágica está acontecendo...</h2>
        <p className="text-xl mt-2 drop-shadow-md">Criando sua aventura!</p>
    </div>
  );
};

export default LoadingSpinner;

