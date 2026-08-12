import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Minimal structural types. The Web Speech API is not in every TS lib target and is still
 * vendor-prefixed in Chrome, so we describe only the surface we use rather than depend on it.
 */
interface SpeechResultAlternative {
  transcript: string;
}
interface SpeechResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechResultAlternative;
}
interface SpeechResultList {
  length: number;
  [index: number]: SpeechResult;
}
interface SpeechEvent {
  resultIndex: number;
  results: SpeechResultList;
}
interface SpeechErrorEvent {
  error: string;
}
interface Recognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onaudiostart: (() => void) | null;
  onresult: ((event: SpeechEvent) => void) | null;
  onerror: ((event: SpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
}
type RecognitionCtor = new () => Recognition;

/**
 * Chrome's recogniser transcribes in whichever language it is told to expect, and returns
 * nothing useful when the spoken language doesn't match. This was previously
 * `navigator.language`, which is `fi-FI` on a Finnish machine — English speech into a
 * Finnish recogniser produced no text at all. The app's copy is English, so ask for English.
 */
const RECOGNITION_LANG = 'en-US';

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export type SpeechStatus = 'idle' | 'requesting' | 'listening' | 'error';

export interface SpeechControls {
  supported: boolean;
  status: SpeechStatus;
  listening: boolean;
  /** Words heard but not yet finalised. Shown as a preview; never written to the journal. */
  interim: string;
  /** A blocking problem: no permission, insecure page, no microphone. */
  error: string | null;
  /** Non-blocking feedback — still listening, just hasn't heard anything yet. */
  hint: string | null;
  start: () => void;
  stop: () => void;
}

/**
 * Voice input is additive: only finalised chunks are handed to `onFinalText`, which appends
 * them. Anything typed by hand is never overwritten.
 */
export function useSpeechRecognition(onFinalText: (text: string) => void): SpeechControls {
  const [supported] = useState(() => getRecognitionCtor() !== null);
  const [status, setStatus] = useState<SpeechStatus>('idle');
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  const recognitionRef = useRef<Recognition | null>(null);
  // Chrome ends a session on its own after a pause; this says whether to reopen it.
  const wantsToListenRef = useRef(false);
  const onFinalTextRef = useRef(onFinalText);
  onFinalTextRef.current = onFinalText;

  const stop = useCallback(() => {
    wantsToListenRef.current = false;
    setStatus('idle');
    setInterim('');
    setHint(null);
    try {
      recognitionRef.current?.stop();
    } catch {
      // Already stopped.
    }
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor || wantsToListenRef.current) return;

    // Speech recognition silently does nothing on an insecure origin. That is worth saying
    // out loud, because "nothing happens" is the hardest failure to diagnose.
    if (!window.isSecureContext) {
      setStatus('error');
      setError(
        'Voice input needs a secure connection. It works on localhost and on the deployed https:// site, but not over a plain http:// address.',
      );
      return;
    }

    setStatus('requesting');
    setError(null);
    setHint(null);

    const begin = () => {
      const recognition = new Ctor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = RECOGNITION_LANG;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setStatus('listening');
      recognition.onaudiostart = () => setHint(null);

      recognition.onresult = (event) => {
        setHint(null);
        let finalText = '';
        let pending = '';
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          const transcript = result[0]?.transcript ?? '';
          if (result.isFinal) finalText += transcript;
          else pending += transcript;
        }
        setInterim(pending);
        if (finalText.trim()) onFinalTextRef.current(finalText.trim());
      };

      recognition.onerror = (event) => {
        // Not failures: Chrome fires these routinely and `onend` will reopen the session.
        if (event.error === 'aborted') return;
        if (event.error === 'no-speech') {
          setHint('Not hearing anything yet — still listening.');
          return;
        }

        wantsToListenRef.current = false;
        setStatus('error');
        setInterim('');
        setError(errorMessage(event.error));
      };

      recognition.onend = () => {
        setInterim('');
        if (!wantsToListenRef.current) {
          setStatus((current) => (current === 'error' ? current : 'idle'));
          return;
        }
        // Chrome closes the session after a pause in speech; reopen it so one press of
        // the button lasts as long as the person wants to talk.
        try {
          recognition.start();
        } catch {
          wantsToListenRef.current = false;
          setStatus('idle');
        }
      };

      recognitionRef.current = recognition;
      wantsToListenRef.current = true;

      try {
        recognition.start();
      } catch {
        wantsToListenRef.current = false;
        setStatus('error');
        setError('Voice input could not start. Reload the page and try again.');
      }
    };

    // Ask for the microphone explicitly. Chrome's recogniser would ask on its own, but
    // going through getUserMedia turns a refusal into a real error we can explain,
    // instead of a session that opens and closes with nothing to show for it.
    const media = navigator.mediaDevices;
    if (!media?.getUserMedia) {
      begin();
      return;
    }

    media
      .getUserMedia({ audio: true })
      .then((stream) => {
        // The recogniser opens its own stream; this one was only to settle permission.
        stream.getTracks().forEach((track) => track.stop());
        begin();
      })
      .catch((cause: unknown) => {
        const name = cause instanceof Error ? cause.name : '';
        setStatus('error');
        setError(
          name === 'NotFoundError' || name === 'DevicesNotFoundError'
            ? 'No microphone found. Typing still works.'
            : 'Microphone access was blocked. Allow it from the icon in your browser’s address bar, then press Speak again.',
        );
      });
  }, []);

  // Leaving the screen mid-sentence must not leave the microphone open.
  useEffect(() => {
    return () => {
      wantsToListenRef.current = false;
      try {
        recognitionRef.current?.abort();
      } catch {
        // Nothing to abort.
      }
    };
  }, []);

  return {
    supported,
    status,
    listening: status === 'listening' || status === 'requesting',
    interim,
    error,
    hint,
    start,
    stop,
  };
}

function errorMessage(code: string): string {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Microphone access is blocked. Allow it from the icon in your browser’s address bar, then press Speak again.';
    case 'audio-capture':
      return 'No microphone was found. Typing still works.';
    case 'network':
      return 'Voice input needs a network connection — the browser sends audio away to transcribe it.';
    case 'language-not-supported':
      return 'This browser can’t transcribe English. Typing still works.';
    default:
      return 'Voice input stopped unexpectedly. Typing still works.';
  }
}
