import { useState, useEffect, useRef } from 'react';
import type { FlourData } from '../../domain/models/FlourType';
import { PizzaCalculator } from './PizzaCalculator';
import { FlourGuide } from './FlourGuide';
import { RecipeView } from './RecipeView';
import { LanguageContext, LANGUAGES, loadLanguage, saveLanguage, useTranslation } from '../../i18n';
import type { LanguageId } from '../../i18n';
import { UrlStateManager } from '../../infrastructure/UrlStateManager';

type AppView = 'calculator' | 'flour-guide' | 'recipe';

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
            <NavItem
              label={t.nav.recipe}
              active={view === 'recipe'}
              onClick={() => onNavigate('recipe')}
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
      {view === 'recipe' && <RecipeView />}
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

  return (
    <div ref={ref} className="share">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={t.share.label}
        className="share__trigger"
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
        <div className="share__dropdown">
          <div className="share__platforms">
            <a
              href={`https://wa.me/?text=${encoded}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="share__platform"
            >
              <div className="share__platform-icon share__platform-icon--whatsapp"><WhatsAppIcon /></div>
              <span className="share__platform-label">WhatsApp</span>
            </a>

            <a
              href={`sms:?&body=${encoded}`}
              onClick={() => setOpen(false)}
              className="share__platform"
            >
              <div className="share__platform-icon share__platform-icon--messages"><MessagesIcon /></div>
              <span className="share__platform-label">{t.share.messages}</span>
            </a>

            {/* Instagram — native share sheet on mobile, copy fallback on desktop */}
            <button onClick={handleInstagram} className="share__platform">
              <div className="share__platform-icon share__platform-icon--instagram"><InstagramIcon /></div>
              <span className="share__platform-label">Instagram</span>
            </button>

            <a
              href={`fb-messenger://share/?link=${encodedUrl}`}
              onClick={() => setOpen(false)}
              className="share__platform"
            >
              <div className="share__platform-icon share__platform-icon--messenger"><MessengerIcon /></div>
              <span className="share__platform-label">Messenger</span>
            </a>
          </div>

          <button
            onClick={handleCopy}
            className={`share__copy${copied ? ' share__copy--copied' : ''}`}
          >
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
