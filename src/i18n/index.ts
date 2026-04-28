import { createContext, useContext } from 'react';
import { en } from './en';
import { he } from './he';
import type { AppTranslation } from './types';

export type LanguageId = 'en' | 'he';

export const LANGUAGES: Record<LanguageId, string> = { en: 'English', he: 'עברית' };

const TRANSLATIONS: Record<LanguageId, AppTranslation> = { en, he };

export const LanguageContext = createContext<LanguageId>('en');

export function useTranslation(): AppTranslation {
  return TRANSLATIONS[useContext(LanguageContext)];
}

const LANG_KEY = 'pizza-lang';

export function loadLanguage(): LanguageId {
  try {
    const v = localStorage.getItem(LANG_KEY);
    return (v === 'en' || v === 'he') ? v : 'en';
  } catch {
    return 'en';
  }
}

export function saveLanguage(id: LanguageId): void {
  try { localStorage.setItem(LANG_KEY, id); } catch { /* ignore */ }
}
