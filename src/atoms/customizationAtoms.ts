import { atom } from 'jotai';
import { Weapon, Part } from '../types';

// Atom for parts
export const partsAtom = atom<Part[]>([]);

// Atom for weapons
export const weaponsAtom = atom<Weapon[]>([]);
