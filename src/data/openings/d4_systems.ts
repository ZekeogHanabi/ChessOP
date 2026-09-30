import { OpeningVariant } from '../../types';

export const D4_SYSTEM_OPENINGS: OpeningVariant[] = [
  {
    id: 'qgd-exchange',
    openingName: 'Queen\'s Gambit Declined',
    name: 'Exchange Variation',
    category: '1.d4 Systems & Classical',
    description: 'White executes 4.cxd5 to produce the Carlsbad pawn structure, preparing a queenside minority attack with b4-b5.',
    side: 'white',
    moves: [
      { from: 'd2', to: 'd4', notation: 'd4', comment: 'White opens with 1.d4, controlling e5 and c5.' },
      { from: 'd7', to: 'd5', notation: 'd5', comment: 'Black stakes out the center symmetrically.' },
      { from: 'c2', to: 'c4', notation: 'c4', comment: 'The Queen\'s Gambit! Undermining Black\'s d5 pawn.' },
      { from: 'e7', to: 'e6', notation: 'e6', comment: 'Queen\'s Gambit Declined: Black secures d5 with a solid pawn chain.' },
      { from: 'b1', to: 'c3', notation: 'Nc3', comment: 'White piles pressure onto d5.' },
      { from: 'g8', to: 'f6', notation: 'Nf6', comment: 'Black develops and defends the central anchor.' },
      { from: 'c4', to: 'd5', notation: 'cxd5', comment: 'The Exchange Variation! Clarifying the central pawn structure.' },
      { from: 'e6', to: 'd5', notation: 'exd5', comment: 'Black recaptures, creating the Carlsbad pawn formation.' },
      { from: 'c1', to: 'g5', notation: 'Bg5', comment: 'White pins the f6 knight against the queen.' },
      { from: 'f8', to: 'e7', notation: 'Be7', comment: 'Black unpins the knight and prepares castling.' },
      { from: 'e2', to: 'e3', notation: 'e3', comment: 'Solidifying the center and opening lines for the light bishop.' },
      { from: 'e8', to: 'g8', notation: 'O-O', comment: 'Black castles into safety.' },
      { from: 'f1', to: 'd3', notation: 'Bd3', comment: 'The bishop takes the commanding b1-h7 diagonal aiming at Black\'s king.' },
      { from: 'c7', to: 'c6', notation: 'c6', comment: 'Black reinforces the d5 outpost.' }
    ]
  },
  {
    id: 'qgd-tartakower',
    openingName: 'Queen\'s Gambit Declined',
    name: 'Tartakower Defense',
    category: '1.d4 Systems & Classical',
    description: 'A resilient World Championship weapon. Black plays ...h6 and ...b6 to smoothly fianchetto the light bishop on b7.',
    side: 'black',
    moves: [
      { from: 'd2', to: 'd4', notation: 'd4', comment: 'White claims the center with 1.d4.' },
      { from: 'd7', to: 'd5', notation: 'd5', comment: 'Black meets White in the center.' },
      { from: 'c2', to: 'c4', notation: 'c4', comment: 'The Queen\'s Gambit.' },
      { from: 'e7', to: 'e6', notation: 'e6', comment: 'Declining the gambit to build a rock-solid center.' },
      { from: 'b1', to: 'c3', notation: 'Nc3', comment: 'Developing knight pressuring d5.' },
      { from: 'g8', to: 'f6', notation: 'Nf6', comment: 'Developing knight defending d5.' },
      { from: 'c1', to: 'g5', notation: 'Bg5', comment: 'Pinning the defender of d5.' },
      { from: 'f8', to: 'e7', notation: 'Be7', comment: 'Unpinning and preparing castling.' },
      { from: 'e2', to: 'e3', notation: 'e3', comment: 'White fortifies d4.' },
      { from: 'e8', to: 'g8', notation: 'O-O', comment: 'Black castles into safety.' },
      { from: 'g1', to: 'f3', notation: 'Nf3', comment: 'White develops kingside knight harmoniously.' },
      { from: 'h7', to: 'h6', notation: 'h6', comment: 'Questioning the bishop.' },
      { from: 'g5', to: 'h4', notation: 'Bh4', comment: 'White maintains the pin.' },
      { from: 'b7', to: 'b6', notation: 'b6', comment: 'The Tartakower hallmark! Solving the problem of the c8 bishop via ...Bb7.' }
    ]
  },
  {
    id: 'london-system',
    openingName: 'London System',
    name: 'Classical Line',
    category: '1.d4 Systems & Classical',
    description: 'A universal, solid system for White. White develops the dark-squared bishop to f4 before locking the center with e3 and c3.',
    side: 'white',
    moves: [
      { from: 'd2', to: 'd4', notation: 'd4', comment: 'White stakes central claim with 1.d4.' },
      { from: 'd7', to: 'd5', notation: 'd5', comment: 'Black mirrors symmetrically.' },
      { from: 'c1', to: 'f4', notation: 'Bf4', comment: 'The London Bishop! Developed outside the pawn chain before e3.' },
      { from: 'g8', to: 'f6', notation: 'Nf6', comment: 'Natural piece development controlling e4.' },
      { from: 'e2', to: 'e3', notation: 'e3', comment: 'Constructing the solid central pawn triangle.' },
      { from: 'c7', to: 'c5', notation: 'c5', comment: 'Black challenges White\'s d4 pawn.' },
      { from: 'c2', to: 'c3', notation: 'c3', comment: 'Fortifying d4 with the granite London pawn pyramid.' },
      { from: 'b8', to: 'c6', notation: 'Nc6', comment: 'Black adds another attacker on d4.' },
      { from: 'b1', to: 'd2', notation: 'Nd2', comment: 'Flexible knight development guarding e4.' },
      { from: 'e7', to: 'e6', notation: 'e6', comment: 'Black prepares kingside bishop development.' },
      { from: 'g1', to: 'f3', notation: 'Nf3', comment: 'Natural kingside development, ready to anchor Ne5.' },
      { from: 'f8', to: 'd6', notation: 'Bd6', comment: 'Black contests the powerful f4 bishop.' }
    ]
  },
  {
    id: 'kings-indian',
    openingName: 'King\'s Indian Defense',
    name: 'Classical Variation',
    category: '1.d4 Systems & Classical',
    description: 'The hypermodern counterattacking weapon. Black cedes central territory only to lock it and unleash a deadly kingside attack with ...f5.',
    side: 'black',
    moves: [
      { from: 'd2', to: 'd4', notation: 'd4', comment: 'White opens with 1.d4.' },
      { from: 'g8', to: 'f6', notation: 'Nf6', comment: 'Black prevents 2.e4 and introduces the King\'s Indian.' },
      { from: 'c2', to: 'c4', notation: 'c4', comment: 'White seizes broad space in the center.' },
      { from: 'g7', to: 'g6', notation: 'g6', comment: 'Preparing the kingside fianchetto.' },
      { from: 'b1', to: 'c3', notation: 'Nc3', comment: 'White prepares e4.' },
      { from: 'f8', to: 'g7', notation: 'Bg7', comment: 'The King\'s Indian Bishop takes position on the long diagonal.' },
      { from: 'e2', to: 'e4', notation: 'e4', comment: 'White occupies the full center.' },
      { from: 'd7', to: 'd6', notation: 'd6', comment: 'Restricting White\'s e5 push.' },
      { from: 'g1', to: 'f3', notation: 'Nf3', comment: 'Natural kingside development.' },
      { from: 'e8', to: 'g8', notation: 'O-O', comment: 'Black castles into safety.' },
      { from: 'f1', to: 'e2', notation: 'Be2', comment: 'White prepares castling.' },
      { from: 'e7', to: 'e5', notation: 'e5', comment: 'Black strikes the center, forcing White to take a stance.' },
      { from: 'e1', to: 'g1', notation: 'O-O', comment: 'White castles safely.' },
      { from: 'b8', to: 'c6', notation: 'Nc6', comment: 'Pressuring White\'s d4 pawn.' },
      { from: 'd4', to: 'd5', notation: 'd5', comment: 'The center is locked! The Mar del Plata race begins.' },
      { from: 'c6', to: 'e7', notation: 'Ne7', comment: 'The knight retreats, clearing the way for ...f7-f5.' }
    ]
  },
  {
    id: 'slav-defense',
    openingName: 'Slav Defense',
    name: 'Classical Variation',
    category: '1.d4 Systems & Classical',
    description: 'One of the most solid defenses to 1.d4. Black supports d5 with 2...c6, reserving the c8-h3 diagonal for the light-squared bishop.',
    side: 'black',
    moves: [
      { from: 'd2', to: 'd4', notation: 'd4', comment: 'White starts with 1.d4.' },
      { from: 'd7', to: 'd5', notation: 'd5', comment: 'Black anchors the center.' },
      { from: 'c2', to: 'c4', notation: 'c4', comment: 'The Queen\'s Gambit.' },
      { from: 'c7', to: 'c6', notation: 'c6', comment: 'The Slav Defense! Reinforcing d5 without blocking the c8 bishop.' },
      { from: 'g1', to: 'f3', notation: 'Nf3', comment: 'White develops kingside knight.' },
      { from: 'g8', to: 'f6', notation: 'Nf6', comment: 'Black develops smoothly.' },
      { from: 'b1', to: 'c3', notation: 'Nc3', comment: 'Pressure on d5 mounts.' },
      { from: 'd5', to: 'c4', notation: 'dxc4', comment: 'Black takes the c4 pawn, preparing to develop the light bishop.' },
      { from: 'a2', to: 'a4', notation: 'a4', comment: 'White prevents ...b5.' },
      { from: 'c8', to: 'f5', notation: 'Bf5', comment: 'The key Slav move! The bishop develops actively before ...e6.' },
      { from: 'e2', to: 'e3', notation: 'e3', comment: 'White prepares to recapture on c4.' },
      { from: 'e7', to: 'e6', notation: 'e6', comment: 'Closing the pawn structure with an active bishop outside.' },
      { from: 'f1', to: 'c4', notation: 'Bxc4', comment: 'White regains the pawn.' },
      { from: 'f8', to: 'b4', notation: 'Bb4', comment: 'Pinning the knight and preparing kingside castling.' }
    ]
  }
];
