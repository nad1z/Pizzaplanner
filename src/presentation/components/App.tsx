import { useState, useEffect, useRef } from 'react';
import type { FlourData } from '../../domain/models/FlourType';
import { PizzaCalculator } from './PizzaCalculator';
import { FlourGuide } from './FlourGuide';
import { LanguageContext, LANGUAGES, loadLanguage, saveLanguage, useTranslation } from '../../i18n';
import type { LanguageId } from '../../i18n';
import { UrlStateManager } from '../../infrastructure/UrlStateManager';

type AppView = 'calculator' | 'flour-guide';

interface PendingApply {
  hydration: number;
  fermentation: number;
}

export function App() {
  const [lang, setLang] = useState<LanguageId>(() => {
    const fromUrl = UrlStateManager.readLang();
    return (fromUrl === 'en' || fromUrl === 'he') ? fromUrl : loadLanguage();
  });
  const [view, setView] = useState<AppView>('calculator');
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedFlour, setSelectedFlour] = useState<FlourData | null>(null);
  const [pendingApply, setPendingApply] = useState<PendingApply | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync document direction with language, and keep lang in URL
  useEffect(() => {
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    UrlStateManager.updateLang(lang);
  }, [lang]);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const handleLangChange = (id: LanguageId) => {
    setLang(id);
    saveLanguage(id);
  };

  const navigateTo = (v: AppView) => { setView(v); setMenuOpen(false); };

  const handleApplyFlour = (flour: FlourData, hydration: number, fermentation: number) => {
    setSelectedFlour(flour);
    setPendingApply({ hydration, fermentation });
    navigateTo('calculator');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <LanguageContext.Provider value={lang}>
      <AppInner
        lang={lang}
        view={view}
        menuOpen={menuOpen}
        copied={copied}
        menuRef={menuRef}
        selectedFlour={selectedFlour}
        pendingApply={pendingApply}
        onLangChange={handleLangChange}
        onMenuToggle={() => setMenuOpen(o => !o)}
        onNavigate={navigateTo}
        onSelectFlour={setSelectedFlour}
        onApplyFlour={handleApplyFlour}
        onClearApply={() => setPendingApply(null)}
        onCopyLink={handleCopyLink}
      />
    </LanguageContext.Provider>
  );
}

interface AppInnerProps {
  lang: LanguageId;
  view: AppView;
  menuOpen: boolean;
  copied: boolean;
  menuRef: React.RefObject<HTMLDivElement>;
  selectedFlour: FlourData | null;
  pendingApply: PendingApply | null;
  onLangChange: (id: LanguageId) => void;
  onMenuToggle: () => void;
  onNavigate: (v: AppView) => void;
  onSelectFlour: (f: FlourData | null) => void;
  onApplyFlour: (flour: FlourData, h: number, f: number) => void;
  onClearApply: () => void;
  onCopyLink: () => void;
}

function AppInner({ lang, view, menuOpen, copied, menuRef, selectedFlour, pendingApply,
  onLangChange, onMenuToggle, onNavigate, onSelectFlour, onApplyFlour, onClearApply, onCopyLink }: AppInnerProps) {
  const t = useTranslation();

  return (
    <div className="app">
      <div ref={menuRef} className="menu">
        <button onClick={onMenuToggle} aria-label="Menu" className="menu__trigger">
          {menuOpen ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="3" x2="15" y2="15" />
              <line x1="15" y1="3" x2="3" y2="15" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="5" x2="16" y2="5" />
              <line x1="2" y1="9" x2="16" y2="9" />
              <line x1="2" y1="13" x2="16" y2="13" />
            </svg>
          )}
        </button>

        {menuOpen && (
          <div className="menu__dropdown">
            <NavItem
              label={t.nav.calculator}
              active={view === 'calculator'}
              onClick={() => onNavigate('calculator')}
            />
            <NavItem
              label={t.nav.flourGuide}
              active={view === 'flour-guide'}
              onClick={() => onNavigate('flour-guide')}
              badge={selectedFlour ? selectedFlour.name.split(' ').slice(0, 2).join(' ') : undefined}
            />
            <div className="menu__divider" />
            <div className="menu__lang">
              <span className="menu__lang-label">{t.lang.label}</span>
              <select
                value={lang}
                onChange={e => onLangChange(e.target.value as LanguageId)}
                className="menu__lang-select"
              >
                {(Object.keys(LANGUAGES) as LanguageId[]).map(id => (
                  <option key={id} value={id}>{LANGUAGES[id]}</option>
                ))}
              </select>
            </div>
            <button onClick={onCopyLink} className={`menu__copy${copied ? ' menu__copy--copied' : ''}`}>
              {copied ? '✓' : '🔗'} {copied ? t.calc.buttons.copied : t.calc.buttons.copyLink}
            </button>
          </div>
        )}
      </div>

      {view === 'calculator' && (
        <PizzaCalculator
          selectedFlour={selectedFlour}
          pendingApply={pendingApply}
          onClearApply={onClearApply}
          onNavigateToFlourGuide={() => onNavigate('flour-guide')}
        />
      )}
      {view === 'flour-guide' && (
        <FlourGuide
          selectedFlour={selectedFlour}
          onSelectFlour={onSelectFlour}
          onApplyFlour={onApplyFlour}
        />
      )}
    </div>
  );
}

interface NavItemProps {
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: string;
}

function NavItem({ label, active, onClick, badge }: NavItemProps) {
  return (
    <button onClick={onClick} className={`nav-item${active ? ' nav-item--active' : ''}`}>
      <span>{label}</span>
      {badge && <span className="nav-item__badge">{badge}</span>}
    </button>
  );
}
