import { AudioGraphLink, AudioGraphNodes } from ".";
import { uniqueId } from "lodash";

export type AddAudioNode = (type: AudioGraphNodes) => string;
export type RemoveAudioNode = (id: string) => boolean;
export type LinkNodes = (fromId: string, toId: string) => boolean;
export type UnlinkNodes = (fromId: string, toId: string) => boolean;
export type FindLink = (fromId: string, toId: string) => number;

export class AudioGraphNode<
  Node = AudioNode,
  Parameters = Record<string, any>
> {
  protected readonly context: AudioContext;
  public readonly id: string;
  public node: Node | undefined;
  public readonly linkedFrom: () => AudioGraphNode[] = () =>
    this.graph.links
      .filter((link) => link.to.id === this.id)
      .map((link) => link.from);
  public readonly linkedTo: () => AudioGraphNode[] = () =>
    this.graph.links
      .filter((link) => link.from.id === this.id)
      .map((link) => link.to);
  public parameters: Partial<Parameters>;
  protected playing: boolean;
  public get isPlaying() {
    return this.playing;
  }
  private graph: AudioGraph;

  start() {
    if (this.playing) this.stop();

    this.beforeStart();

    const linkedTo = this.linkedTo();

    for (let i = 0; i < linkedTo.length; i++) {
      const element = linkedTo[i];

      if (
        this.node instanceof AudioNode &&
        element.node instanceof AudioNode &&
        "connect" in this.node
      ) {
        this.node.connect(element.node!);
      }
    }

    this.playing = true;

    this.onStart();
  }

  stop = () => {
    if (!this.playing) return;

    this.beforeStop();
    this.playing = false;
    this.onStop();
  };
  beforeStart = () => {};
  onStart = () => {};
  beforeStop = () => {};
  onStop = () => {};

  constructor(context: AudioContext, graph: AudioGraph) {
    this.graph = graph;
    this.context = context;
    this.id = uniqueId();
    this.playing = false;
    this.parameters = {};
  }
}

export class AudioGraphNodeOscillator extends AudioGraphNode<
  OscillatorNode,
  OscillatorOptions
> {
  beforeStart = () =>
    (this.node = new OscillatorNode(this.context, this.parameters));
  onStart = () => this.node?.start();
  onStop = () => this.node?.stop();

  constructor(context: AudioContext, graph: AudioGraph) {
    super(context, graph);
    this.parameters = {
      detune: 0,
      frequency: 440,
      periodicWave: undefined,
      type: "sawtooth",
    };
    this.node = new OscillatorNode(context, this.parameters);
  }
}

export class AudioGraphNodeGain extends AudioGraphNode<GainNode, GainOptions> {
  beforeStart = () => (this.node = new GainNode(this.context, this.parameters));

  constructor(context: AudioContext, graph: AudioGraph) {
    super(context, graph);
    this.parameters = {
      gain: 1,
    };
    this.node = new GainNode(context, this.parameters);
  }
}

export class AudioGraphNodeOutput extends AudioGraphNode<
  AudioDestinationNode,
  GainOptions
> {
  beforeStart = () => (this.node = this.context.destination);

  constructor(context: AudioContext, graph: AudioGraph) {
    super(context, graph);
    this.node = this.context.destination;
  }
}

export class AudioGraph {
  play() {
    console.log(this.audioContext.suspend())
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
    this.nodes.forEach((node) => node.start());
  }
  private audioContext: AudioContext;
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

    this.nodes.push(newNode);
    return newNode.id;
  };

  removeAudioNode: RemoveAudioNode = (id) => {
    const i = this.nodes.findIndex((node) => node.id === id);
    if (i !== -1) {
      this.nodes.splice(i, 1);

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
        return true;
      }
    }

    return false;
  };

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
      linkIndex = this.findLinkIndex(fromId, toId);
    }

    return success;
  };

  constructor(context: AudioContext) {
    this.nodes = [];
    this.links = [];
    this.audioContext = context;
  }
}
