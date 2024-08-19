import { TContext, IDynamicsCompressorOptions, DynamicsCompressorNode, AudioContext } from "standardized-audio-context";
import { AudioGraphNodes } from "..";
import { AudioGraph } from "../AudioGraph";
import { AudioGraphNode } from "../AudioGraphNode";

export class AudioGraphNodeDynamicsCompressor extends AudioGraphNode<
  DynamicsCompressorNode<TContext>,
  IDynamicsCompressorOptions
> {
  public readonly type: AudioGraphNodes = AudioGraphNodes.Gain;
  reconstruct = () => (this.node = new DynamicsCompressorNode(this.context, this.parameters));

  constructor(context: AudioContext, graph: AudioGraph) {
    super(context, graph);
    this._parameters = {
      threshold: -24,
      knee: 30,
      ratio: 12,
      attack: 0.003,
      release: 0.25,
    };
    this.reconstruct();
  }
}