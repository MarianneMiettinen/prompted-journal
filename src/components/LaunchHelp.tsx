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
      <h2 className="launch-title">Save the app, to access it next time easily</h2>

      {desktop ? (
        <>
          {installEvent ? (
            <button type="button" className="button button--primary button--wide" onClick={install}>
              Save the app
            </button>
          ) : (
            <ol className="launch-steps">
              <li>
                Open the <b>⋮</b> menu in your browser and pick <b>Install</b>.
              </li>
              <li>
                Or press <kbd>Ctrl</kbd> + <kbd>D</kbd> to save it as a bookmark.
              </li>
            </ol>
          )}

          <div className="launch-actions">
            <button type="button" className="button button--ghost" onClick={openWindow}>
              Open in a small window
            </button>
            <button type="button" className="link-button" onClick={close}>
              Hide this
            </button>
          </div>

          {popupBlocked && (
            <p className="launch-note" role="status">
              Your browser blocked the window. Allow pop-ups for this site, or save it instead.
            </p>
          )}
        </>
      ) : (
        <>
          <ol className="launch-steps">
            <li>
              Tap <b>Share</b>, then <b>Add to Home screen</b>.
            </li>
            <li>Open it from there, like any other app.</li>
          </ol>

          <div className="launch-actions">
            <button type="button" className="link-button" onClick={close}>
              Hide this
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
