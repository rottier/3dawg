import { v4 as uuid } from 'uuid';
import { Subscribable } from "../../../utils/Subscribable";
import { IAudioNode, TContext, isAnyAudioNode, IAudioParam } from "standardized-audio-context";
import { AudioGraphNodes } from "../types";
import { IAudioGraph, IAudioGraphNode } from "../interfaces";
import { JsonProperty} from "@paddls/ts-serializer";
import { globalAudioContext } from "../AudioGraphContext";
import { on } from 'events';

interface IAudioParamNode {
  setValueAtTime: (value: number, endTime: number) => void;
}

/**
 * Represents a node in an audio graph.
 *
 * @template Node - The type of audio node.
 * @template Parameters - The type of parameters associated with the node.
 */
export abstract class AudioGraphNode<
  Node extends IAudioNode<TContext> = IAudioNode<TContext>,
  Parameters extends Record<string, any> = Record<string, any>
> implements IAudioGraphNode {
  /**
   * The audio context used by the audio graph.
   */
  protected _context: TContext = globalAudioContext;
  public get context(): TContext {
    return this._context;
  }
  public set context(context: TContext) {
    this._context = context;
    this.reconstruct();
  }

  @JsonProperty()
  public get id() {
    return this._id;
  }

  public set id(id: string) {
    this._id = id;
  }

  private _id: string = uuid();

  protected regenerateID() {
    this.id = uuid();
  }

  public get node() {
    return this._node;
  }
  protected set node(node: Node | undefined) {
    this._node = node;
  }
  private _node: Node | undefined;

  @JsonProperty() public readonly type: AudioGraphNodes = AudioGraphNodes.Invalid;

  @JsonProperty() public label: string = AudioGraphNodes[this.type];

  @JsonProperty() public position = { x: 0, y: 0 };

  /**
   * Retrieves an array of AudioGraphLink objects that are linked to this AudioGraphNode.
   * @returns {AudioGraphLink[]} The array of relevant links.
   */
  public readonly linksFrom = () =>
    this.graph?.links
      .filter((link) => link.to === this.id) || [];
  /**
   * Returns an array of AudioGraphLink objects that are linked to this AudioGraphNode.
   *
   * @returns {AudioGraphLink[]} The array of relevant links.
   */
  public readonly linksTo = () =>
    this.graph?.links
      .filter((link) => link.from === this.id) || [];
  protected _parametersDefault: Partial<Parameters> = {};
  protected _parameters: Partial<Parameters> = {};
  public readonly onParameterChange = new Subscribable<Partial<Record<string, any>>>(() => this._parameters);

  @JsonProperty() public get parameters() {
    return this._parameters;
  }
  public set parameters(parameters: Partial<Parameters>) {
    Object.entries(parameters).forEach(([key, value]) => {
      if (key in this._parameters) {
        let changed = false;
        if (this._parameters[key as keyof Parameters] !== value) {
          this._parameters[key as keyof Parameters] = value;
          changed = true;
  
          if (this.node) {
            const nodeAsRecord = this.node as Record<string, any>;
  
            if (this.playing &&
              key in this.node &&
              typeof nodeAsRecord[key]?.setValueAtTime === "function" &&
              typeof value === "number"
            ) {
              const setValueAtTime = (this.node as any)[key]
                .setValueAtTime as IAudioParamNode["setValueAtTime"];
  
              if (setValueAtTime) {
                setValueAtTime(Number(value), this.context?.currentTime || 0);
              }
            } else {
              if (this.graph?.playing) {
                this.graph.stop();
                this.graph.start();
              }
            }
          }
        }

        if (changed)
          this.onParameterChange.notify();
      }
    });
  }

  public playing: boolean = false;
  public get isPlaying() {
    return this.playing;
  }

  protected _graph: IAudioGraph | undefined;
  public get graph(): IAudioGraph | undefined {
    return this._graph;
  }
  public set graph(graph: IAudioGraph) {
    this._graph = graph;

    if (graph.context)
      this._context = graph.context;
  }

  start() {
    this.onBeforeStart();

    if (this.isPlaying) {
      this.stop();
    }

    const linkedTo = this.linksTo();

    for (let i = 0; i < linkedTo.length; i++) {
      const link = linkedTo[i];

      const toNode = this.graph?.findAudioNode(link.to);

      if (isAnyAudioNode(toNode?.node) && isAnyAudioNode(this.node) && (link.toParameter ? link.toParameter in toNode : true)) {
        try {
          if (link.toParameter) {
            const nodeAsRecord = toNode as Record<string, any>;
            this.node.connect(nodeAsRecord[link.toParameter] as IAudioParam);
          }
          else
            this.node.connect(toNode.node);
        } catch (error) {
          console.error(error);
        }
      }
    }

    this.playing = true;

    this.onStart();
  }

  stop() {
    if (!this.playing) return;

    this.onBeforeStop();

    this.playing = false;
    this.onStop();
    this.reconstruct();
  }
  reconstruct = () => { };
  onBeforeStart = () => { };
  onBeforeStop = () => { };
  onStart = () => { };
  onStop = () => { };
  resetParameters = () => this.parameters = this._parametersDefault;
  resetParameter = (name: string) => this.parameters = { [name]: this._parametersDefault[name] as Parameters[string] } as Partial<Parameters>;
}