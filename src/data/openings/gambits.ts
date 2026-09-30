import { OpeningVariant } from '../../types';

export const GAMBITS_OPENINGS: OpeningVariant[] = [
  {
    id: 'kings-gambit',
    openingName: 'King\'s Gambit',
    name: 'King\'s Knight Variation',
    category: 'Gambits & Tactical Attacks',
    description: 'The soul of Romantic chess! White sacrifices the f-pawn on move 2 to rip open the f-file and seize complete central control.',
    side: 'white',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: 'White initiates with the King\'s pawn.' },
      { from: 'e7', to: 'e5', notation: 'e5', comment: 'Black responds symmetrically.' },
      { from: 'f2', to: 'f4', notation: 'f4', comment: 'The King\'s Gambit! Sacrificing the flank pawn to eliminate e5.' },
      { from: 'e5', to: 'f4', notation: 'exf4', comment: 'Black accepts the gambit pawn.' },
      { from: 'g1', to: 'f3', notation: 'Nf3', comment: 'Preventing dangerous ...Qh4+ checks and developing the knight.' },
      { from: 'g7', to: 'g5', notation: 'g5', comment: 'Classical defense: Black tries to hold onto the gambit pawn.' },
      { from: 'f1', to: 'c4', notation: 'Bc4', comment: 'The bishop aims squarely at Black\'s sensitive f7 square.' },
      { from: 'f8', to: 'g7', notation: 'Bg7', comment: 'Black defends the g5 pawn with the bishop.' },
      { from: 'e1', to: 'g1', notation: 'O-O', comment: 'White castles, placing the rook on the half-open f-file.' },
      { from: 'd7', to: 'd6', notation: 'd6', comment: 'Solidifying Black\'s pawn fortress.' },
      { from: 'd2', to: 'd4', notation: 'd4', comment: 'White takes absolute domination of the center.' },
      { from: 'h7', to: 'h6', notation: 'h6', comment: 'Black braces the pawn chain on the kingside.' }
    ]
  },
  {
    id: 'danish-gambit',
    openingName: 'Danish Gambit',
    name: 'Accepted Variation',
    category: 'Gambits & Tactical Attacks',
    description: 'White sacrifices two full pawns to set up a terrifying battery of bishops cross-firing along the kingside diagonals.',
    side: 'white',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: 'Opening with the King\'s pawn.' },
      { from: 'e7', to: 'e5', notation: 'e5', comment: 'Black stakes out the center.' },
      { from: 'd2', to: 'd4', notation: 'd4', comment: 'Center Game: immediate pawn strike.' },
      { from: 'e5', to: 'd4', notation: 'exd4', comment: 'Black captures in the center.' },
      { from: 'c2', to: 'c3', notation: 'c3', comment: 'The Danish Gambit! Offering a second pawn for development.' },
      { from: 'd4', to: 'c3', notation: 'dxc3', comment: 'Black accepts the second pawn.' },
      { from: 'f1', to: 'c4', notation: 'Bc4', comment: 'White ignores the pawn on c3 to laser the f7 weakness.' },
      { from: 'c3', to: 'b2', notation: 'cxb2', comment: 'Black captures a third pawn on b2.' },
      { from: 'c1', to: 'b2', notation: 'Bxb2', comment: 'The ultimate diagonal crossfire! Both bishops slice through Black\'s position.' }
    ]
  },
  {
    id: 'smith-morra-gambit',
    openingName: 'Smith-Morra Gambit',
    name: 'Accepted Line',
    category: 'Gambits & Tactical Attacks',
    description: 'White meets the Sicilian Defense by sacrificing a pawn on move 2 to open the c- and d-files for relentless initiative.',
    side: 'white',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: 'White opens with 1.e4.' },
      { from: 'c7', to: 'c5', notation: 'c5', comment: 'The Sicilian Defense.' },
      { from: 'd2', to: 'd4', notation: 'd4', comment: 'The Smith-Morra strike!' },
      { from: 'c5', to: 'd4', notation: 'cxd4', comment: 'Black takes the central pawn.' },
      { from: 'c2', to: 'c3', notation: 'c3', comment: 'Offering the gambit pawn to accelerate development.' },
      { from: 'd4', to: 'c3', notation: 'dxc3', comment: 'Black accepts the gambit.' },
      { from: 'b1', to: 'c3', notation: 'Nxc3', comment: 'White develops the knight with tempo, opening the c- and d-files.' },
      { from: 'b8', to: 'c6', notation: 'Nc6', comment: 'Black develops naturally.' },
      { from: 'g1', to: 'f3', notation: 'Nf3', comment: 'Developing the kingside knight.' },
      { from: 'd7', to: 'd6', notation: 'd6', comment: 'Solidifying control over e5.' },
      { from: 'f1', to: 'c4', notation: 'Bc4', comment: 'The bishop occupies the active attacking diagonal aiming at f7.' },
      { from: 'e7', to: 'e6', notation: 'e6', comment: 'Black creates a barrier blunting the bishop.' },
      { from: 'e1', to: 'g1', notation: 'O-O', comment: 'White castles, ready to swing rooks to c1 and d1.' }
    ]
  }
];
