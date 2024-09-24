import { IAudioNode, TContext } from "standardized-audio-context";
import { Subscribable } from "../../utils/Subscribable";
import { AudioGraphNodes } from "./types";
import { WebAudioGraphNode } from "./WebAudioGraphNode";
import { Composer } from "../Composer/Composer";


export interface IAudioGraphNode<
  Node extends IAudioNode<TContext> = IAudioNode<TContext>,
  Parameters extends Record<string, any> = Record<string, any>
> {
  readonly id: string;
  graphId?: string;
  composer?: Composer;
  context: TContext;
  readonly type: AudioGraphNodes;
  label: string;
  playing: boolean;
  readonly isPlaying: boolean;

  position: { x: number; y: number };

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

export interface IAudioGraph extends IAudioGraphNode, WebAudioGraphNode {
  readonly onPlayback: Subscribable<boolean>;
  readonly onNodes: Subscribable<IAudioGraphNode[]>;
  readonly onLinks: Subscribable<AudioGraphLink[]>;
  readonly nodes: IAudioGraphNode[];
  readonly links: AudioGraphLink[];

  copy(): IAudioGraph;
  addAudioNode(type: AudioGraphNodes): IAudioGraphNode;
  addAudioNode(node: IAudioGraphNode): IAudioGraphNode;
  findAudioNode(id: string): IAudioGraphNode | undefined;
  removeAudioNode(id: string): boolean;
  removeAudioNode(node: IAudioGraphNode): boolean;
  linkNodes(fromId: string, toId: string, fromParameter?: string, toParameter?: string): boolean;
  unlinkNodes(fromId: string, toId: string, fromParameter?: string, toParameter?: string): boolean;
  findLinkIndex(fromId: string, toId: string, fromParameter?: string, toParameter?: string): number;
}

export interface AudioGraphLink {
    id: string;
    from: string;
    to: string;
    fromParameter?: string;
    toParameter?: string;
  };