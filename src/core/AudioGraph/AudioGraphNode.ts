import { uniqueId } from "lodash";
import { IAudioNode, TContext, isAnyAudioNode, AudioContext } from "standardized-audio-context";
import { AudioGraphNodes } from ".";
import { AudioGraph } from "./AudioGraph";

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
              setValueAtTime(Number(value), this.context.currentTime);
            }
          } else {
            if (this.graph.playing) {
              this.graph.stop();
              this.graph.play();
            }
          }
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