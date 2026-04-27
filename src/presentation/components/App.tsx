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
  const [selectedFlour, setSelectedFlour] = useState<FlourData | null>(null);
  const [pendingApply, setPendingApply] = useState<PendingApply | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    UrlStateManager.updateLang(lang);
  }, [lang]);

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

      {/* Share button */}
      <ShareButton />

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

function ShareButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslation();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const url = window.location.href;
  const shareMsg = `${t.share.message} ${url}`;
  const encoded = encodeURIComponent(shareMsg);
  const encodedUrl = encodeURIComponent(url);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleInstagram = () => {
    if (navigator.share) {
      navigator.share({ url }).catch(() => {});
    } else {
      handleCopy();
    }
    setOpen(false);
  };

  const platformBtn = (color: string, icon: React.ReactNode, label: string) => ({
    wrapStyle: { width: 46, height: 46, borderRadius: 12, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' } as React.CSSProperties,
    labelStyle: { fontSize: 10, color: '#f5e6c8aa', whiteSpace: 'nowrap' } as React.CSSProperties,
    icon,
    label,
  });

  const platforms = [
    platformBtn('#25D366', <WhatsAppIcon />, 'WhatsApp'),
    platformBtn('#34C759', <MessagesIcon />, t.share.messages),
    platformBtn('linear-gradient(135deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', <InstagramIcon />, 'Instagram'),
    platformBtn('#006AFF', <MessengerIcon />, 'Messenger'),
  ];

  return (
    <div ref={ref} style={{ position: 'fixed', top: 12, left: 16, zIndex: 200 }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={t.share.label}
        style={{
          background: '#21160a', border: '1px solid #3a2a18', borderRadius: 10,
          color: '#f5e6c8', padding: '8px 10px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0,
          background: '#21160a', border: '1px solid #3a2a18',
          borderRadius: 12, padding: '14px 12px',
          boxShadow: '0 8px 32px #00000066',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <div style={{ display: 'flex', gap: 10 }}>
            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encoded}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}
            >
              <div style={platforms[0].wrapStyle}>{platforms[0].icon}</div>
              <span style={platforms[0].labelStyle}>{platforms[0].label}</span>
            </a>

            {/* Messages / SMS */}
            <a
              href={`sms:?&body=${encoded}`}
              onClick={() => setOpen(false)}
              style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}
            >
              <div style={platforms[1].wrapStyle}>{platforms[1].icon}</div>
              <span style={platforms[1].labelStyle}>{platforms[1].label}</span>
            </a>

            {/* Instagram — native share sheet on mobile, copy fallback on desktop */}
            <button
              onClick={handleInstagram}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}
            >
              <div style={platforms[2].wrapStyle}>{platforms[2].icon}</div>
              <span style={platforms[2].labelStyle}>{platforms[2].label}</span>
            </button>

            {/* Facebook Messenger */}
            <a
              href={`fb-messenger://share/?link=${encodedUrl}`}
              onClick={() => setOpen(false)}
              style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}
            >
              <div style={platforms[3].wrapStyle}>{platforms[3].icon}</div>
              <span style={platforms[3].labelStyle}>{platforms[3].label}</span>
            </a>
          </div>

          <button onClick={handleCopy} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            width: '100%', padding: '8px 12px',
            background: copied ? '#4ade8022' : '#2a1e0e',
            border: `1px solid ${copied ? '#4ade80' : '#3a2a18'}`,
            borderRadius: 8, cursor: 'pointer',
            color: copied ? '#4ade80' : '#f5e6c8aa',
            fontSize: 12, transition: 'all 0.2s',
          }}>
            {copied ? '✓' : '🔗'} {copied ? t.calc.buttons.copied : t.calc.buttons.copyLink}
          </button>
        </div>
      )}
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function MessagesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function MessengerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z" />
    </svg>
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
