import { TContext, GainNode } from "standardized-audio-context";
import { AudioGraphNode } from "./Node";
import { AudioGraphNodes } from "../types";

const defaults = {
  name: "Output",
}
export class AudioGraphNodeOutput extends AudioGraphNode<GainNode<TContext>> {
  public readonly type: AudioGraphNodes = AudioGraphNodes.Output;
  reconstruct = () => (this.node = new GainNode(this.audioContext, { gain: 1 }));
  constructor() {
    super();
    this._parametersDefault = defaults;
    this._parameters = {...defaults};
  }
}
