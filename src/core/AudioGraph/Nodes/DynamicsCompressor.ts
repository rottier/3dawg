import { TContext, IDynamicsCompressorOptions, DynamicsCompressorNode } from "standardized-audio-context";
import { AudioGraphNodes } from "..";
import { AudioGraphNode } from "../AudioGraphNode";

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

  constructor() {
    super();
    this._parametersDefault = defaults;
    this._parameters = {...defaults};
    this.reconstruct();
  }
}