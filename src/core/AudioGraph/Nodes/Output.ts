import { TContext, IAudioDestinationNode } from "standardized-audio-context";
import { AudioGraphNode } from "./Node";
import { AudioGraphNodes } from "../types";

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