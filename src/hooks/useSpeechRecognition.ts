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
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechEvent) => void) | null;
  onerror: ((event: SpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
}
type RecognitionCtor = new () => Recognition;

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export interface SpeechControls {
  supported: boolean;
  listening: boolean;
  /** Words heard but not yet finalised. Shown as a preview; never written to the journal. */
  interim: string;
  error: string | null;
  start: () => void;
  stop: () => void;
}

/**
 * Voice input is additive: only finalised chunks are handed to `onFinalText`, which appends
 * them. Anything the user types by hand is never overwritten.
 */
export function useSpeechRecognition(onFinalText: (text: string) => void): SpeechControls {
  const [supported] = useState(() => getRecognitionCtor() !== null);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<Recognition | null>(null);
  // Chrome ends a session on its own after a pause; this says whether to reopen it.
  const wantsToListenRef = useRef(false);
  const onFinalTextRef = useRef(onFinalText);
  onFinalTextRef.current = onFinalText;

  const stop = useCallback(() => {
    wantsToListenRef.current = false;
    setListening(false);
    setInterim('');
    try {
      recognitionRef.current?.stop();
    } catch {
      // Already stopped.
    }
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor || wantsToListenRef.current) return;

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = navigator.language || 'en-US';

    recognition.onresult = (event) => {
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
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      wantsToListenRef.current = false;
      setListening(false);
      setInterim('');
      setError(
        event.error === 'not-allowed' || event.error === 'service-not-allowed'
          ? 'Microphone access is blocked. You can enable it in your browser settings, or keep typing.'
          : 'Voice input stopped unexpectedly. Typing still works.',
      );
    };

    recognition.onend = () => {
      setInterim('');
      if (!wantsToListenRef.current) {
        setListening(false);
        return;
      }
      try {
        recognition.start();
      } catch {
        wantsToListenRef.current = false;
        setListening(false);
      }
    };

    recognitionRef.current = recognition;
    wantsToListenRef.current = true;
    setError(null);
    try {
      recognition.start();
      setListening(true);
    } catch {
      wantsToListenRef.current = false;
      setListening(false);
    }
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

  return { supported, listening, interim, error, start, stop };
}
