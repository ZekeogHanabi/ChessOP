import { OpeningVariant } from '../../types';

export const E4_OPEN_OPENINGS: OpeningVariant[] = [
  {
    id: 'ruy-lopez-berlin',
    openingName: 'Ruy Lopez',
    name: 'Berlin Defense',
    category: '1.e4 Open Games',
    description: 'Practice with White pieces against Black\'s ultra-solid Berlin Defense (known as the Berlin Wall).',
    side: 'white',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: 'White initiates with 1.e4 dominating central squares.' },
      { from: 'e7', to: 'e5', notation: 'e5', comment: 'Black responds symmetrically to contest the center.' },
      { from: 'g1', to: 'f3', notation: 'Nf3', comment: 'Developing the knight and attacking the undefended e5 pawn.' },
      { from: 'b8', to: 'c6', notation: 'Nc6', comment: 'Black defends the e5 pawn with the knight.' },
      { from: 'f1', to: 'b5', notation: 'Bb5', comment: 'The Spanish Game! Pressuring the knight that anchors e5.' },
      { from: 'g8', to: 'f6', notation: 'Nf6', comment: 'Berlin Defense. Black counterattacks directly against e4.' },
      { from: 'e1', to: 'g1', notation: 'O-O', comment: 'Castling early to safeguard the king and activate the rook.' },
      { from: 'f6', to: 'e4', notation: 'Nxe4', comment: 'Black accepts the challenge, capturing the central e4 pawn.' },
      { from: 'd2', to: 'd4', notation: 'd4', comment: 'Striking back in the center to open files against the black king.' }
    ]
  },
  {
    id: 'ruy-lopez-morphy',
    openingName: 'Ruy Lopez',
    name: 'Morphy Main Line',
    category: '1.e4 Open Games',
    description: 'The golden standard of classical chess theory. White preserves the bishop pair and builds a solid pawn center with c3 and d4.',
    side: 'white',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: 'Opening with king\'s pawn.' },
      { from: 'e7', to: 'e5', notation: 'e5', comment: 'Classical open game response.' },
      { from: 'g1', to: 'f3', notation: 'Nf3', comment: 'Developing the knight and attacking e5.' },
      { from: 'b8', to: 'c6', notation: 'Nc6', comment: 'Defending the central pawn.' },
      { from: 'f1', to: 'b5', notation: 'Bb5', comment: 'The Ruy Lopez bishop placement.' },
      { from: 'a7', to: 'a6', notation: 'a6', comment: 'Morphy\'s Defense, asking the Spanish bishop its intentions.' },
      { from: 'b5', to: 'a4', notation: 'Ba4', comment: 'White retreats while maintaining the pin.' },
      { from: 'g8', to: 'f6', notation: 'Nf6', comment: 'Black attacks the e4 pawn.' },
      { from: 'e1', to: 'g1', notation: 'O-O', comment: 'White castles, confident in defending e4 tactically.' },
      { from: 'f8', to: 'e7', notation: 'Be7', comment: 'Quiet classical development breaking the pin.' },
      { from: 'f1', to: 'e1', notation: 'Re1', comment: 'Guarding e4 with the rook and clearing f1 for minor pieces.' },
      { from: 'b7', to: 'b5', notation: 'b5', comment: 'Black kicks the bishop and expands on the queenside.' },
      { from: 'a4', to: 'b3', notation: 'Bb3', comment: 'The bishop takes the commanding a2-g8 diagonal.' },
      { from: 'd7', to: 'd6', notation: 'd6', comment: 'Black fortifies e5 and opens lines for the light bishop.' },
      { from: 'c2', to: 'c3', notation: 'c3', comment: 'Preparing the d2-d4 central strike and carving a retreat for the bishop.' },
      { from: 'e8', to: 'g8', notation: 'O-O', comment: 'Black completes development with kingside castling.' }
    ]
  },
  {
    id: 'italian-giuoco-piano',
    openingName: 'Italian Game',
    name: 'Giuoco Piano',
    category: '1.e4 Open Games',
    description: 'The "Quiet Game". White develops harmonious piece coordination, eyeing Black\'s sensitive f7 weakness with Bc4.',
    side: 'white',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: 'White begins with 1.e4.' },
      { from: 'e7', to: 'e5', notation: 'e5', comment: 'Black stakes equal claim in the center.' },
      { from: 'g1', to: 'f3', notation: 'Nf3', comment: 'Developing the knight and targeting e5.' },
      { from: 'b8', to: 'c6', notation: 'Nc6', comment: 'Black protects e5.' },
      { from: 'f1', to: 'c4', notation: 'Bc4', comment: 'The Italian Bishop! Targeting the vulnerable f7 square.' },
      { from: 'f8', to: 'c5', notation: 'Bc5', comment: 'Giuoco Piano: Black mirrors with an active bishop placement.' },
      { from: 'c2', to: 'c3', notation: 'c3', comment: 'White prepares the classical d2-d4 pawn center.' },
      { from: 'g8', to: 'f6', notation: 'Nf6', comment: 'Black counterattacks against the e4 pawn.' },
      { from: 'd2', to: 'd3', notation: 'd3', comment: 'The solid Giuoco Pianissimo setup, guarding e4 securely.' },
      { from: 'd7', to: 'd6', notation: 'd6', comment: 'Black solidifies the center and supports the c5 bishop.' },
      { from: 'e1', to: 'g1', notation: 'O-O', comment: 'White secures the king and activates the rook.' },
      { from: 'a7', to: 'a6', notation: 'a6', comment: 'Black preserves the c5 bishop from being exchanged.' }
    ]
  },
  {
    id: 'italian-evans-gambit',
    openingName: 'Italian Game',
    name: 'Evans Gambit',
    category: '1.e4 Open Games',
    description: 'The Romantic masterpiece! White sacrifices the b4 pawn for blistering development, an overwhelming center, and direct king attacks.',
    side: 'white',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: 'Standard King\'s pawn advance.' },
      { from: 'e7', to: 'e5', notation: 'e5', comment: 'Black responds symmetrically.' },
      { from: 'g1', to: 'f3', notation: 'Nf3', comment: 'Knight development attacking e5.' },
      { from: 'b8', to: 'c6', notation: 'Nc6', comment: 'Knight development defending e5.' },
      { from: 'f1', to: 'c4', notation: 'Bc4', comment: 'Italian Game targeting f7.' },
      { from: 'f8', to: 'c5', notation: 'Bc5', comment: 'Black\'s classical bishop.' },
      { from: 'b2', to: 'b4', notation: 'b4', comment: 'The Evans Gambit! White sacrifices a flank pawn for initiative.' },
      { from: 'c5', to: 'b4', notation: 'Bxb4', comment: 'Black accepts the challenge and takes the pawn.' },
      { from: 'c2', to: 'c3', notation: 'c3', comment: 'White gains tempo on the bishop and prepares d2-d4.' },
      { from: 'b4', to: 'a5', notation: 'Ba5', comment: 'The traditional retreat, maintaining pin along the diagonal.' },
      { from: 'd2', to: 'd4', notation: 'd4', comment: 'White takes full control of the center with rapid speed.' },
      { from: 'e5', to: 'd4', notation: 'exd4', comment: 'Black exchanges in the center.' },
      { from: 'e1', to: 'g1', notation: 'O-O', comment: 'White castles, prioritizing swift king attack over material.' }
    ]
  },
  {
    id: 'italian-fried-liver',
    openingName: 'Two Knights Defense',
    name: 'Fried Liver Attack',
    category: '1.e4 Open Games',
    description: 'The legendary knight sacrifice on f7! White tears open Black\'s king shelter, dragging the king into the dangerous center.',
    side: 'white',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: 'White starts with 1.e4.' },
      { from: 'e7', to: 'e5', notation: 'e5', comment: 'Black plays 1...e5.' },
      { from: 'g1', to: 'f3', notation: 'Nf3', comment: 'Attacking e5.' },
      { from: 'b8', to: 'c6', notation: 'Nc6', comment: 'Defending e5.' },
      { from: 'f1', to: 'c4', notation: 'Bc4', comment: 'Aiming at the sensitive f7 pawn.' },
      { from: 'g8', to: 'f6', notation: 'Nf6', comment: 'Two Knights Defense, inviting aggressive play.' },
      { from: 'f3', to: 'g5', notation: 'Ng5', comment: 'White targets f7 with knight and bishop in tandem.' },
      { from: 'd7', to: 'd5', notation: 'd5', comment: 'Black blocks the bishop\'s line of sight.' },
      { from: 'e4', to: 'd5', notation: 'exd5', comment: 'White captures the central pawn.' },
      { from: 'f6', to: 'd5', notation: 'Nxd5', comment: 'Black recaptures with the knight, enabling the famous sacrifice.' },
      { from: 'g5', to: 'f7', notation: 'Nxf7', comment: 'The Fried Liver Attack sacrifice! Forking Queen and Rook.' },
      { from: 'e8', to: 'f7', notation: 'Kxf7', comment: 'The black King is forced out to capture the intruder.' },
      { from: 'd1', to: 'f3', notation: 'Qf3+', comment: 'White checks with the Queen, pinning and attacking the d5 knight!' },
      { from: 'f7', to: 'e6', notation: 'Ke6', comment: 'The black King must walk into the open center to protect the knight.' }
    ]
  },
  {
    id: 'scotch-mieses',
    openingName: 'Scotch Game',
    name: 'Mieses Variation',
    category: '1.e4 Open Games',
    description: 'An aggressive, modern approach popularized by Garry Kasparov. White blows open the center on move 3 and establishes dynamic pressure.',
    side: 'white',
    moves: [
      { from: 'e2', to: 'e4', notation: 'e4', comment: 'White opens with the King\'s pawn.' },
      { from: 'e7', to: 'e5', notation: 'e5', comment: 'Black responds symmetrically.' },
      { from: 'g1', to: 'f3', notation: 'Nf3', comment: 'Developing and attacking e5.' },
      { from: 'b8', to: 'c6', notation: 'Nc6', comment: 'Defending the pawn.' },
      { from: 'd2', to: 'd4', notation: 'd4', comment: 'The Scotch Game! Immediately challenging the center on move 3.' },
      { from: 'e5', to: 'd4', notation: 'exd4', comment: 'Black takes the offered central pawn.' },
      { from: 'f3', to: 'd4', notation: 'Nxd4', comment: 'White centralizes the knight.' },
      { from: 'g8', to: 'f6', notation: 'Nf6', comment: 'Black develops and attacks the e4 pawn.' },
      { from: 'd4', to: 'c6', notation: 'Nxc6', comment: 'White captures, damaging Black\'s queenside structure.' },
      { from: 'b7', to: 'c6', notation: 'bxc6', comment: 'Black recaptures towards the center.' },
      { from: 'e4', to: 'e5', notation: 'e5', comment: 'The Mieses Variation! Kicking the f6 knight.' },
      { from: 'd8', to: 'e7', notation: 'Qe7', comment: 'Black pins the e5 pawn along the e-file.' },
      { from: 'd1', to: 'e2', notation: 'Qe2', comment: 'White protects the pawn and unpins.' },
      { from: 'f6', to: 'd5', notation: 'Nd5', comment: 'Black\'s knight retreats to the central outpost.' }
    ]
  }
];
