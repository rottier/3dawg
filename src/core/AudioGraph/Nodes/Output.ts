import { TContext, IAudioDestinationNode, AudioContext } from "standardized-audio-context";
import { AudioGraphNodes } from "..";
import { AudioGraphNode } from "../AudioGraphNode";

export class AudioGraphNodeOutput extends AudioGraphNode<
  IAudioDestinationNode<TContext>
> {
  public readonly type: AudioGraphNodes = AudioGraphNodes.Output;
  reconstruct = () =>
    (this.node = this.context.destination);
  constructor() {
    super();
    this.reconstruct();
  }
}