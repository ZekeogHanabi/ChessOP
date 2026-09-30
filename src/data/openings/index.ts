import { OpeningVariant } from '../../types';
import { E4_ASYMMETRIC_OPENINGS } from './e4_asymmetric';
import { E4_OPEN_OPENINGS } from './e4_open';
import { D4_SYSTEM_OPENINGS } from './d4_systems';
import { GAMBITS_OPENINGS } from './gambits';

export * from './e4_asymmetric';
export * from './e4_open';
export * from './d4_systems';
export * from './gambits';

export const OPENING_VARIANTS: OpeningVariant[] = [
  ...E4_ASYMMETRIC_OPENINGS,
  ...E4_OPEN_OPENINGS,
  ...D4_SYSTEM_OPENINGS,
  ...GAMBITS_OPENINGS
];
