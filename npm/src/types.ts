import type { ReactNode, RefObject } from 'react';

export interface BridgeMetadata {
  secret: string;
  timestamp: number;
}

export interface BridgeEnvelope {
  event: string;
  payload: Record<string, unknown>;
  metadata: BridgeMetadata;
}

/** Callback signature for events received from Godot */
export type EventCallback = (payload: Record<string, unknown>) => void;

/** Return value of useGodot() */
export interface UseGodotReturn {
  /** Send an event with optional payload to the Godot game */
  emit: (event: string, payload?: Record<string, unknown>) => void;
  /** Subscribe to an event from Godot. Returns an unsubscribe function */
  on: (event: string, callback: EventCallback) => () => void;
  /** Manually unsubscribe a callback from an event */
  off: (event: string, callback: EventCallback) => void;
}

export interface GodotBridgeProviderProps {
  /** Secret key that must be present in every message envelope */
  appKey: string;
  /**
   * Allowed origin for incoming postMessage events.
   * Defaults to '*' (allow all). Set to your Godot export origin in production.
   */
  allowedOrigin?: string;
  children: ReactNode;
}

/** Internal context value shared between Provider, GodotFrame, and useGodot */
export interface GodotBridgeContextValue extends UseGodotReturn {
  iframeRef: RefObject<HTMLIFrameElement | null>;
}
