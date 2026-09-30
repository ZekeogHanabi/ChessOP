import { CampaignWorld, OpeningVariant } from '../types';

export const CAMPAIGN_WORLDS: CampaignWorld[] = [
  {
    id: 'world-1-vienna',
    worldNumber: 1,
    title: 'Realm of the Vienna Gambit',
    subtitle: 'Aggressive Mastery of 1.e4 e5 2.Nc3',
    description: 'Master the 8 core chapters of the Vienna Game step by step and defeat the AI Master in the final Sparring Duel.',
    theme: 'gold',
    levels: [
      {
        id: 'vienna-lvl-1',
        levelNumber: 1,
        title: 'Steinitz-Paulsen Attack',
        subtitle: 'Main Line (3...d5)',
        variantId: 'vienna-pgn-ch1-line0',
        description: 'Meet Black\'s most principled counterstrike with the incisive 5.Qf3!, asserting total center dominance.'
      },
      {
        id: 'vienna-lvl-2',
        levelNumber: 2,
        title: 'Accepting the Fire',
        subtitle: 'Gambit Accepted (3...exf4)',
        variantId: 'vienna-pgn-ch2-line0',
        description: 'Punish the concession of the center with the thematic 4.e5! push, evicting Black\'s key knight.'
      },
      {
        id: 'vienna-lvl-3',
        levelNumber: 3,
        title: 'Knight Counter',
        subtitle: 'Gambit Declined (3...Nc6)',
        variantId: 'vienna-pgn-ch3-line0',
        description: 'Capitalize on Black\'s premature knight move with 4.fxe5! and 5.d4!, setting up an unstoppable central pawn roller.'
      },
      {
        id: 'vienna-lvl-4',
        levelNumber: 4,
        title: 'The Pawn Vault',
        subtitle: 'Passive Defense (3...d6)',
        variantId: 'vienna-pgn-ch4-line0',
        description: 'Besiege the Philidor-style pawn shell with 4.Nf3, 5.h3, and a crushing kingside pawn avalanche.'
      },
      {
        id: 'vienna-lvl-5',
        levelNumber: 5,
        title: 'The Queen\'s Mirror',
        subtitle: 'Early Bishop Attack (3...Bc5)',
        variantId: 'vienna-pgn-ch5-line0',
        description: 'Exploit Black\'s premature bishop development with the tactical 4.Qg4! Qf6 5.Nd5!.'
      },
      {
        id: 'vienna-lvl-6',
        levelNumber: 6,
        title: 'Italian Transition',
        subtitle: 'Classical Structure (4.d3)',
        variantId: 'vienna-pgn-ch6-line0',
        description: 'Solid positional development preparing the decisive f4-f5 breakthrough at the optimal moment.'
      },
      {
        id: 'vienna-lvl-7',
        levelNumber: 7,
        title: 'Bishop Hunt',
        subtitle: 'Positional Defense (3...Na5)',
        variantId: 'vienna-pgn-ch7-line0',
        description: 'Preserve your powerful bishop pair with 4.Be2!, maintaining harmonious piece coordination.'
      },
      {
        id: 'vienna-lvl-8',
        levelNumber: 8,
        title: 'Sidelines & Surprises',
        subtitle: 'Early Deviations (2...Bc5)',
        variantId: 'vienna-pgn-ch8-line0',
        description: 'Punish irregular sidelines and early bishop detours with surgical theoretical precision.'
      },
      {
        id: 'vienna-lvl-boss',
        levelNumber: 9,
        title: 'World Boss: Vienna Sparring Duel',
        subtitle: 'Post-Theory Bot Sparring',
        variantId: 'vienna-pgn-ch1-line0',
        isBoss: true,
        bossDifficulty: 'intermediate',
        description: 'The trial by fire! Convert your theoretical advantage into a full victory against the AI sparring bot.'
      }
    ]
  },
  {
    id: 'world-2-asymmetric',
    worldNumber: 2,
    title: 'The Black Fortresses',
    subtitle: 'Elite Asymmetric Defenses',
    description: 'Master the most feared counterattacking weapons in modern chess playing from the Black perspective.',
    theme: 'emerald',
    levels: [
      {
        id: 'asym-lvl-1',
        levelNumber: 1,
        title: 'Najdorf Counter-Strike',
        subtitle: 'Sicilian Defense: Najdorf',
        variantId: 'sicilian-najdorf',
        description: 'Fischer and Kasparov\'s ultimate weapon. Fight for the center asymmetrically with dynamic flank play.'
      },
      {
        id: 'asym-lvl-2',
        levelNumber: 2,
        title: 'The Dragon\'s Breath',
        subtitle: 'Sicilian Defense: Dragon',
        variantId: 'sicilian-dragon',
        description: 'Unleash the dark-squared bishop along the great diagonal and strike the enemy King in opposite-castling warfare.'
      },
      {
        id: 'asym-lvl-3',
        levelNumber: 3,
        title: 'The Steel Fortress',
        subtitle: 'Caro-Kann: Classical',
        variantId: 'caro-kann-classical',
        description: 'Rock-solid structure neutralizing White\'s initiative and converting positional advantages into endgame triumph.'
      },
      {
        id: 'asym-lvl-4',
        levelNumber: 4,
        title: 'Advance Infiltration',
        subtitle: 'Caro-Kann: Advance',
        variantId: 'caro-kann-advance',
        description: 'Develop the light bishop actively outside the pawn chain and batter the d4 base with ...c5 and ...Qb6.'
      },
      {
        id: 'asym-lvl-5',
        levelNumber: 5,
        title: 'The Winawer Bastion',
        subtitle: 'French Defense: Winawer',
        variantId: 'french-winawer',
        description: 'Pin the white knight with 3...Bb4, inflict doubled pawns on the queenside, and launch a furious counterattack.'
      },
      {
        id: 'asym-lvl-6',
        levelNumber: 6,
        title: 'Siege of the Center',
        subtitle: 'French Defense: Advance',
        variantId: 'french-advance',
        description: 'Lay relentless siege to the d4 pawn pyramid with the combined firepower of ...c5, ...Nc6, and ...Qb6.'
      },
      {
        id: 'asym-lvl-boss',
        levelNumber: 7,
        title: 'World Boss: Dragon Bastion Duel',
        subtitle: 'Tactical Sicilian Sparring vs AI Bot',
        variantId: 'sicilian-dragon',
        isBoss: true,
        bossDifficulty: 'master',
        description: 'Convert dynamic Sicilian advantages into victory against the master AI in a tactical sparring clash.'
      }
    ]
  },
  {
    id: 'world-3-open-classics',
    worldNumber: 3,
    title: 'The Open Classics',
    subtitle: 'The Grand Spanish & Italian Academy',
    description: 'The positional bedrock and romantic tactical roots of classical chess featuring 1.e4 e5.',
    theme: 'sapphire',
    levels: [
      {
        id: 'open-lvl-1',
        levelNumber: 1,
        title: 'The Berlin Wall',
        subtitle: 'Ruy Lopez: Berlin Defense',
        variantId: 'ruy-lopez-berlin',
        description: 'The impenetrable fortress used by Vladimir Kramnik to neutralize Garry Kasparov in the World Championship.'
      },
      {
        id: 'open-lvl-2',
        levelNumber: 2,
        title: 'The Spanish Masterpiece',
        subtitle: 'Ruy Lopez: Morphy Main Line',
        variantId: 'ruy-lopez-morphy',
        description: 'The crowning glory of classical chess: master the knight maneuver d2-f1-g3 and build the mighty Spanish center.'
      },
      {
        id: 'open-lvl-3',
        levelNumber: 3,
        title: 'The Quiet Harmony',
        subtitle: 'Italian Game: Giuoco Piano',
        variantId: 'italian-giuoco-piano',
        description: 'Harmonious piece coordination targeting f7, supported by the patient c3 and d3 central foundation.'
      },
      {
        id: 'open-lvl-4',
        levelNumber: 4,
        title: 'Romantic Fireworks',
        subtitle: 'Italian Game: Evans Gambit',
        variantId: 'italian-evans-gambit',
        description: 'Sacrifice the b-pawn for rapid tempo, build a colossal pawn center, and blast open lines against the uncastled King.'
      },
      {
        id: 'open-lvl-5',
        levelNumber: 5,
        title: 'Sacrificial Carnage',
        subtitle: 'Two Knights: Fried Liver Attack',
        variantId: 'italian-fried-liver',
        description: 'Execute the audacious 6.Nxf7! knight sacrifice, dragging the enemy king into the center of the board.'
      },
      {
        id: 'open-lvl-6',
        levelNumber: 6,
        title: 'Dynamic Strike',
        subtitle: 'Scotch Game: Mieses Variation',
        variantId: 'scotch-mieses',
        description: 'Blow open the center on move 3 and establish relentless pressure with 6.e5! and 7.Qe2.'
      },
      {
        id: 'open-lvl-boss',
        levelNumber: 7,
        title: 'World Boss: Italian Colosseum Duel',
        subtitle: 'Open Game Sparring vs AI Bot',
        variantId: 'italian-evans-gambit',
        isBoss: true,
        bossDifficulty: 'master',
        description: 'Demonstrate tactical precision and conversion technique against the master AI in an open sparring duel.'
      }
    ]
  },
  {
    id: 'world-4-granite-empires',
    worldNumber: 4,
    title: 'The Granite Empires',
    subtitle: '1.d4 Classical & Hypermodern Clashes',
    description: 'Command the royal d4 systems: from the impregnable London pyramid and Carlsbad structures to the hypermodern Mar del Plata avalanche.',
    theme: 'gold',
    levels: [
      {
        id: 'd4-lvl-1',
        levelNumber: 1,
        title: 'The Carlsbad Minority',
        subtitle: 'QGD: Exchange Variation',
        variantId: 'qgd-exchange',
        description: 'Master the celebrated pawn exchange and launch the queenside minority attack with b4-b5.'
      },
      {
        id: 'd4-lvl-2',
        levelNumber: 2,
        title: 'Tartakower\'s Bastion',
        subtitle: 'QGD: Tartakower Defense',
        variantId: 'qgd-tartakower',
        description: 'Solve the light-squared bishop challenge with ...h6 and ...b6 for an unbreakable pawn structure.'
      },
      {
        id: 'd4-lvl-3',
        levelNumber: 3,
        title: 'The London Citadel',
        subtitle: 'London System: Classical',
        variantId: 'london-system',
        description: 'Erect the granite pawn pyramid with 2.Bf4 and establish an immovable knight outpost on e5.'
      },
      {
        id: 'd4-lvl-4',
        levelNumber: 4,
        title: 'Mar del Plata Storm',
        subtitle: 'King\'s Indian Defense',
        variantId: 'kings-indian',
        description: 'Lock the center and charge forward on the kingside with the ferocious ...f5 pawn avalanche.'
      },
      {
        id: 'd4-lvl-5',
        levelNumber: 5,
        title: 'The Granite Wall',
        subtitle: 'Slav Defense: Classical',
        variantId: 'slav-defense',
        description: 'Defend d5 with 2...c6, liberate the bishop to f5, and strike back against White\'s center.'
      },
      {
        id: 'd4-lvl-boss',
        levelNumber: 6,
        title: 'World Boss: King\'s Indian Mating Duel',
        subtitle: 'Hypermodern Sparring vs Master AI',
        variantId: 'kings-indian',
        isBoss: true,
        bossDifficulty: 'master',
        description: 'Weather the queenside storm and deliver checkmate against the Master AI in a high-stakes sparring duel.'
      }
    ]
  },
  {
    id: 'world-5-romantic-gambits',
    worldNumber: 5,
    title: 'The Romantic Gambits',
    subtitle: 'Sacrificial Fire & King Hunts',
    description: 'Relive the golden age of chess: sacrifice material for blistering tempi, raking diagonals, and devastating king attacks.',
    theme: 'emerald',
    levels: [
      {
        id: 'gambit-lvl-1',
        levelNumber: 1,
        title: 'The King\'s Blade',
        subtitle: 'King\'s Gambit: Knight Variation',
        variantId: 'kings-gambit',
        description: 'Sacrifice the f-pawn on move 2 to blast open the f-file and rule the center in the immortal Romantic style.'
      },
      {
        id: 'gambit-lvl-2',
        levelNumber: 2,
        title: 'Dual Bishop Crossfire',
        subtitle: 'Danish Gambit: Accepted',
        variantId: 'danish-gambit',
        description: 'Sacrifice two full pawns to set up a terrifying pair of bishops raking the undefended black kingside.'
      },
      {
        id: 'gambit-lvl-3',
        levelNumber: 3,
        title: 'The Sicilian Sacrifice',
        subtitle: 'Smith-Morra Gambit',
        variantId: 'smith-morra-gambit',
        description: 'Tear open the c- and d-files against the Sicilian Defense with the energetic 2.d4 and 3.c3 pawn offer.'
      },
      {
        id: 'gambit-lvl-boss',
        levelNumber: 4,
        title: 'World Boss: Romantic King Hunt',
        subtitle: 'Sacrificial Gambit Sparring vs Bot',
        variantId: 'kings-gambit',
        isBoss: true,
        bossDifficulty: 'master',
        description: 'Convert overwhelming sacrificial initiative into a king hunt victory against the master AI.'
      }
    ]
  }
];

/**
 * Resolves a repertoire variation corresponding to a campaign level
 */
export const findVariantForLevel = (
  level: { variantId: string; levelNumber?: number },
  allVariants: OpeningVariant[]
): OpeningVariant | undefined => {
  // 1. Try exact ID match
  let found = allVariants.find(v => v.id === level.variantId);
  if (found) return found;

  // 2. If it's a Vienna chapter (e.g. ch1, ch2)
  const chMatch = level.variantId.match(/ch(\d+)/);
  if (chMatch) {
    const chapterIdx = parseInt(chMatch[1], 10);
    found = allVariants.find(v => v.chapterIndex === chapterIdx);
    if (found) return found;
  }

  // 3. Fallback to first Vienna or any variant
  return allVariants.find(v => v.id.includes('vienna') || v.openingName.includes('Vienna')) || allVariants[0];
};
