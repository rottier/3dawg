import { TContext, IOscillatorOptions, OscillatorNode, AudioContext } from "standardized-audio-context";
import { AudioGraphNodes } from "..";
import { AudioGraph } from "../AudioGraph";
import { AudioGraphNode } from "../AudioGraphNode";

export class AudioGraphNodeOscillator extends AudioGraphNode<
  OscillatorNode<TContext>,
  IOscillatorOptions
> {
  public readonly type: AudioGraphNodes = AudioGraphNodes.Oscillator;
  reconstruct = () =>
    (this.node = new OscillatorNode(this.context, this.parameters));
  onStart = () => this.node?.start();
  onStop = () => this.node?.stop();

  constructor(context: AudioContext, graph: AudioGraph) {
    super(context, graph);
    this._parameters = {
      detune: 0,
      frequency: 20,
      periodicWave: undefined,
      type: "sawtooth",
    };
    this.reconstruct();
  }
}
