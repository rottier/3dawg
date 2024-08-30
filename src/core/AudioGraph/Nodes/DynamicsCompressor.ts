import { TContext, IDynamicsCompressorOptions, DynamicsCompressorNode, AudioContext } from "standardized-audio-context";
import { AudioGraphNodes } from "../types";
import { AudioGraphNode } from "./Node";
import { IAudioGraph } from "../interfaces";

const defaults = {
  threshold: -24,
  knee: 30,
  ratio: 12,
  attack: 0.003,
  release: 0.25,
};

export class AudioGraphNodeDynamicsCompressor extends AudioGraphNode<
  DynamicsCompressorNode<TContext>,
  IDynamicsCompressorOptions
> {
  public readonly type: AudioGraphNodes = AudioGraphNodes.Gain;
  reconstruct = () => (this.node = new DynamicsCompressorNode(this.context, this.parameters));

  constructor(context: AudioContext, graph: IAudioGraph) {
    super(context, graph);
    this._parametersDefault = defaults;
    this._parameters = {...defaults};
    this.reconstruct();
  }
}