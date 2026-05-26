import { OpeningVariant } from '../types';

export const OPENING_VARIANTS: OpeningVariant[] = [
  {
    id: 'sicilian-najdorf',
    openingName: 'Sicilian Defense',
    name: 'Najdorf Variation',
    description: 'One of the sharpest and most popular responses to 1.e4. Ideal for Black players looking for dynamic, double-edged counterplay.',
    side: 'black',
    moves: [
      {
        from: 'e2',
        to: 'e4',
        notation: 'e4',
        comment: 'White occupies the center and prepares development.'
      },
      {
        from: 'c7',
        to: 'c5',
        notation: 'c5',
        comment: 'The Sicilian! We fight for the center asymmetrically, controlling the d4 square.'
      },
      {
        from: 'g1',
        to: 'f3',
        notation: 'Nf3',
        comment: 'Classic knight development, preparing the d2-d4 push.'
      },
      {
        from: 'd7',
        to: 'd6',
        notation: 'd6',
        comment: 'Controlling the e5 square and opening a path for the light-squared bishop.'
      },
      {
        from: 'd2',
        to: 'd4',
        notation: 'd4',
        comment: 'White breaks open the center to activate pieces.'
      },
      {
        from: 'c5',
        to: 'd4',
        notation: 'cxd4',
        comment: 'We trade our flank c-pawn for White\'s central d-pawn.'
      },
      {
        from: 'f3',
        to: 'd4',
        notation: 'Nxd4',
        comment: 'White recaptures, centralizing the knight.'
      },
      {
        from: 'g8',
        to: 'f6',
        notation: 'Nf6',
        comment: 'Developing the knight, attacking the undefended e4 pawn, and forcing Nc3.'
      },
      {
        from: 'b1',
        to: 'c3',
        notation: 'Nc3',
        comment: 'White defends the e4 pawn and completes another development.'
      },
      {
        from: 'a7',
        to: 'a6',
        notation: 'a6',
        comment: 'The Najdorf! Prevents annoying knight/bishop jumps to b5 and prepares b7-b5 for queenside expansion.'
      }
    ]
  },
  {
    id: 'caro-kann-classical',
    openingName: 'Caro-Kann Defense',
    name: 'Classical Variation',
    description: 'One of the most solid defenses for Black against 1.e4. Seeking a solid pawn structure and safe piece development.',
    side: 'black',
    moves: [
      {
        from: 'e2',
        to: 'e4',
        notation: 'e4',
        comment: 'White claims central space.'
      },
      {
        from: 'c7',
        to: 'c6',
        notation: 'c6',
        comment: 'The Caro-Kann. Preparing the d5 central push while maintaining a solid pawn structure.'
      },
      {
        from: 'd2',
        to: 'd4',
        notation: 'd4',
        comment: 'Classic central occupation with two pawns.'
      },
      {
        from: 'd7',
        to: 'd5',
        notation: 'd5',
        comment: 'Challenging White\'s e4 pawn immediately with a solid foundation.'
      },
      {
        from: 'b1',
        to: 'c3',
        notation: 'Nc3',
        comment: 'White chooses the main line, defending e4.'
      },
      {
        from: 'd5',
        to: 'e4',
        notation: 'dxe4',
        comment: 'Trading pawns in the center to open up files.'
      },
      {
        from: 'c3',
        to: 'e4',
        notation: 'Nxe4',
        comment: 'White recaptures with the knight.'
      },
      {
        from: 'c8',
        to: 'f5',
        notation: 'Bf5',
        comment: 'Key! Developing our light-squared bishop actively before playing e6.'
      }
    ]
  },
  {
    id: 'ruy-lopez-berlin',
    openingName: 'Ruy Lopez Opening',
    name: 'Berlin Defense',
    description: 'Practice with White pieces against Black\'s ultra-solid Berlin Defense (known as the Berlin Wall).',
    side: 'white',
    moves: [
      {
        from: 'e2',
        to: 'e4',
        notation: 'e4',
        comment: 'We start by dominating the central squares and opening diagonals.'
      },
      {
        from: 'e7',
        to: 'e5',
        notation: 'e5',
        comment: 'Black responds symmetrically to contest the center.'
      },
      {
        from: 'g1',
        to: 'f3',
        notation: 'Nf3',
        comment: 'Developing the knight and attacking the undefended e5 pawn.'
      },
      {
        from: 'b8',
        to: 'c6',
        notation: 'Nc6',
        comment: 'Black defends the e5 pawn with the knight.'
      },
      {
        from: 'f1',
        to: 'b5',
        notation: 'Bb5',
        comment: 'The Ruy Lopez! Pressuring the knight that defends the e5 pawn.'
      },
      {
        from: 'g8',
        to: 'f6',
        notation: 'Nf6',
        comment: 'Berlin Defense. Black counterattacks directly against our e4 pawn.'
      },
      {
        from: 'e1',
        to: 'g1',
        notation: 'O-O',
        comment: 'Castling early. Safeguarding the king and activating the rook, temporarily ignoring the e4 pawn.'
      },
      {
        from: 'f6',
        to: 'e4',
        notation: 'Nxe4',
        comment: 'Black accepts the challenge, capturing the central e4 pawn.'
      },
      {
        from: 'd2',
        to: 'd4',
        notation: 'd4',
        comment: 'Striking back in the center to open files against the black king.'
      }
    ]
  }
];
