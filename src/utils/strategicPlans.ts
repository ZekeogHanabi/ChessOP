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
  },
  // --- CARO-KANN: CLASSICAL ---
  'caro-kann-classical': {
    title: 'Caro-Kann: Classical Solidity',
    keyIdea: 'Black achieves harmonious piece activity with 4...Bf5 before securing the pawn center with ...e6, heading towards an endgame with superior pawn structure.',
    pawnBreaks: [
      'c6-c5 (Thematic pawn lever attacking White\'s d4 base)',
      'e7-e6 (Fortifying the pawn structure and clearing dark bishop development)'
    ],
    pieceGoals: [
      'Bf5: Active bishop outside the pawn chain guarding the diagonal',
      'Nd7 & Ngf6: Coordinated knight duo challenging White\'s central pieces',
      'Be7 & O-O: Safe and resilient king placement'
    ],
    tacticalThemes: [
      'Endgame pawn majority advantages on the queenside',
      'Absorbing White\'s early kingside expansions with precise defense'
    ],
    recommendedArrows: [
      ['c8', 'f5', 'rgba(34, 197, 94, 0.85)'],
      ['c6', 'c5', 'rgba(234, 179, 8, 0.85)'],
      ['b8', 'd7', 'rgba(59, 130, 246, 0.85)']
    ]
  },

  // --- CARO-KANN: ADVANCE ---
  'caro-kann-advance': {
    title: 'Caro-Kann: Advance Counterstrike',
    keyIdea: 'Against White\'s 3.e5 space grab, Black develops the bishop to f5 and immediately strikes back at d4 with ...c5 and ...Qb6.',
    pawnBreaks: [
      'c6-c5 (Immediate assault on White\'s d4 pawn anchor)',
      'f7-f6 (Undermining the advanced e5 wedge)'
    ],
    pieceGoals: [
      'Bf5: Developed freely outside the pawn chain before ...e6',
      'Qb6: Putting simultaneous pressure on b2 and d4',
      'Nc6: Heavy tactical firepower applied to d4'
    ],
    tacticalThemes: [
      'Queenside infiltration through the weakened b2 and c3 squares',
      'Pawn sacrifices to open lines for Black\'s active heavy pieces'
    ],
    recommendedArrows: [
      ['c6', 'c5', 'rgba(234, 179, 8, 0.85)'],
      ['d8', 'b6', 'rgba(239, 68, 68, 0.85)'],
      ['c8', 'f5', 'rgba(34, 197, 94, 0.85)']
    ]
  },

  // --- FRENCH: WINAWER ---
  'french-winawer': {
    title: 'French Winawer: Asymmetric Clash',
    keyIdea: 'Black pins the c3 knight with 3...Bb4 and exchanges it for doubled c-pawns, launching a fierce queenside counterattack against White\'s center.',
    pawnBreaks: [
      'c7-c5 (Core counterstrike against the d4 base)',
      'f7-f6 (Demolishing White\'s e5 territory wedge)'
    ],
    pieceGoals: [
      'Bb4xc3: Damaging White\'s queenside pawn structure permanently',
      'Ne7 -> Nf5: Rerouting the knight to attack the d4 pawn',
      'Qa5: Applying heavy tactical pressure on White\'s pinned c-pawns'
    ],
    tacticalThemes: [
      'Double-edged opposite-wing attacks with fierce tactical complications',
      'Dynamic kingside defense against early Qg4 sorties'
    ],
    recommendedArrows: [
      ['f8', 'b4', 'rgba(34, 197, 94, 0.85)'],
      ['c7', 'c5', 'rgba(234, 179, 8, 0.85)'],
      ['g8', 'e7', 'rgba(59, 130, 246, 0.85)']
    ]
  },

  // --- FRENCH: ADVANCE ---
  'french-advance': {
    title: 'French Advance: Siege on the Center',
    keyIdea: 'Black lays siege to the d4 pawn base using the trio ...c5, ...Nc6, and ...Qb6, tying down White\'s pieces to central defense.',
    pawnBreaks: [
      'c7-c5 (The foundational battering ram attacking d4)',
      'f7-f6 (Undermining the head of White\'s pawn chain on e5)'
    ],
    pieceGoals: [
      'Qb6: Piling on d4 while pinning White\'s b2 pawn',
      'Nc6: Point-blank attacker focused on d4',
      'Bd7: Preparing ...Bb5 to exchange the "bad" French bishop'
    ],
    tacticalThemes: [
      'Overloading White\'s defenders on the d4 square',
      'Exploitation of the half-open c-file with Rc8'
    ],
    recommendedArrows: [
      ['c7', 'c5', 'rgba(234, 179, 8, 0.85)'],
      ['b8', 'c6', 'rgba(59, 130, 246, 0.85)'],
      ['d8', 'b6', 'rgba(239, 68, 68, 0.85)']
    ]
  },

  // --- SICILIAN: DRAGON ---
  'sicilian-dragon': {
    title: 'Sicilian Dragon: The Long Diagonal',
    keyIdea: 'Black fianchettoes the monstrous Dragon Bishop on g7, aiming down the long diagonal toward White\'s queenside for blistering counterattacks.',
    pawnBreaks: [
      'd6-d5 (The liberating thematic Sicilian central break)',
      'b7-b5 (Queenside pawn storm driving White\'s defenders)'
    ],
    pieceGoals: [
      'Bg7: The sniper bishop controlling the critical central dark squares',
      'Rc8: Dominates the half-open c-file against White\'s king',
      'Nc6 -> e5 -> c4: Invading prime outposts on White\'s side'
    ],
    tacticalThemes: [
      'Thematic exchange sacrifice on c3 (Rxc3!) shattering White\'s king shelter',
      'Ruler-sharp race: White attacks kingside, Black strikes queenside'
    ],
    recommendedArrows: [
      ['f8', 'g7', 'rgba(34, 197, 94, 0.85)'],
      ['c8', 'c3', 'rgba(239, 68, 68, 0.85)'],
      ['b8', 'c6', 'rgba(59, 130, 246, 0.85)']
    ]
  },

  // --- SICILIAN: ALAPIN ---
  'sicilian-alapin': {
    title: 'Sicilian Alapin: Classical Pawn Center',
    keyIdea: 'White plays 2.c3 to erect a broad d4-e4 classical pawn center, neutralizing Black\'s typical Sicilian wing counterplay.',
    pawnBreaks: [
      'c2-c3 followed by d2-d4 (Establishing total central control)',
      'd4-d5 (Seizing space and chasing away Black\'s minor pieces)'
    ],
    pieceGoals: [
      'Nf3: Natural kingside development guarding d4 and e5',
      'Be2 / Bd3: Harmonic piece development preparing rapid castling',
      'Nc3: Developed to c3 once d4 is established'
    ],
    tacticalThemes: [
      'Gaining tempos on Black\'s Queen if she captures early on d5',
      'Mobilizing the central pawn roller in the middlegame'
    ],
    recommendedArrows: [
      ['c2', 'c3', 'rgba(234, 179, 8, 0.85)'],
      ['d2', 'd4', 'rgba(59, 130, 246, 0.85)'],
      ['g1', 'f3', 'rgba(34, 197, 94, 0.85)']
    ]
  },

  // --- RUY LOPEZ: MORPHY MAIN LINE ---
  'ruy-lopez-morphy': {
    title: 'Ruy Lopez: Morphy Classical Mastery',
    keyIdea: 'White maintains the Spanish bishop pair with Bb3, builds the classical c3-d4 center, and maneuvers the b1 knight to the kingside via d2-f1-g3.',
    pawnBreaks: [
      'c2-c3 followed by d2-d4 (Building the classical Spanish center)',
      'a2-a4 (Testing and undermining Black\'s queenside pawn structure)'
    ],
    pieceGoals: [
      'Bb3: The Spanish Bishop rakes the crucial a2-g8 diagonal',
      'Nbd2 -> Nf1 -> Ng3: The celebrated maneuver to reinforce king attack',
      'Re1: Anchoring e4 and clearing f1 for the knight'
    ],
    tacticalThemes: [
      'Kingside outpost on f5 for the knight',
      'Transforming central space into a mating net or favorable endgame'
    ],
    recommendedArrows: [
      ['c2', 'c3', 'rgba(234, 179, 8, 0.85)'],
      ['d2', 'd4', 'rgba(59, 130, 246, 0.85)'],
      ['b1', 'd2', 'rgba(168, 85, 247, 0.85)'],
      ['a4', 'b3', 'rgba(34, 197, 94, 0.85)']
    ]
  },

  // --- ITALIAN: GIUOCO PIANO ---
  'italian-giuoco-piano': {
    title: 'Italian Game: Giuoco Piano Maneuvering',
    keyIdea: 'White develops harmonious harmony with Bc4 aiming at f7, playing c3 and d3 to build patient central and kingside pressure.',
    pawnBreaks: [
      'c2-c3 + d3-d4 (Timed central expansion)',
      'f2-f4 (Aggressive flank break once kingside is consolidated)'
    ],
    pieceGoals: [
      'Bc4: Lasers the sensitive f7 square from the opening',
      'Nbd2 -> Nf1 -> Ng3: Spanish-style reroute to conquer kingside outposts',
      'Bg5: Pinning Black\'s key defending knight on f6'
    ],
    tacticalThemes: [
      'Pinning f6 followed by Nd5 pressure to induce defensive concessions',
      'Greek gift bishop sacrifices on h7 under favorable conditions'
    ],
    recommendedArrows: [
      ['f1', 'c4', 'rgba(34, 197, 94, 0.85)'],
      ['c2', 'c3', 'rgba(234, 179, 8, 0.85)'],
      ['d2', 'd3', 'rgba(59, 130, 246, 0.85)']
    ]
  },

  // --- ITALIAN: EVANS GAMBIT ---
  'italian-evans-gambit': {
    title: 'Italian Game: Evans Romantic Fire',
    keyIdea: 'White sacrifices the b4 wing pawn to win multiple tempi, establish a dominant central pawn pair with c3 and d4, and launch devastating attacks against Black\'s uncastled King.',
    pawnBreaks: [
      'b2-b4 (The gambit catalyst winning time against the bishop)',
      'd2-d4 (Explosive central thrust tearing open the board)',
      'e4-e5 (Driving Black\'s defending pieces away from the king)'
    ],
    pieceGoals: [
      'Bc4 & Ba3: Cross-firing bishops preventing Black from castling',
      'Qb3: Dual threat creating intense batteries against f7 and b7',
      'Re1: Dominating the open e-file against the exposed enemy king'
    ],
    tacticalThemes: [
      'Bxf7+ sacrifices dragging the king into deadly check sequences',
      'Devastating double attacks using Queen and Bishop diagonals'
    ],
    recommendedArrows: [
      ['b2', 'b4', 'rgba(239, 68, 68, 0.85)'],
      ['c2', 'c3', 'rgba(234, 179, 8, 0.85)'],
      ['d2', 'd4', 'rgba(59, 130, 246, 0.85)']
    ]
  },

  // --- TWO KNIGHTS: FRIED LIVER ATTACK ---
  'italian-fried-liver': {
    title: 'Two Knights: Fried Liver Attack',
    keyIdea: 'White executes the audacious Nxf7! knight sacrifice, forcing Black\'s king into the center of the board to face relentless attacks.',
    pawnBreaks: [
      'd2-d4 (Breaking open lines for the remaining pieces)',
      'c2-c3 (Solidifying central piece batteries)'
    ],
    pieceGoals: [
      'Qf3+: Direct check pinning and battering the exposed d5 knight',
      'Nc3: Triple pressure on the pinned d5 knight',
      'O-O & Re1: Mobilizing the heavy artillery against the stranded king'
    ],
    tacticalThemes: [
      'Absolute pin exploitation on the d5 square',
      'Mating nets in the center with king chased to e6, d6, or c6'
    ],
    recommendedArrows: [
      ['g5', 'f7', 'rgba(239, 68, 68, 0.85)'],
      ['d1', 'f3', 'rgba(234, 179, 8, 0.85)'],
      ['b1', 'c3', 'rgba(34, 197, 94, 0.85)']
    ]
  },

  // --- SCOTCH: MIESES VARIATION ---
  'scotch-mieses': {
    title: 'Scotch Game: Mieses Dynamic Attack',
    keyIdea: 'White blows open the center on move 3 and thrusts 6.e5!, forcing Black\'s queen to e7 and setting up dynamic middlegame piece play.',
    pawnBreaks: [
      'd2-d4 (Immediate center liquidation on move 3)',
      'e4-e5 (Driving Black\'s f6 knight and creating territorial advantage)'
    ],
    pieceGoals: [
      'Qe2: Supporting the e5 pawn while unpinning the queen',
      'Ba3: Snipping across the a3-f8 diagonal to prevent Black castling',
      'Nc3: Fluid development reinforcing the central outposts'
    ],
    tacticalThemes: [
      'Pins along the central e-file against Black\'s queen and king',
      'Favorable queenside majority in simplified endgame structures'
    ],
    recommendedArrows: [
      ['d2', 'd4', 'rgba(59, 130, 246, 0.85)'],
      ['e4', 'e5', 'rgba(239, 68, 68, 0.85)'],
      ['d1', 'e2', 'rgba(34, 197, 94, 0.85)']
    ]
  },

  // --- QUEEN'S GAMBIT DECLINED: EXCHANGE ---
  'qgd-exchange': {
    title: 'QGD: Carlsbad Minority Attack',
    keyIdea: 'White executes the central exchange cxd5, establishing the celebrated Carlsbad pawn structure and launching a queenside minority attack with b4-b5.',
    pawnBreaks: [
      'b4-b5 (The minority attack creating a backward pawn on c6)',
      'e3-e4 (Alternative central breakthrough with piece dominance)'
    ],
    pieceGoals: [
      'Bg5: Pinning Black\'s defensive f6 knight',
      'Bd3: Dominating the b1-h7 diagonal aiming at Black\'s king',
      'Nge2 -> Ng3: Flexible knight placement guarding against bishop pins'
    ],
    tacticalThemes: [
      'Creating and sieging the weak c6 pawn along the open c-file',
      'Kingside sacrifices when Black overcommits to queenside defense'
    ],
    recommendedArrows: [
      ['c4', 'd5', 'rgba(239, 68, 68, 0.85)'],
      ['b2', 'b4', 'rgba(234, 179, 8, 0.85)'],
      ['c1', 'g5', 'rgba(34, 197, 94, 0.85)']
    ]
  },

  // --- LONDON SYSTEM ---
  'london-system': {
    title: 'London System: The Impenetrable Pyramid',
    keyIdea: 'White develops the dark-squared bishop to f4 before playing e3, building a rock-solid central pawn pyramid and aiming knights toward e5.',
    pawnBreaks: [
      'e3-e4 (Liberating central break once pieces are fully mobilized)',
      'c3-c4 (Alternative queenside opening when Black plays solidly)'
    ],
    pieceGoals: [
      'Bf4: Dominating the central diagonal outside the pawn chain',
      'Ne5: Cementing the iron horse in the heart of Black\'s position',
      'Bd3: Laser beam focused on Black\'s h7 kingside vulnerability'
    ],
    tacticalThemes: [
      'Kingside mating attacks using Ne5, Bd3, and Qh5',
      'Ultra-stable structure rendering Black tactical surprises ineffective'
    ],
    recommendedArrows: [
      ['c1', 'f4', 'rgba(34, 197, 94, 0.85)'],
      ['f3', 'e5', 'rgba(239, 68, 68, 0.85)'],
      ['f1', 'd3', 'rgba(59, 130, 246, 0.85)']
    ]
  },

  // --- KING'S INDIAN DEFENSE ---
  'kings-indian': {
    title: 'King\'s Indian: Mar del Plata Storm',
    keyIdea: 'Black allows White to occupy the center, then locks it with ...e5 and unleashes a ferocious kingside pawn storm with ...f5 and ...g5 against White\'s king.',
    pawnBreaks: [
      'f7-f5 (The thunderous kingside avalanche break)',
      'e7-e5 (Claiming the center before locking it with White\'s d5)'
    ],
    pieceGoals: [
      'Bg7: King\'s Indian bishop defending the king and waiting for open lines',
      'Nf6 -> Nh5/Ne8: Clearing the f-pawn to charge forward',
      'Rf8 & f4: Spearheading the kingside mating onslaught'
    ],
    tacticalThemes: [
      'Mating attacks on the h-file and g-file',
      'Dynamic sacrifices (Bxh3, g3) shattering White\'s kingside defense'
    ],
    recommendedArrows: [
      ['f7', 'f5', 'rgba(239, 68, 68, 0.85)'],
      ['g7', 'g5', 'rgba(234, 179, 8, 0.85)'],
      ['f8', 'g7', 'rgba(34, 197, 94, 0.85)']
    ]
  },

  // --- SLAV DEFENSE ---
  'slav-defense': {
    title: 'Slav Defense: The Solid Wall',
    keyIdea: 'Black reinforces the d5 center with 2...c6, maintaining open diagonals for the light-squared bishop and preparing counterpunches with ...dxc4 and ...b5.',
    pawnBreaks: [
      'c6-c5 (Thematic strike opening the center once White commits forces)',
      'e7-e5 (Alternative energetic break in open Slav lines)'
    ],
    pieceGoals: [
      'Bf5: Developing actively before playing ...e6',
      'Nbd7: Coordinated knight guarding c5 and e5',
      'Be7 & O-O: Sound, resilient castling safety'
    ],
    tacticalThemes: [
      'Queenside counterplay with ...b5 and ...a6',
      'Exploitation of overextended white center pawns'
    ],
    recommendedArrows: [
      ['c7', 'c6', 'rgba(234, 179, 8, 0.85)'],
      ['c8', 'f5', 'rgba(34, 197, 94, 0.85)'],
      ['b8', 'd7', 'rgba(59, 130, 246, 0.85)']
    ]
  },

  // --- KING'S GAMBIT ---
  'kings-gambit': {
    title: 'King\'s Gambit: The Immortal Blade',
    keyIdea: 'The quintessential Romantic opening. White sacrifices the f2-f4 pawn on move 2 to eliminate Black\'s e5 anchor, open the f-file for the rook, and dominate the center.',
    pawnBreaks: [
      'f2-f4 (The immortal sacrifice destabilizing Black\'s center)',
      'd2-d4 (Seizing total central dominance with tempo)',
      'e4-e5 (Driving Black\'s defending kingside pieces away)'
    ],
    pieceGoals: [
      'Bc4: Laser-guided attack directed at the vulnerable f7 square',
      'Nf3: Developed swiftly to prevent devastating ...Qh4+ checks',
      'O-O: Kingside rook arrives immediately on the open f-file'
    ],
    tacticalThemes: [
      'Bxf7+ sacrifices dragging the king into lethal tactical crossfire',
      'Fierce king hunts along open central and kingside files'
    ],
    recommendedArrows: [
      ['f2', 'f4', 'rgba(239, 68, 68, 0.85)'],
      ['f1', 'c4', 'rgba(34, 197, 94, 0.85)'],
      ['d2', 'd4', 'rgba(59, 130, 246, 0.85)']
    ]
  },

  // --- DANISH GAMBIT ---
  'danish-gambit': {
    title: 'Danish Gambit: Dual Bishop Crossfire',
    keyIdea: 'White sacrifices two pawns (c3 and b2) to plant a lethal pair of bishops on c4 and b2, raking Black\'s uncastled kingside.',
    pawnBreaks: [
      'c2-c3 (The first sacrifice offering)',
      'b2-b4 (The second sacrifice to clear the long diagonal)',
      'e4-e5 (Preventing Black from completing development)'
    ],
    pieceGoals: [
      'Bb2: The long-range sniper along the a1-h8 diagonal',
      'Bc4: Piercing the f7 weakness directly',
      'Qb3: Teaming up with the bishops for relentless tactical threats'
    ],
    tacticalThemes: [
      'Crushing discoveries and mating threats along the diagonal pair',
      'Rapid King hunt before Black can develop minor pieces'
    ],
    recommendedArrows: [
      ['c1', 'b2', 'rgba(239, 68, 68, 0.85)'],
      ['f1', 'c4', 'rgba(34, 197, 94, 0.85)'],
      ['d1', 'b3', 'rgba(234, 179, 8, 0.85)']
    ]
  },

  // --- SMITH-MORRA GAMBIT ---
  'smith-morra-gambit': {
    title: 'Smith-Morra Gambit: Rapid Open Files',
    keyIdea: 'White sacrifices the c-pawn against the Sicilian to gain rapid development, sweeping open the c- and d-files for rooks and pinning down Black\'s king.',
    pawnBreaks: [
      'c2-c3 (The initial gambit thrust tearing open the position)',
      'e4-e5 (Kicking Black\'s defensive pieces and splitting the board)'
    ],
    pieceGoals: [
      'Bc4: The Italian bishop taking aim at the weak f7 square',
      'Nc3: Fluid development controlling central squares',
      'Rc1 & Rd1: The signature rooks dominating the open central files'
    ],
    tacticalThemes: [
      'Sacrificial breakthroughs on e6 or d5 with minor pieces',
      'Pins along the d-file against the black Queen'
    ],
    recommendedArrows: [
      ['c2', 'c3', 'rgba(239, 68, 68, 0.85)'],
      ['f1', 'c4', 'rgba(34, 197, 94, 0.85)'],
      ['b1', 'c3', 'rgba(59, 130, 246, 0.85)']
    ]
  }
};

/**
 * Retrieves the Grandmaster Strategic Plan for a given variant.
 * Falls back to an automatic dynamic plan if not explicitly in the curated database.
 */
export const getStrategicPlan = (variant: OpeningVariant): StrategicPlan => {
  // 1. Direct ID lookup first
  if (STRATEGIC_PLANS[variant.id]) {
    return STRATEGIC_PLANS[variant.id];
  }

  const chapterLower = (variant.chapterName || '').toLowerCase();
  const nameLower = (variant.name || '').toLowerCase();
  const openingLower = (variant.openingName || '').toLowerCase();

  // 2. Vienna Game Chapter matches
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

  // 3. Opening Family fallbacks
  if (openingLower.includes('sicilian') && nameLower.includes('dragon')) {
    return STRATEGIC_PLANS['sicilian-dragon'];
  }
  if (openingLower.includes('sicilian') && nameLower.includes('alapin')) {
    return STRATEGIC_PLANS['sicilian-alapin'];
  }
  if (openingLower.includes('sicilian')) {
    return STRATEGIC_PLANS['sicilian-najdorf'];
  }
  if (openingLower.includes('caro-kann') && nameLower.includes('advance')) {
    return STRATEGIC_PLANS['caro-kann-advance'];
  }
  if (openingLower.includes('caro-kann')) {
    return STRATEGIC_PLANS['caro-kann-classical'];
  }
  if (openingLower.includes('french') && nameLower.includes('advance')) {
    return STRATEGIC_PLANS['french-advance'];
  }
  if (openingLower.includes('french')) {
    return STRATEGIC_PLANS['french-winawer'];
  }
  if (openingLower.includes('ruy') && nameLower.includes('morphy')) {
    return STRATEGIC_PLANS['ruy-lopez-morphy'];
  }
  if (openingLower.includes('ruy')) {
    return STRATEGIC_PLANS['ruy-lopez-berlin'];
  }
  if (openingLower.includes('italian') && nameLower.includes('evans')) {
    return STRATEGIC_PLANS['italian-evans-gambit'];
  }
  if (openingLower.includes('italian') || openingLower.includes('giuoco')) {
    return STRATEGIC_PLANS['italian-giuoco-piano'];
  }
  if (openingLower.includes('fried liver') || nameLower.includes('fried liver')) {
    return STRATEGIC_PLANS['italian-fried-liver'];
  }
  if (openingLower.includes('scotch')) {
    return STRATEGIC_PLANS['scotch-mieses'];
  }
  if (openingLower.includes('london')) {
    return STRATEGIC_PLANS['london-system'];
  }
  if (openingLower.includes('indian')) {
    return STRATEGIC_PLANS['kings-indian'];
  }
  if (openingLower.includes('slav')) {
    return STRATEGIC_PLANS['slav-defense'];
  }
  if (openingLower.includes('king\'s gambit')) {
    return STRATEGIC_PLANS['kings-gambit'];
  }
  if (openingLower.includes('danish')) {
    return STRATEGIC_PLANS['danish-gambit'];
  }

  // General Vienna fallback
  if (openingLower.includes('vienna') || chapterLower.includes('vienna')) {
    return STRATEGIC_PLANS['vienna-gambit-accepted'];
  }

  // 4. Generic dynamic fallback
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
