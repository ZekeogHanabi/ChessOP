import { OpeningVariant } from '../../types';

export const E4_ASYMMETRIC_OPENINGS: OpeningVariant[] = [
  {
    id: 'sicilian-najdorf',
    openingName: 'Sicilian Defense',
    name: 'Najdorf Variation',
    category: '1.e4 Asymmetric Defenses',
    description: 'One of the sharpest and most popular responses to 1.e4. Black seeks double-edged counterplay by controlling d4 and expanding on the queenside.',
    side: 'black',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: 'White occupies the center and prepares kingside development.' },
      { from: 'c7', to: 'c5', notation: 'c5', comment: 'The Sicilian! Black fights for the center asymmetrically, controlling d4.' },
      { from: 'g1', to: 'f3', notation: 'Nf3', comment: 'Classic knight development preparing the d2-d4 pawn break.' },
      { from: 'd7', to: 'd6', notation: 'd6', comment: 'Controlling e5 and opening the c8-h3 diagonal for the bishop.' },
      { from: 'd2', to: 'd4', notation: 'd4', comment: 'White breaks open the center to accelerate piece activity.' },
      { from: 'c5', to: 'd4', notation: 'cxd4', comment: 'Black trades the flank c-pawn for White\'s central d-pawn.' },
      { from: 'f3', to: 'd4', notation: 'Nxd4', comment: 'White recaptures with the knight, centralizing it.' },
      { from: 'g8', to: 'f6', notation: 'Nf6', comment: 'Developing the knight, hitting the undefended e4 pawn, and forcing Nc3.' },
      { from: 'b1', to: 'c3', notation: 'Nc3', comment: 'White defends e4 and develops another minor piece.' },
      { from: 'a7', to: 'a6', notation: 'a6', comment: 'The Najdorf hallmark! Prevents Nb5 and Bb5+ while preparing ...b5 queenside expansion.' }
    ]
  },
  {
    id: 'sicilian-dragon',
    openingName: 'Sicilian Defense',
    name: 'Dragon Variation',
    category: '1.e4 Asymmetric Defenses',
    description: 'The ferocious Dragon! Black fianchettoes the dark-squared bishop along the long h8-a1 diagonal, leading to sharp opposite-side castling battles.',
    side: 'black',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: 'White opens with the King\'s pawn.' },
      { from: 'c7', to: 'c5', notation: 'c5', comment: 'Black initiates the Sicilian asymmetry.' },
      { from: 'g1', to: 'f3', notation: 'Nf3', comment: 'Preparing the central d4 strike.' },
      { from: 'd7', to: 'd6', notation: 'd6', comment: 'Sound defense preventing e4-e5 advances.' },
      { from: 'd2', to: 'd4', notation: 'd4', comment: 'Opening lines in the center.' },
      { from: 'c5', to: 'd4', notation: 'cxd4', comment: 'Exchanging flank pawn for central pawn.' },
      { from: 'f3', to: 'd4', notation: 'Nxd4', comment: 'Recapturing toward the center.' },
      { from: 'g8', to: 'f6', notation: 'Nf6', comment: 'Developing with tempo against e4.' },
      { from: 'b1', to: 'c3', notation: 'Nc3', comment: 'Defending the central pawn.' },
      { from: 'g7', to: 'g6', notation: 'g6', comment: 'The Dragon sign! Preparing to unleash the monstrous dark-squared bishop.' },
      { from: 'c1', to: 'e3', notation: 'Be3', comment: 'White sets up the aggressive Yugoslav Attack.' },
      { from: 'f8', to: 'g7', notation: 'Bg7', comment: 'The Dragon Bishop takes its post on the long diagonal.' },
      { from: 'f2', to: 'f3', notation: 'f3', comment: 'Solidifying e4 and preparing g4-h4 pawn storms.' },
      { from: 'e8', to: 'g8', notation: 'O-O', comment: 'Black castles into safety before launching the counterattack.' },
      { from: 'd1', to: 'd2', notation: 'Qd2', comment: 'Forming the queen-bishop battery to challenge Black\'s dragon bishop.' },
      { from: 'b8', to: 'c6', notation: 'Nc6', comment: 'Developing the knight and piling pressure onto d4 and the c-file.' }
    ]
  },
  {
    id: 'sicilian-alapin',
    openingName: 'Sicilian Defense',
    name: 'Alapin Variation',
    category: '1.e4 Asymmetric Defenses',
    description: 'A solid and principled anti-Sicilian weapon for White. White plays 2.c3 to establish a full pawn center with d2-d4.',
    side: 'white',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: 'White claims central space.' },
      { from: 'c7', to: 'c5', notation: 'c5', comment: 'Black adopts the Sicilian Defense.' },
      { from: 'c2', to: 'c3', notation: 'c3', comment: 'The Alapin! Preparing d2-d4 to build a massive classical pawn center.' },
      { from: 'd7', to: 'd5', notation: 'd5', comment: 'Black counterattacks in the center immediately.' },
      { from: 'e4', to: 'd5', notation: 'exd5', comment: 'Liquidating the central tension.' },
      { from: 'd8', to: 'd5', notation: 'Qxd5', comment: 'Black recaptures with the Queen.' },
      { from: 'd2', to: 'd4', notation: 'd4', comment: 'White establishes a strong central foothold.' },
      { from: 'g8', to: 'f6', notation: 'Nf6', comment: 'Black develops smoothly, eyeing the d4 pawn.' },
      { from: 'g1', to: 'f3', notation: 'Nf3', comment: 'Developing the kingside knight and supporting d4.' },
      { from: 'c8', to: 'g4', notation: 'Bg4', comment: 'Black pins the f3 knight to weaken White\'s control over d4.' },
      { from: 'f1', to: 'e2', notation: 'Be2', comment: 'Unpinning the knight and preparing kingside castling.' },
      { from: 'e7', to: 'e6', notation: 'e6', comment: 'Solidifying Black\'s position and opening lines for the dark bishop.' }
    ]
  },
  {
    id: 'french-winawer',
    openingName: 'French Defense',
    name: 'Winawer Variation',
    category: '1.e4 Asymmetric Defenses',
    description: 'A sharp and tactical counter to 3.Nc3. Black pins the knight with 3...Bb4, leading to unbalanced pawn structures and sharp imbalances.',
    side: 'black',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: 'White initiates with 1.e4.' },
      { from: 'e7', to: 'e6', notation: 'e6', comment: 'The French Defense. Preparing a solid central strike with ...d5.' },
      { from: 'd2', to: 'd4', notation: 'd4', comment: 'White establishes a full pawn center.' },
      { from: 'd7', to: 'd5', notation: 'd5', comment: 'Challenging White\'s e4 pawn directly.' },
      { from: 'b1', to: 'c3', notation: 'Nc3', comment: 'White develops the knight and defends e4.' },
      { from: 'f8', to: 'b4', notation: 'Bb4', comment: 'The Winawer! Pinning the knight to pressure e4 and threaten ...Bxc3+.' },
      { from: 'e4', to: 'e5', notation: 'e5', comment: 'White locks the center and gains kingside territory.' },
      { from: 'c7', to: 'c5', notation: 'c5', comment: 'Undermining White\'s d4 pawn base immediately.' },
      { from: 'a2', to: 'a3', notation: 'a3', comment: 'White questions the bishop immediately.' },
      { from: 'b4', to: 'c3', notation: 'Bxc3+', comment: 'Black captures, inflicting doubled pawns on White\'s queenside.' },
      { from: 'b2', to: 'c3', notation: 'bxc3', comment: 'White recaptures with the b-pawn.' },
      { from: 'g8', to: 'e7', notation: 'Ne7', comment: 'Flexible knight development heading toward f5 to assault d4.' }
    ]
  },
  {
    id: 'french-advance',
    openingName: 'French Defense',
    name: 'Advance Variation',
    category: '1.e4 Asymmetric Defenses',
    description: 'White closes the center early with 3.e5. Black responds with rapid pressure on the d4 base of White\'s pawn chain.',
    side: 'black',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: 'White opens the game.' },
      { from: 'e7', to: 'e6', notation: 'e6', comment: 'Setting up the French pawn barrier.' },
      { from: 'd2', to: 'd4', notation: 'd4', comment: 'Occupying the center.' },
      { from: 'd7', to: 'd5', notation: 'd5', comment: 'Contesting the center with ...d5.' },
      { from: 'e4', to: 'e5', notation: 'e5', comment: 'The Advance Variation. White claims space and locks the center.' },
      { from: 'c7', to: 'c5', notation: 'c5', comment: 'Thematic counterstrike attacking the base of White\'s pawn wedge.' },
      { from: 'c2', to: 'c3', notation: 'c3', comment: 'White reinforces d4 with a pawn.' },
      { from: 'b8', to: 'c6', notation: 'Nc6', comment: 'Developing the knight and adding a second attacker on d4.' },
      { from: 'g1', to: 'f3', notation: 'Nf3', comment: 'White adds another defender to the critical d4 square.' },
      { from: 'd8', to: 'b6', notation: 'Qb6', comment: 'Triple attack on d4 and targeting the weak b2 square.' }
    ]
  },
  {
    id: 'caro-kann-classical',
    openingName: 'Caro-Kann Defense',
    name: 'Classical Variation',
    category: '1.e4 Asymmetric Defenses',
    description: 'One of the most solid defenses for Black against 1.e4. Seeking a rock-solid pawn structure and active piece development.',
    side: 'black',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: 'White claims central space.' },
      { from: 'c7', to: 'c6', notation: 'c6', comment: 'The Caro-Kann. Preparing d5 while maintaining a solid pawn structure.' },
      { from: 'd2', to: 'd4', notation: 'd4', comment: 'Classic central occupation with two pawns.' },
      { from: 'd7', to: 'd5', notation: 'd5', comment: 'Challenging White\'s e4 pawn immediately with a solid foundation.' },
      { from: 'b1', to: 'c3', notation: 'Nc3', comment: 'White chooses the main line, defending e4.' },
      { from: 'd5', to: 'e4', notation: 'dxe4', comment: 'Trading pawns in the center to open up files.' },
      { from: 'c3', to: 'e4', notation: 'Nxe4', comment: 'White recaptures with the knight.' },
      { from: 'c8', to: 'f5', notation: 'Bf5', comment: 'Key! Developing our light-squared bishop actively before playing e6.' }
    ]
  },
  {
    id: 'caro-kann-advance',
    openingName: 'Caro-Kann Defense',
    name: 'Advance Variation',
    category: '1.e4 Asymmetric Defenses',
    description: 'When White pushes 3.e5, Black easily develops the light-squared bishop to f5 before securing the center with ...e6.',
    side: 'black',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: 'White starts with 1.e4.' },
      { from: 'c7', to: 'c6', notation: 'c6', comment: 'Preparing ...d5 with solid pawn support.' },
      { from: 'd2', to: 'd4', notation: 'd4', comment: 'Full pawn center for White.' },
      { from: 'd7', to: 'd5', notation: 'd5', comment: 'Direct strike at the White center.' },
      { from: 'e4', to: 'e5', notation: 'e5', comment: 'The Advance Variation! Grabbing space and restricting Black\'s kingside.' },
      { from: 'c8', to: 'f5', notation: 'Bf5', comment: 'Crucial advantage over the French: the bishop gets out before ...e6!' },
      { from: 'g1', to: 'f3', notation: 'Nf3', comment: 'Natural kingside piece development.' },
      { from: 'e7', to: 'e6', notation: 'e6', comment: 'Securing the light-squared bishop and fortifying d5.' },
      { from: 'f1', to: 'e2', notation: 'Be2', comment: 'Quiet development preparing kingside castling.' },
      { from: 'c6', to: 'c5', notation: 'c5', comment: 'Black breaks in the center, challenging White\'s d4 foundation.' },
      { from: 'c1', to: 'e3', notation: 'Be3', comment: 'White defends d4 with the dark bishop.' },
      { from: 'd8', to: 'b6', notation: 'Qb6', comment: 'Queenside counterplay hitting b2 and piling pressure on d4.' }
    ]
  }
];
