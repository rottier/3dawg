import { TContext, IGainOptions, GainNode, AudioContext } from "standardized-audio-context";
import { AudioGraphNodes } from "..";
import { AudioGraph } from "../AudioGraph";
import { AudioGraphNode } from "../AudioGraphNode";

export class AudioGraphNodeGain extends AudioGraphNode<
  GainNode<TContext>,
  IGainOptions
> {
  public readonly type: AudioGraphNodes = AudioGraphNodes.Gain;
  reconstruct = () => (this.node = new GainNode(this.context, this.parameters));

  constructor(context: AudioContext, graph: AudioGraph) {
    super(context, graph);
    this._parameters = {
      gain: 0.5,
    };
    this.reconstruct();
  }
}