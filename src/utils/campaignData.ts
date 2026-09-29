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
        title: 'Sicilian Defense: Najdorf',
        subtitle: 'Sharp Asymmetric Counterplay',
        variantId: 'sicilian-najdorf',
        description: 'Fischer and Kasparov\'s ultimate weapon. Fight for the center asymmetrically with dynamic flank play.'
      },
      {
        id: 'asym-lvl-2',
        levelNumber: 2,
        title: 'Caro-Kann Defense: Classical',
        subtitle: 'Steel Pawn Structure (1.e4 c6)',
        variantId: 'caro-kann-classical',
        description: 'Rock-solid structure neutralizing White\'s initiative and punishing overambitious attacks.'
      },
      {
        id: 'asym-lvl-boss',
        levelNumber: 3,
        title: 'World Boss: Sicilian Bastion',
        subtitle: 'Najdorf Sparring vs AI Bot',
        variantId: 'sicilian-najdorf',
        isBoss: true,
        bossDifficulty: 'master',
        description: 'Prove your strategic mastery by converting dynamic Sicilian advantages into victory against the AI.'
      }
    ]
  },
  {
    id: 'world-3-open-classics',
    worldNumber: 3,
    title: 'The Open Classics',
    subtitle: 'The Grand Spanish School',
    description: 'The positional bedrock of classical chess featuring 1.e4 e5 and the legendary Berlin Wall.',
    theme: 'sapphire',
    levels: [
      {
        id: 'open-lvl-1',
        levelNumber: 1,
        title: 'Ruy Lopez: Berlin Defense',
        subtitle: 'The Berlin Wall (3...Nf6)',
        variantId: 'ruy-lopez-berlin',
        description: 'The impenetrable fortress used by Vladimir Kramnik to dethrone Garry Kasparov in the World Championship.'
      },
      {
        id: 'open-lvl-boss',
        levelNumber: 2,
        title: 'World Boss: Berlin Fortress Duel',
        subtitle: 'Positional Endgame Sparring vs Bot',
        variantId: 'ruy-lopez-berlin',
        isBoss: true,
        bossDifficulty: 'master',
        description: 'Withstand the pressure, mobilize the bishop pair, and neutralize White\'s activity in a masterclass endgame.'
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
