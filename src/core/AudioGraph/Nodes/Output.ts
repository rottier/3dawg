import { TContext, IAudioDestinationNode, AudioContext } from "standardized-audio-context";
import { AudioGraphNode } from "./Node";
import { AudioGraphNodes } from "../types";
import { IAudioGraph } from "../interfaces";

export class AudioGraphNodeOutput extends AudioGraphNode<
  IAudioDestinationNode<TContext>
> {
  public readonly type: AudioGraphNodes = AudioGraphNodes.Output;
  constructor(context: AudioContext, graph: IAudioGraph) {
    super(context, graph);
    this.node = this.context.destination;
  }
}