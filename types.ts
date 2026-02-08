
// Fix: Added import for React types to resolve namespace error.
import type React from 'react';

export interface StoryOption {
    id: string;
    name: string;
    prompt: string;
    icon: React.ComponentType<{ className?: string }>;
}

export enum AppState {
    SELECTION,
    LOADING,
    RESULT
}
