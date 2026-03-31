import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import type {
  BridgeEnvelope,
  EventCallback,
  GodotBridgeContextValue,
  GodotBridgeProviderProps,
} from './types';

const GodotBridgeContext = createContext<GodotBridgeContextValue | null>(null);

export function GodotBridgeProvider({
  appKey,
  allowedOrigin = '*',
  children,
}: GodotBridgeProviderProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  // Map of event name → set of registered callbacks
  const subscribers = useRef<Map<string, Set<EventCallback>>>(new Map());

  // Listen for messages from Godot (inside the iframe → parent window)
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      // Origin validation — skip '*' wildcard for incoming since MessageEvent.origin is always set
      if (allowedOrigin !== '*' && e.origin !== allowedOrigin) return;

      let envelope: BridgeEnvelope;
      try {
        envelope = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }

      // Schema guard
      if (!envelope?.event || typeof envelope.event !== 'string') return;

      // Secret key validation — skipped when appKey is empty (dev mode)
      if (appKey !== '' && envelope.metadata?.secret !== appKey) return;

      const cbs = subscribers.current.get(envelope.event);
      if (!cbs) return;
      const payload = envelope.payload ?? {};
      cbs.forEach((cb) => cb(payload));
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [appKey, allowedOrigin]);

  const emit = useCallback(
    (event: string, payload: Record<string, unknown> = {}) => {
      const iframe = iframeRef.current;
      if (!iframe?.contentWindow) {
        console.warn('[react-godot-bridge] iframe not ready — emit("' + event + '") dropped');
        return;
      }
      const envelope: BridgeEnvelope = {
        event,
        payload,
        metadata: { secret: appKey, timestamp: Date.now() },
      };
      iframe.contentWindow.postMessage(JSON.stringify(envelope), '*');
    },
    [appKey],
  );

  const off = useCallback((event: string, callback: EventCallback) => {
    subscribers.current.get(event)?.delete(callback);
  }, []);

  const on = useCallback(
    (event: string, callback: EventCallback) => {
      if (!subscribers.current.has(event)) {
        subscribers.current.set(event, new Set());
      }
      subscribers.current.get(event)!.add(callback);
      return () => off(event, callback);
    },
    [off],
  );

  const value = useMemo<GodotBridgeContextValue>(
    () => ({ iframeRef, emit, on, off }),
    [emit, on, off],
  );

  return (
    <GodotBridgeContext.Provider value={value}>
      {children}
    </GodotBridgeContext.Provider>
  );
}

export function useGodotContext(): GodotBridgeContextValue {
  const ctx = useContext(GodotBridgeContext);
  if (!ctx) {
    throw new Error('useGodot must be used inside <GodotBridgeProvider>');
  }
  return ctx;
}
