import { atom } from 'jotai';

export const authAtom = atom(!!localStorage.getItem('token'));
export const tokenAtom = atom(localStorage.getItem('token') || null);
