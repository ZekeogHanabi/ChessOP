import { OpeningCategory, OpeningVariant } from '../../types';

export interface OpeningInfo {
  description: string;
  side: 'white' | 'black';
  category: OpeningCategory;
}

export const OPENING_METADATA: Record<string, OpeningInfo> = {
  'Sicilian Defense': {
    description: 'The most popular and sharp response to 1.e4. Black fights for the center asymmetrically, creating dynamic, double-edged counterplay.',
    side: 'black',
    category: '1.e4 Asymmetric Defenses'
  },
  'French Defense': {
    description: 'A solid and strategic defense based on an ironclad central pawn chain (e6-d5) with sharp counterattacks against White\'s d4 center.',
    side: 'black',
    category: '1.e4 Asymmetric Defenses'
  },
  'Caro-Kann Defense': {
    description: 'One of the most resilient defenses against 1.e4. Black prepares ...d5 with ...c6, developing the light-squared bishop outside the pawn chain.',
    side: 'black',
    category: '1.e4 Asymmetric Defenses'
  },
  'Ruy Lopez': {
    description: 'The Spanish Game, the bedrock of classical chess strategy. White pressures Black\'s e5 pawn anchor and maneuvers for lasting central initiative.',
    side: 'white',
    category: '1.e4 Open Games'
  },
  'Italian Game': {
    description: 'One of the oldest and richest openings. White develops the bishop to c4 aiming at the sensitive f7 square, building harmonious piece play.',
    side: 'white',
    category: '1.e4 Open Games'
  },
  'Two Knights Defense': {
    description: 'An aggressive, tactical battlefield where Black immediately counterattacks e4 on move 3, leading to famous clashes like the Fried Liver.',
    side: 'white',
    category: '1.e4 Open Games'
  },
  'Scotch Game': {
    description: 'White breaks open the center on move 3 with d4, accelerating piece development and seizing active lines for dynamic attacks.',
    side: 'white',
    category: '1.e4 Open Games'
  },
  'Vienna Game': {
    description: 'A practical, active-recall repertoire for the Vienna Game (1.e4 e5 2.Nc3). Master the signature Vienna Gambit and major variations.',
    side: 'white',
    category: '1.e4 Open Games'
  },
  "Queen's Gambit Declined": {
    description: 'The golden standard of classical 1.d4 theory. Black anchors the center with ...e6 and ...d5, absorbing White\'s initiative and contesting key files.',
    side: 'white',
    category: '1.d4 Systems & Classical'
  },
  'London System': {
    description: 'A universal, rock-solid setup for White. White develops the dark-squared bishop to f4 before playing e3, erecting an impenetrable pawn pyramid.',
    side: 'white',
    category: '1.d4 Systems & Classical'
  },
  "King's Indian Defense": {
    description: 'The hypermodern counterattacking weapon. Black cedes central space to lock it with ...e5, then launches a ferocious kingside attack with ...f5.',
    side: 'black',
    category: '1.d4 Systems & Classical'
  },
  'Slav Defense': {
    description: 'The granite defense against 1.d4. Black supports d5 with 2...c6, keeping the diagonal open to develop the light bishop before playing ...e6.',
    side: 'black',
    category: '1.d4 Systems & Classical'
  },
  "King's Gambit": {
    description: 'The immortal Romantic weapon. White sacrifices the f-pawn on move 2 to rip open the f-file and dominate the center with tactical fireworks.',
    side: 'white',
    category: 'Gambits & Tactical Attacks'
  },
  'Danish Gambit': {
    description: 'A thrilling Romantic sacrifice of two pawns to establish a devastating pair of bishops slicing through Black\'s uncastled kingside.',
    side: 'white',
    category: 'Gambits & Tactical Attacks'
  },
  'Smith-Morra Gambit': {
    description: 'An aggressive sacrificial weapon against the Sicilian. White sacrifices the c-pawn to seize open c- and d-files for relentless initiative.',
    side: 'white',
    category: 'Gambits & Tactical Attacks'
  }
};

export const getOpeningMetadata = (
  openingName: string,
  fallbackVariant?: OpeningVariant
): OpeningInfo => {
  if (OPENING_METADATA[openingName]) {
    return OPENING_METADATA[openingName];
  }
  return {
    description: fallbackVariant?.description || 'Practice theoretical lines and variations for this opening repertoire.',
    side: fallbackVariant?.side || 'white',
    category: (fallbackVariant?.category as OpeningCategory) || '1.e4 Open Games'
  };
};
