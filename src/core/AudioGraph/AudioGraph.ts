import { v4 as uuid } from "uuid";
import { AudioContext, isAnyAudioNode, IAudioParam } from "standardized-audio-context";
import { Converter, JsonProperty } from "@paddls/ts-serializer";
import { defaultSerializer } from "../../utils/Serializable";
import { Subscribable } from "../../utils/Subscribable";
import { getAudioGraphNodeType, createAudioGraphNodeOfType } from "./AudioGraphNodeFactory";
import { AudioGraphLink, IAudioGraph, IAudioGraphNode } from "./interfaces";
import { AudioGraphNode } from "./Nodes";
import { AudioGraphNodes } from "./types";
import { WebAudioGraphNode } from "./WebAudioGraphNode";
import { Mixin } from "ts-mixer";
import { AudioGraphNodeGraph } from './Nodes';


class AudioGraphNodesConverter implements Converter<AudioGraphNode[] | AudioGraphNode, any> {
  fromJson(jsonObj: any) {
    try {
      const serializer = defaultSerializer();
      const newNodes: AudioGraphNode[] = [];
      if (Array.isArray(jsonObj)) {
        jsonObj.forEach((node: any) => {
          const NodeType = getAudioGraphNodeType(node.type);
          newNodes.push(serializer.deserialize(NodeType as { new(): AudioGraphNode }, node));
        });
        return newNodes;
      } else {
        const NodeType = getAudioGraphNodeType(jsonObj.type);
        return serializer.deserialize(
          NodeType as { new(): AudioGraphNode },
          jsonObj
        );
      }
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  toJson(nodes: AudioGraphNode[] | AudioGraphNode) {
    const serializer = defaultSerializer();

    if (Array.isArray(nodes)) {
      const nodeArr: AudioGraphNode[] = [];
      nodes.forEach((node) => nodeArr.push(serializer.serialize(node)));
      return nodeArr;
    } else {
      return serializer.serialize(nodes);
    }
  }
}

class AudioGraphLinksConverter implements Converter<AudioGraphLink[] | AudioGraphLink, any> {
  graph: AudioGraph;
  fromJson(jsonObj: any) {
    try {
      const newLinks: AudioGraphLink[] = [];

      if (Array.isArray(jsonObj)) {
        jsonObj.forEach((link: any) => {
          const newLink = {
            id: uuid(),
            from: link.from,
            to: link.to,
            fromParameter: link.fromParameter,
            toParameter: link.toParameter,
          };
          newLinks.push(newLink);
        });
        return newLinks;
      } else {
        return {
          id: uuid(),
          from: jsonObj.from,
          to: jsonObj.to,
          fromParameter: jsonObj.fromParameter,
          toParameter: jsonObj.toParameter,
        };
      }
    } catch (e) {
      console.error(e);
      return [];
    }
  }
  toJson(links: AudioGraphLink[] | AudioGraphLink) {
    if (Array.isArray(links)) {
      const jsonLinks: any[] = [];
      links.forEach((link) =>
        jsonLinks.push({
          id: link.id,
          from: link.from,
          to: link.to,
          fromParameter: link.fromParameter,
          toParameter: link.toParameter,
        })
      );
      return jsonLinks;
    } else {
      return {
        id: links.id,
        from: links.from,
        to: links.to,
        fromParameter: links.fromParameter,
        toParameter: links.toParameter,
      };
    }
  }

  constructor(graph: AudioGraph) {
    this.graph = graph;
  }
}

export class AudioGraph extends Mixin(AudioGraphNode, WebAudioGraphNode) implements IAudioGraph {
  public readonly type: AudioGraphNodes = AudioGraphNodes.Invalid;
  reconstruct = () => this.nodes.forEach((node) => node.reconstruct());

  public label = "Graph";

  public set graph(graph: IAudioGraph) {
    this._graph = graph;

    if (this.nodes.length > 0) {
      this.nodes.forEach((node) => (node.graph = graph));
    }
  }

  public set audioContext(context: AudioContext) {
    this._context = context;

    if (this.nodes.length > 0) {
      this.nodes.forEach((node) => (node.audioContext = context));
    }
  }

  start = () => {
    if (this.audioContext?.state !== "running" && !this.playing) {
      this.audioContext?.resume();
    }

    this.reconstruct();

    this.nodes.forEach((node) => node.start());

    this.playing = true;

    this.onPlayback.notify();
  }
  stop = () => {
    if (this.audioContext?.state === "running" && this.playing) {
      this.audioContext.suspend();
    }

    this.nodes.forEach((node) => node.stop());

    this.playing = false;

    this.onPlayback.notify();
  }
  public readonly onPlayback = new Subscribable<boolean>(() => this.playing);
  public readonly onNodes = new Subscribable<IAudioGraphNode[]>(
    () => this.nodes
  );
  public readonly onLinks = new Subscribable<AudioGraphLink[]>(
    () => this.links
  );
  @JsonProperty({ customConverter: () => AudioGraphNodesConverter })
  public readonly nodes: AudioGraphNode[] = [];
  @JsonProperty({ customConverter: () => AudioGraphLinksConverter })
  public readonly links: AudioGraphLink[] = [];

  copy(): IAudioGraph {
    const serializer = defaultSerializer();
    const serialized = serializer.serialize(this);

    const graphNode = serializer.deserialize(AudioGraph, serialized) as AudioGraph;
    graphNode.regenerateID();
    graphNode.nodes.forEach((node: IAudioGraphNode) => node.graph = graphNode);
    return graphNode;
  }

  addAudioNode(type: AudioGraphNodes): IAudioGraphNode;
  addAudioNode(node: IAudioGraphNode): IAudioGraphNode;
  addAudioNode(
    arg: AudioGraphNodes | IAudioGraphNode
  ): IAudioGraphNode | boolean {
    if (arg instanceof AudioGraphNode) {
      let node = arg;

      node.graph = this;

      if (this.playing) node.start();

      this.nodes.push(node);

      this.onNodes.notify();

      return node;
    } else {
      const type = arg;
      let newNode = createAudioGraphNodeOfType(type as AudioGraphNodes);

      newNode.graph = this;

      if (this.playing) newNode.start();

      this.nodes.push(newNode);

      this.onNodes.notify();

      return newNode;
    }
  }

  findAudioNode: (id: string) => IAudioGraphNode | undefined = (id) => {
    return this.nodes.find((node) => node.id === id);
  };

  removeAudioNode(node: IAudioGraphNode): boolean;
  removeAudioNode(id: string): boolean;
  removeAudioNode(arg: IAudioGraphNode | string) {
    let nodeToRemove: IAudioGraphNode | undefined;
    let i = -1;

    if (typeof arg === "string") {
      i = this.nodes.findIndex((n) => n.id === arg);
    } else {
      const providedNode = arg as IAudioGraphNode;
      i = this.nodes.findIndex((n) => n.id === providedNode.id);
    }

    if (i !== -1) {
      nodeToRemove = this.nodes.splice(i, 1)[0];

      if (this.playing) nodeToRemove.stop();

      let linksRemoved = false;

      // Also remove links when removing a node
      for (let j = this.links.length - 1; j > -1; j--) {
        const link = this.links[j];
        if (nodeToRemove.id === link.from || nodeToRemove.id === link.to) {
          linksRemoved = true;
          this.links.splice(j, 1);
        }
      }
      if (linksRemoved) this.onLinks.notify();

      this.onNodes.notify();
      return true;
    }

    return false;
  }

  removeAllAudioNodes() {
    this.nodes.forEach((node) => this.removeAudioNode(node.id));
  }

  linkNodes(
    fromId: string,
    toId: string,
    fromParameter?: string,
    toParameter?: string
  ) {
    let fromNode = null;
    let toNode = null;

    if (this.findLinkIndex(fromId, toId, fromParameter, toParameter) > -1)
      return true;

    for (const node of this.nodes) {
      if (node.id === fromId) {
        fromNode = node;

        if (fromParameter)
          fromNode =
            fromNode?.parameters && fromParameter in fromNode.parameters
              ? fromNode
              : undefined;
      }
      if (node.id === toId) {
        toNode = node;

        if (toParameter)
          toNode =
            toNode?.parameters && toParameter in toNode.parameters
              ? toNode
              : undefined;
      }

      if (fromNode && toNode) {
        const newLink = {
          id: uuid(),
          from: fromNode.id,
          to: toNode.id,
        } as AudioGraphLink;

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
  }

  findLinkIndex(
    fromId: string,
    toId: string,
    fromParameter?: string,
    toParameter?: string
  ) {
    const index = this.links.findIndex((link) => {
      let found = link.from === fromId && link.to === toId;

      if (found) {
        if (fromParameter && toParameter) {
          found =
            link.fromParameter === fromParameter &&
            link.toParameter === toParameter;
        } else if (fromParameter) {
          found = link.fromParameter === fromParameter;
        } else if (toParameter) {
          found = link.toParameter === toParameter;
        }
      }

      return found;
    });

    return index;
  }

  unlinkNodes(
    fromId: string,
    toId: string,
    fromParameter?: string,
    toParameter?: string
  ) {
    let linkIndex = this.findLinkIndex(
      fromId,
      toId,
      fromParameter,
      toParameter
    );
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

    if (success) this.onLinks.notify();

    return success;
  }

  unlinkAllNodes: () => void = () => {
    this.links.forEach((link) =>
      this.unlinkNodes(link.from, link.to, link.fromParameter, link.toParameter)
    );
  };

  constructor() {
    super();
  }
}
