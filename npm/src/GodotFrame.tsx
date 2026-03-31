import type { IframeHTMLAttributes } from 'react';
import { useGodotContext } from './context';

type GodotFrameProps = Omit<IframeHTMLAttributes<HTMLIFrameElement>, 'src'> & {
  /** Path to the exported Godot index.html */
  src: string;
};

/**
 * Drop-in iframe that connects to the nearest <GodotBridgeProvider>.
 * All standard iframe HTML attributes are forwarded.
 *
 * @example
 * <GodotFrame src="/game/index.html" className="w-full h-full" />
 */
export function GodotFrame({ src, ...rest }: GodotFrameProps) {
  const { iframeRef } = useGodotContext();
  return <iframe ref={iframeRef} src={src} {...rest} />;
}
