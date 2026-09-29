import { CampaignWorld, OpeningVariant } from '../types';

export const CAMPAIGN_WORLDS: CampaignWorld[] = [
  {
    id: 'world-1-vienna',
    worldNumber: 1,
    title: 'Reino del Gambito Vienés',
    subtitle: 'El Dominio Agresivo de 1.e4 e5 2.Nc3',
    description: 'Aprende paso a paso las 8 variantes maestras de la Apertura Vienesa y derrota al Gran Maestro de la IA en el duelo de Sparring final.',
    theme: 'gold',
    levels: [
      {
        id: 'vienna-lvl-1',
        levelNumber: 1,
        title: 'Ataque Steinitz-Paulsen',
        subtitle: 'Línea Principal (3...d5)',
        variantId: 'vienna-pgn-ch1-line0',
        description: 'Enfrenta la réplica más sólida de las negras con el incisivo 5.Qf3! dominando el centro.'
      },
      {
        id: 'vienna-lvl-2',
        levelNumber: 2,
        title: 'Aceptando el Fuego',
        subtitle: 'Gambito Aceptado (3...exf4)',
        variantId: 'vienna-pgn-ch2-line0',
        description: 'Castiga la entrega del centro con el avance temático 4.e5!, desalojando el caballo negro.'
      },
      {
        id: 'vienna-lvl-3',
        levelNumber: 3,
        title: 'Contragolpe de Caballo',
        subtitle: 'Gambito Declinado (3...Nc6)',
        variantId: 'vienna-pgn-ch3-line0',
        description: 'Aprovecha el error posicional negro con 4.fxe5! y 5.d4! formando un rodillo central arrollador.'
      },
      {
        id: 'vienna-lvl-4',
        levelNumber: 4,
        title: 'La Bóveda de Peón',
        subtitle: 'Defensa Pasiva (3...d6)',
        variantId: 'vienna-pgn-ch4-line0',
        description: 'Asedia la estructura tipo Philidor con 4.Nf3, 5.h3 y la avalancha de peones en el flanco de rey.'
      },
      {
        id: 'vienna-lvl-5',
        levelNumber: 5,
        title: 'El Espejo Peligroso',
        subtitle: 'Ataque a la Dama (3...Bc5)',
        variantId: 'vienna-pgn-ch5-line0',
        description: 'Explotar la salida prematura del alfil negro con la agresiva 4.Qg4! Qf6 5.Nd5!.'
      },
      {
        id: 'vienna-lvl-6',
        levelNumber: 6,
        title: 'Transición Italiana',
        subtitle: 'Estructura Clásica (4.d3)',
        variantId: 'vienna-pgn-ch6-line0',
        description: 'Desarrollo posicional sólido preparando las rupturas temáticas f4-f5 en el momento idóneo.'
      },
      {
        id: 'vienna-lvl-7',
        levelNumber: 7,
        title: 'Caza de Alfiles',
        subtitle: 'Defensa Posicional (3...Na5)',
        variantId: 'vienna-pgn-ch7-line0',
        description: 'Preserva la pareja de alfiles con 4.Be2! manteniendo la armonía de piezas blancas.'
      },
      {
        id: 'vienna-lvl-8',
        levelNumber: 8,
        title: 'Desvíos y Sorpresas',
        subtitle: 'Refutación de Secundarias (2...Bc5)',
        variantId: 'vienna-pgn-ch8-line0',
        description: 'Castiga con precisión quirúrgica las líneas irregulares y desvíos tempranos de las negras.'
      },
      {
        id: 'vienna-lvl-boss',
        levelNumber: 9,
        title: 'Jefe de Mundo: Duelo Vienés',
        subtitle: 'Sparring Post-Teoría vs Bot',
        variantId: 'vienna-pgn-ch1-line0',
        isBoss: true,
        bossDifficulty: 'intermediate',
        description: '¡Prueba de fuego! Juega el medio juego resultante de la Apertura Vienesa contra el motor de IA.'
      }
    ]
  },
  {
    id: 'world-2-asymmetric',
    worldNumber: 2,
    title: 'Las Murallas Negras',
    subtitle: 'Defensas Asimétricas de Élite',
    description: 'Domina los contraataques más respetados del ajedrez moderno jugando con las piezas negras.',
    theme: 'emerald',
    levels: [
      {
        id: 'asym-lvl-1',
        levelNumber: 1,
        title: 'Defensa Siciliana: Najdorf',
        subtitle: 'Contrajuego Asimétrico Afilado',
        variantId: 'sicilian-najdorf',
        description: 'La defensa favorita de Kasparov y Fischer. Lucha asimétrica por el centro con peón c.'
      },
      {
        id: 'asym-lvl-2',
        levelNumber: 2,
        title: 'Defensa Caro-Kann: Clásica',
        subtitle: 'Estructura de Acero (1.e4 c6)',
        variantId: 'caro-kann-classical',
        description: 'Solidez granítica para neutralizar la iniciativa blanca y castigar el exceso de ambición.'
      },
      {
        id: 'asym-lvl-boss',
        levelNumber: 3,
        title: 'Jefe de Mundo: Bastión Siciliano',
        subtitle: 'Sparring vs Bot en Posición Najdorf',
        variantId: 'sicilian-najdorf',
        isBoss: true,
        bossDifficulty: 'master',
        description: 'Demuestra tu comprensión estratégica convirtiendo el dinamismo siciliano en victoria contra el Bot.'
      }
    ]
  },
  {
    id: 'world-3-open-classics',
    worldNumber: 3,
    title: 'Los Clásicos Abiertos',
    subtitle: 'La Gran Escuela Española',
    description: 'Los pilares posicionales del ajedrez tradicional con 1.e4 e5 y el Muro de Berlín.',
    theme: 'sapphire',
    levels: [
      {
        id: 'open-lvl-1',
        levelNumber: 1,
        title: 'Ruy Lopez: Muro de Berlín',
        subtitle: 'Defensa Berlinesa (3...Nf6)',
        variantId: 'ruy-lopez-berlin',
        description: 'La muralla que Vladimir Kramnik utilizó para derrocar a Garry Kasparov en el Campeonato Mundial.'
      },
      {
        id: 'open-lvl-boss',
        levelNumber: 2,
        title: 'Jefe de Mundo: Duelo de la Berlinesa',
        subtitle: 'Final Posicional vs Bot',
        variantId: 'ruy-lopez-berlin',
        isBoss: true,
        bossDifficulty: 'master',
        description: 'Aguanta la presión y neutraliza la actividad de las piezas blancas en un final magistral.'
      }
    ]
  }
];

/**
 * Resuelve una variante del repertorio correspondiente a un nivel de la campaña
 */
export const findVariantForLevel = (
  level: { variantId: string; levelNumber?: number },
  allVariants: OpeningVariant[]
): OpeningVariant | undefined => {
  // 1. Intento por ID exacto
  let found = allVariants.find(v => v.id === level.variantId);
  if (found) return found;

  // 2. Si es de la vienesa y busca ch1, ch2, etc.
  const chMatch = level.variantId.match(/ch(\d+)/);
  if (chMatch) {
    const chapterIdx = parseInt(chMatch[1], 10);
    found = allVariants.find(v => v.chapterIndex === chapterIdx);
    if (found) return found;
  }

  // 3. Fallback al primer variant si existe
  return allVariants.find(v => v.id.includes('vienna') || v.openingName.includes('Vienna')) || allVariants[0];
};
