import { AudioContext } from "standardized-audio-context";
import { AudioGraphLink, AudioGraphNodes } from ".";
import { uniqueId } from "lodash";
import {
  AudioGraphNodeDynamicsCompressor,
  AudioGraphNodeGain,
  AudioGraphNodeOscillator,
  AudioGraphNodeOutput,
} from "./Nodes";
import { AudioGraphNode } from "./AudioGraphNode";

let globalAudioContext: AudioContext;

export type AddAudioNode = (type: AudioGraphNodes) => string;
export type RemoveAudioNode = (id: string) => boolean;
export type LinkNodes = (fromId: string, toId: string) => boolean;
export type UnlinkNodes = (fromId: string, toId: string) => boolean;
export type FindLink = (fromId: string, toId: string) => number;

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
    let newNode;

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
      case AudioGraphNodes.DynamicsCompressor:
        newNode = new AudioGraphNodeDynamicsCompressor(this.audioContext, this);
        break;
      default:
        throw `Could not add audio graph node, type unknown: ${type}`;
    }

    if (this.playing) newNode.start();

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

      if (this.playing) foundNode.stop();

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
