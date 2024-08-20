import { uniqueId } from "lodash";
import { IAudioNode, TContext, isAnyAudioNode, AudioContext, IAudioParam } from "standardized-audio-context";
import { AudioGraphLink, AudioGraphNodes } from ".";
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
   * Retrieves an array of AudioGraphLink objects that are linked to this AudioGraphNode.
   * @returns {AudioGraphLink[]} The array of relevant links.
   */
  public readonly linksFrom: () => AudioGraphLink[] = () =>
    this.graph.links
      .filter((link) => link.to.id === this.id)
  /**
   * Returns an array of AudioGraphLink objects that are linked to this AudioGraphNode.
   *
   * @returns {AudioGraphLink[]} The array of relevant links.
   */
  public readonly linksTo: () => AudioGraphLink[] = () =>
    this.graph.links
      .filter((link) => link.from.id === this.id)
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

    const linkedTo = this.linksTo();

    for (let i = 0; i < linkedTo.length; i++) {
      const link = linkedTo[i];

      if (isAnyAudioNode(link.to.node) && isAnyAudioNode(this.node) && (link.toParameter ? link.toParameter in link.to.node : true)) {
        try {
          if (link.toParameter) {
            const nodeAsRecord = link.to.node as Record<string, any>;
            this.node.connect(nodeAsRecord[link.toParameter] as IAudioParam);
          }
          else
            this.node.connect(link.to.node);
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
  reconstruct = () => { };
  onStart = () => { };
  onStop = () => { };

  constructor(context: AudioContext, graph: AudioGraph) {
    this.graph = graph;
    this.context = context;
    this.id = uniqueId();
    this.playing = false;
    this._parameters = {};
  }
}