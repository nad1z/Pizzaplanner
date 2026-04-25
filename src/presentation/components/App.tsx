import { useState, useEffect, useRef } from 'react';
import type { FlourData } from '../../domain/models/FlourType';
import { PizzaCalculator } from './PizzaCalculator';
import { FlourGuide } from './FlourGuide';
import { LanguageContext, LANGUAGES, loadLanguage, saveLanguage, useTranslation } from '../../i18n';
import type { LanguageId } from '../../i18n';

type AppView = 'calculator' | 'flour-guide';

interface PendingApply {
  hydration: number;
  fermentation: number;
}

export function App() {
  const [lang, setLang] = useState<LanguageId>(loadLanguage);
  const [view, setView] = useState<AppView>('calculator');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFlour, setSelectedFlour] = useState<FlourData | null>(null);
  const [pendingApply, setPendingApply] = useState<PendingApply | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync document direction with language
  useEffect(() => {
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
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

  return (
    <LanguageContext.Provider value={lang}>
      <AppInner
        lang={lang}
        view={view}
        menuOpen={menuOpen}
        menuRef={menuRef}
        selectedFlour={selectedFlour}
        pendingApply={pendingApply}
        onLangChange={handleLangChange}
        onMenuToggle={() => setMenuOpen(o => !o)}
        onNavigate={navigateTo}
        onSelectFlour={setSelectedFlour}
        onApplyFlour={handleApplyFlour}
        onClearApply={() => setPendingApply(null)}
      />
    </LanguageContext.Provider>
  );
}

interface AppInnerProps {
  lang: LanguageId;
  view: AppView;
  menuOpen: boolean;
  menuRef: React.RefObject<HTMLDivElement>;
  selectedFlour: FlourData | null;
  pendingApply: PendingApply | null;
  onLangChange: (id: LanguageId) => void;
  onMenuToggle: () => void;
  onNavigate: (v: AppView) => void;
  onSelectFlour: (f: FlourData | null) => void;
  onApplyFlour: (flour: FlourData, h: number, f: number) => void;
  onClearApply: () => void;
}

function AppInner({ lang, view, menuOpen, menuRef, selectedFlour, pendingApply,
  onLangChange, onMenuToggle, onNavigate, onSelectFlour, onApplyFlour, onClearApply }: AppInnerProps) {
  const t = useTranslation();

  return (
    <div style={{ minHeight: '100vh', background: '#1a1209' }}>
      {/* Fixed hamburger */}
      <div ref={menuRef} style={{ position: 'fixed', top: 12, right: 16, zIndex: 200 }}>
        <button
          onClick={onMenuToggle}
          aria-label="Menu"
          style={{
            background: '#21160a', border: '1px solid #3a2a18', borderRadius: 10,
            color: '#f5e6c8', padding: '8px 10px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}
        >
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
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0,
            background: '#21160a', border: '1px solid #3a2a18',
            borderRadius: 12, padding: '6px 0', minWidth: 190,
            boxShadow: '0 8px 32px #00000066',
          }}>
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
            <div style={{ borderTop: '1px solid #3a2a1855', margin: '6px 0' }} />
            <div style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: '#f5e6c860', flexShrink: 0 }}>{t.lang.label}</span>
              <select
                value={lang}
                onChange={e => onLangChange(e.target.value as LanguageId)}
                style={{
                  flex: 1, background: '#2a1e0e', border: '1px solid #3a2a18',
                  borderRadius: 6, color: '#f5e6c8', fontSize: 12,
                  padding: '4px 6px', cursor: 'pointer', fontFamily: 'DM Sans',
                }}
              >
                {(Object.keys(LANGUAGES) as LanguageId[]).map(id => (
                  <option key={id} value={id}>{LANGUAGES[id]}</option>
                ))}
              </select>
            </div>
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
    <button onClick={onClick} style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      width: '100%', padding: '10px 18px', background: 'none', border: 'none',
      cursor: 'pointer', color: active ? '#c0522a' : '#f5e6c8',
      fontSize: 14, fontFamily: 'DM Sans', textAlign: 'left',
    }}>
      <span>{label}</span>
      {badge && (
        <span style={{ fontSize: 10, color: '#c0522a', background: '#c0522a22', padding: '2px 7px', borderRadius: 999, marginLeft: 8 }}>
          {badge}
        </span>
      )}
    </button>
  );
}
