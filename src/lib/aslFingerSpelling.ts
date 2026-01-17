// ASL Fingerspelling hand shape data
// Each letter maps to a description and SVG path data for the hand shape

export interface ASLHandShape {
  letter: string;
  description: string;
  // Simplified finger positions: [thumb, index, middle, ring, pinky]
  // Values: 'up' | 'down' | 'bent' | 'out' | 'across'
  fingers: {
    thumb: 'up' | 'out' | 'across' | 'tucked';
    index: 'up' | 'down' | 'bent' | 'point';
    middle: 'up' | 'down' | 'bent';
    ring: 'up' | 'down' | 'bent';
    pinky: 'up' | 'down' | 'bent' | 'out';
  };
  // Wrist rotation in degrees
  rotation: number;
}

export const aslAlphabet: Record<string, ASLHandShape> = {
  A: {
    letter: 'A',
    description: 'Fist with thumb alongside',
    fingers: { thumb: 'up', index: 'down', middle: 'down', ring: 'down', pinky: 'down' },
    rotation: 0,
  },
  B: {
    letter: 'B',
    description: 'Flat hand, fingers up, thumb across palm',
    fingers: { thumb: 'across', index: 'up', middle: 'up', ring: 'up', pinky: 'up' },
    rotation: 0,
  },
  C: {
    letter: 'C',
    description: 'Curved hand like holding a ball',
    fingers: { thumb: 'out', index: 'bent', middle: 'bent', ring: 'bent', pinky: 'bent' },
    rotation: 0,
  },
  D: {
    letter: 'D',
    description: 'Index up, others touch thumb',
    fingers: { thumb: 'out', index: 'up', middle: 'bent', ring: 'bent', pinky: 'bent' },
    rotation: 0,
  },
  E: {
    letter: 'E',
    description: 'Fingers bent, thumb tucked',
    fingers: { thumb: 'across', index: 'bent', middle: 'bent', ring: 'bent', pinky: 'bent' },
    rotation: 0,
  },
  F: {
    letter: 'F',
    description: 'Thumb and index touch, others up',
    fingers: { thumb: 'out', index: 'bent', middle: 'up', ring: 'up', pinky: 'up' },
    rotation: 0,
  },
  G: {
    letter: 'G',
    description: 'Index and thumb pointing sideways',
    fingers: { thumb: 'out', index: 'point', middle: 'down', ring: 'down', pinky: 'down' },
    rotation: 90,
  },
  H: {
    letter: 'H',
    description: 'Index and middle pointing sideways',
    fingers: { thumb: 'tucked', index: 'point', middle: 'up', ring: 'down', pinky: 'down' },
    rotation: 90,
  },
  I: {
    letter: 'I',
    description: 'Pinky up, others closed',
    fingers: { thumb: 'across', index: 'down', middle: 'down', ring: 'down', pinky: 'up' },
    rotation: 0,
  },
  J: {
    letter: 'J',
    description: 'Pinky up with J motion',
    fingers: { thumb: 'across', index: 'down', middle: 'down', ring: 'down', pinky: 'up' },
    rotation: -30,
  },
  K: {
    letter: 'K',
    description: 'Index and middle up in V, thumb between',
    fingers: { thumb: 'out', index: 'up', middle: 'up', ring: 'down', pinky: 'down' },
    rotation: 0,
  },
  L: {
    letter: 'L',
    description: 'L shape with thumb and index',
    fingers: { thumb: 'out', index: 'up', middle: 'down', ring: 'down', pinky: 'down' },
    rotation: 0,
  },
  M: {
    letter: 'M',
    description: 'Three fingers over thumb',
    fingers: { thumb: 'tucked', index: 'down', middle: 'down', ring: 'down', pinky: 'down' },
    rotation: 0,
  },
  N: {
    letter: 'N',
    description: 'Two fingers over thumb',
    fingers: { thumb: 'tucked', index: 'down', middle: 'down', ring: 'down', pinky: 'down' },
    rotation: 0,
  },
  O: {
    letter: 'O',
    description: 'Fingers and thumb form O',
    fingers: { thumb: 'out', index: 'bent', middle: 'bent', ring: 'bent', pinky: 'bent' },
    rotation: 0,
  },
  P: {
    letter: 'P',
    description: 'K hand pointing down',
    fingers: { thumb: 'out', index: 'point', middle: 'up', ring: 'down', pinky: 'down' },
    rotation: 180,
  },
  Q: {
    letter: 'Q',
    description: 'G hand pointing down',
    fingers: { thumb: 'out', index: 'point', middle: 'down', ring: 'down', pinky: 'down' },
    rotation: 180,
  },
  R: {
    letter: 'R',
    description: 'Index and middle crossed',
    fingers: { thumb: 'across', index: 'up', middle: 'up', ring: 'down', pinky: 'down' },
    rotation: 0,
  },
  S: {
    letter: 'S',
    description: 'Fist with thumb across fingers',
    fingers: { thumb: 'across', index: 'down', middle: 'down', ring: 'down', pinky: 'down' },
    rotation: 0,
  },
  T: {
    letter: 'T',
    description: 'Thumb between index and middle',
    fingers: { thumb: 'up', index: 'down', middle: 'down', ring: 'down', pinky: 'down' },
    rotation: 0,
  },
  U: {
    letter: 'U',
    description: 'Index and middle up together',
    fingers: { thumb: 'across', index: 'up', middle: 'up', ring: 'down', pinky: 'down' },
    rotation: 0,
  },
  V: {
    letter: 'V',
    description: 'Index and middle up in V',
    fingers: { thumb: 'across', index: 'up', middle: 'up', ring: 'down', pinky: 'down' },
    rotation: 0,
  },
  W: {
    letter: 'W',
    description: 'Index, middle, ring up',
    fingers: { thumb: 'across', index: 'up', middle: 'up', ring: 'up', pinky: 'down' },
    rotation: 0,
  },
  X: {
    letter: 'X',
    description: 'Index bent like hook',
    fingers: { thumb: 'across', index: 'bent', middle: 'down', ring: 'down', pinky: 'down' },
    rotation: 0,
  },
  Y: {
    letter: 'Y',
    description: 'Thumb and pinky out',
    fingers: { thumb: 'out', index: 'down', middle: 'down', ring: 'down', pinky: 'out' },
    rotation: 0,
  },
  Z: {
    letter: 'Z',
    description: 'Index draws Z in air',
    fingers: { thumb: 'across', index: 'point', middle: 'down', ring: 'down', pinky: 'down' },
    rotation: 0,
  },
  ' ': {
    letter: ' ',
    description: 'Space - brief pause',
    fingers: { thumb: 'tucked', index: 'down', middle: 'down', ring: 'down', pinky: 'down' },
    rotation: 0,
  },
};

export function getHandShapeForLetter(letter: string): ASLHandShape | null {
  const upper = letter.toUpperCase();
  return aslAlphabet[upper] || null;
}

export function messageToHandShapes(message: string): ASLHandShape[] {
  return message
    .split('')
    .map((char) => getHandShapeForLetter(char))
    .filter((shape): shape is ASLHandShape => shape !== null);
}
