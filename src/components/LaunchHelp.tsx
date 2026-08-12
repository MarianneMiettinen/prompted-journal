import { useEffect, useState } from 'react';
import { POPUP_NAME, useDisplayMode } from '../hooks/useDisplayMode';
import { readLaunchHelpDismissed, writeLaunchHelpDismissed } from '../utils/storage';

/** Chrome's install offer. Not in lib.dom, so describe only what we use. */
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/** Small enough to leave in a corner of the screen, tall enough to write in. */
const POPUP_WIDTH = 460;
const POPUP_HEIGHT = 860;

export function LaunchHelp() {
  const { installed, desktop } = useDisplayMode();
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(readLaunchHelpDismissed);
  const [popupBlocked, setPopupBlocked] = useState(false);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      // Keep Chrome's own banner from appearing; we offer the install in context instead.
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => setInstallEvent(null);

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  // Once it is running as an app, every word here is noise.
  if (installed || dismissed) return null;

  const install = () => {
    if (!installEvent) return;
    void installEvent.prompt();
    void installEvent.userChoice.then(({ outcome }) => {
      if (outcome === 'accepted') setInstallEvent(null);
    });
  };

  const openWindow = () => {
    const popup = window.open(
      window.location.href,
      POPUP_NAME,
      `popup=yes,width=${POPUP_WIDTH},height=${POPUP_HEIGHT}`,
    );
    setPopupBlocked(popup === null);
  };

  const close = () => {
    setDismissed(true);
    writeLaunchHelpDismissed(true);
  };

  return (
    <aside className="launch">
      <h2 className="launch-title">Make this easy to reach</h2>
      <p className="launch-lede">
        A morning ritual works better when it is one click away, not a tab you have to go
        looking for.
      </p>

      {desktop ? (
        <>
          <ol className="launch-steps">
            <li>
              {installEvent ? (
                <>
                  <button type="button" className="button button--primary" onClick={install}>
                    Install as an app
                  </button>
                  <span className="launch-note">
                    It gets its own small window — no tabs, no address bar.
                  </span>
                </>
              ) : (
                <>
                  <strong>Install it.</strong> In Chrome or Edge, open the <b>⋮</b> menu and
                  choose <b>Install</b> — under <i>Cast, save and share</i> if you don’t see it
                  straight away. It then opens in its own small window instead of a tab.
                </>
              )}
            </li>
            <li>
              <strong>Pin it.</strong> Right-click the app on your taskbar and choose{' '}
              <b>Pin to taskbar</b>, so it is there tomorrow morning.
            </li>
            <li>
              <strong>Or just bookmark it.</strong> Press <kbd>Ctrl</kbd> + <kbd>D</kbd> to add
              it to your favourites.
            </li>
          </ol>

          <div className="launch-actions">
            <button type="button" className="button button--quiet" onClick={openWindow}>
              Open in a small window
            </button>
            <button type="button" className="link-button" onClick={close}>
              Don’t show this again
            </button>
          </div>

          {popupBlocked && (
            <p className="launch-note" role="status">
              Your browser blocked the window. Allow pop-ups for this site, or use the install
              step above.
            </p>
          )}
        </>
      ) : (
        <>
          <ol className="launch-steps">
            <li>
              <strong>Add it to your home screen.</strong> Tap the <b>⋮</b> menu in Chrome, or
              the <b>Share</b> button in Safari, then <b>Add to Home screen</b>.
            </li>
            <li>
              <strong>Open it from there.</strong> It runs full screen, like any other app.
            </li>
          </ol>

          <div className="launch-actions">
            <button type="button" className="link-button" onClick={close}>
              Don’t show this again
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
