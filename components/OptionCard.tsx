
import React from 'react';
import type { StoryOption } from '../types';

interface OptionCardProps {
  option: StoryOption;
  isSelected: boolean;
  onSelect: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({ option, isSelected, onSelect }) => {
  const baseClasses = "flex flex-col items-center justify-center p-4 rounded-2xl cursor-pointer transform transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1";
  const selectedClasses = "bg-yellow-300 border-4 border-yellow-500 scale-105";
  const unselectedClasses = "bg-white/80 border-2 border-transparent hover:border-yellow-400";
  
  return (
    <div
      onClick={onSelect}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
    >
      <option.icon className="w-16 h-16 mb-2 text-gray-700" />
      <span className="text-center font-bold text-gray-800">{option.name}</span>
    </div>
  );
};

export default OptionCard;
