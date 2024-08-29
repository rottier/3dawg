import { AudioContext } from "standardized-audio-context";
import { AudioGraphLink, AudioGraphNodes } from "..";
import { uniqueId } from "lodash";
import {
  AudioGraphNodeDynamicsCompressor,
  AudioGraphNodeGain,
  AudioGraphNodeOscillator,
  AudioGraphNodeOutput,
} from ".";
import { AudioGraphNode } from "../AudioGraphNode";
import { Subscribable } from "../../../utils/Subscribable";

let globalAudioContext: AudioContext;

export type AddAudioNode = (type: AudioGraphNodes) => string;
export type RemoveAudioNode = (id: string) => boolean;
export type LinkNodes = (fromId: string, toId: string, fromParameter?: string, toParameter?: string) => boolean;
export type UnlinkNodes = (fromId: string, toId: string, fromParameter?: string, toParameter?: string) => boolean;
export type FindLink = (fromId: string, toId: string, fromParameter?: string, toParameter?: string) => number;

export class AudioGraph extends AudioGraphNode {
  public readonly type: AudioGraphNodes = AudioGraphNodes.Graph;
  reconstruct = () => (this.nodes.forEach((node) => node.reconstruct()));

  start() {
    if (this.audioContext.state !== "running" && !this.playing) {
      this.audioContext.resume();
    }
    this.nodes.forEach((node) => node.start());

    this.playing = true;

    this.onPlayback.notify();
  }
  stop() {
    if (this.audioContext.state === "running" && this.playing) {
      this.audioContext.suspend();
    }
    this.nodes.forEach((node) => node.stop());

    this.playing = false;

    this.onPlayback.notify();
  }
  public audioContext: AudioContext;
  public readonly onPlayback = new Subscribable<boolean>(() => this.playing);
  public readonly onNodes = new Subscribable<AudioGraphNode[]>(() => this.nodes);
  public readonly onLinks = new Subscribable<AudioGraphLink[]>(() => this.links);
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
      case AudioGraphNodes.Graph:
        newNode = new AudioGraph(this.audioContext, this);
        break;
      default:
        throw `Could not add audio graph node, type unknown: ${type}`;
    }

    if (this.playing) newNode.start();

    this.nodes.push(newNode);
    this.onNodes.notify();
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

      let linksRemoved = false;

      // Also remove links when removing a node
      for (let j = this.links.length - 1; j > -1; j--) {
        const link = this.links[j];
        if (id === link.from.id || id === link.to.id) {
          linksRemoved = true;
          this.links.splice(j, 1);
        }
      }
      if (linksRemoved)
        this.onLinks.notify();

      this.onNodes.notify();
      return true;
    }

    return false;
  };

  linkNodes: LinkNodes = (fromId, toId, fromParameter, toParameter) => {
    let fromNode = null;
    let toNode = null;

    if (this.findLinkIndex(fromId, toId, fromParameter, toParameter) > -1) return true;

    for (const node of this.nodes) {
      if (node.id === fromId) {
        fromNode = node;

        if (fromParameter)
          fromNode = fromNode?.parameters && fromParameter in fromNode.parameters ? fromNode : undefined;
      }
      if (node.id === toId) {
        toNode = node;

        if (toParameter)
          toNode = toNode?.parameters && toParameter in toNode.parameters ? toNode : undefined;
      }

      if (fromNode && toNode) {
        const newLink: AudioGraphLink = {
          id: uniqueId(),
          from: fromNode,
          to: toNode,
        }

        if (fromParameter) newLink.fromParameter = fromParameter;
        if (toParameter) newLink.toParameter = toParameter;

        this.links.push(newLink);

        if (this.playing) {
          this.stop();
          this.start();
        }

        this.onLinks.notify();
        return true;
      }
    }

    return false;
  };

  findLinkIndex: FindLink = (fromId, toId, fromParameter, toParameter) => {
    const index = this.links.findIndex(
      (link) => {
        let found = link.from.id === fromId && link.to.id === toId;

        if (found) {
          if (fromParameter && toParameter) {
            found = link.fromParameter === fromParameter && link.toParameter === toParameter;
          } else if (fromParameter) {
            found = link.fromParameter === fromParameter;
          } else if (toParameter) {
            found = link.toParameter === toParameter;
          }
        }
        
        return found
      }
    );

    return index;
  }


  unlinkNodes: UnlinkNodes = (fromId, toId, fromParameter, toParameter) => {
    let linkIndex = this.findLinkIndex(fromId, toId, fromParameter, toParameter);
    let success = false;

    while (linkIndex > -1) {
      this.links.splice(linkIndex, 1);
      success = true;
      this.onLinks.notify();
      linkIndex = this.findLinkIndex(fromId, toId, fromParameter, toParameter);
    }

    if (this.playing) {
      this.stop();
      this.start();
    }

    if (success)
      this.onLinks.notify();

    return success;
  };

  constructor(context?: AudioContext, graph?: AudioGraph, loadSerialized?: any) {
    let audioContext: AudioContext;
      // Allow to supply a custom audio context
      if (context) audioContext = context;
      else {
        if (!globalAudioContext)
          // Create a global audio context if none exists
          globalAudioContext = new AudioContext();

          audioContext = globalAudioContext;
      }
    super(audioContext, graph);

    this.nodes = [];
    this.links = [];
    this.audioContext = audioContext;
  }
}
