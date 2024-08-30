import { IAudioNode, TContext, AudioContext } from "standardized-audio-context";
import { Subscribable } from "../../utils/Subscribable";
import { AudioGraphNodes } from "./types";


export interface IAudioGraphNode<
  Node extends IAudioNode<TContext> = IAudioNode<TContext>,
  Parameters extends Record<string, any> = Record<string, any>
> {
  readonly id: string;
  readonly context: AudioContext;
  readonly type: AudioGraphNodes;
  label: string;
  playing: boolean;
  readonly isPlaying: boolean;

  readonly linksFrom: () => AudioGraphLink[];
  readonly linksTo: () => AudioGraphLink[];
  readonly onParameterChange: Subscribable<Partial<Record<string, any>>>;

  node: Node | undefined;

  parameters: Partial<Parameters>;
  resetParameters(): void;
  resetParameter(name: string): void;

  start(): void;
  stop(): void;
  reconstruct(): void;
  onStart(): void;
  onStop(): void;
}

export interface IAudioGraph extends IAudioGraphNode {
  readonly audioContext: AudioContext;
  readonly onPlayback: Subscribable<boolean>;
  readonly onNodes: Subscribable<IAudioGraphNode[]>;
  readonly onLinks: Subscribable<AudioGraphLink[]>;
  readonly nodes: IAudioGraphNode[];
  readonly links: AudioGraphLink[];

  addAudioNode(type: AudioGraphNodes): string;
  getAudioNode(id: string): IAudioGraphNode | undefined;
  removeAudioNode(id: string): boolean;
  linkNodes(fromId: string, toId: string, fromParameter?: string, toParameter?: string): boolean;
  unlinkNodes(fromId: string, toId: string, fromParameter?: string, toParameter?: string): boolean;
  findLinkIndex(fromId: string, toId: string, fromParameter?: string, toParameter?: string): number;
}

export interface AudioGraphLink {
    id: string;
    from: IAudioGraphNode;
    to: IAudioGraphNode;
    fromParameter?: string;
    toParameter?: string;
  };