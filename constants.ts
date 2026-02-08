
import type { StoryOption } from './types';
import { AstronautIcon, DinosaurIcon, FairyIcon, KnightIcon, PirateIcon, RobotIcon, UnderwaterIcon, CandyIcon, CastleIcon, ForestIcon, SpaceIcon, VolcanoIcon, BirthdayIcon, FriendIcon, PotionIcon, StarIcon, TreasureIcon, DragonIcon } from './components/icons';

export const CHARACTERS: StoryOption[] = [
    { id: 'astronauta', name: 'Astronauta', prompt: 'um astronauta corajoso', icon: AstronautIcon },
    { id: 'dinossauro', name: 'Dinossauro', prompt: 'um dinossauro amigável', icon: DinosaurIcon },
    { id: 'fada', name: 'Fada', prompt: 'uma fada brilhante', icon: FairyIcon },
    { id: 'cavaleiro', name: 'Cavaleiro', prompt: 'um cavaleiro valente', icon: KnightIcon },
    { id: 'pirata', name: 'Pirata', prompt: 'um pirata aventureiro', icon: PirateIcon },
    { id: 'robo', name: 'Robô', prompt: 'um robô super inteligente', icon: RobotIcon },
];

export const WORLDS: StoryOption[] = [
    { id: 'espaco', name: 'Espaço', prompt: 'no espaço sideral cheio de estrelas', icon: SpaceIcon },
    { id: 'floresta', name: 'Floresta', prompt: 'numa floresta encantada com árvores falantes', icon: ForestIcon },
    { id: 'castelo', name: 'Castelo', prompt: 'em um castelo mágico nas nuvens', icon: CastleIcon },
    { id: 'doce', name: 'Terra dos Doces', prompt: 'na Terra dos Doces, com rios de chocolate', icon: CandyIcon },
    { id: 'subaquatico', name: 'Fundo do Mar', prompt: 'no fundo do mar, com peixes coloridos', icon: UnderwaterIcon },
    { id: 'vulcao', name: 'Ilha do Vulcão', prompt: 'numa ilha com um vulcão adormecido', icon: VolcanoIcon },
];

export const QUESTS: StoryOption[] = [
    { id: 'tesouro', name: 'Achar um Tesouro', prompt: 'encontrar um tesouro escondido', icon: TreasureIcon },
    { id: 'amigo', name: 'Salvar um Amigo', prompt: 'salvar um amigo em perigo', icon: FriendIcon },
    { id: 'estrela', name: 'Pegar uma Estrela', prompt: 'pegar uma estrela cadente', icon: StarIcon },
    { id: 'pocao', name: 'Fazer uma Poção', prompt: 'criar uma poção mágica', icon: PotionIcon },
    { id: 'festa', name: 'Organizar uma Festa', prompt: 'organizar a melhor festa de aniversário', icon: BirthdayIcon },
    { id: 'dragao', name: 'Fazer amizade com um Dragão', prompt: 'fazer amizade com um dragão sonolento', icon: DragonIcon },
];
