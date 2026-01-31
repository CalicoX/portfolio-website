import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import MobileHeader from './MobileHeader';
import DotMatrixBackground from './DotMatrixBackground';
import LoadingScreen from './LoadingScreen';
import { useAdminShortcut } from '../hooks/useKonamiCode';
import { Lock, X, Loader2 } from 'lucide-react';
import {
  generateAuthToken,
  validateAuthToken,
  storeAuthToken,
  getStoredAuthToken,
  hasAuthToken,
  clearAuthToken,
} from '../lib/adminAuth';
import { verifyTotpCode, isTotpEnabled } from '../lib/totp';

// SHA-256 hash function
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // Check sessionStorage to skip loading screen on refresh
  const loadingAlreadyComplete = typeof window !== 'undefined' && sessionStorage.getItem('loadingComplete') === 'true';
  const [isLoading, setIsLoading] = useState(!loadingAlreadyComplete);
  const [isReady, setIsReady] = useState(loadingAlreadyComplete);
  const cursorStyleRef = useRef<HTMLStyleElement | null>(null);
  const cursorUrlRef = useRef<string | null>(null);

  // Admin panel states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [showTotpInput, setShowTotpInput] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Shared secret trigger logic
  const handleSecretTrigger = async () => {
    const token = getStoredAuthToken();
    const expectedHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH || '';

    if (token && await validateAuthToken(token, expectedHash)) {
      navigate('/admin');
    } else {
      clearAuthToken(); // Clear invalid token
      setShowPasswordModal(true);
      setShowTotpInput(false); // Reset TOTP state
      setPassword('');
      setTotpCode('');
      setPasswordError('');
    }
  };

  // Secure admin shortcut with token validation
  useAdminShortcut(handleSecretTrigger);

  const completeLogin = async () => {
    const expectedHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH || '';
    // Generate and store secure auth token
    const token = await generateAuthToken(expectedHash);
    storeAuthToken(token);
    setShowPasswordModal(false);
    setPassword('');
    setTotpCode('');
    setShowTotpInput(false);
    navigate('/admin');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setPasswordError('');

    try {
      // Step 1: Verify Password (if not already verified)
      if (!showTotpInput) {
        const hashedPassword = await sha256(password);
        const expectedHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH || '';

        if (hashedPassword === expectedHash.toLowerCase()) {
          // Password valid, check if TOTP is enabled
          if (isTotpEnabled()) {
            setShowTotpInput(true);
            setVerifying(false); // Stop verifying to let user enter code
            return;
          }

          await completeLogin();
        } else {
          setPasswordError('Incorrect password');
        }
      }
      // Step 2: Verify TOTP
      else {
        if (await verifyTotpCode(totpCode)) {
          await completeLogin();
        } else {
          setPasswordError('Invalid authentication code');
        }
      }
    } catch (err) {
      setPasswordError('Verification failed');
    } finally {
      if (!showTotpInput || (showTotpInput && passwordError)) {
        setVerifying(false);
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Setup global game controller cursor
  useEffect(() => {
    // Create SVG cursor from the game controller icon
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1024 1024">
        <path fill="rgba(34, 197, 94, 0.9)" d="M295.279309 796.959276v90.563554h45.422186v-90.563554z m-45.49239-90.633758V615.481146H204.645551v90.844372h45.141368v90.633758h45.49239v-90.633758zM159.012752 569.848348V479.214589h90.774167v-45.49239H113.379953v136.126149h45.632799v45.632798H204.645551v-45.632798z m135.564514-45.281777v135.985739h46.124229v-589.716166h-46.124229v408.589058h-44.790347v45.351982zM431.545866 25.203346H340.701495v45.422185h90.844371z m0 272.252296v182.180173h45.351981V297.455642H567.60181v-45.351981H476.897847V70.625531h-45.351981v226.830111zM567.60181 479.214589h45.351981V342.456602h91.265597v-45.00096H567.60181v181.758947z m136.406966 45.351982h45.351981V388.580831h45.351981v-46.124229H704.008776v182.109969z m135.845331-90.844372v-45.141368h-45.141369v45.141368z m0 0v317.885096H885.627314V433.722199z m-45.351982 454.011244h45.351982v-136.126148h-45.141369z m-45.351981 90.142328H385.983272v-90.352941h-45.281777v136.47717h454.011243v-136.266557h-45.351981z"/>
        <path fill="rgba(34, 197, 94, 0.4)" d="M382.824078 908.022487l7.792678 72.521048 408.097628 2.246538 4.493075-105.938297 16.708625-9.337173 45.422186-136.126148 22.605786-252.665296-22.605786-65.2198-45.422186-45.141368-90.703963-46.124229-136.406965-44.930755-114.081997-28.292335-21.973947-198.607981-58.339778-34.400109-32.504594 34.400109-20.991087 306.792815-12.285754 127.069793-57.637734-25.203345-107.412588-24.922529 16.638421 115.486083 45.632798 45.141369 90.844372 45.49239 90.633758 45.422185 90.633758 16.919238 40.648293z"/>
      </svg>
    `;

    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    cursorUrlRef.current = url;

    // Add global cursor style with highest priority
    const styleTag = document.createElement('style');
    styleTag.id = 'global-cursor-style';
    styleTag.innerHTML = `
      * {
        cursor: url('${url}') 0 16, auto !important;
      }
      html, body {
        cursor: url('${url}') 0 16, auto !important;
      }
      a, button, input, textarea, select, [role="button"] {
        cursor: url('${url}') 0 16, pointer !important;
      }
    `;
    // Insert at the end of head to ensure it overrides other styles
    document.head.appendChild(styleTag);
    cursorStyleRef.current = styleTag;

    return () => {
      // Clean up
      if (cursorStyleRef.current) {
        document.head.removeChild(cursorStyleRef.current);
      }
      if (cursorUrlRef.current) {
        URL.revokeObjectURL(cursorUrlRef.current);
      }
    };
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setIsReady(true);
      // Mark root as ready for CSS
      const root = document.getElementById('root');
      if (root) {
        root.classList.add('ready');
      }
    }, 100);
  }, []);

  // Check if we're on admin page
  const isAdminPage = pathname === '/admin';

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col md:flex-row">
      {isLoading ? (
        <LoadingScreen onComplete={handleLoadingComplete} />
      ) : (
        <>
          {isReady && (
            <>
              {/* Hide navigation on admin page */}
              {!isAdminPage && <Sidebar />}
              {!isAdminPage && <MobileHeader onSecretTrigger={handleSecretTrigger} />}

              {/* Main Content Area */}
              <main className={`flex-1 ${!isAdminPage ? 'md:ml-64' : ''} w-full relative min-h-screen ${pathname === '/contact' ? '!p-0 !pt-0 !pb-0' : ''}`}>
                {/* Render background only on Home page */}
                {pathname === '/' && <DotMatrixBackground />}

                <div className={`w-full h-full ${isAdminPage ? 'p-0' : 'p-6 pt-24 md:p-12 md:pt-12 pb-24 md:pb-12'} animate-fade-in relative z-10 ${pathname === '/contact' ? '!p-0 !pt-0 !pb-0' : ''}`}>
                  <Outlet />
                </div>
              </main>

              {!isAdminPage && <MobileNav />}
            </>
          )}
        </>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-sm mx-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <Lock size={20} className="text-accent" />
                </div>
                <h3 className="text-lg font-semibold">
                  {showTotpInput ? 'Two-Factor Auth' : 'Admin Access'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setShowTotpInput(false);
                  setPassword('');
                  setTotpCode('');
                }}
                className="p-1 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleLoginSubmit}>
              {!showTotpInput ? (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:border-accent outline-none mb-3"
                  autoFocus
                />
              ) : (
                <div className="mb-3">
                  <p className="text-sm text-zinc-400 mb-2">
                    Enter the code from your authenticator app
                  </p>
                  <input
                    type="text"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:border-accent outline-none text-center text-xl tracking-widest"
                    autoFocus
                    pattern="\d{6}"
                    inputMode="numeric"
                  />
                </div>
              )}
              {passwordError && (
                <p className="text-red-400 text-sm mb-3">{passwordError}</p>
              )}
              <button
                type="submit"
                disabled={verifying || (!showTotpInput && !password) || (showTotpInput && totpCode.length !== 6)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-black font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {verifying ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  showTotpInput ? 'Verify Code' : 'Unlock'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
