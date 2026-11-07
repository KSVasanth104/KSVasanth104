// Shared colour theme for "Diwali Mom".
//
// Environment colours come in two palettes with identical keys: COLD (scenes 1-3)
// and WARM (scene 4 onwards). `mixPalette(t)` crossfades between them, so every
// set piece reads its colours from the mixed palette and the whole film warms up
// smoothly when the son arrives.
//
// Character colours are fixed; the global colour grade (GRADE) tints them so they
// sit inside the scene's mood.

import {interpolateColors} from 'remotion';

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 1140, // 38 s
} as const;

export const COLD = {
  sky: '#141c2c',
  skyLow: '#26344c',
  wallTop: '#3a475d',
  wallBottom: '#2b3548',
  wallTrim: '#222b3a',
  wallDeco: '#47556d',
  floor: '#252f40',
  floorFar: '#303b4f',
  floorLine: '#1c2432',
  wood: '#465061',
  woodDark: '#323a49',
  woodLight: '#5b6577',
  fabric: '#4f5a73',
  fabricDark: '#3d4760',
  fabricLight: '#6f7b97',
  sheet: '#97a3b9',
  sheetShade: '#76829a',
  steel: '#a3afc3',
  steelDark: '#68748a',
  glass: '#161e30',
  glassGlow: '#33476a',
  light: '#b6c8e8',
  lightSoft: '#7f95bd',
  shadow: '#0c111b',
  accent: '#6a7b9c',
  accent2: '#56688a',
  food: '#d9dfe8',
  foodShade: '#aab4c4',
  text: '#e7eefa',
  textGlow: 'rgba(140,170,225,0.55)',
  dust: '#c8d7f2',
};

export type Palette = typeof COLD;

export const WARM: Palette = {
  sky: '#1d1431',
  skyLow: '#4b2a45',
  wallTop: '#e5a35c',
  wallBottom: '#c47b3f',
  wallTrim: '#8f4b22',
  wallDeco: '#f0b86e',
  floor: '#7b3f22',
  floorFar: '#96522c',
  floorLine: '#5e2e17',
  wood: '#8c4b25',
  woodDark: '#62331a',
  woodLight: '#b46d37',
  fabric: '#b8322f',
  fabricDark: '#8a2122',
  fabricLight: '#e0583f',
  sheet: '#f4dfb6',
  sheetShade: '#d9b98b',
  steel: '#ead4a8',
  steelDark: '#a88858',
  glass: '#2a1c3c',
  glassGlow: '#7c4a5f',
  light: '#ffd28c',
  lightSoft: '#ffb25b',
  shadow: '#3a1607',
  accent: '#f2b544',
  accent2: '#d9622b',
  food: '#fff3dc',
  foodShade: '#e8c99a',
  text: '#fff4dc',
  textGlow: 'rgba(255,165,60,0.7)',
  dust: '#ffd89a',
};

/** Crossfade every environment colour. t = 0 → COLD, t = 1 → WARM. */
export const mixPalette = (t: number): Palette => {
  if (t <= 0) return COLD;
  if (t >= 1) return WARM;
  const out = {} as Palette;
  (Object.keys(COLD) as (keyof Palette)[]).forEach((k) => {
    const a = COLD[k];
    const b = WARM[k];
    out[k] = a.startsWith('#') && b.startsWith('#') ? interpolateColors(t, [0, 1], [a, b]) : t < 0.5 ? a : b;
  });
  return out;
};

/** Food / festive colours that only appear once the film is warm. */
export const FESTIVE = {
  marigold: '#f59e1b',
  marigoldDark: '#d9741a',
  rangoliPink: '#e2457a',
  rangoliBlue: '#2f8fc9',
  rangoliGreen: '#3aa569',
  laddoo: '#f0a23a',
  laddooShade: '#cf7d1f',
  jalebi: '#f5b324',
  jalebiShade: '#d78b12',
  barfi: '#f3e6cf',
  silver: '#e9edf2',
  dal: '#e9b23a',
  sabzi: '#7e9b36',
  puri: '#e7b064',
  puriShade: '#c88a3e',
  rice: '#fbf6ea',
  flame: '#ffe9a6',
  flameOuter: '#ffa630',
  flameCore: '#fffaf0',
  clay: '#b4552a',
  clayDark: '#82361a',
  fireworkA: '#ffcf5a',
  fireworkB: '#ff7aa8',
  fireworkC: '#8fd7ff',
};

export const CHARACTERS = {
  mom: {
    skin: '#b9805e',
    skinShade: '#99634a',
    blush: '#d47b68',
    hair: '#4f4b54',
    hairLight: '#a29ea8',
    saree: '#eeebe5',
    sareeShade: '#d2cec5',
    sareeBorder: '#9ba0ae',
    blouse: '#d6d3cd',
    bindi: '#7a2430',
    mouth: '#4a1e1c',
    tongue: '#c75f5a',
    eye: '#221917',
    earring: '#d9dce2',
  },
  son: {
    skin: '#b67a55',
    skinShade: '#935c3e',
    blush: '#cf7a62',
    hair: '#1c1718',
    hairLight: '#3a3134',
    kurta: '#8e2f3a',
    kurtaShade: '#6d222b',
    kurtaTrim: '#e2b14b',
    pants: '#ece3d1',
    pantsShade: '#cdc1aa',
    shoes: '#4a2e22',
    bag: '#2f3b57',
    bagShade: '#222b41',
    bagLight: '#45547a',
    mouth: '#3e1816',
    tongue: '#c25e58',
    eye: '#1d1514',
  },
};

/** Global colour grade applied over the whole frame (crossfaded by warmth). */
export const GRADE = {
  cold: {saturate: 0.68, brightness: 0.9, tint: '#3c5b90', tintOpacity: 0.26},
  warm: {saturate: 1.06, brightness: 1.0, tint: '#ff9a3c', tintOpacity: 0.16},
};

export const FONT_FAMILY = 'Baloo 2';
