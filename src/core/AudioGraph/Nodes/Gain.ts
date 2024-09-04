import { TContext, IGainOptions, GainNode } from "standardized-audio-context";
import { AudioGraphNodes } from "..";
import { AudioGraphNode } from "../AudioGraphNode";

const defaults = {
  gain: 0.5,
};

export class AudioGraphNodeGain extends AudioGraphNode<
  GainNode<TContext>,
  IGainOptions
> {
  public readonly type: AudioGraphNodes = AudioGraphNodes.Gain;
  reconstruct = () => (this.node = new GainNode(this.context, this.parameters));

  constructor() {
    super();
    this._parametersDefault = defaults;
    this._parameters = {...defaults};
    this.reconstruct();
  }
}