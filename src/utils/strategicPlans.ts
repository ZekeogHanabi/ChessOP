import { OpeningVariant, StrategicPlan } from '../types';

/**
 * Curated Grandmaster Strategic Plans & Tactical Motifs
 * for the Vienna Game repertoire and major openings.
 */
export const STRATEGIC_PLANS: Record<string, StrategicPlan> = {
  // --- VIENNA GAMBIT: ACCEPTED ---
  'vienna-gambit-accepted': {
    title: 'Vienna Gambit: Accepted Mastery',
    keyIdea: 'White sacrifices the f-pawn to deflect Black\'s e5 pawn, opening the f-file for kingside attack and seizing absolute central dominance with d4.',
    pawnBreaks: [
      'f2-f4 (The catalyst break that destroys Black\'s central anchor)',
      'd2-d4 (Seizing complete center control with tempo)',
      'e4-e5 (Kicking Black\'s f6 Knight and gaining space)'
    ],
    pieceGoals: [
      'Nc3: Anchors the d5 outpost and defends e4',
      'Bc4: Lasers in on the vulnerable f7 weakness',
      'O-O: Connects the King and swings the Rook onto the half-open f-file',
      'Bxf4: Recaptures material while establishing active piece diagonals'
    ],
    tacticalThemes: [
      'Exploitation of Black\'s weakened King along the e8-h5 and a2-g8 diagonals',
      'Kingside sacrifices on f7 (Bxf7+) to drag the Black King into the open',
      'Fork tricks with d4-d5 kicking defenders'
    ],
    recommendedArrows: [
      ['f2', 'f4', 'rgba(234, 179, 8, 0.85)'], // Pawn push
      ['f1', 'c4', 'rgba(34, 197, 94, 0.85)'], // Bishop attack
      ['c4', 'f7', 'rgba(239, 68, 68, 0.85)'], // Threatening f7
      ['d2', 'd4', 'rgba(59, 130, 246, 0.85)']  // Center seizure
    ]
  },

  // --- VIENNA GAMBIT: MAIN LINE (3...d5) ---
  'vienna-gambit-main-line': {
    title: 'Vienna Gambit: 3...d5 Counterstrike',
    keyIdea: 'The most principled defense by Black. White responds by winning the e5 pawn (fxe5) and driving Black\'s knight away with Nf3 and d4.',
    pawnBreaks: [
      'f4xe5 (Undermines Black\'s central knight and wins space)',
      'd2-d4 (Solidifies the e5 pawn and unlocks the dark-squared bishop)',
      'c2-c3 (Fortifies the d4 center against Black\'s counterplay)'
    ],
    pieceGoals: [
      'Nf3: Controls e5 and d4 while developing quickly',
      'Be2 / Bd3: Developing bishops smoothly for rapid kingside castling',
      'Qe2 / Qf3: Putting tactical pressure on Black\'s pinned knights'
    ],
    tacticalThemes: [
      'Black\'s overextended d5/e4 knights frequently get trapped or overloaded',
      'Pin along the e-file if Black delays castling',
      'Rapid kingside castle followed by rook lift along the f-file'
    ],
    recommendedArrows: [
      ['f4', 'e5', 'rgba(239, 68, 68, 0.85)'],
      ['g1', 'f3', 'rgba(34, 197, 94, 0.85)'],
      ['d2', 'd4', 'rgba(59, 130, 246, 0.85)'],
      ['c1', 'e3', 'rgba(168, 85, 247, 0.85)']
    ]
  },

  // --- VIENNA HYBRID (Bc4 + d3) ---
  'vienna-hybrid': {
    title: 'Vienna Hybrid: Positional Strangulation',
    keyIdea: 'A modern, flexible setup combining Italian Game aesthetics with Vienna King\'s Gambit threats. White delays f4 until development is complete.',
    pawnBreaks: [
      'f2-f4 (Timed specifically after Black castles to launch a lethal pawn storm)',
      'c2-c3 + d3-d4 (Classical Italian expansion in the center)',
      'a2-a3 (Preserves the valuable c4 Italian bishop from ...Na5 trades)'
    ],
    pieceGoals: [
      'Bc4: The Italian bishop dominates the center and aims at f7',
      'd2-d3: Solid pawn pyramid supporting e4 and clearing c1 bishop',
      'Nf3 & O-O: Classic sound King safety before kingside operations'
    ],
    tacticalThemes: [
      'Bg5 pin on Black\'s f6 Knight followed by Nd5 outpost domination',
      'Opening the f-file with f4 after castling for crushing Rook activity'
    ],
    recommendedArrows: [
      ['f1', 'c4', 'rgba(34, 197, 94, 0.85)'],
      ['d2', 'd3', 'rgba(59, 130, 246, 0.85)'],
      ['c1', 'g5', 'rgba(234, 179, 8, 0.85)'],
      ['c3', 'd5', 'rgba(239, 68, 68, 0.85)']
    ]
  },

  // --- VIENNA MIESES (g3 Fianchetto) ---
  'vienna-mieses': {
    title: 'Vienna Mieses: Dragon Hunter Fianchetto',
    keyIdea: 'White adopts a hypermodern approach with 3.g3 and 4.Bg2, exerting diagonal pressure along the h1-a8 long diagonal.',
    pawnBreaks: [
      'd2-d3 followed by f2-f4 (Positional expansion on the flanks)',
      'Nge2 + O-O (Leaving the f-pawn unblocked for future pawn storms)'
    ],
    pieceGoals: [
      'Bg2: The monster sniper bishop controls d5 and e4',
      'Nge2: Developed to e2 instead of f3 to keep the f-pawn mobile and guard c3',
      'Nc3: Anchors the queenside and prevents ...d5 breaks'
    ],
    tacticalThemes: [
      'Tactics along the long diagonal against undefended black pieces on a8/b7',
      'Late f2-f4 push transforming the quiet setup into an aggressive kingside avalanche'
    ],
    recommendedArrows: [
      ['g2', 'g3', 'rgba(234, 179, 8, 0.85)'],
      ['f1', 'g2', 'rgba(34, 197, 94, 0.85)'],
      ['g2', 'd5', 'rgba(239, 68, 68, 0.85)'],
      ['g1', 'e2', 'rgba(59, 130, 246, 0.85)']
    ]
  },

  // --- VIENNA COPYCAT (4.Qg4!) ---
  'vienna-copycat': {
    title: 'Vienna Copycat: 4.Qg4! Venomous Queen Attack',
    keyIdea: 'White punishes Black\'s symmetrical 3...Bc5 by launching the queen directly to g4, threatening g7 and sacrificing f2 for a decisive knight invasion with Nd5.',
    pawnBreaks: [
      'd2-d3 (Securing the c4 bishop and opening the dark bishop diagonal)',
      'c2-c3 (Preparing to snare and trap the overextended black queen)'
    ],
    pieceGoals: [
      'Qg4: Dominates g7 and forces king dislocation (...Kf8 or ...g6)',
      'Nd5: Central outpost fork with devastating threats on c7 and f7',
      'Nh3 -> Ng5: Pouncing on f7 with overwhelming attack'
    ],
    tacticalThemes: [
      'Queen trapping on c5 after ...Qxf2+ Kd1 and d3/c3',
      'Sacrificial battery along the f-file with Rf1 and Qf3'
    ],
    recommendedArrows: [
      ['d1', 'g4', 'rgba(234, 179, 8, 0.85)'],
      ['c3', 'd5', 'rgba(239, 68, 68, 0.85)'],
      ['c4', 'f7', 'rgba(239, 68, 68, 0.85)']
    ]
  },

  // --- VIENNA GAMBIT DECLINED ---
  'vienna-declined': {
    title: 'Vienna Gambit: Punishing Declined Setups (3...Nc6 & 3...d6)',
    keyIdea: 'When Black refuses the gambit with 3...Nc6 or 3...d6, White captures fxe5, seizes the full center with d4, and kicks Black\'s knights backwards with e5.',
    pawnBreaks: [
      'f4xe5 (Obliterating Black\'s central resistance)',
      'd2-d4 (Establishing a dominant central pawn roller)',
      'e4-e5 (Driving Black\'s minor pieces into retreat)'
    ],
    pieceGoals: [
      'd4 + e5: The unstoppable central pawn pair',
      'Bc4 / Bd3: Developing bishops onto commanding attacking diagonals',
      'Nf3 & O-O: Fast harmonious king safety'
    ],
    tacticalThemes: [
      'Forking minor pieces with d4-d5 and e5-e6',
      'Pawn storm on the kingside with f5 and g4-g5 against ...d6'
    ],
    recommendedArrows: [
      ['f4', 'e5', 'rgba(239, 68, 68, 0.85)'],
      ['d2', 'd4', 'rgba(59, 130, 246, 0.85)'],
      ['e4', 'e5', 'rgba(234, 179, 8, 0.85)']
    ]
  },

  // --- SICILIAN NAJDORF ---
  'sicilian-najdorf': {
    title: 'Sicilian Najdorf: Dynamic Asymmetry',
    keyIdea: 'Black plays 5...a6 to eliminate White\'s Nb5/Bb5 checks and plans a queenside expansion with ...b5, while preparing counterpunches with ...e5 or ...e6.',
    pawnBreaks: [
      'b7-b5 (Queenside pawn expansion and pressure on e4)',
      'd6-d5 (The liberating thematic Sicilian central break)',
      'e7-e5 (Grabbing central space and cementing the d6-e5 pawn chain)'
    ],
    pieceGoals: [
      'Bb7 / Be6: Active diagonal placement controlling key central outposts',
      'Nbd7 -> Nc5: Pressuring White\'s e4 pawn and eyeing the b3/d3 squares',
      'Rc8: Dominates the half-open c-file for tactical combinations'
    ],
    tacticalThemes: [
      'Rook sacrifice on c3 (Rxc3!) shattering White\'s pawn shelter',
      'Knight fork tactics on e5 and c5 outposts',
      'Counterattack on White\'s King while White attacks the kingside'
    ],
    recommendedArrows: [
      ['b7', 'b5', 'rgba(234, 179, 8, 0.85)'],
      ['c8', 'c3', 'rgba(239, 68, 68, 0.85)'],
      ['b8', 'd7', 'rgba(59, 130, 246, 0.85)'],
      ['d7', 'c5', 'rgba(34, 197, 94, 0.85)']
    ]
  },

  // --- QUEEN'S GAMBIT ACCEPTED ---
  'qga': {
    title: 'Queen\'s Gambit Accepted: Central Counter',
    keyIdea: 'Black accepts the c4 gambit pawn temporarily, planning to strike back at White\'s central structure with ...c5 or ...e5 rather than clinging to c4.',
    pawnBreaks: [
      'c7-c5 (The fundamental break undermining White\'s d4 center)',
      'e7-e5 (Alternative energetic break opening diagonals for the black bishops)'
    ],
    pieceGoals: [
      'Nf6: Fast development controlling d5 and e4',
      'a7-a6 + b7-b5: Expanding on the queenside and giving the light bishop a home on b7',
      'Bb7: Sniping along the long diagonal against White\'s center'
    ],
    tacticalThemes: [
      'Punishing White if they overextend trying to regain c4',
      'Pinning tricks along the d-file once c5 is traded'
    ],
    recommendedArrows: [
      ['c7', 'c5', 'rgba(234, 179, 8, 0.85)'],
      ['b7', 'b5', 'rgba(59, 130, 246, 0.85)'],
      ['c8', 'b7', 'rgba(34, 197, 94, 0.85)'],
      ['f6', 'd5', 'rgba(239, 68, 68, 0.85)']
    ]
  },

  // --- RUY LOPEZ: BERLIN DEFENSE ---
  'ruy-lopez-berlin': {
    title: 'Ruy Lopez: Berlin Fortress',
    keyIdea: 'Known as the "Berlin Wall", Black develops the knight to f6 directly attacking e4. Famous for neutralising White\'s opening initiative at world championship level.',
    pawnBreaks: [
      'd7-d5 (Central strike once White commits forces)',
      'c7-c6 (Kicking White\'s b5 Bishop)'
    ],
    pieceGoals: [
      'Nf6: Direct counterattack on the e4 center pawn',
      'Be7 / Bc5: Solid bishop development preparing rapid castling'
    ],
    tacticalThemes: [
      'Endgame superiority due to the bishop pair if Queens are exchanged',
      'Immense resilience against direct King attacks'
    ],
    recommendedArrows: [
      ['g8', 'f6', 'rgba(34, 197, 94, 0.85)'],
      ['f6', 'e4', 'rgba(239, 68, 68, 0.85)'],
      ['d7', 'd6', 'rgba(59, 130, 246, 0.85)']
    ]
  }
};

/**
 * Retrieves the Grandmaster Strategic Plan for a given variant.
 * Falls back to an automatic dynamic plan if not explicitly in the curated database.
 */
export const getStrategicPlan = (variant: OpeningVariant): StrategicPlan => {
  const chapterLower = (variant.chapterName || '').toLowerCase();
  const nameLower = (variant.name || '').toLowerCase();
  const openingLower = (variant.openingName || '').toLowerCase();

  // 1. Check curated keys
  if (chapterLower.includes('copycat') || nameLower.includes('copycat') || chapterLower.includes('qg4')) {
    return STRATEGIC_PLANS['vienna-copycat'];
  }
  if (chapterLower.includes('declined') || nameLower.includes('declined')) {
    return STRATEGIC_PLANS['vienna-declined'];
  }
  if (chapterLower.includes('accepted') || nameLower.includes('accepted')) {
    return STRATEGIC_PLANS['vienna-gambit-accepted'];
  }
  if (chapterLower.includes('3...d5') || chapterLower.includes('main line') || nameLower.includes('main line')) {
    return STRATEGIC_PLANS['vienna-gambit-main-line'];
  }
  if (chapterLower.includes('hybrid') || nameLower.includes('hybrid')) {
    return STRATEGIC_PLANS['vienna-hybrid'];
  }
  if (chapterLower.includes('mieses') || nameLower.includes('mieses')) {
    return STRATEGIC_PLANS['vienna-mieses'];
  }
  if (openingLower.includes('sicilian') || nameLower.includes('najdorf')) {
    return STRATEGIC_PLANS['sicilian-najdorf'];
  }
  if (openingLower.includes('queen') || nameLower.includes('accepted')) {
    return STRATEGIC_PLANS['qga'];
  }
  if (openingLower.includes('ruy') || nameLower.includes('berlin')) {
    return STRATEGIC_PLANS['ruy-lopez-berlin'];
  }

  // General Vienna fallback
  if (openingLower.includes('vienna') || chapterLower.includes('vienna')) {
    return STRATEGIC_PLANS['vienna-gambit-accepted'];
  }

  // 2. Generic dynamic fallback for custom PGNs
  return {
    title: `${variant.openingName}: ${variant.name}`,
    keyIdea: variant.description || 'Master the central control, development tempo, and tactical motifs of this theoretical opening line.',
    pawnBreaks: [
      'Fight for central control with timely pawn advances',
      'Challenge opponent pawn levers and open dynamic lines for your pieces'
    ],
    pieceGoals: [
      'Rapid piece development towards the center',
      'Secure King safety through early castling',
      'Coordinate Rooks along open and half-open files'
    ],
    tacticalThemes: [
      'Look for forks, pins, and skewers in the early middlegame',
      'Punish neglected development or overextended opponent pawns'
    ],
    recommendedArrows: [
      ['e2', 'e4', 'rgba(234, 179, 8, 0.85)'],
      ['d2', 'd4', 'rgba(59, 130, 246, 0.85)']
    ]
  };
};
