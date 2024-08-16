import {
  IAudioNode,
  IAudioParam,
  TContext,
  AudioContext,
  OscillatorNode,
  GainNode,
  IGainOptions,
  IOscillatorOptions,
  IAudioDestinationNode,
  isAnyAudioNode,
} from "standardized-audio-context";
import { AudioGraphLink, AudioGraphNodes } from ".";
import { uniqueId } from "lodash";
import { Node } from "postcss";

let globalAudioContext: AudioContext;

interface IAudioParamNode {
  setValueAtTime: (value: number, endTime: number) => void;
  // other properties...
}

function hassetValueAtTime(node: any): node is IAudioParamNode {
  return node && typeof node.setValueAtTime === 'function';
}

export type AddAudioNode = (type: AudioGraphNodes) => string;
export type RemoveAudioNode = (id: string) => boolean;
export type LinkNodes = (fromId: string, toId: string) => boolean;
export type UnlinkNodes = (fromId: string, toId: string) => boolean;
export type FindLink = (fromId: string, toId: string) => number;

/**
 * Represents a node in an audio graph.
 *
 * @template Node - The type of audio node.
 * @template Parameters - The type of parameters associated with the node.
 */
export class AudioGraphNode<
  Node extends IAudioNode<TContext> = IAudioNode<TContext>,
  Parameters extends Record<string, any> = Record<string, any>
> {
  /**
   * The audio context used by the audio graph.
   */
  public readonly context: AudioContext;
  public readonly id: string;
  public get node() {
    return this._node;
  }
  protected set node(node: Node | undefined) {
    this._node = node;
  }
  private _node: Node | undefined;
  public readonly type: AudioGraphNodes = AudioGraphNodes.Invalid;
  /**
   * Retrieves an array of AudioGraphNode objects that are linked to this AudioGraphNode.
   * @returns {AudioGraphNode[]} The array of linked AudioGraphNode objects.
   */
  public readonly linkedFrom: () => AudioGraphNode[] = () =>
    this.graph.links
      .filter((link) => link.to.id === this.id)
      .map((link) => link.from);
  /**
   * Returns an array of AudioGraphNode objects that are linked to this AudioGraphNode.
   *
   * @returns {AudioGraphNode[]} The array of linked AudioGraphNode objects.
   */
  public readonly linkedTo: () => AudioGraphNode[] = () =>
    this.graph.links
      .filter((link) => link.from.id === this.id)
      .map((link) => link.to);
  protected _parameters: Partial<Parameters>;
  public get parameters() {
    return this._parameters;
  }
  public set parameters(parameters: Partial<Parameters>) {
    Object.entries(parameters).forEach(([key, value]) => {
      if (key in this._parameters) {
        this._parameters[key as keyof Parameters] = value;
        if (this.node && this.playing) {
          const nodeAsRecord = this.node as Record<string, any>;

          if (
            key in this.node &&
            typeof nodeAsRecord[key]?.setValueAtTime === 'function' &&
            typeof value === "number"
        ) {
            const setValueAtTime = (this.node as any)[key].setValueAtTime as IAudioParamNode['setValueAtTime'];

            if (setValueAtTime) {
              setValueAtTime(Number(value), this.context.currentTime);
            }
          }
        } else if (key in this.node!) {
          (this.node as any)[key].value = value;
        }
      }
    });
  }

  public playing: boolean;
  public get isPlaying() {
    return this.playing;
  }
  private graph: AudioGraph;

  start() {
    if (this.isPlaying) {
      this.stop();
      this.reconstruct();
    }

    const linkedTo = this.linkedTo();

    for (let i = 0; i < linkedTo.length; i++) {
      const to = linkedTo[i];

      if (isAnyAudioNode(to.node) && isAnyAudioNode(this.node)) {
        try {
          this.node.connect(to.node);
        } catch (error) {
          console.error(error);
        }
      }
    }

    this.playing = true;

    this.onStart();
  }

  stop = () => {
    if (!this.playing) return;

    this.playing = false;
    this.onStop();
    this.reconstruct();
  };
  reconstruct = () => {};
  onStart = () => {};
  onStop = () => {};

  constructor(context: AudioContext, graph: AudioGraph) {
    this.graph = graph;
    this.context = context;
    this.id = uniqueId();
    this.playing = false;
    this._parameters = {};
  }
}

export class AudioGraphNodeOscillator extends AudioGraphNode<
  OscillatorNode<TContext>,
  IOscillatorOptions
> {
  public readonly type: AudioGraphNodes = AudioGraphNodes.Oscillator;
  reconstruct = () =>
    (this.node = new OscillatorNode(this.context, this.parameters));
  onStart = () => this.node?.start();
  onStop = () => this.node?.stop();


  constructor(context: AudioContext, graph: AudioGraph) {
    super(context, graph);
    this._parameters = {
      detune: 0,
      frequency: 20,
      periodicWave: undefined,
      type: "sawtooth",
    };
  this.node?.frequency.setValueAtTime(0,0)

    this.reconstruct();
  }
}

export class AudioGraphNodeGain extends AudioGraphNode<
  GainNode<TContext>,
  IGainOptions
> {
  public readonly type: AudioGraphNodes = AudioGraphNodes.Gain;
  reconstruct = () => (this.node = new GainNode(this.context, this.parameters));

  constructor(context: AudioContext, graph: AudioGraph) {
    super(context, graph);
    this._parameters = {
      gain: 0.5,
    };
    this.reconstruct();
  }
}

export class AudioGraphNodeOutput extends AudioGraphNode<
  IAudioDestinationNode<TContext>
> {
  public readonly type: AudioGraphNodes = AudioGraphNodes.Output;
  constructor(context: AudioContext, graph: AudioGraph) {
    super(context, graph);
    this.node = this.context.destination;
  }
}

export class AudioGraph {
  playing = false;
  play() {
    if (this.audioContext.state !== "running" && !this.playing) {
      this.audioContext.resume();
    }
    this.nodes.forEach((node) => node.start());

    this.playing = true;
  }
  stop() {
    if (this.audioContext.state === "running" && this.playing) {
      this.audioContext.suspend();
    }
    this.nodes.forEach((node) => node.stop());

    this.playing = false;
  }
  public audioContext: AudioContext;
  public readonly nodes: AudioGraphNode[];
  public readonly links: AudioGraphLink[];
  addAudioNode: AddAudioNode = (type) => {
    let newNode: AudioGraphNode;

    switch (type) {
      case AudioGraphNodes.Oscillator:
        newNode = new AudioGraphNodeOscillator(this.audioContext, this);
        break;
      case AudioGraphNodes.Gain:
        newNode = new AudioGraphNodeGain(this.audioContext, this);
        break;
      case AudioGraphNodes.Output:
        newNode = new AudioGraphNodeOutput(this.audioContext, this) as any;
        break;
      default:
        throw `Could not add audio graph node, type unknown: ${type}`;
    }

    if (this.playing)
      newNode.start();

    this.nodes.push(newNode);
    return newNode.id;
  };

  getAudioNode: (id: string) => AudioGraphNode | undefined = (id) => {
    return this.nodes.find((node) => node.id === id);
  };

  removeAudioNode: RemoveAudioNode = (id) => {
    const i = this.nodes.findIndex((node) => node.id === id);
    if (i !== -1) {
      const foundNode = this.nodes.splice(i, 1)[0];

      if (this.playing)
        foundNode.stop();

      // Also remove links when removing a node
      for (let j = this.links.length - 1; j > -1; j--) {
        const link = this.links[j];
        if (id === link.from.id || id === link.to.id) {
          this.links.splice(j, 1);
        }
      }

      return true;
    }

    return false;
  };

  linkNodes: LinkNodes = (fromId, toId) => {
    let fromNode = null;
    let toNode = null;

    if (this.findLinkIndex(fromId, toId) > -1) return true;

    for (const node of this.nodes) {
      if (node.id === fromId) {
        fromNode = node;
      }
      if (node.id === toId) {
        toNode = node;
      }
      if (fromNode && toNode) {
        this.links.push({
          id: uniqueId(),
          from: fromNode,
          to: toNode,
          muted: false,
        });
        if (this.playing) {
          this.stop();
          this.play();
        }

        this.onLinksChanged(this.links);
        return true;
      }
    }

    return false;
  };

  public onLinksChanged: (links: AudioGraphLink[]) => void = () => {};

  findLinkIndex: FindLink = (fromId, toId) =>
    this.links.findIndex(
      (link) => link.from.id === fromId && link.to.id === toId
    );

  unlinkNodes: UnlinkNodes = (fromId, toId) => {
    let linkIndex = this.findLinkIndex(fromId, toId);
    let success = false;

    while (linkIndex > -1) {
      this.links.splice(linkIndex, 1);
      success = true;
      this.onLinksChanged(this.links);
      linkIndex = this.findLinkIndex(fromId, toId);
    }

    return success;
  };

  constructor(context?: AudioContext) {
    this.nodes = [];
    this.links = [];
    this.audioContext = context || globalAudioContext;

    // Allow to supply a custom audio context
    if (context) this.audioContext = context;
    else {
      if (!globalAudioContext)
        // Create a global audio context if none exists
        globalAudioContext = new AudioContext();
      this.audioContext = globalAudioContext;
    }
  }
}
