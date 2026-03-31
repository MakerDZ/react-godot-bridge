import { useGodotContext } from './context';
import type { UseGodotReturn } from './types';

/**
 * Primary hook for interacting with the Godot bridge.
 *
 * Must be called inside a <GodotBridgeProvider>.
 *
 * @example
 * const { emit, on } = useGodot();
 * emit('jump', { height: 2 });
 * useEffect(() => on('player_died', (p) => setScore(p.score as number)), []);
 */
export function useGodot(): UseGodotReturn {
  const { emit, on, off } = useGodotContext();
  return { emit, on, off };
}
