import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '@/redux/slices/authSlice';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GSI_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

let gsiScriptPromise = null;

/** Loads Google's Identity Services script once and caches the promise across mounts. */
function loadGsiScript() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (gsiScriptPromise) return gsiScriptPromise;

  gsiScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GSI_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => {
      gsiScriptPromise = null;
      reject(new Error('Failed to load Google Sign-In.'));
    };
    document.head.appendChild(script);
  });

  return gsiScriptPromise;
}

/**
 * Renders Google's official "Sign in with Google" button and exchanges the
 * resulting ID token for a CareerFlow session via POST /auth/google.
 *
 * Renders nothing if VITE_GOOGLE_CLIENT_ID isn't configured, so the rest of
 * the auth pages work fine on setups that skip Google OAuth entirely (free-tier
 * friendly — Google OAuth credentials are optional).
 *
 * @param {{ role?: string, redirectTo?: string }} props
 *   `role` is only used the first time a brand-new user signs in with Google
 *   (existing accounts keep their existing role).
 */
export function GoogleSignInButton({ role = 'student', redirectTo = '/dashboard' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return undefined;

    let cancelled = false;

    async function handleCredentialResponse(response) {
      const result = await dispatch(googleLogin({ idToken: response.credential, role }));
      if (!cancelled && googleLogin.fulfilled.match(result)) {
        navigate(redirectTo, { replace: true });
      } else if (!cancelled) {
        setError(result.payload?.message || 'Google sign-in failed. Please try again.');
      }
    }

    loadGsiScript()
      .then(() => {
        if (cancelled || !buttonRef.current) return;

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          width: buttonRef.current.offsetWidth || 320,
        });
      })
      .catch(() => {
        if (!cancelled) setError('Could not load Google Sign-In.');
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- role/redirectTo intentionally not deps; GSI is initialized once per mount
  }, []);

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div className="mt-6">
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-mist/20 dark:border-white/10" />
        <span className="mx-3 shrink-0 text-xs font-medium uppercase tracking-wide text-mist">
          Or continue with
        </span>
        <div className="flex-grow border-t border-mist/20 dark:border-white/10" />
      </div>
      <div ref={buttonRef} className="flex w-full justify-center" />
      {error && <p className="mt-2 text-center text-sm text-danger">{error}</p>}
    </div>
  );
}
