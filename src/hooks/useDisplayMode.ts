import { useEffect, useState } from 'react';

export interface DisplayMode {
  /** Running as an installed app — its own window, no tabs, no address bar. */
  installed: boolean;
  /** A mouse-and-keyboard machine, where opening a small window makes sense. */
  desktop: boolean;
}

const INSTALLED = '(display-mode: standalone), (display-mode: window-controls-overlay)';
const DESKTOP = '(hover: hover) and (pointer: fine)';

/**
 * The name given to the popped-out window. Chrome reports `display-mode: browser` inside a
 * popup, so the window name is the only way to tell that we are already in one — and that
 * the launch help has nothing left to offer.
 */
export const POPUP_NAME = 'prompted-journal';

function read(query: string): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(query).matches;
}

/**
 * Tells the launch help whether it still has a job. Installing the app changes
 * `display-mode` live, so this listens rather than reading once — the hints
 * disappear the moment they stop being true.
 */
export function useDisplayMode(): DisplayMode {
  const [installed, setInstalled] = useState(() => read(INSTALLED));
  const [desktop, setDesktop] = useState(() => read(DESKTOP));

  useEffect(() => {
    if (!window.matchMedia) return;

    const installedQuery = window.matchMedia(INSTALLED);
    const desktopQuery = window.matchMedia(DESKTOP);
    const sync = () => {
      setInstalled(installedQuery.matches);
      setDesktop(desktopQuery.matches);
    };

    installedQuery.addEventListener('change', sync);
    desktopQuery.addEventListener('change', sync);
    return () => {
      installedQuery.removeEventListener('change', sync);
      desktopQuery.removeEventListener('change', sync);
    };
  }, []);

  // iOS Safari reports installation on `navigator.standalone` and nowhere else.
  const iosStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true;

  return {
    installed: installed || iosStandalone || window.name === POPUP_NAME,
    desktop,
  };
}
